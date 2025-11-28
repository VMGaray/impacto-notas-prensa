import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onOpenAuth: () => void;
  remainingQueries: number;
}

export const Navigation = ({ currentPage, onPageChange, onOpenAuth, remainingQueries }: NavigationProps) => {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] p-4">
      <div className="max-w-[1100px] my-0 mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-200 py-3 px-6 flex justify-between items-center gap-5">
        {/* Logo */}
      <div className="flex items-center gap-2.5">
      <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#40ABA5] to-[#931583] flex items-center justify-center">
      <span className="text-white font-bold text-[13px]">MMI</span>
      </div>
    <span className="text-[#1f2937] font-semibold text-[15px]">Analytics</span>
    </div>


        {/* Selector Pill */}
<div className="flex items-center bg-[#f3f4f6] rounded-[50px] p-1 relative">
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

        {/* Botón acceder / Usuario */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-[#6b7280] text-sm">{remainingQueries} consultas</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#40ABA5] to-[#931583] flex items-center justify-center">
              <span className="text-white font-semibold">
                {user.user_metadata?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="py-2.5 px-[22px] bg-[#111827] text-white rounded-[50px] text-sm font-semibold border-none cursor-pointer transition-all duration-200 hover:bg-[#1f2937]"
          >
            Acceder
          </button>
        )}
      </div>
    </div>
  );
};
