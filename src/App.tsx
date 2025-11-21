import { useState, useEffect, type FormEvent } from 'react';
import './App.css';
import type { AnalysisResult } from './types';
import { Modal } from './components/Modal';
import { MetricsDisplay } from './components/MetricsDisplay';
import { MencionesDisplay } from './components/MencionesDisplay';

function App() {
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

  useEffect(() => {
    let id = sessionStorage.getItem('idSesion');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('idSesion', id);
      console.log('ID de sesion generado:', id);
    }
    setSessionId(id);
  }, []);

  const ensureNumber = (val: any): number => {
    const num = Number(val);
    return typeof num === 'number' && !isNaN(num) ? num : 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const WEBHOOK_URL = "https://n8n.icc-e.org/webhook-test/0c67f547-a6b6-431a-9368-68dd2d8a4a8b";3
    const data = { organizacion, tema, fecha, id_sesion: sessionId };

    setLoading(true);
    setShowResults(false);

    try {
      console.log('Enviando datos al webhook:', data);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      console.log('Respuesta HTTP:', response.status);

      if (!response.ok) {
        // Intentar leer el error del servidor
        try {
          const errorData = await response.json();
          console.error('Error del servidor:', errorData);
          throw new Error(
            `Error ${response.status}: ${errorData.message || 'El webhook no esta disponible. Verifica que el workflow de n8n este activo.'}`
          );
        } catch {
          throw new Error(
            `Error ${response.status}: El webhook no esta disponible. Asegurate de que el workflow de n8n este activo y en modo produccion.`
          );
        }
      }

      const text = await response.text();
      console.log('Respuesta del servidor:', text.substring(0, 200));

      if (!text) throw new Error('Respuesta vacia del servidor');

      let parsed: any = JSON.parse(text);
      if (Array.isArray(parsed)) parsed = parsed[0];
      if (parsed.output) parsed = parsed.output;

      console.log('Datos parseados:', parsed);

      setAnalysisResult(parsed);
      setLoading(false);
      setShowResults(true);
      setShowForm(false);
    } catch (error: any) {
      setLoading(false);
      console.error('Error completo:', error);

      let errorMessage = 'Error desconocido';

      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica:\n\n' +
                      '1. Que el workflow de n8n este ACTIVO\n' +
                      '2. Que el webhook este en modo PRODUCCION (no test)\n' +
                      '3. Tu conexion a internet\n\n' +
                      'Si el workflow esta en modo test, haz clic en "Execute workflow" en n8n primero.';
      } else {
        errorMessage = error.message;
      }

      alert('❌ Error en el analisis:\n\n' + errorMessage);
    }
  };

  const handleResetForm = () => {
    setOrganizacion('');
    setTema('');
    setFecha('');
    setShowForm(true);
    setShowResults(false);
    setAnalysisResult(null);
  };

  const handleDescargarBasico = () => {
    if (!analysisResult) return;

    const report = `ANALISIS COMPLETO - NOTA DE PRENSA
${'='.repeat(60)}

INFORMACION GENERAL
Organizacion: ${organizacion}
Tema: ${tema}
Fecha de Publicacion: ${fecha}
Fecha de Analisis: ${new Date().toLocaleDateString()}
Resultado Global: ${analysisResult.resultado_global}

${analysisResult.resumen_ejecutivo ? `${'='.repeat(60)}
RESUMEN EJECUTIVO
${'='.repeat(60)}
${analysisResult.resumen_ejecutivo}

` : ''}${'='.repeat(60)}
METRICAS DETALLADAS
${'='.repeat(60)}

1. COBERTURA DE MEDIOS
   Cantidad: ${analysisResult.cobertura_medios || 0} medios

2. CANTIDAD DE EMISIONES
   Total: ${analysisResult.cobertura_emisiones || 0}

3. ALCANCE ESTIMADO
   Personas impactadas: ${analysisResult.alcance_estimado || 0}

4. DURACION EN AGENDA MEDIATICA
   Dias activos: ${analysisResult.duracion_dias || 0}

${analysisResult.recomendaciones && analysisResult.recomendaciones.length > 0 ? `${'='.repeat(60)}
RECOMENDACIONES
${'='.repeat(60)}

${analysisResult.recomendaciones.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}
` : ''}`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Analisis_${organizacion.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setModalDescarga(false);
    alert('Analisis completo descargado exitosamente');
  };

  const isPositiveResult = (resultado: string) => {
    return resultado?.toLowerCase().includes('funciono') &&
           !resultado?.toLowerCase().startsWith('no');
  };

  return (
    <div className="container">
      <h1>¿Funciono mi nota de prensa?</h1>

      {showForm && (
        <>
          <p className="subtitle">
            Ingresa los datos de tu comunicacion para ver su repercusion en medios canarios.
          </p>
          <small className="freemium-note">
            Esta utilizando la version gratuita que consulta menciones de radio y television en Canarias en los ultimos 3 dias.
          </small>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="organizacion">Organizacion</label>
              <input
                type="text"
                id="organizacion"
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
              <label htmlFor="fecha">Fecha de Publicacion</label>
              <input
                type="date"
                id="fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>

            <button type="submit">Evaluar repercusion</button>
          </form>
        </>
      )}

      {loading && (
        <div id="loading">
          Cargando analisis... Esto puede tomar unos segundos.
        </div>
      )}

      {showResults && analysisResult && (
        <div id="results">
          <h2>Resultados del analisis</h2>
          <p className="freemium-note">
            Version gratuita<br />
            (Radio y television en Canarias, ultimos 3 dias)
          </p>

          {analysisResult.ai_model === 'claude-3.5-sonnet' && analysisResult.ai_provider === 'anthropic' && (
            <div className="ai-badge">
              <span className="ai-icon">🤖</span>
              <span className="ai-text">
                Analisis generado con <strong>Claude AI 3.5 Sonnet (Anthropic)</strong>
              </span>
            </div>
          )}

          <div className="info-row">
            <strong>Organizacion:</strong>
            <span>{organizacion}</span>
          </div>

          <div className="info-row">
            <strong>Tema:</strong>
            <span>{tema}</span>
          </div>

          <div className="ai-summary-box">
            <h3>Resumen ejecutivo (Analisis de Claude)</h3>
            <p className="ai-summary-text">
              {analysisResult.resumen_ejecutivo || analysisResult.mensaje || 'No disponible'}
            </p>
          </div>

          <h3>Metricas detalladas</h3>
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
              <span className="btn-icon">📄</span> Solicitar analisis completo
            </button>
            <button type="button" id="btn-reset-form" className="action-btn btn-primary" onClick={handleResetForm}>
              <span className="btn-icon">🔄</span> Analizar otra nota de prensa
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={modalDetalles} onClose={() => setModalDetalles(false)} title="Detalles ampliados del analisis">
        {analysisResult && (
          <div>
            <div className="detail-item">
              <h4>Informacion general</h4>
              <p><strong>Organizacion:</strong> {organizacion}</p>
              <p><strong>Tema:</strong> {tema}</p>
              <p><strong>Fecha:</strong> {fecha}</p>
              <p><strong>Resultado global:</strong> {analysisResult.resultado_global}</p>
            </div>

            {analysisResult.ai_model === 'claude-3.5-sonnet' && (
              <div className="detail-item" style={{ background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', borderLeftColor: '#667eea' }}>
                <h4>🤖 Analisis con Inteligencia Artificial</h4>
                <p><strong>Modelo:</strong> Claude 3.5 Sonnet</p>
                <p><strong>Proveedor:</strong> Anthropic</p>
                <p><strong>Tipo:</strong> Inteligencia artificial generativa</p>
              </div>
            )}

            {analysisResult.resumen_ejecutivo && (
              <div className="detail-item">
                <h4>Resumen ejecutivo (Claude AI)</h4>
                <p>{analysisResult.resumen_ejecutivo}</p>
              </div>
            )}

            <div className="detail-item">
              <h4>Cobertura de medios</h4>
              <p><strong>Cantidad:</strong> {analysisResult.cobertura_medios || 0} medios</p>
              <p><strong>Descripcion:</strong> Indica cuantos medios de comunicacion publicaron informacion sobre la nota de prensa.</p>
            </div>

            <div className="detail-item">
              <h4>Cantidad de emisiones</h4>
              <p><strong>Total:</strong> {analysisResult.cobertura_emisiones || 0}</p>
              <p><strong>Descripcion:</strong> Numero de emisiones unicas en radio y television que difundieron la nota.</p>
            </div>

            <div className="detail-item">
              <h4>Alcance estimado</h4>
              <p><strong>Personas impactadas:</strong> {analysisResult.alcance_estimado}</p>
              <p><strong>Descripcion:</strong> Estimacion del numero total de personas expuestas al mensaje.</p>
            </div>

            <div className="detail-item">
              <h4>Duracion en agenda mediatica</h4>
              <p><strong>Dias activos:</strong> {analysisResult.duracion_dias || 0} dias</p>
              <p><strong>Descripcion:</strong> Tiempo durante el cual la nota se mantuvo relevante en los medios.</p>
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

      <Modal isOpen={modalComparar} onClose={() => setModalComparar(false)} title="Comparar con otras notas de prensa" className="modal-descarga-content">
        <p className="descarga-message">
          La funcionalidad de comparacion esta disponible en la version Pro.
        </p>
        <p className="descarga-message">Con la version Pro podras:</p>
        <ul className="descarga-message" style={{ textAlign: 'left', margin: '20px auto', maxWidth: 500 }}>
          <li>Comparar multiples analisis de notas de prensa</li>
          <li>Ver graficos comparativos de metricas</li>
          <li>Guardar historial de analisis</li>
          <li>Exportar reportes comparativos en PDF</li>
          <li>Analisis de prensa escrita y digital</li>
        </ul>
        <p className="descarga-message">
          Para acceder a estas funcionalidades, contacte con ventas en:{' '}
          <strong>contacto@icc-e.org</strong>
        </p>
        <div className="descarga-actions">
          <button
            type="button"
            className="action-btn btn-success"
            onClick={() => window.open('mailto:contacto@icc-e.org?subject=Consulta sobre version Pro - Funcionalidad de comparacion', '_blank')}
          >
            📧 Contactar para version Pro
          </button>
          <button type="button" className="action-btn btn-primary" onClick={() => setModalComparar(false)}>
            Volver
          </button>
        </div>
      </Modal>

      <Modal isOpen={modalDescarga} onClose={() => setModalDescarga(false)} title="Descargar informe de analisis" className="modal-descarga-content">
        <p className="descarga-message">
          Se va a descargar el informe de la version gratuita con datos basicos de impacto de su nota de prensa.
        </p>
        <p className="descarga-message">
          Para un informe completo y funcionalidades Pro, contacte con ventas en:{' '}
          <strong>contacto@icc-e.org</strong>
        </p>
        <div className="descarga-actions">
          <button type="button" className="action-btn btn-primary" onClick={handleDescargarBasico}>
            📄 Descargar informe basico
          </button>
          <button
            type="button"
            className="action-btn btn-success"
            onClick={() => window.open('mailto:contacto@icc-e.org?subject=Consulta sobre version Pro', '_blank')}
          >
            ⭐ Ver version Pro
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
