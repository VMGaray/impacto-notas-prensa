import type { AnalysisResult } from '../types';

interface MetricsDisplayProps {
  analysisResult: AnalysisResult;
  ensureNumber: (val: any) => number;
}

export const MetricsDisplay = ({ analysisResult, ensureNumber }: MetricsDisplayProps) => {
  const todasMenciones = analysisResult.menciones?.detalle || [];
  // Filtrar solo menciones de TV y radio
  const menciones = todasMenciones.filter((m) => {
    const tipo = (m.tipo || '').toLowerCase().trim();
    return tipo === 'tv' || tipo === 'radio' || tipo === 'televisión' || tipo === 'television';
  });

  // Función para formatear números con separador de miles europeo
  const formatNumber = (value: any): string => {
    const num = ensureNumber(value);
    if (isNaN(num)) return '0';
    return num.toLocaleString('es-ES');
  };

  const metricBoxClass = "my-3 px-3 sm:px-5 py-3 sm:py-[18px] rounded-xl text-white text-base sm:text-[1.05em] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-200 animate-slideIn hover:translate-x-1.5 bg-gradient-to-br from-[#40ABA5] to-[#40ABA5]";

  return (
    <>
      <div className={metricBoxClass}>
        <strong>Cobertura de medios:</strong> {formatNumber(analysisResult.cobertura_medios)}
      </div>
      <div className={metricBoxClass}>
        <strong>Cantidad de emisiones:</strong> {formatNumber(analysisResult.cobertura_emisiones)}
      </div>
      <div className={metricBoxClass}>
        <strong>Alcance estimado:</strong> {formatNumber(analysisResult.alcance_estimado)}
      </div>
      <div className={metricBoxClass}>
        <strong>Duración en días:</strong> {formatNumber(analysisResult.duracion_dias)} días
      </div>
      <div className={metricBoxClass}>
        <strong>Cobertura de radio:</strong> {formatNumber(analysisResult.cobertura_radio)}
      </div>
      <div className={metricBoxClass}>
        <strong>Cobertura de televisión:</strong> {formatNumber(analysisResult.cobertura_tv)}
      </div>
      <div className={metricBoxClass}>
        <strong>Menciones:</strong> {formatNumber(menciones.length)}
      </div>

      {analysisResult.recomendaciones && analysisResult.recomendaciones.length > 0 && (
        <div className={metricBoxClass}>
          <strong>Recomendaciones:</strong>
          <ul className="mt-2.5 pl-5">
            {analysisResult.recomendaciones.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}
    </>
  );
};
