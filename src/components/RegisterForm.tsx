import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  disabled?: boolean;
}

export const RegisterForm = ({ onSuccess, onSwitchToLogin, disabled = false }: RegisterFormProps) => {
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

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Error al registrarse con Google');
      setLoading(false);
    }
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        alert('¡Registro exitoso! Por favor, verifica tu correo electrónico.');
        resetForm();
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || disabled;

  return (
    <form onSubmit={handleSubmit} className="w-full animate-fadeIn">
      <h2 className="text-[#2d3748] mb-6 text-[1.3em] text-center">Crear cuenta</h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-3 rounded-lg mb-5 border-l-4 border-red-400 text-sm animate-slideIn">
          {error}
        </div>
      )}

      <button
        type="button"
        className="w-full py-3 px-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-semibold text-[#2d3748] cursor-pointer transition-all duration-300 flex items-center justify-center gap-2.5 mb-5 hover:bg-[#f7fafc] hover:border-[#cbd5e0] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        onClick={handleGoogleSignUp}
        disabled={isDisabled}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
          <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
          <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
        </svg>
        Continuar con Google
      </button>

      <div className="relative text-center my-5 before:content-[''] before:absolute before:top-1/2 before:left-0 before:right-0 before:h-px before:bg-gray-200">
        <span className="relative bg-white px-[15px] text-[#718096] text-sm">o</span>
      </div>

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
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base bg-[#f7fafc] text-[#2d3748] transition-all duration-300 box-border focus:outline-none focus:border-[#9A0483] focus:bg-white focus:shadow-[0_0_0_3px_rgba(61,148,76,0.15)] placeholder:text-[#a0aec0]"
        />
      </div>

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
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base bg-[#f7fafc] text-[#2d3748] transition-all duration-300 box-border focus:outline-none focus:border-[#9A0483] focus:bg-white focus:shadow-[0_0_0_3px_rgba(61,148,76,0.15)] placeholder:text-[#a0aec0]"
        />
      </div>

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
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base bg-[#f7fafc] text-[#2d3748] transition-all duration-300 box-border focus:outline-none focus:border-[#9A0483] focus:bg-white focus:shadow-[0_0_0_3px_rgba(61,148,76,0.15)] placeholder:text-[#a0aec0]"
        />
      </div>

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
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base bg-[#f7fafc] text-[#2d3748] transition-all duration-300 box-border focus:outline-none focus:border-[#9A0483] focus:bg-white focus:shadow-[0_0_0_3px_rgba(61,148,76,0.15)] placeholder:text-[#a0aec0]"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-3 bg-gradient-to-br from-[#7B3294] to-[#9A0483] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-2.5 shadow-[0_4px_15px_rgba(61,148,76,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(61,148,76,0.6)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        disabled={isDisabled}
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="text-center mt-5 text-[#718096] text-sm">
        ¿Ya tienes cuenta?{' '}
        <span
          onClick={onSwitchToLogin}
          className="text-[#9A0483] cursor-pointer font-semibold underline transition-colors duration-200 hover:text-[#764ba2]"
        >
          Inicia sesión aquí
        </span>
      </p>
    </form>
  );
};
1