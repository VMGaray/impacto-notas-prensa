import React from 'react';

export const SocialProof: React.FC = () => {
  const institutions = [
    'Gobierno de Canarias',
    'Cabildo de Gran Canaria',
    'Cabildo de Tenerife',
    'Ayto. Las Palmas'
  ];

  return (
    <div className="mt-20 text-center max-w-[1100px] mx-auto px-6">
      <p className="text-[#9ca3af] text-[13px] uppercase tracking-wider font-medium mb-6">
        Usado por gabinetes de comunicación de
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {institutions.map((org, i) => (
          <span key={i} className="text-[#9ca3af] font-medium text-base">
            {org}
          </span>
        ))}
      </div>
    </div>
  );
};
