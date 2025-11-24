import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userId: string) => void;
}

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);

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

        <div className="auth-tabs">
          <button
            className={"auth-tab " + (isLogin ? "active" : "")}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Iniciar sesión
          </button>
          <button
            className={"auth-tab " + (!isLogin ? "active" : "")}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Registrarse
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
      </div>
    </div>
  );
};
