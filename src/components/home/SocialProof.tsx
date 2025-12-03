import React from 'react';

export const SocialProof: React.FC = () => {
  const institutions = [
    'Gobierno de Canarias',
    'Cabildo de Gran Canaria',
    'Cabildo de Tenerife',
    'Ayto. Las Palmas'
  ];

  return (
    <div className="mt-12 sm:mt-20 text-center max-w-[1100px] mx-auto px-4 sm:px-6">
      <p className="text-[#9ca3af] text-[11px] sm:text-[13px] uppercase tracking-wider font-medium mb-4 sm:mb-6">
        Usado por gabinetes de comunicación de
      </p>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
        {institutions.map((org, i) => (
          <span key={i} className="text-[#9ca3af] font-medium text-sm sm:text-base">
            {org}
          </span>
        ))}
      </div>
    </div>
  );
};
