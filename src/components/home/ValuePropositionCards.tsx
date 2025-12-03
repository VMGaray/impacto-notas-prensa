import React from 'react';

export const ValuePropositionCards: React.FC = () => {
  const cards = [
    {
      icon: '📊',
      title: 'Datos reales',
      description: 'Información verificada de emisiones de radio y TV en Canarias',
      gradient: 'from-[#40ABA5] to-[#8878A9]'
    },
    {
      icon: '⚡',
      title: 'Análisis instantáneo',
      description: 'Resultados en segundos gracias a nuestra tecnología de IA',
      gradient: 'from-[#8878A9] to-[#931583]'
    },
    {
      icon: '✓',
      title: 'Criterios objetivos',
      description: 'Evaluación transparente basada en alcance, duración y repetición',
      gradient: 'from-[#931583] to-[#40ABA5]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-[1100px] mx-auto px-4 sm:px-6 mb-12 sm:mb-20">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 sm:p-8 border border-[#f3f4f6] text-center"
        >
          <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-5 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
            <span className="text-2xl sm:text-3xl">{card.icon}</span>
          </div>
          <h3 className="text-[#111827] font-bold text-base sm:text-lg mb-2 sm:mb-3">{card.title}</h3>
          <p className="text-[#6b7280] text-xs sm:text-sm leading-relaxed">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
};
