// components/Inicio.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import type { AnalysisResult } from '../types';
import { Modal } from './Modal';
import { MetricsDisplay } from './MetricsDisplay';
import { MencionesDisplay } from './MencionesDisplay';
import { AuthModal } from './AuthModal';
import { ContactForm } from './ContactForm';
import { useAuth } from '../contexts/AuthContext';
import {
  checkAnonymousQueryLimit,
  registerAnonymousQuery,
  checkAuthenticatedQueryLimit,
  registerAuthenticatedQuery
} from "../lib/fingerprintService";
import {
  QueryLimitBanner,
  HeroSection,
  AnalysisForm,
  ValuePropositionCards,
  SocialProof
} from './home';

export const Inicio: React.FC = () => {
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
  const [modalContacto, setModalContacto] = useState(false);
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
    }
    setSessionId(id);

    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const configured = !!(url && key && !url.includes('tu-proyecto') && !key.includes('tu-anon-key'));
    setSupabaseConfigured(configured);
  }, []);

  useEffect(() => {
    checkQueryLimits();
  }, [user, userPlan]);

  useEffect(() => {
    checkQueryLimits();
  }, []);

  const checkQueryLimits = async () => {
    if (user) {
      const limits = await checkAuthenticatedQueryLimit(user.id, userPlan);
      setRemainingQueries(limits.remainingQueries);
    } else {
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

    if (user) {
      const limits = await checkAuthenticatedQueryLimit(user.id, userPlan);
      if (!limits.canQuery) {
        setModalAuth(true);
        return;
      }
    } else {
      const limits = await checkAnonymousQueryLimit();
      if (!limits.canQuery) {
        setModalAuth(true);
        return;
      }
    }

    const WEBHOOK_URL = "https://n8n.icc-e.org/webhook/0c67f547-a6b6-431a-9368-68dd2d8a4a8b";

    const data: any = {
      organizacion,
      tema,
      fecha,
      id_sesion: sessionId,
      user_id: user ? user.id : null
    };

    setLoading(true);
    setShowResults(false);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const text = await response.text();
      if (!text) throw new Error('Respuesta vacía del servidor');

      let parsed: any = JSON.parse(text);
      if (Array.isArray(parsed)) parsed = parsed[0];
      if (parsed.output) parsed = parsed.output;

      if (user) {
        await registerAuthenticatedQuery(user.id, { organizacion, tema, fecha });
        const limits = await checkAuthenticatedQueryLimit(user.id, userPlan);
        setRemainingQueries(limits.remainingQueries);
      } else {
        const success = await registerAnonymousQuery();
        if (success) {
          const limits = await checkAnonymousQueryLimit();
          setRemainingQueries(limits.remainingQueries);
          setShowBanner(true);
        }
      }

      setAnalysisResult(parsed);
      setLoading(false);
      setShowResults(true);
      setShowForm(false);

    } catch (error: any) {
      setLoading(false);
      let userMessage = '';

      if (error.name === 'AbortError') {
        userMessage = 'El análisis está tardando más de lo habitual.\n\nPor favor, vuelve a intentarlo en unos minutos.';
      } else if (error.message.includes('Failed to fetch')) {
        userMessage = 'No hemos podido conectar con el servidor.\n\nPor favor, verifica tu conexión a internet e inténtalo de nuevo.';
      } else if (error.message.includes('Error 5')) {
        userMessage = 'El servidor está experimentando problemas temporales.\n\nPor favor, inténtalo de nuevo en unos minutos.';
      } else {
        userMessage = 'Ha ocurrido un error inesperado.\n\nPor favor, inténtalo de nuevo.';
      }

      setError(userMessage);
    }
  };

  const handleResetForm = async () => {
    if (user) {
      const limits = await checkAuthenticatedQueryLimit(user.id, userPlan);
      if (!limits.canQuery) {
        setModalAuth(true);
        return;
      }
    } else {
      const limits = await checkAnonymousQueryLimit();
      if (!limits.canQuery) {
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

Organización: ${organizacion}
Tema: ${tema}
Fecha de publicación: ${fecha}
Resultado global: ${analysisResult.resultado_global}`;

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
    alert('Análisis completo descargado exitosamente');
  };

  const isPositiveResult = (resultado: string) => {
    return resultado?.toLowerCase().includes('funcionó') &&
      !resultado?.toLowerCase().startsWith('no');
  };

  return (
  <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
    {/* Manchas de fondo */}
    <div
      className="absolute top-[-100px] left-[20%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
      style={{
        background: 'radial-gradient(circle, rgba(64,171,165,0.2) 0%, transparent 70%)'
      }}
    />
    <div
      className="absolute top-[100px] right-[15%] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
      style={{
        background: 'radial-gradient(circle, rgba(147,21,131,0.2) 0%, transparent 70%)'
      }}
    />

    <div className="relative z-10 max-w-[1100px] mx-auto px-6 pt-[140px] pb-20">
      {/* Hero Section */}
      <HeroSection />

      {/* Formulario de Análisis */}
      {showForm && (
        <AnalysisForm
          organizacion={organizacion}
          tema={tema}
          fecha={fecha}
          onOrganizacionChange={setOrganizacion}
          onTemaChange={setTema}
          onFechaChange={setFecha}
          onSubmit={handleSubmit}
          supabaseConfigured={supabaseConfigured}
        />
      )}

      {loading && (
        <div className="text-center text-[#9A0483] text-xl font-semibold p-[30px] animate-pulse">
          Cargando análisis... Esto puede tomar unos segundos.
        </div>
      )}

      {showResults && analysisResult && (
        <div className="mt-10 p-8 border-2 border-gray-200 rounded-[15px] bg-gradient-to-b from-[#f7fafc] to-white animate-fadeIn">
          <h2 className="text-[#2d3748] mb-5 text-[1.8em] border-b-[3px] border-[#9A0483] pb-2.5">Resultados del análisis</h2>

          {/* Banner de límite de consultas */}
          {(showBanner || (!user && remainingQueries <= 1) || (user && remainingQueries <= 3)) && (
            <QueryLimitBanner
              user={user}
              remainingQueries={remainingQueries}
              onCreateAccount={() => setModalAuth(true)}
              onContactPro={() => setModalContacto(true)}
            />
          )}

          <div className="flex justify-between mb-3 p-3 bg-[#f7fafc] rounded-lg border-l-4 border-[#9A0483]">
            <strong>Organización:</strong>
            <span>{organizacion}</span>
          </div>

          <div className="flex justify-between mb-3 p-3 bg-[#f7fafc] rounded-lg border-l-4 border-[#9A0483]">
            <strong>Tema:</strong>
            <span>{tema}</span>
          </div>

          <h3 className="text-[#4a5568] mt-6 mb-4 text-[1.3em]">Métricas detalladas</h3>
          <MetricsDisplay analysisResult={analysisResult} ensureNumber={ensureNumber} />

          <div className={`text-[1.3em] font-medium mt-5 text-center py-4 px-5 rounded-xl ${
            isPositiveResult(analysisResult.resultado_global)
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            Resultado global: {analysisResult.resultado_global}
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-6">
            <button
              onClick={() => setModalDetalles(true)}
              className="py-3 px-4 bg-gradient-to-br from-[#40ABA5] to-[#8878A9] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              📊 Ver detalles ampliados
            </button>
            <button
              onClick={() => setModalComparar(true)}
              className="py-3 px-4 bg-gradient-to-br from-[#8878A9] to-[#931583] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              📈 Comparar con otras notas
            </button>
            <button
              onClick={() => setModalDescarga(true)}
              className="py-3 px-4 bg-gradient-to-br from-[#931583] to-[#40ABA5] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              📄 Descargar informe
            </button>
            <button
              onClick={handleResetForm}
              className="col-span-3 py-3 px-4 bg-gradient-to-br from-[#7B3294] to-[#9A0483] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              🔄 Analizar otra nota
            </button>
          </div>
        </div>
      )}

      {/* Cards de Propuesta de Valor */}
      <ValuePropositionCards />

      {/* Social Proof - Instituciones */}
      <SocialProof />
    </div>

    {/* Modales */}
    <Modal isOpen={modalDetalles} onClose={() => setModalDetalles(false)} title="Detalles ampliados">
      {analysisResult && (
        <div className="space-y-6">
          {/* Información general */}
          <div className="bg-gradient-to-br from-[#f8fafc] to-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm">
            <h3 className="font-bold text-[#111827] mb-4 text-lg flex items-center gap-2">
              📄 Información General
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-start p-3 bg-white rounded-lg border-l-4 border-[#40ABA5]">
                <span className="font-semibold text-[#4b5563]">Organización:</span>
                <span className="text-[#111827] text-right">{organizacion}</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-white rounded-lg border-l-4 border-[#8878A9]">
                <span className="font-semibold text-[#4b5563]">Tema:</span>
                <span className="text-[#111827] text-right">{tema}</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-white rounded-lg border-l-4 border-[#931583]">
                <span className="font-semibold text-[#4b5563]">Fecha de publicación:</span>
                <span className="text-[#111827]">{fecha}</span>
              </div>
              <div className={`flex justify-between items-start p-4 rounded-lg border-l-4 ${
                isPositiveResult(analysisResult.resultado_global)
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}>
                <span className="font-semibold text-[#4b5563]">Resultado global:</span>
                <span className={`font-bold text-right ${
                  isPositiveResult(analysisResult.resultado_global)
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}>
                  {analysisResult.resultado_global}
                </span>
              </div>
            </div>
          </div>

          {/* Resumen ejecutivo */}
          {analysisResult.resumen_ejecutivo && (
            <div className="bg-gradient-to-br from-[#f0f9ff] to-[#f3f4f6] p-5 rounded-xl border-l-4 border-[#40ABA5]">
              <h3 className="font-bold text-[#111827] mb-3 text-lg">📋 Resumen Ejecutivo</h3>
              <p className="text-[#4b5563] leading-relaxed">{analysisResult.resumen_ejecutivo}</p>
            </div>
          )}

          {/* Impacto */}
          {analysisResult.impacto && (
            <div className="bg-gradient-to-br from-[#faf5ff] to-[#f3f4f6] p-5 rounded-xl border-l-4 border-[#931583]">
              <h3 className="font-bold text-[#111827] mb-3 text-lg">🎯 Impacto Mediático</h3>
              <p className="text-[#4b5563] leading-relaxed">{analysisResult.impacto}</p>
            </div>
          )}

          {/* Métricas detalladas */}
          <div className="bg-white p-5 rounded-xl border border-[#e5e7eb]">
            <h3 className="font-bold text-[#111827] mb-4 text-lg">📊 Métricas Detalladas</h3>
            <div className="space-y-3">
              {/* Cobertura de medios */}
              <div className="p-4 bg-gradient-to-r from-[#f0f9ff] to-white rounded-lg border-l-4 border-[#40ABA5]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#111827]">Cobertura de medios</span>
                  <span className="text-2xl font-bold text-[#40ABA5]">{ensureNumber(analysisResult.cobertura_medios)}</span>
                </div>
                <p className="text-sm text-[#6b7280]">Cantidad total de medios que cubrieron la nota de prensa</p>
              </div>

              {/* Cobertura Radio */}
              <div className="p-4 bg-gradient-to-r from-[#f0f9ff] to-white rounded-lg border-l-4 border-[#40ABA5]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#111827]">Cobertura de radio</span>
                  <span className="text-2xl font-bold text-[#40ABA5]">{ensureNumber(analysisResult.cobertura_radio)}</span>
                </div>
                <p className="text-sm text-[#6b7280]">Menciones en emisoras de radio</p>
              </div>

              {/* Cobertura TV */}
              <div className="p-4 bg-gradient-to-r from-[#faf5ff] to-white rounded-lg border-l-4 border-[#931583]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#111827]">Cobertura de televisión</span>
                  <span className="text-2xl font-bold text-[#931583]">{ensureNumber(analysisResult.cobertura_tv)}</span>
                </div>
                <p className="text-sm text-[#6b7280]">Menciones en canales de televisión</p>
              </div>

              {/* Emisiones */}
              <div className="p-4 bg-gradient-to-r from-[#faf5ff] to-white rounded-lg border-l-4 border-[#931583]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#111827]">Cantidad de emisiones</span>
                  <span className="text-2xl font-bold text-[#931583]">{ensureNumber(analysisResult.cobertura_emisiones)}</span>
                </div>
                <p className="text-sm text-[#6b7280]">Número de emisiones únicas que cubrieron la noticia</p>
              </div>

              {/* Menciones totales */}
              {analysisResult.menciones?.total !== undefined && (
                <div className="p-4 bg-gradient-to-r from-[#f0f9ff] to-white rounded-lg border-l-4 border-[#40ABA5]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-[#111827]">Menciones totales</span>
                    <span className="text-2xl font-bold text-[#40ABA5]">{ensureNumber(analysisResult.menciones.total)}</span>
                  </div>
                  <p className="text-sm text-[#6b7280]">Cantidad total de menciones realizadas por los medios</p>
                </div>
              )}

              {/* Duración */}
              <div className="p-4 bg-gradient-to-r from-[#f0f9ff] to-white rounded-lg border-l-4 border-[#40ABA5]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#111827]">Duración de la cobertura</span>
                  <span className="text-2xl font-bold text-[#40ABA5]">{ensureNumber(analysisResult.duracion_dias)} días</span>
                </div>
                <p className="text-sm text-[#6b7280]">Período en el que los medios cubrieron la nota de prensa</p>
                {analysisResult.rango_fechas && (
                  <p className="text-sm text-[#931583] mt-1 font-medium">{analysisResult.rango_fechas}</p>
                )}
              </div>

              {/* Alcance estimado */}
              <div className="p-4 bg-gradient-to-r from-[#faf5ff] to-white rounded-lg border-l-4 border-[#931583]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#111827]">Alcance estimado</span>
                  <span className="text-2xl font-bold text-[#931583]">{analysisResult.alcance_estimado}</span>
                </div>
                <p className="text-sm text-[#6b7280]">Número estimado de personas alcanzadas por la cobertura</p>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          {analysisResult.recomendaciones && analysisResult.recomendaciones.length > 0 && (
            <div className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] p-5 rounded-xl border-l-4 border-[#f59e0b]">
              <h3 className="font-bold text-[#92400e] mb-3 text-lg">💡 Recomendaciones</h3>
              <ul className="space-y-2">
                {analysisResult.recomendaciones.map((rec, idx) => (
                  <li key={idx} className="text-[#78350f] flex items-start gap-2">
                    <span className="text-[#f59e0b] mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Análisis detallado - Comentado temporalmente */}
          {/* {analysisResult.analisis && Object.keys(analysisResult.analisis).length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-[#e5e7eb]">
              <h3 className="font-bold text-[#111827] mb-4 text-lg">🔍 Análisis Detallado</h3>
              <div className="space-y-3">
                {Object.entries(analysisResult.analisis).map(([key, value]) => (
                  <div key={key} className="p-3 bg-[#f9fafb] rounded-lg border-l-2 border-[#40ABA5]">
                    <p className="font-semibold text-[#111827] mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-[#4b5563] text-sm">{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Menciones detalladas */}
          {analysisResult.menciones?.detalle && analysisResult.menciones.detalle.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-[#e5e7eb]">
              <h3 className="font-bold text-[#111827] mb-4 text-lg">📰 Menciones Detalladas</h3>
              <MencionesDisplay menciones={analysisResult.menciones.detalle} />
            </div>
          )}

          {/* Info técnica */}
          {(analysisResult.ai_model || analysisResult.ai_provider) && (
            <div className="bg-[#f9fafb] p-4 rounded-lg border border-[#e5e7eb] text-xs text-[#6b7280]">
              <p>Análisis generado con {analysisResult.ai_provider || 'IA'} {analysisResult.ai_model ? `(${analysisResult.ai_model})` : ''}</p>
            </div>
          )}
        </div>
      )}
    </Modal>

    <Modal isOpen={modalComparar} onClose={() => setModalComparar(false)} title="Comparación de notas de prensa">
      <div className="space-y-4">
        <p className="text-[#4b5563] text-center">
          La funcionalidad de comparación está disponible en la versión Pro.
        </p>

        <p className="text-[#4b5563] font-semibold text-center">Con la versión Pro podrás:</p>

        <ul className="text-left mx-auto max-w-[500px] space-y-2 text-[#4b5563]">
          <li className="flex items-start gap-2">
            <span className="text-[#40ABA5] font-bold">✓</span>
            <span>Comparar múltiples análisis de notas de prensa</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#40ABA5] font-bold">✓</span>
            <span>Ver gráficos comparativos de métricas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#40ABA5] font-bold">✓</span>
            <span>Guardar historial de análisis</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#40ABA5] font-bold">✓</span>
            <span>Exportar reportes comparativos en PDF</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#40ABA5] font-bold">✓</span>
            <span>Análisis de prensa escrita y digital</span>
          </li>
        </ul>

        <p className="text-[#4b5563] text-center mt-6">
          Para acceder a estas funcionalidades, contacte con ventas en:{' '}
          <strong className="text-[#931583]">administracion@mmi-e.com</strong>
        </p>

        <div className="flex gap-3 mt-6 justify-center flex-wrap">
          <button
            onClick={() => {
              setModalComparar(false);
              setModalContacto(true);
            }}
            className="py-3 px-6 bg-gradient-to-br from-[#40ABA5] to-[#8878A9] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            📧 Contactar para versión Pro
          </button>
          <button
            onClick={() => setModalComparar(false)}
            className="py-3 px-6 bg-gradient-to-br from-[#7B3294] to-[#9A0483] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Volver
          </button>
        </div>
      </div>
    </Modal>

    <Modal isOpen={modalDescarga} onClose={() => setModalDescarga(false)} title="Descarga del informe">
      <div className="space-y-4">
        <p className="text-[#4b5563] text-center">
          Se va a descargar el informe de la versión gratuita con datos básicos de impacto de su nota de prensa.
        </p>

        <p className="text-[#4b5563] text-center">
          Para un informe completo y funcionalidades Pro, contacte con ventas en:{' '}
          <strong className="text-[#931583]">administracion@mmi-e.com</strong>
        </p>

        <div className="flex gap-3 mt-6 justify-center flex-wrap">
          <button
            onClick={handleDescargarBasico}
            className="py-3 px-6 bg-gradient-to-br from-[#40ABA5] to-[#8878A9] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            📄 Descargar informe básico
          </button>
          <button
            onClick={() => {
              setModalDescarga(false);
              setModalContacto(true);
            }}
            className="py-3 px-6 bg-gradient-to-br from-[#7B3294] to-[#9A0483] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            ⭐ Ver versión Pro
          </button>
        </div>
      </div>
    </Modal>

    <Modal isOpen={error !== null} onClose={() => setError(null)} title="Aviso de error">
      <p className="whitespace-pre-line">{error}</p>
    </Modal>

    <Modal isOpen={modalContacto} onClose={() => setModalContacto(false)} title="Solicitar información comercial">
      <ContactForm onClose={() => setModalContacto(false)} />
    </Modal>

    <AuthModal
      isOpen={modalAuth}
      onClose={() => setModalAuth(false)}
      onAuthSuccess={async () => {
        await checkQueryLimits();
        setModalAuth(false);
      }}
    />
  </div>
  );
}