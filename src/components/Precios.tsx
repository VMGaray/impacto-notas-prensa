import { useState } from 'react';
import { Modal } from './Modal';
import { ContactForm } from './ContactForm';
import { AuthModal } from './AuthModal';

export const Precios = () => {
  const [modalContacto, setModalContacto] = useState(false);
  const [modalAuth, setModalAuth] = useState(false);

  const handleContacto = () => {
    setModalContacto(true);
  };

  const handleInicio = () => {
    // Abrir modal de registro
    setModalAuth(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Mancha de color de fondo */}
      <div
        className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(147,21,131,0.15) 0%, transparent 70%)'
        }}
      />

      <div className="relative z-10 max-w-[900px] mx-auto px-6 pt-[140px] pb-20">
        {/* Título */}
        <div className="text-center mb-[60px]">
          <h1 className="text-5xl font-bold text-[#111827] mb-4">
            Planes{' '}
            <span className="bg-gradient-to-r from-[#40ABA5] via-[#8878A9] to-[#931583] bg-clip-text text-transparent">
              simples
            </span>
          </h1>
          <p className="text-[#6b7280] text-lg">Elige cómo quieres analizar tu impacto mediático</p>
        </div>

        {/* Planes */}
        <div className="grid gap-8 mb-12 md:grid-cols-2">
          {/* Plan Gratuito */}
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#e5e7eb] p-8">
            <div className="mb-8">
              <h2 className="text-[#6b7280] font-medium mb-2">Gratuito</h2>
              <div className="text-5xl font-bold text-[#111827]">0 €</div>
              <p className="text-[#9ca3af] text-sm">Para probar la herramienta</p>
            </div>

            <ul className="mb-8 space-y-4">
              {[
                '3 consultas sin registro',
                '10 consultas con cuenta',
                'Datos de los últimos 3 días',
                'Radio y TV de Canarias',
                'Veredicto y métricas básicas',
                'Informe en texto plano'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#4b5563] text-[15px]">
                  <span className="text-[#40ABA5] text-lg">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={handleInicio}
              className="w-full py-3.5 px-4 bg-[#f3f4f6] text-[#374151] font-semibold rounded-xl border-none cursor-pointer text-[15px] hover:bg-[#e5e7eb] transition-colors duration-200"
            >
              Empezar gratis
            </button>
          </div>

          {/* Plan Profesional */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(139,92,246,0.15)] border-2 border-[#c4b5fd] p-8 relative">
            {/* Badge Recomendado */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#40ABA5] via-[#8878A9] to-[#931583] text-white text-xs font-semibold rounded-full">
              Recomendado
            </div>

            <div className="mb-8">
              <h2 className="text-[#931583] font-medium mb-2">Profesional</h2>
              <div className="text-5xl font-bold text-[#111827]">A medida</div>
              <p className="text-[#9ca3af] text-sm">Según necesidades</p>
            </div>

            <ul className="mb-8 space-y-4">
              {[
                'Consultas ilimitadas',
                'Períodos ampliados',
                'Historial completo',
                'Detalle de programas',
                'Comparativas históricas',
                'Informes personalizados'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#4b5563] text-[15px]">
                  <span className="text-[#931583] text-lg">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={handleContacto}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#40ABA5] via-[#8878A9] to-[#931583] text-white font-semibold rounded-xl border-none cursor-pointer text-[15px] hover:shadow-lg transition-shadow duration-200"
            >
              Solicitar información
            </button>
          </div>
        </div>

        {/* Nota */}
        <p className="text-center text-[#9ca3af] text-sm">
          ¿Dudas? Escríbenos a{' '}
          <a href="mailto:administracion@mmi-e.com" className="text-[#931583] hover:text-[#8878A9] transition-colors duration-200">
            administracion@mmi-e.com
          </a>
        </p>
      </div>

      {/* Modal de contacto */}
      <Modal isOpen={modalContacto} onClose={() => setModalContacto(false)} title="Solicitar información comercial">
        <ContactForm onClose={() => setModalContacto(false)} />
      </Modal>

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={modalAuth}
        onClose={() => setModalAuth(false)}
        onAuthSuccess={() => {
          setModalAuth(false);
          // Redirigir a inicio después de registrarse
          const event = new CustomEvent('changePage', { detail: 'inicio' });
          window.dispatchEvent(event);
        }}
        showWelcomeMessage={false}
      />
    </div>
  );
};

