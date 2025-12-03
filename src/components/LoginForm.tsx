import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onSuccess: (userId: string) => void;
  onSwitchToRegister: () => void;
  disabled?: boolean;
}

export const LoginForm = ({ onSuccess, onSwitchToRegister, disabled = false }: LoginFormProps) => {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    console.log('🔐 handleGoogleLogin: Iniciando...');
    setLoading(true);
    setError('');
    try {
      console.log('🔐 handleGoogleLogin: Llamando a signInWithGoogle()...');
      await signInWithGoogle();
      console.log('🔐 handleGoogleLogin: signInWithGoogle() completado');
      // El AuthContext se encargará de traer el perfil automáticamente
    } catch (err: any) {
      console.error('❌ Error al iniciar sesión con Google:', err);
      setError(err.message || 'Error al iniciar sesión con Google');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userId = await signInWithEmail(email, password);
      setEmail('');
      setPassword('');

      if (userId) {
        onSuccess(userId);
      } else {
        // Si no hay userId es probable que el registro requiera confirmación por email
        setError('Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || disabled;

  return (
    <form onSubmit={handleSubmit} className="w-full animate-fadeIn">
      <h2 className="text-[#2d3748] mb-6 text-[1.3em] text-center">Iniciar sesión</h2>

      {error && (
        <div className="px-3 py-3 mb-5 text-sm text-[#A6089B] bg-[#A6089B]/10 border-l-4 border-[#A6089B] rounded-lg animate-slideIn">
          {error}
        </div>
      )}

      <button
        type="button"
        className="w-full py-3 px-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-semibold text-[#2d3748] cursor-pointer transition-all duration-300 flex items-center justify-center gap-2.5 mb-5 hover:bg-[#f7fafc] hover:border-[#cbd5e0] disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={(e) => {
          console.log('🖱️ CLICK EN BOTÓN GOOGLE - LoginForm');
          e.preventDefault();
          e.stopPropagation();
          handleGoogleLogin();
        }}
        disabled={isDisabled}
      >
        Continuar con Google
      </button>

      <div className="relative text-center my-5 before:content-[''] before:absolute before:top-1/2 before:left-0 before:right-0 before:h-px before:bg-gray-200">
        <span className="relative bg-white px-[15px] text-[#718096] text-sm">o</span>
      </div>

      <div className="mb-[18px]">
        <label htmlFor="login-email" className="block mb-1.5 text-[#4a5568] font-semibold text-sm">
          Email
        </label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          disabled={isDisabled}
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base bg-[#f7fafc] text-[#2d3748] focus:outline-none focus:border-[#9A0483]"
        />
      </div>

      <div className="mb-[18px]">
        <label htmlFor="login-password" className="block mb-1.5 text-[#4a5568] font-semibold text-sm">
          Contraseña
        </label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isDisabled}
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base bg-[#f7fafc] text-[#2d3748] focus:outline-none focus:border-[#9A0483]"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-3 bg-gradient-to-br from-[#7B3294] to-[#9A0483] text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-2.5 disabled:opacity-60"
        disabled={isDisabled}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>

      <p className="text-center mt-5 text-[#718096] text-sm">
        ¿No tienes cuenta?{' '}
        <span
          onClick={onSwitchToRegister}
          className="text-[#9A0483] cursor-pointer font-semibold underline hover:text-[#764ba2]"
        >
          Regístrate aquí
        </span>
      </p>
    </form>
  );
};
