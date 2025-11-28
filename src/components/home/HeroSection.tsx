import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] rounded-full mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <span className="w-2 h-2 bg-[#40ABA5] rounded-full" />
        <span className="text-[#4b5563] text-sm font-medium">
          Análisis en tiempo real de medios canarios
        </span>
      </div>

      <h1 className="text-[clamp(40px,8vw,72px)] font-bold leading-tight mb-6">
        <span className="text-[#111827]">¿Funcionó mi</span>
        <br />
        <span className="bg-gradient-to-r from-[#931583] via-[#8878A9] to-[#40ABA5] bg-clip-text text-transparent">
          nota de prensa?
        </span>
      </h1>

      <p className="text-xl text-[#6b7280] max-w-[600px] mx-auto mb-2">
        Descubre en segundos si tu comunicación llegó a radio y televisión de Canarias
      </p>

      <p className="text-base text-[#6b7280] max-w-[700px] mx-auto mb-8">
        Introduce los datos de tu nota de prensa y obtén un análisis objetivo: número de menciones, alcance estimado, duración de la cobertura y un veredicto claro sobre su repercusión real.
      </p>

      <div className="inline-flex items-center gap-2 text-sm text-[#6b7280] bg-white px-4 py-2 rounded-full border border-[#e5e7eb]">
        <svg width="16" height="16" fill="#40ABA5" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Primera consulta gratuita · Sin registro</span>
      </div>
    </div>
  );
};
