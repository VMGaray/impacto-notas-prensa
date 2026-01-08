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

  // Función para formatear fechas de YYYY-MM-DD a DD-MM-YYYY (formato europeo)
  const formatFecha = (fecha: string): string => {
    if (!fecha) return '';
    
    try {
      // Si la fecha ya está en formato DD-MM-YYYY, la devuelve tal cual
      if (fecha.match(/^\d{2}-\d{2}-\d{4}$/)) {
        return fecha;
      }
      
      // Convierte de YYYY-MM-DD a DD-MM-YYYY
      const partes = fecha.split('-');
      if (partes.length === 3) {
        const [año, mes, dia] = partes;
        return `${dia}-${mes}-${año}`;
      }
      
      return fecha; // Si no puede convertir, devuelve el original
    } catch (error) {
      return fecha;
    }
  };

  if (mencionesValidas.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#F9F9F9] text-[#2d3748] p-3 sm:p-[15px] my-3 rounded-[10px] border-l-4 border-[#A6089B]">
      <h4 className="text-[#931583] mb-2">Menciones encontradas</h4>
      <p className="text-[#2d3748] leading-6">
        <strong>Cantidad:</strong> {mencionesValidas.length} menciones
      </p>
      <p className="text-[#2d3748] leading-6">
        <strong>Descripción:</strong> Fragmentos de las noticias donde se menciona la organización o el tema analizado.
      </p>
      <div className="mt-3 sm:mt-[15px]">
        {mencionesValidas.map((m, index) => {
          const extracto = m.extracto || m.texto || "";
          const tipo = (m.tipo || '').toLowerCase();
          const isTv = tipo === 'tv' || tipo === 'television';

          return (
            <div
              key={index}
              className={`mb-5 p-3 sm:p-[15px] bg-[#F9F9F9] rounded-md shadow-sm ${
                isTv ? 'border-l-4 border-[#40ABA5]' : 'border-l-4 border-[#A6089B]'
              }`}
            >
              <div className="flex justify-between items-center mb-2.5">
                <strong className="text-[#931583] text-base sm:text-[1.05em]">Mención {index + 1}</strong>
                <span
                  className={`text-white py-1 px-2.5 rounded-xl text-xs sm:text-[0.85em] font-semibold uppercase ${
                    isTv
                      ? 'bg-[#40ABA5]'
                      : 'bg-gradient-to-br from-[#A6089B] to-[#931583]'
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

              <div className="flex gap-3 sm:gap-5 flex-wrap mt-2.5 text-sm sm:text-[0.9em]">
                {m.medio && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#8878A9]"><strong>Medio:</strong></span>
                    <span className="text-[#2d3748]">{m.medio}</span>
                  </div>
                )}
                {m.fecha && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#8878A9]"><strong>Fecha:</strong></span>
                    <span className="text-[#2d3748]">{formatFecha(m.fecha)}</span>
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