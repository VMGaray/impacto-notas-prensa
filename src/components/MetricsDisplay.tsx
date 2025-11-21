import type { AnalysisResult } from '../types';

interface MetricsDisplayProps {
  analysisResult: AnalysisResult;
  ensureNumber: (val: any) => number;
}

export const MetricsDisplay = ({ analysisResult, ensureNumber }: MetricsDisplayProps) => {
  const menciones = analysisResult.menciones?.detalle || [];
  const mencionesValidas = menciones.filter(m =>
    ['radio', 'tv'].includes(m.tipo?.toLowerCase())
  );

  return (
    <>
      {analysisResult.analisis && Object.entries(analysisResult.analisis).map(([key, detail]) => {
        let displayName = key.charAt(0).toUpperCase() + key.slice(1);
        let displayValue = '';

        if (key === 'cobertura') {
          displayName = 'Cobertura de medios';
          displayValue = ensureNumber(analysisResult.cobertura_medios).toString();
        } else if (key === 'alcance') {
          displayName = 'Alcance estimado';
          displayValue = analysisResult.alcance_estimado.toString();
        } else if (key === 'duracion') {
          displayName = 'Duracion en dias';
          displayValue = `${ensureNumber(analysisResult.duracion_dias)} dias`;
        } else if (key === 'emisiones') {
          displayName = 'Cantidad de emisiones';
          displayValue = ensureNumber(analysisResult.cobertura_emisiones).toString();
        }

        return (
          <div key={key} className={`metric-box ${detail.color}`}>
            <strong>{displayName}:</strong> {displayValue}
          </div>
        );
      })}

      <div className="metric-box verde">
        <strong>Cobertura radio:</strong> {ensureNumber(analysisResult.cobertura_radio)}
      </div>
      <div className="metric-box verde">
        <strong>Cobertura TV:</strong> {ensureNumber(analysisResult.cobertura_tv)}
      </div>
      <div className="metric-box verde">
        <strong>Menciones (Radio/TV):</strong> {mencionesValidas.length}
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
