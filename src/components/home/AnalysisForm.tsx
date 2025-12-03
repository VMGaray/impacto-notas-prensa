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
    <div className="max-w-[800px] w-full my-2.5 mx-4 sm:mx-auto bg-[#F9F9F9] px-5 sm:px-10 py-6 sm:py-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#B1BBC4] mb-12 sm:mb-20">
  {!supabaseConfigured && (
    <div className="bg-gradient-to-br from-[#F9F9F9] to-[#B1BBC4] border-2 border-[#A6089B] rounded-xl px-4 sm:px-5 py-3 sm:py-[15px] mb-4 sm:mb-5 text-left">
      <strong className="text-[#931583] text-sm sm:text-base block mb-1.5">⚠️ Modo de Desarrollo</strong>
      <p className="text-[#8878A9] my-1.5 text-xs sm:text-sm">
        Supabase no está configurado. El sistema usa localStorage temporal.
      </p>
    </div>
  )}

  <form onSubmit={onSubmit}>
    <div className="mb-2.5">
      <label className="block mb-0.5 text-[#931583] font-semibold text-xs sm:text-sm">Organización</label>
      <input
        type="text"
        value={organizacion}
        onChange={(e) => onOrganizacionChange(e.target.value)}
        placeholder="Ej: TechCorp"
        required
        className="block w-full py-2 sm:py-2.5 px-3 sm:px-3.5 border-2 border-[#B1BBC4] rounded-lg text-sm sm:text-base text-[#2d3748] focus:outline-none focus:border-[#40ABA5] focus:ring-1 focus:ring-[#40ABA5]"
      />
    </div>

    <div className="mb-2.5">
      <label className="block mb-0.5 text-[#931583] font-semibold text-xs sm:text-sm">Tema</label>
      <input
        type="text"
        value={tema}
        onChange={(e) => onTemaChange(e.target.value)}
        placeholder="Ej: Lanzamiento Producto"
        required
        className="block w-full py-2 sm:py-2.5 px-3 sm:px-3.5 border-2 border-[#B1BBC4] rounded-lg text-sm sm:text-base text-[#2d3748] focus:outline-none focus:border-[#40ABA5] focus:ring-1 focus:ring-[#40ABA5]"
      />
    </div>

    <div className="mb-2.5">
      <label className="block mb-0.5 text-[#931583] font-semibold text-xs sm:text-sm">Fecha de publicación</label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => onFechaChange(e.target.value)}
        required
        className="block w-full py-2 sm:py-2.5 px-3 sm:px-3.5 border-2 border-[#B1BBC4] rounded-lg text-sm sm:text-base text-[#2d3748] focus:outline-none focus:border-[#40ABA5] focus:ring-1 focus:ring-[#40ABA5]"
      />
    </div>

    <button
      type="submit"
      className="block w-full mt-4 sm:mt-[15px] py-2.5 sm:py-3 px-3 bg-gradient-to-br from-[#A6089B] to-[#931583] text-white rounded-lg text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all"
    >
      Analizar mi nota de prensa
    </button>
  </form>
</div>

  );
};
