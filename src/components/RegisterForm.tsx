import { useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';

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
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Crear cuenta</h2>

      {error && <div className="auth-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="register-name">Nombre</label>
        <input
          type="text"
          id="register-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          required
          disabled={isDisabled}
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-email">Email</label>
        <input
          type="email"
          id="register-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          disabled={isDisabled}
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-password">Contraseña</label>
        <input
          type="password"
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isDisabled}
          minLength={6}
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-confirm-password">Confirmar contraseña</label>
        <input
          type="password"
          id="register-confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isDisabled}
          minLength={6}
        />
      </div>

      <button type="submit" className="auth-submit-btn" disabled={isDisabled}>
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="auth-switch">
        ¿Ya tienes cuenta?{' '}
        <span onClick={onSwitchToLogin} className="auth-link">
          Inicia sesión aquí
        </span>
      </p>
    </form>
  );
};
