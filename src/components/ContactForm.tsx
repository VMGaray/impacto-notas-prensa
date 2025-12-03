import React, { useState, type FormEvent } from 'react';

interface ContactFormProps {
  onClose: () => void;
  defaultMessage?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onClose,
  defaultMessage = "Quiero información sobre la versión profesional"
}) => {
  const [nombre, setNombre] = useState('');
  const [organizacion, setOrganizacion] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState(defaultMessage);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      // Preparar el cuerpo del email
      const emailBody = `
Nombre y apellidos: ${nombre}
Organización: ${organizacion}
Correo electrónico: ${email}
Teléfono: ${telefono || 'No proporcionado'}

Mensaje:
${mensaje}

---
Enviado desde: ¿Funcionó mi nota de prensa?
Fecha: ${new Date().toLocaleString('es-ES')}
      `.trim();

      // Construir mailto links para ambos destinatarios
      const subject = encodeURIComponent('Solicitud de información - Versión Profesional');
      const body = encodeURIComponent(emailBody);

      // Abrir cliente de correo con ambos destinatarios
      const mailtoLink = `mailto:administracion@mmi-e.com,nfernandez@mmi-e.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;

      setExito(true);

      // Cerrar el modal después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError('Ha ocurrido un error al enviar el formulario. Por favor, inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#40ABA5]/20 flex items-center justify-center">
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="text-xl font-bold text-[#111827] mb-2">¡Solicitud enviada!</h3>
        <p className="text-[#6b7280]">
          Se ha abierto tu cliente de correo con la información prellenada.
          <br />
          Nos pondremos en contacto contigo pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-[#A6089B]/5 border-l-4 border-[#A6089B] p-4 rounded-lg">
          <p className="text-[#A6089B] text-sm">{error}</p>
        </div>
      )}

      {/* Nombre y apellidos */}
      <div>
        <label htmlFor="nombre" className="block text-[#374151] font-semibold text-sm mb-2">
          Nombre y apellidos <span className="text-[#A6089B]">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          placeholder="Ej: Juan Pérez García"
          className="w-full py-3 px-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[15px] text-[#111827] outline-none focus:border-[#40ABA5] focus:ring-2 focus:ring-[#40ABA5]/20 transition-all"
        />
      </div>

      {/* Organización */}
      <div>
        <label htmlFor="organizacion" className="block text-[#374151] font-semibold text-sm mb-2">
          Organización <span className="text-[#A6089B]">*</span>
        </label>
        <input
          type="text"
          id="organizacion"
          value={organizacion}
          onChange={(e) => setOrganizacion(e.target.value)}
          required
          placeholder="Ej: Cabildo de Gran Canaria"
          className="w-full py-3 px-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[15px] text-[#111827] outline-none focus:border-[#40ABA5] focus:ring-2 focus:ring-[#40ABA5]/20 transition-all"
        />
      </div>

      {/* Correo electrónico */}
      <div>
        <label htmlFor="email" className="block text-[#374151] font-semibold text-sm mb-2">
          Correo electrónico <span className="text-[#A6089B]">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Ej: juan.perez@organizacion.com"
          className="w-full py-3 px-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[15px] text-[#111827] outline-none focus:border-[#40ABA5] focus:ring-2 focus:ring-[#40ABA5]/20 transition-all"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="telefono" className="block text-[#374151] font-semibold text-sm mb-2">
          Teléfono <span className="text-[#6b7280] text-xs">(opcional)</span>
        </label>
        <input
          type="tel"
          id="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej: +34 123 456 789"
          className="w-full py-3 px-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[15px] text-[#111827] outline-none focus:border-[#40ABA5] focus:ring-2 focus:ring-[#40ABA5]/20 transition-all"
        />
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="mensaje" className="block text-[#374151] font-semibold text-sm mb-2">
          Mensaje <span className="text-[#6b7280] text-xs">(opcional)</span>
        </label>
        <textarea
          id="mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={4}
          placeholder="Cuéntanos qué necesitas..."
          className="w-full py-3 px-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[15px] text-[#111827] outline-none focus:border-[#40ABA5] focus:ring-2 focus:ring-[#40ABA5]/20 transition-all resize-none"
        />
      </div>

      {/* Información de privacidad */}
      <p className="text-xs text-[#6b7280] text-center">
        Tus datos serán enviados a <strong>administracion@mmi-e.com</strong> y <strong>nfernandez@mmi-e.com</strong>
      </p>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 px-4 bg-[#f3f4f6] text-[#374151] font-semibold rounded-xl hover:bg-[#e5e7eb] transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={enviando}
          className="flex-1 py-3 px-4 bg-gradient-to-br from-[#40ABA5] to-[#931583] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </div>
    </form>
  );
};
