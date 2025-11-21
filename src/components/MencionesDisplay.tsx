import type { Mencion } from '../types';

interface MencionesDisplayProps {
  menciones: Mencion[];
}

export const MencionesDisplay = ({ menciones }: MencionesDisplayProps) => {
  const mencionesValidas = menciones.filter((m: Mencion) => {
    const tipoNorm = (m.tipo || '').trim().toLowerCase();
    return tipoNorm === 'tv' || tipoNorm === 'radio';
  });

  if (mencionesValidas.length === 0) {
    return (
      <div className="detail-item">
        <h4>Menciones encontradas</h4>
        <p><strong>Cantidad:</strong> 0 menciones validas</p>
        <p><strong>Descripcion:</strong> No se encontraron menciones de radio o TV en los medios consultados.</p>
      </div>
    );
  }

  return (
    <div className="detail-item">
      <h4>Menciones encontradas</h4>
      <p><strong>Cantidad:</strong> {mencionesValidas.length} menciones</p>
      <p><strong>Descripcion:</strong> Fragmentos de las noticias de radio y TV donde se menciona la organizacion o el tema analizado.</p>
      <div style={{ marginTop: '15px' }}>
        {mencionesValidas.map((m, index) => {
          const extracto = m.extracto || m.texto || "";
          const colorBadge = m.tipo?.trim().toLowerCase() === 'tv' ? '#48bb78' : '#4299e1';

          return (
            <div key={index} style={{
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f7fafc',
              borderLeft: `4px solid ${colorBadge}`,
              borderRadius: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ color: '#2b6cb0', fontSize: '1.05em' }}>📰 Mencion {index + 1}</strong>
                <span style={{
                  backgroundColor: colorBadge,
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.85em',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>
                  {m.tipo}
                </span>
              </div>

              {extracto && (
                <div style={{ marginBottom: '12px' }}>
                  <p style={{
                    margin: 0,
                    fontStyle: 'italic',
                    color: '#2d3748',
                    lineHeight: 1.6,
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '4px'
                  }}>
                    "{extracto}"
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px', fontSize: '0.9em' }}>
                {m.medio && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#718096' }}>📡 <strong>Medio:</strong></span>
                    <span style={{ color: '#2d3748' }}>{m.medio}</span>
                  </div>
                )}
                {m.fecha && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#718096' }}>📅 <strong>Fecha:</strong></span>
                    <span style={{ color: '#2d3748' }}>{m.fecha}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
