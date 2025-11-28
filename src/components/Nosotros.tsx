export const Nosotros = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Manchas de color de fondo */}
      <div
        className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(136,120,169,0.15) 0%, transparent 70%)'
        }}
      />

      <div className="relative z-10 max-w-[800px] mx-auto px-6 pt-[140px] pb-20">
        {/* Título */}
        <div className="text-center mb-[60px]">
          <h1 className="text-5xl font-bold text-[#111827] mb-4">
            Más de{' '}
            <span className="bg-gradient-to-r from-[#40ABA5] via-[#8878A9] to-[#931583] bg-clip-text text-transparent">
              20 años
            </span>
          </h1>
          <p className="text-[#6b7280] text-lg">monitorizando medios en Canarias</p>
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-10 mb-12">
          <h2 className="text-2xl font-bold text-[#111827] mb-6">Sobre MMI Analytics</h2>

          <p className="text-[#4b5563] text-[17px] leading-relaxed mb-5">
            MMI Analytics es la división de análisis de datos de MMI, empresa canaria especializada en monitorización de medios desde 2003. Procesamos información de radio, televisión y medios digitales para organizaciones que necesitan datos fiables sobre su presencia mediática.
          </p>

          <p className="text-[#4b5563] text-[17px] leading-relaxed">
            <strong className="text-[#111827]">"¿Funcionó mi nota de prensa?"</strong> es nuestra primera herramienta de acceso público. Permite a gabinetes de comunicación, administraciones y organizaciones evaluar de forma inmediata y objetiva el impacto de sus comunicaciones en radio y televisión de Canarias.
          </p>
        </div>

        {/* Datos clave */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { num: '+20', label: 'años', color: '#40ABA5' },
            { num: '24/7', label: 'monitorización', color: '#931583' },
            { num: '100%', label: 'verificado', color: '#8878A9' },
            { num: 'IA', label: 'inteligente', color: '#B1BBC4' }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] py-6 px-4 text-center"
            >
              <div
                className="text-[32px] font-bold mb-1"
                style={{ color: stat.color }}
              >
                {stat.num}
              </div>
              <p className="text-[#6b7280] text-[13px]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Criterios transparentes */}
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 mb-12">
          <h3 className="text-xl font-bold text-[#111827] mb-6">Datos clave</h3>
          <ul className="space-y-4">
            {[
              'Más de 20 años monitorizando medios en Canarias',
              'Datos reales de radio y televisión regional',
              'Análisis automático mediante inteligencia artificial',
              'Criterios de evaluación homogéneos y transparentes'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[#4b5563] text-base">
                <span className="text-[#40ABA5] text-lg flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div className="text-center">
          <p className="text-[#6b7280] mb-4">¿Necesitas más información?</p>
          <a
            href="mailto:administracion@mmi-e.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#374151] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.06)] no-underline font-medium text-[15px] hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)] transition-shadow duration-200"
          >
            administracion@mmi-e.com →
          </a>
        </div>
      </div>
    </div>
  );
};
