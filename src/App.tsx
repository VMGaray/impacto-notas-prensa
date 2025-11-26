import { useState, useEffect, type FormEvent } from 'react';
import './App.css';
import type { AnalysisResult } from './types';
import { Modal } from './components/Modal';
import { MetricsDisplay } from './components/MetricsDisplay';
import { MencionesDisplay } from './components/MencionesDisplay';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';
import {
  checkAnonymousQueryLimit,
  registerAnonymousQuery,
  checkAuthenticatedQueryLimit,
  registerAuthenticatedQuery
} from "../lib/fingerprintService";

function App() {
  const { user, userPlan } = useAuth();
  const [sessionId, setSessionId] = useState<string>('');
  const [organizacion, setOrganizacion] = useState('');
  const [tema, setTema] = useState('');
  const [fecha, setFecha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [modalComparar, setModalComparar] = useState(false);
  const [modalDescarga, setModalDescarga] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalAuth, setModalAuth] = useState(false);
  const [remainingQueries, setRemainingQueries] = useState(3);
  const [showBanner, setShowBanner] = useState(false);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);

  useEffect(() => {
    let id = sessionStorage.getItem('idSesion');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('idSesion', id);
      console.log('ID de sesión generado:', id);
    }
    setSessionId(id);

    // Verificar si Supabase está configurado
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const configured = !!(url && key && !url.includes('tu-proyecto') && !key.includes('tu-anon-key'));
    setSupabaseConfigured(configured);

    if (!configured) {
      console.warn('⚠️ Supabase no está configurado. Usando localStorage como fallback temporal.');
    }
  }, []);

  useEffect(() => {
    // Verificar límites de consultas cuando cambie el usuario
    checkQueryLimits();
  }, [user, userPlan]);

  useEffect(() => {
    // Verificar límites al cargar la página inicialmente
    checkQueryLimits();
  }, []);

  const checkQueryLimits = async () => {
    if (user) {
      // Usuario autenticado
      const limits = await checkAuthenticatedQueryLimit(user.id, userPlan);
      setRemainingQueries(limits.remainingQueries);
    } else {
      // Usuario anónimo
      const limits = await checkAnonymousQueryLimit();
      setRemainingQueries(limits.remainingQueries);
    }
  };

  const ensureNumber = (val: any): number => {
    const num = Number(val);
    return typeof num === 'number' && !isNaN(num) ? num : 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Verificar límites antes de permitir la consulta
    if (user) {
      const limits = await checkAuthenticatedQueryLimit(user.id, userPlan);
      if (!limits.canQuery) {
        setModalAuth(true);
        return;
      }
    } else {
      // Para usuarios anónimos, verificar límites en la base de datos
      console.log('[handleSubmit] Verificando límites - remainingQueries:', remainingQueries);
      const limits = await checkAnonymousQueryLimit();
      console.log('[handleSubmit] Límites desde BD:', limits);
      if (!limits.canQuery) {
        console.log('[handleSubmit] No puede hacer consultas - mostrando modal de autenticación');
        setModalAuth(true);
        return;
      }
    }

    const WEBHOOK_URL = "https://n8n.icc-e.org/webhook/0c67f547-a6b6-431a-9368-68dd2d8a4a8b";

    // Agregar user_id si el usuario está autenticado
    const data: any = {
      organizacion,
      tema,
      fecha,
      id_sesion: sessionId,
      user_id: user ? user.id : null  // Enviar user_id o null
    };

    setLoading(true);
    setShowResults(false);
    setError(null);
    console.log()
    try {
      console.log('Enviando datos al webhook:', data);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Respuesta HTTP:', response.status);

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const text = await response.text();
      console.log('Respuesta del servidor:', text.substring(0, 200));

      if (!text) throw new Error('Respuesta vacía del servidor');

      let parsed: any = JSON.parse(text);
      if (Array.isArray(parsed)) parsed = parsed[0];
      if (parsed.output) parsed = parsed.output;

      console.log('Datos parseados:', parsed);

      // Registrar la consulta
      if (user) {
        await registerAuthenticatedQuery(user.id, { organizacion, tema, fecha });
        // Actualizar límites para usuarios autenticados
        const limits = await checkAuthenticatedQueryLimit(user.id, userPlan);
        setRemainingQueries(limits.remainingQueries);
      } else {
        const success = await registerAnonymousQuery();
        console.log('Consulta anónima registrada:', success);
        if (success) {
          // Verificar límites reales después de registrar
          const limits = await checkAnonymousQueryLimit();
          setRemainingQueries(limits.remainingQueries);
          setShowBanner(true);
          console.log('Estado actualizado: remainingQueries=' + limits.remainingQueries + ', showBanner=true');
        }
      }

      setAnalysisResult(parsed);
      setLoading(false);
      setShowResults(true);
      setShowForm(false);

    } catch (error: any) {
      setLoading(false);
      console.error('Error completo:', error);

      let userMessage = '';

      if (error.name === 'AbortError') {
        userMessage = 'El análisis está tardando más de lo habitual.\n\n' +
          'Es posible que haya numerosas menciones que analizar.\n\n' +
          'Por favor, vuelve a intentarlo en unos minutos.';
      }
      else if (error.message.includes('Failed to fetch')) {
        userMessage = 'No hemos podido conectar con el servidor.\n\n' +
          'Por favor, verifica tu conexión a internet e inténtalo de nuevo.';
      }
      else if (error.message.includes('Error 5')) {
        userMessage = 'El servidor está experimentando problemas temporales.\n\n' +
          'Por favor, inténtalo de nuevo en unos minutos.';
      }
      else {
        userMessage = 'Ha ocurrido un error inesperado.\n\n' +
          'Por favor, inténtalo de nuevo.';
      }

      setError(userMessage);
    }
  };

  const handleResetForm = async () => {
    // Verificar límites antes de permitir otra consulta
    if (user) {
      const limits = await checkAuthenticatedQueryLimit(user.id, userPlan);
      if (!limits.canQuery) {
        setModalAuth(true);
        return;
      }
    } else {
      // Para usuarios anónimos, verificar límites en la base de datos
      console.log('[handleResetForm] Verificando límites - remainingQueries:', remainingQueries);
      const limits = await checkAnonymousQueryLimit();
      console.log('[handleResetForm] Límites desde BD:', limits);
      if (!limits.canQuery) {
        console.log('[handleResetForm] No puede hacer consultas - mostrando modal de autenticación');
        setModalAuth(true);
        return;
      }
    }

    setOrganizacion('');
    setTema('');
    setFecha('');
    setShowForm(true);
    setShowResults(false);
    setAnalysisResult(null);
  };

  const handleDescargarBasico = () => {
    if (!analysisResult) return;

    const report = `ANÁLISIS COMPLETO - NOTA DE PRENSA
${'='.repeat(60)}

INFORMACIÓN GENERAL
Organización: ${organizacion}
Tema: ${tema}
Fecha de publicación: ${fecha}
Fecha de análisis: ${new Date().toLocaleDateString()}
Resultado global: ${analysisResult.resultado_global}

${analysisResult.resumen_ejecutivo ? `${'='.repeat(60)}
RESUMEN EJECUTIVO
${'='.repeat(60)}
${analysisResult.resumen_ejecutivo}

` : ''}${'='.repeat(60)}
MÉTRICAS DETALLADAS
${'='.repeat(60)}

1. COBERTURA DE MEDIOS
   Cantidad: ${analysisResult.cobertura_medios || 0} medios

2. CANTIDAD DE EMISIONES
   Total: ${analysisResult.cobertura_emisiones || 0}

3. ALCANCE ESTIMADO
   Personas impactadas: ${analysisResult.alcance_estimado || 0}

4. DURACIÓN EN AGENDA MEDIÁTICA
   Días activos: ${analysisResult.duracion_dias || 0}

${analysisResult.recomendaciones && analysisResult.recomendaciones.length > 0 ? `${'='.repeat(60)}
RECOMENDACIONES
${'='.repeat(60)}

${analysisResult.recomendaciones.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}
` : ''}`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Análisis_${organizacion.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setModalDescarga(false);
    alert('Análisis completo descargado exitosamente');
  };

  const isPositiveResult = (resultado: string) => {
    return resultado?.toLowerCase().includes('funcionó') &&
      !resultado?.toLowerCase().startsWith('no');
  };

  return (
    <div className="container">
      <h1>¿Funcionó mi nota de prensa?</h1>

      {!supabaseConfigured && (
        <div className="warning-banner">
          <strong>⚠️ Modo de Desarrollo</strong>
          <p>Supabase no está configurado. El sistema usa localStorage temporal.</p>
          <details style={{ marginTop: '10px', fontSize: '0.85em' }}>
            <summary style={{ cursor: 'pointer' }}>Ver instrucciones de configuración</summary>
            <p style={{ marginTop: '10px' }}>1. Crea un archivo <code>.env</code> en la raíz del proyecto</p>
            <p>2. Agrega tus credenciales de Supabase (ver <code>SETUP_AUTH.md</code>)</p>
          </details>
        </div>
      )}

      {showForm && (
        <>
          <p className="subtitle">
            Analiza GRATIS el impacto de tu última nota de prensa en radio y televisión canaria.<br />

          </p>
          <small className="freemium-note">
            3 consultas gratuitas • Sin registro necesario
          </small>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="organización">Organización</label>
              <input
                type="text"
                id="organización"
                value={organizacion}
                onChange={(e) => setOrganizacion(e.target.value)}
                placeholder="Ej: TechCorp"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tema">Tema</label>
              <input
                type="text"
                id="tema"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ej: Lanzamiento Producto"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha">Fecha de publicación</label>
              <input
                type="date"
                id="fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>

            <button type="submit">Analizar mi nota de prensa</button>
          </form>
        </>
      )}

      {loading && (
        <div id="loading">
          Cargando análisis... Esto puede tomar unos segundos.
        </div>
      )}

      {showResults && analysisResult && (
        <div id="results">
          <h2>Resultados del análisis</h2>

          {showBanner && !user && remainingQueries > 0 && (
            <div className="query-limit-banner">
              <h3>✨ Te quedan {remainingQueries} {remainingQueries === 1 ? 'consulta gratuita' : 'consultas gratuitas'} hoy</h3>
              <p>Crea cuenta gratis para:</p>
              <ul>
                <li>10 análisis diarios (vs 3 sin cuenta)</li>
                <li>Historial de análisis</li>
                <li>Comparativas</li>
              </ul>
              <div className="banner-actions">
                <button className="btn-banner-primary" onClick={() => setModalAuth(true)}>
                  Crear cuenta - 30 segundos
                </button>
                <button className="btn-banner-secondary">
                  Ver planes Pro
                </button>
              </div>
            </div>
          )}

          {user && remainingQueries >= 0 && remainingQueries < 10 && userPlan === 'free' && (
            <div className="query-limit-banner">
              <h3>Te quedan {remainingQueries} {remainingQueries === 1 ? 'consulta' : 'consultas'} hoy</h3>
              {remainingQueries === 0 && (
                <p>Vuelve mañana o actualiza a Pro para consultas ilimitadas</p>
              )}
            </div>
          )}

          {analysisResult.ai_model === 'claude-3.5-sonnet' && analysisResult.ai_provider === 'anthropic' && (
            <div className="ai-badge">
              <span className="ai-icon">🤖</span>
              <span className="ai-text">
                Análisis generado con <strong>Inteligencia Artificial</strong>
              </span>
            </div>
          )}

          <div className="info-row">
            <strong>Organización:</strong>
            <span>{organizacion}</span>
          </div>

          <div className="info-row">
            <strong>Tema:</strong>
            <span>{tema}</span>
          </div>

          <div className="ai-summary-box">
            <h3>Resumen ejecutivo (Análisis de IA)</h3>
            <p className="ai-summary-text">
              {analysisResult.resumen_ejecutivo || analysisResult.mensaje || 'No disponible'}
            </p>
          </div>

          <h3>Métricas detalladas</h3>
          <div id="metrics-output">
            <MetricsDisplay analysisResult={analysisResult} ensureNumber={ensureNumber} />
          </div>

          <div className={`global-result ${isPositiveResult(analysisResult.resultado_global) ? 'verde' : 'rojo'}`}>
            Resultado global: {analysisResult.resultado_global}
          </div>

          <div className="action-buttons">
            <button type="button" className="action-btn btn-primary" onClick={() => setModalDetalles(true)}>
              <span className="btn-icon">📊</span> Ver detalles ampliados
            </button>
            <button type="button" className="action-btn btn-secondary" onClick={() => setModalComparar(true)}>
              <span className="btn-icon">📈</span> Comparar con otras notas
            </button>
            <button type="button" className="action-btn btn-success" onClick={() => setModalDescarga(true)}>
              <span className="btn-icon">📄</span> Solicitar análisis completo
            </button>
            <button type="button" id="btn-reset-form" className="action-btn btn-primary" onClick={handleResetForm}>
              <span className="btn-icon">🔄</span> Analizar otra nota de prensa
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={modalDetalles} onClose={() => setModalDetalles(false)} title="Detalles ampliados del análisis">
        {analysisResult && (
          <div>
            <div className="detail-item">
              <h4>Información general</h4>
              <p><strong>Organización:</strong> {organizacion}</p>
              <p><strong>Tema:</strong> {tema}</p>
              <p><strong>Fecha:</strong> {fecha}</p>
              <p><strong>Resultado global:</strong> {analysisResult.resultado_global}</p>
            </div>

            {analysisResult.ai_model === 'claude-3.5-sonnet' && (
              <div className="detail-item" style={{ background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', borderLeftColor: '#667eea' }}>
                <h4>Análisis con inteligencia artificial</h4>
                <p><strong>Modelo:</strong> Claude 3.5 Sonnet</p>
                <p><strong>Proveedor:</strong> Anthropic</p>
                <p><strong>Tipo:</strong> Inteligencia artificial generativa</p>
              </div>
            )}

            {analysisResult.resumen_ejecutivo && (
              <div className="detail-item">
                <h4>Resumen ejecutivo</h4>
                <p>{analysisResult.resumen_ejecutivo}</p>
              </div>
            )}

            <div className="detail-item">
              <h4>Cobertura de medios</h4>
              <p><strong>Cantidad:</strong> {analysisResult.cobertura_medios || 0} medios</p>
              <p><strong>Descripción:</strong> Indica cuántos medios de comunicación publicaron información sobre la nota de prensa.</p>

            </div>

            <div className="detail-item">
              <h4>Cantidad de emisiones</h4>
              <p><strong>Total:</strong> {analysisResult.cobertura_emisiones || 0}</p>
              <p><strong>Descripción:</strong> Número de emisiones únicas en radio y televisión que difundieron la nota.</p>
            </div>

            <div className="detail-item">
              <h4>Alcance estimado</h4>
              <p><strong>Personas impactadas:</strong> {analysisResult.alcance_estimado}</p>
              <p><strong>Descripción:</strong> Estimación del número total de personas expuestas al mensaje.</p>
            </div>

            <div className="detail-item">
              <h4>Duración en agenda mediática</h4>
              <p><strong>Días activos:</strong> {analysisResult.duracion_dias || 0} días</p>
              <p><strong>Descripción:</strong> Tiempo durante el cual la nota se mantuvo relevante en los medios.</p>
            </div>


            <MencionesDisplay menciones={analysisResult.menciones?.detalle || []} />

            {analysisResult.recomendaciones && analysisResult.recomendaciones.length > 0 && (
              <div className="detail-item">
                <h4>Recomendaciones</h4>
                <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
                  {analysisResult.recomendaciones.map((rec, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={modalComparar} onClose={() => setModalComparar(false)} title="Comparación de notas de prensa" className="modal-descarga-content">
        <p className="descarga-message">
          La funcionalidad de comparación está disponible en la versión Pro.
        </p>
        <p className="descarga-message">Con la versión Pro podrás:</p>
        <ul className="descarga-message" style={{ textAlign: 'left', margin: '20px auto', maxWidth: 500 }}>
          <li>Comparar múltiples análisis de notas de prensa</li>
          <li>Ver gráficos comparativos de métricas</li>
          <li>Guardar historial de análisis</li>
          <li>Exportar reportes comparativos en PDF</li>
          <li>Análisis de prensa escrita y digital</li>
        </ul>
        <p className="descarga-message">
          Para acceder a estas funcionalidades, contacte con ventas en:{' '}
          <strong>contacto@icc-e.org</strong>
        </p>
        <div className="descarga-actions">
          <button
            type="button"
            className="action-btn btn-success"
            onClick={() => window.open('mailto:contacto@icc-e.org?subject=Consulta sobre versión Pro - Funcionalidad de comparación', '_blank')}
          >
            📧 Contactar para versión Pro
          </button>
          <button type="button" className="action-btn btn-primary" onClick={() => setModalComparar(false)}>
            Volver
          </button>
        </div>
      </Modal>


      <Modal isOpen={modalDescarga} onClose={() => setModalDescarga(false)} title="Descarga del informe" className="modal-descarga-content">
        <p className="descarga-message">
          Se va a descargar el informe de la versión gratuita con datos básicos de impacto de su nota de prensa.
        </p>
        <p className="descarga-message">
          Para un informe completo y funcionalidades Pro, contacte con ventas en:{' '}
          <strong>contacto@icc-e.org</strong>
        </p>
        <div className="descarga-actions">
          <button type="button" className="action-btn btn-primary" onClick={handleDescargarBasico}>
            📄 Descargar informe básico
          </button>
          <button
            type="button"
            className="action-btn btn-success"
            onClick={() => window.open('mailto:contacto@icc-e.org?subject=Consulta sobre versión Pro', '_blank')}
          >
            ⭐ Ver versión Pro
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={error !== null}
        onClose={() => setError(null)}
        title="Aviso de error"
      >
        <p className="whitespace-pre-line">{error}</p>
        <button
          onClick={() => setError(null)}
          className="action-btn btn-primary"
        >
          Entendido
        </button>
      </Modal>

      <AuthModal
        isOpen={modalAuth}
        onClose={() => setModalAuth(false)}
        onAuthSuccess={async (userId) => {
          console.log('Usuario autenticado:', userId);
          await checkQueryLimits();
          setModalAuth(false);
        }}
      />
    </div>
  );
}
export default App;
