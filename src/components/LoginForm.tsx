import { useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';

interface LoginFormProps {
  onSuccess: (userId: string) => void;
  onSwitchToRegister: () => void;
  disabled?: boolean;
}

export const LoginForm = ({ onSuccess, onSwitchToRegister, disabled = false }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        onSuccess(data.user.id);
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || disabled;

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Iniciar sesión</h2>

      {error && <div className="auth-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          disabled={isDisabled}
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Contraseña</label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isDisabled}
        />
      </div>

      <button type="submit" className="auth-submit-btn" disabled={isDisabled}>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>

      <p className="auth-switch">
        ¿No tienes cuenta?{' '}
        <span onClick={onSwitchToRegister} className="auth-link">
          Regístrate aquí
        </span>
      </p>
    </form>
  );
};
