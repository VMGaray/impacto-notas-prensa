import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onOpenAuth: () => void;
  remainingQueries: number;
}

export const Navigation = ({ currentPage, onPageChange, onOpenAuth, remainingQueries }: NavigationProps) => {
  const { user, signOut, userPlan } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (user?.user_metadata?.name) {
      const nameParts = user.user_metadata.name.trim().split(' ');
      if (nameParts.length >= 2) {
        // Primera letra del nombre y primera del apellido
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
      }
      // Solo primera letra si no hay apellido
      return user.user_metadata.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setShowDropdown(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] p-2 sm:p-4">
      <div className="max-w-[1100px] my-0 mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-200 py-2 sm:py-3 px-3 sm:px-6 flex justify-between items-center gap-2 sm:gap-5">
        {/* Logo */}
      <div className="flex items-center gap-2">
      <div className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-xl bg-gradient-to-br from-[#40ABA5] to-[#931583] flex items-center justify-center">
      <span className="text-white font-bold text-[11px] sm:text-[13px]">MMI</span>
      </div>
    <span className="text-[#1f2937] font-semibold text-[13px] sm:text-[15px]">Analytics</span>
    </div>


        {/* Selector Pill */}
<div className="hidden sm:flex items-center bg-[#f3f4f6] rounded-[50px] p-1 relative">
  {/* Indicador deslizante */}
  <div
    className="absolute bg-white rounded-[50px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out"
    style={{
      height: 'calc(100% - 8px)',
      width: currentPage === 'inicio' ? '72px' : currentPage === 'precios' ? '82px' : '102px',
      transform: currentPage === 'inicio' ? 'translateX(4px)' : currentPage === 'precios' ? 'translateX(80px)' : 'translateX(166px)',
      top: '4px'
    }}
  />
  <button
    onClick={() => onPageChange('inicio')}
    className={`py-2.5 px-[22px] rounded-[50px] text-sm font-medium cursor-pointer border-none relative z-10
      transition-all duration-300 ease-in-out flex items-center justify-center
      ${currentPage === 'inicio'
        ? 'text-[#111827]'
        : 'text-[#6b7280]'}`}
    style={{ lineHeight: '1' }}
  >
    Inicio
  </button>
  <button
    onClick={() => onPageChange('precios')}
    className={`py-2.5 px-[22px] rounded-[50px] text-sm font-medium cursor-pointer border-none relative z-10
      transition-all duration-300 ease-in-out flex items-center justify-center
      ${currentPage === 'precios'
        ? 'text-[#111827]'
        : 'text-[#6b7280]'}`}
    style={{ lineHeight: '1' }}
  >
    Precios
  </button>
  <button
    onClick={() => onPageChange('nosotros')}
    className={`py-2.5 px-[22px] rounded-[50px] text-sm font-medium cursor-pointer border-none relative z-10
      transition-all duration-300 ease-in-out flex items-center justify-center
      ${currentPage === 'nosotros'
        ? 'text-[#111827]'
        : 'text-[#6b7280]'}`}
    style={{ lineHeight: '1' }}
  >
    Nosotros
  </button>
</div>

{/* Selector móvil compacto */}
<div className="flex sm:hidden items-center bg-[#f3f4f6] rounded-[50px] p-0.5 relative">
  <div
    className="absolute bg-white rounded-[50px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out"
    style={{
      height: 'calc(100% - 4px)',
      width: '33.33%',
      transform: currentPage === 'inicio' ? 'translateX(2px)' : currentPage === 'precios' ? 'translateX(calc(100% + 2px))' : 'translateX(calc(200% + 2px))',
      top: '2px'
    }}
  />
  <button
    onClick={() => onPageChange('inicio')}
    className={`py-1.5 px-2 rounded-[50px] text-xs font-medium cursor-pointer border-none relative z-10
      transition-all duration-300 ease-in-out flex items-center justify-center flex-1
      ${currentPage === 'inicio' ? 'text-[#111827]' : 'text-[#6b7280]'}`}
  >
    Inicio
  </button>
  <button
    onClick={() => onPageChange('precios')}
    className={`py-1.5 px-2 rounded-[50px] text-xs font-medium cursor-pointer border-none relative z-10
      transition-all duration-300 ease-in-out flex items-center justify-center flex-1
      ${currentPage === 'precios' ? 'text-[#111827]' : 'text-[#6b7280]'}`}
  >
    Precios
  </button>
  <button
    onClick={() => onPageChange('nosotros')}
    className={`py-1.5 px-2 rounded-[50px] text-xs font-medium cursor-pointer border-none relative z-10
      transition-all duration-300 ease-in-out flex items-center justify-center flex-1
      ${currentPage === 'nosotros' ? 'text-[#111827]' : 'text-[#6b7280]'}`}
  >
    Nosotros
  </button>
</div>

        {/* Botón acceder / Usuario */}
        {user ? (
          <div className="flex items-center gap-1.5 sm:gap-3 relative" ref={dropdownRef}>
            {/* Contador de consultas con colores dinámicos */}
            <div
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 ${
                remainingQueries === -1
                  ? 'bg-gradient-to-r from-[#40ABA5] to-[#931583] text-white shadow-md'
                  : remainingQueries > 5
                  ? 'bg-[#40ABA5]/20 text-[#40ABA5] border border-[#40ABA5]/30'
                  : remainingQueries > 2
                  ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                  : 'bg-[#A6089B]/20 text-[#A6089B] border border-[#A6089B]/30 animate-pulse'
              }`}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="hidden xs:inline">
                {remainingQueries === -1 ? 'Ilimitadas' : `${remainingQueries} consultas`}
              </span>
              <span className="xs:hidden">
                {remainingQueries === -1 ? '∞' : remainingQueries}
              </span>
            </div>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#931583] via-[#8878A9] to-[#40ABA5] flex items-center justify-center cursor-pointer border-none transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <span className="text-white font-semibold text-xs sm:text-sm">
                {getUserInitials()}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-52 sm:w-56 max-w-[90vw] bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-gray-200 py-2 z-[1100]">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-[#111827] truncate">
                    {user.user_metadata?.name || user.email}
                  </p>
                  <p className="text-xs text-[#6b7280] mt-0.5 truncate">{user.email}</p>
                  <div className="mt-2 inline-block px-2 py-1 bg-gradient-to-r from-[#931583] to-[#40ABA5] bg-clip-text text-transparent text-xs font-semibold">
                    Plan {userPlan === 'pro' ? 'PRO' : 'Free'}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827] transition-colors duration-150 border-none cursor-pointer flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="py-1.5 px-3 sm:py-2.5 sm:px-[22px] bg-[#111827] text-white rounded-[50px] text-xs sm:text-sm font-semibold border-none cursor-pointer transition-all duration-200 hover:bg-[#1f2937]"
          >
            Acceder
          </button>
        )}
      </div>
    </div>
  );
};
