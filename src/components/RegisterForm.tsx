import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  disabled?: boolean;
}

export const RegisterForm = ({ onSuccess, onSwitchToLogin, disabled = false }: RegisterFormProps) => {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Registro en Supabase con email
      const userId = await signUpWithEmail(email, password);
      console.log('✅ signUpWithEmail completó, userId:', userId);

      alert('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
      resetForm();
      onSuccess();
    } catch (err: any) {
      console.error('❌ Error en registro:', err);

      let errorMessage = 'Error al registrarse. Por favor, intenta nuevamente.';
      let isDatabaseError = false;
      
      // Manejo específico de errores
      if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
        errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
      } else if (err.message?.includes('invalid email')) {
        errorMessage = 'El formato del email no es válido.';
      } else if (err.message?.includes('weak password')) {
        errorMessage = 'La contraseña es muy débil. Usa al menos 6 caracteres.';
      } else if (err.message?.includes('Database error') || err.message?.includes('unexpected_failure')) {
        // Error del trigger de backend — pero el usuario SÍ se registró
        isDatabaseError = true;
        errorMessage = 'Cuenta creada, pero hay un problema con el servidor. Intenta iniciar sesión ahora.';
        console.warn('⚠️ Trigger error detectado. El usuario probablemente fue creado exitosamente.');
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      
      // Si fue un error de database, mostrar el modal de login después de 1 segundo
      // para que el usuario pueda intentar login (porque el usuario SÍ se creó)
      if (isDatabaseError) {
        setTimeout(() => {
          console.log('💡 Sugerencia: El usuario fue creado. Intenta iniciar sesión con las mismas credenciales.');
          onSwitchToLogin();
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    console.log('📝 handleGoogleSignUp: Iniciando...');
    setLoading(true);
    setError('');
    try {
      console.log('📝 handleGoogleSignUp: Llamando a signInWithGoogle()...');
      await signInWithGoogle();
      console.log('📝 handleGoogleSignUp: signInWithGoogle() completado');
      // El redirect de OAuth lleva a Google y luego vuelve aquí
      // El AuthContext detectará la sesión automáticamente
    } catch (err: any) {
      console.error('❌ Error en Google signup:', err);
      setError(err.message || 'Error al registrarse con Google. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || disabled;

  return (
    <form onSubmit={handleSubmit} className="w-full animate-fadeIn">
      <h2 className="text-[#2d3748] mb-6 text-[1.3em] text-center">Crear cuenta</h2>

      {error && (
        <div className="px-3 py-3 mb-5 text-sm text-[#A6089B] bg-[#A6089B]/10 border-l-4 border-[#A6089B] rounded-lg animate-slideIn">
          {error}
        </div>
      )}

      {/* Botón de Google */}
      <button
        type="button"
        onClick={(e) => {
          console.log('🖱️ CLICK EN BOTÓN GOOGLE - RegisterForm');
          e.preventDefault();
          e.stopPropagation();
          handleGoogleSignUp();
        }}
        disabled={isDisabled}
        className="w-full py-3 px-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-semibold text-[#2d3748] flex items-center justify-center gap-2.5 mb-5 hover:bg-[#f7fafc] hover:border-[#cbd5e0] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar con Google
      </button>

      <div className="relative text-center my-5 before:content-[''] before:absolute before:top-1/2 before:left-0 before:right-0 before:h-px before:bg-gray-200">
        <span className="relative bg-white px-[15px] text-[#718096] text-sm">o</span>
      </div>

      {/* Nombre */}
      <div className="mb-[18px]">
        <label htmlFor="register-name" className="block mb-1.5 text-[#4a5568] font-semibold text-sm">
          Nombre
        </label>
        <input
          type="text"
          id="register-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          required
          disabled={isDisabled}
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base bg-[#f7fafc] text-[#2d3748] transition-all duration-300 focus:outline-none focus:border-[#9A0483] focus:bg-white"
        />
      </div>

      {/* Email */}
      <div className="mb-[18px]">
        <label htmlFor="register-email" className="block mb-1.5 text-[#4a5568] font-semibold text-sm">
          Email
        </label>
        <input
          type="email"
          id="register-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          disabled={isDisabled}
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base bg-[#f7fafc] text-[#2d3748] transition-all duration-300 focus:outline-none focus:border-[#9A0483] focus:bg-white"
        />
      </div>

      {/* Contraseña */}
      <div className="mb-[18px]">
        <label htmlFor="register-password" className="block mb-1.5 text-[#4a5568] font-semibold text-sm">
          Contraseña
        </label>
        <input
          type="password"
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isDisabled}
          minLength={6}
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base bg-[#f7fafc] text-[#2d3748] transition-all duration-300 focus:outline-none focus:border-[#9A0483] focus:bg-white"
        />
      </div>

      {/* Confirmar contraseña */}
      <div className="mb-[18px]">
        <label htmlFor="register-confirm-password" className="block mb-1.5 text-[#4a5568] font-semibold text-sm">
          Confirmar contraseña
        </label>
        <input
          type="password"
          id="register-confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isDisabled}
          minLength={6}
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base bg-[#f7fafc] text-[#2d3748] transition-all duration-300 focus:outline-none focus:border-[#9A0483] focus:bg-white"
        />
      </div>

      {/* Botón de registro con email */}
      <button
        type="submit"
        className="w-full py-3.5 px-3 bg-gradient-to-br from-[#7B3294] to-[#9A0483] text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-2.5 disabled:opacity-60"
        disabled={isDisabled}
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="text-center mt-5 text-[#718096] text-sm">
        ¿Ya tienes cuenta?{' '}
        <span
          onClick={onSwitchToLogin}
          className="text-[#9A0483] cursor-pointer font-semibold underline hover:text-[#764ba2]"
        >
          Inicia sesión aquí
        </span>
      </p>
    </form>
  );
};
