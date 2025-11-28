import React, { type FormEvent } from 'react';

interface AnalysisFormProps {
  organizacion: string;
  tema: string;
  fecha: string;
  onOrganizacionChange: (value: string) => void;
  onTemaChange: (value: string) => void;
  onFechaChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  supabaseConfigured: boolean;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  organizacion,
  tema,
  fecha,
  onOrganizacionChange,
  onTemaChange,
  onFechaChange,
  onSubmit,
  supabaseConfigured
}) => {
  return (
    <div className="max-w-[800px] w-full my-2.5 mx-auto bg-white px-10 py-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#f3f4f6] mb-20">
      {!supabaseConfigured && (
        <div className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border-2 border-[#f59e0b] rounded-xl px-5 py-[15px] mb-5 text-left">
          <strong className="text-[#92400e] text-base block mb-1.5">⚠️ Modo de Desarrollo</strong>
          <p className="text-[#78350f] my-1.5 text-sm">Supabase no está configurado. El sistema usa localStorage temporal.</p>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="mb-2.5">
          <label className="block mb-0.5 text-[#4a5568] font-semibold text-sm">Organización</label>
          <input
            type="text"
            value={organizacion}
            onChange={(e) => onOrganizacionChange(e.target.value)}
            placeholder="Ej: TechCorp"
            required
            className="block w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-lg"
          />
        </div>

        <div className="mb-2.5">
          <label className="block mb-0.5 text-[#4a5568] font-semibold text-sm">Tema</label>
          <input
            type="text"
            value={tema}
            onChange={(e) => onTemaChange(e.target.value)}
            placeholder="Ej: Lanzamiento Producto"
            required
            className="block w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-lg"
          />
        </div>

        <div className="mb-2.5">
          <label className="block mb-0.5 text-[#4a5568] font-semibold text-sm">Fecha de publicación</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => onFechaChange(e.target.value)}
            required
            className="block w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-lg"
          />
        </div>

        <button type="submit" className="block w-full mt-[15px] py-3 px-3 bg-gradient-to-br from-[#7B3294] to-[#9A0483] text-white rounded-lg">
          Analizar mi nota de prensa
        </button>
      </form>
    </div>
  );
};
