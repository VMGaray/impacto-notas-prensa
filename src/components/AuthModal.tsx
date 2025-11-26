import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userId: string) => void;
  showWelcomeMessage?: boolean;
}

export const AuthModal = ({ isOpen, onClose, onAuthSuccess, showWelcomeMessage = true }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(false); // Por defecto mostrar registro

  const handleLoginSuccess = (userId: string) => {
    onAuthSuccess(userId);
    onClose();
  };

  const handleRegisterSuccess = () => {
    setIsLogin(true);
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>

        {showWelcomeMessage && !isLogin && (
          <div className="auth-welcome-message">
            <h2 className="welcome-title">¡Vemos que te gusta! 🎉</h2>
            <p className="welcome-subtitle">Crea tu cuenta gratuita para:</p>
            <ul className="welcome-benefits">
              <li>✅ 10 análisis diarios (vs 3 sin cuenta)</li>
              <li>✅ Historial de todas tus consultas</li>
              <li>✅ Comparar resultados entre fechas</li>
            </ul>
          </div>
        )}

        <div className="auth-tabs">
          <button
            className={"auth-tab " + (!isLogin ? "active" : "")}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Crear cuenta
          </button>
          <button
            className={"auth-tab " + (isLogin ? "active" : "")}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Iniciar sesión
          </button>
        </div>

        {isLogin ? (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}

        <p className="auth-footer-note">Solo 30 segundos. Sin tarjeta de crédito.</p>
      </div>
    </div>
  );
};
