export const Footer = () => {
  return (
    <div className="bg-white border-t border-[#f3f4f6] py-4 sm:py-6 px-4 sm:px-6">
      <div className="max-w-[1100px] my-0 mx-auto">
        {/* Primera fila: Logo y copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-6 mb-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#40ABA5] to-[#931583] flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">MMI</span>
            </div>
            <span className="text-[#9ca3af] text-xs sm:text-sm">© 2025 MMI Analytics</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center flex-wrap gap-3 sm:gap-6">
            <a
              href="#"
              className="text-[#9ca3af] text-xs sm:text-sm no-underline hover:text-[#6b7280] transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                alert('Política de privacidad próximamente disponible');
              }}
            >
              Política de privacidad
            </a>
            <a
              href="mailto:administracion@mmi-e.com"
              className="text-[#9ca3af] text-xs sm:text-sm no-underline hover:text-[#6b7280] transition-colors duration-200"
            >
              administracion@mmi-e.com
            </a>
            <a
              href="https://mmi-e.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9ca3af] text-xs sm:text-sm no-underline hover:text-[#6b7280] transition-colors duration-200"
            >
              mmi-e.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
