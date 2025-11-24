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

  return (
    <>
      <div className="metric-box verde">
        <strong>Cobertura de medios:</strong> {ensureNumber(analysisResult.cobertura_medios)}
      </div>
      <div className="metric-box verde">
        <strong>Cantidad de emisiones:</strong> {ensureNumber(analysisResult.cobertura_emisiones)}
      </div>
      <div className="metric-box verde">
        <strong>Alcance estimado:</strong> {analysisResult.alcance_estimado || 0}
      </div>
      <div className="metric-box verde">
        <strong>Duración en días:</strong> {ensureNumber(analysisResult.duracion_dias)} días
      </div>
      <div className="metric-box verde">
        <strong>Cobertura de radio:</strong> {ensureNumber(analysisResult.cobertura_radio)}
      </div>
      <div className="metric-box verde">
        <strong>Cobertura de televisión:</strong> {ensureNumber(analysisResult.cobertura_tv)}
      </div>
      <div className="metric-box verde">
        <strong>Menciones:</strong> {menciones.length}
      </div>

      {analysisResult.recomendaciones && analysisResult.recomendaciones.length > 0 && (
        <div className="metric-box verde">
          <strong>Recomendaciones:</strong>
          <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
            {analysisResult.recomendaciones.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}
    </>
  );
};
