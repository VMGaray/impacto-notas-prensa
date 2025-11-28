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
  const [showForm, setShowForm] = useState(false); // Controlar visibilidad del formulario

  const handleLoginSuccess = (userId: string) => {
    onAuthSuccess(userId);
    onClose();
  };

  const handleRegisterSuccess = () => {
    setIsLogin(true);
  };

  const handleCreateAccount = () => {
    setIsLogin(false);
    setShowForm(true);
  };

  const handleLogin = () => {
    setIsLogin(true);
    setShowForm(true);
  };

  // Resetear el estado al cerrar
  const handleClose = () => {
    setShowForm(false);
    setIsLogin(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] w-full h-full overflow-auto bg-black/60 animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="bg-white my-[5%] mx-auto p-8 rounded-[20px] w-[90%] max-w-[450px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-slideDown"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="text-[#aaa] float-right text-[32px] font-bold leading-5 cursor-pointer transition-colors duration-300 hover:text-black"
          onClick={handleClose}
        >
          &times;
        </span>

        {/* Banner de bienvenida */}
        {showWelcomeMessage && !showForm && (
          <div className="text-center mb-6 p-5 bg-gradient-to-br from-[#667eea]/[0.08] to-[#764ba2]/[0.08] rounded-xl">
            <h2 className="text-2xl text-[#2d3748] mb-2.5">¡Vemos que te gusta! 🎉</h2>
            <p className="text-[#4a5568] mb-4 font-semibold">Crea tu cuenta gratuita para:</p>
            <ul className="list-none p-0 text-left max-w-[350px] my-0 mx-auto">
              <li className="py-2 text-[#2d3748] text-sm">✅ 10 análisis diarios (vs 3 sin cuenta)</li>
              <li className="py-2 text-[#2d3748] text-sm">✅ Historial de todas tus consultas</li>
              <li className="py-2 text-[#2d3748] text-sm">✅ Comparar resultados entre fechas</li>
            </ul>
          </div>
        )}

        {/* Botones de acción */}
        {!showForm && (
          <div className="flex gap-2.5 mb-6">
            <button
              className="flex-1 py-3 px-3 rounded-lg cursor-pointer font-semibold transition-all duration-300 border-none bg-gradient-to-br from-[#7B3294] to-[#9A0483] text-white hover:shadow-lg"
              onClick={handleCreateAccount}
              type="button"
            >
              Crear cuenta
            </button>
            <button
              className="flex-1 py-3 px-3 rounded-lg cursor-pointer font-semibold transition-all duration-300 border-none bg-[#f7fafc] border-2 border-gray-200 text-[#718096] hover:bg-[#edf2f7]"
              onClick={handleLogin}
              type="button"
            >
              Iniciar sesión
            </button>
          </div>
        )}

        {/* Formularios */}
        {showForm && (
          <>
            <div className="flex gap-2.5 mb-6">
              <button
                className={`flex-1 py-3 px-3 rounded-lg cursor-pointer font-semibold transition-all duration-300 border-none ${
                  !isLogin
                    ? 'bg-gradient-to-br from-[#7B3294] to-[#9A0483] text-white'
                    : 'bg-[#f7fafc] border-2 border-gray-200 text-[#718096] hover:bg-[#edf2f7]'
                }`}
                onClick={() => setIsLogin(false)}
                type="button"
              >
                Crear cuenta
              </button>
              <button
                className={`flex-1 py-3 px-3 rounded-lg cursor-pointer font-semibold transition-all duration-300 border-none ${
                  isLogin
                    ? 'bg-gradient-to-br from-[#7B3294] to-[#9A0483] text-white'
                    : 'bg-[#f7fafc] border-2 border-gray-200 text-[#718096] hover:bg-[#edf2f7]'
                }`}
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
          </>
        )}

        <p className="text-center text-[#718096] text-[0.85em] mt-5 pt-4 border-t border-gray-200">
          Solo 30 segundos. Sin tarjeta de crédito.
        </p>
      </div>
    </div>
  );
};
