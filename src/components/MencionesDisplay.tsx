import type { Mencion } from '../types';

interface MencionesDisplayProps {
  menciones: Mencion[];
}

export const MencionesDisplay = ({ menciones }: MencionesDisplayProps) => {
  // Filtrar solo menciones de TV y radio
  const mencionesValidas = menciones.filter((m) => {
    const tipo = (m.tipo || '').toLowerCase().trim();
    return tipo === 'tv' || tipo === 'radio' || tipo === 'televisión' || tipo === 'television';
  });

  if (mencionesValidas.length === 0) {
    return (
      <div className="bg-[#f7fafc] text-[#2d3748] p-[15px] my-3 rounded-[10px] border-l-4 border-[#3d944c]">
        <h4 className="text-[#4a5568] mb-2">Menciones encontradas</h4>
        <p className="text-[#2d3748] leading-6"><strong>Cantidad:</strong> 0 menciones</p>
        <p className="text-[#2d3748] leading-6"><strong>Descripción:</strong> No se encontraron menciones en los medios consultados.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f7fafc] text-[#2d3748] p-[15px] my-3 rounded-[10px] border-l-4 border-[#3d944c]">
      <h4 className="text-[#4a5568] mb-2">Menciones encontradas</h4>
      <p className="text-[#2d3748] leading-6"><strong>Cantidad:</strong> {mencionesValidas.length} menciones</p>
      <p className="text-[#2d3748] leading-6"><strong>Descripción:</strong> Fragmentos de las noticias donde se menciona la organización o el tema analizado.</p>
      <div className="mt-[15px]">
        {mencionesValidas.map((m, index) => {
          const extracto = m.extracto || m.texto || "";
          const tipo = (m.tipo || '').toLowerCase();
          const isTv = tipo === 'tv' || tipo === 'television';

          return (
            <div
              key={index}
              className={`mb-5 p-[15px] bg-[#f7fafc] rounded-md shadow-sm ${
                isTv ? 'border-l-4 border-[#48bb78]' : 'border-l-4 border-[#4299e1]'
              }`}
            >
              <div className="flex justify-between items-center mb-2.5">
                <strong className="text-[#2b6cb0] text-[1.05em]">Mención {index + 1}</strong>
                <span
                  className={`text-white py-1 px-2.5 rounded-xl text-[0.85em] font-semibold uppercase ${
                    isTv ? 'bg-[#48bb78]' : 'bg-[#4299e1]'
                  }`}
                >
                  {m.tipo}
                </span>
              </div>

              {extracto && (
                <div className="mb-3">
                  <p className="m-0 italic text-[#2d3748] leading-6 bg-white p-2.5 rounded">
                    "{extracto}"
                  </p>
                </div>
              )}

              <div className="flex gap-5 flex-wrap mt-2.5 text-[0.9em]">
                {m.medio && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#718096]"><strong>Medio:</strong></span>
                    <span className="text-[#2d3748]">{m.medio}</span>
                  </div>
                )}
                {m.fecha && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#718096]"><strong>Fecha:</strong></span>
                    <span className="text-[#2d3748]">{m.fecha}</span>
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
