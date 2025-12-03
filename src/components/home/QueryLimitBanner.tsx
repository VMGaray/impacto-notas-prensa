import React from 'react';

interface QueryLimitBannerProps {
  user: any;
  remainingQueries: number;
  onCreateAccount: () => void;
  onContactPro: () => void;
}

export const QueryLimitBanner: React.FC<QueryLimitBannerProps> = ({
  user,
  remainingQueries,
  onCreateAccount,
  onContactPro
}) => {
  return (
    <div className="mb-6 p-6 bg-gradient-to-br from-[#F9F9F9] to-[#B1BBC4] rounded-xl border-l-4 border-[#A6089B] shadow-md">
  <h3 className="text-[#931583] font-bold text-lg mb-3">
    {!user
      ? `Te quedan ${remainingQueries} consultas gratuitas hoy`
      : `Te quedan ${remainingQueries} consultas en tu plan`
    }
  </h3>
  <p className="text-[#8878A9] mb-3">
    {!user ? 'Crea tu cuenta gratis para:' : 'Actualiza a la versión Pro para:'}
  </p>
  <ul className="text-[#8878A9] mb-4 space-y-1">
    {!user ? (
      <>
        <li className="flex items-start gap-2">
          <span className="text-[#A6089B] font-bold">•</span>
          <span>10 análisis diarios</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#A6089B] font-bold">•</span>
          <span>Historial de análisis</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#A6089B] font-bold">•</span>
          <span>Comparativas entre fechas</span>
        </li>
      </>
    ) : (
      <>
        <li className="flex items-start gap-2">
          <span className="text-[#A6089B] font-bold">•</span>
          <span>Consultas ilimitadas</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#A6089B] font-bold">•</span>
          <span>Análisis de prensa escrita y digital</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#A6089B] font-bold">•</span>
          <span>Informes personalizados en PDF</span>
        </li>
      </>
    )}
  </ul>
  <div className="flex flex-wrap gap-3">
    {!user ? (
      <>
        <button
          onClick={onCreateAccount}
          className="py-2.5 px-5 bg-gradient-to-br from-[#40ABA5] to-[#8878A9] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          Crear cuenta - 30 segundos
        </button>
        <button
          onClick={onContactPro}
          className="py-2.5 px-5 bg-gradient-to-br from-[#A6089B] to-[#931583] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          Ver planes Pro
        </button>
      </>
    ) : (
      <button
        onClick={onContactPro}
        className="py-2.5 px-5 bg-gradient-to-br from-[#A6089B] to-[#931583] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
      >
        Actualizar a Pro
      </button>
    )}
  </div>
</div>

  );
};
