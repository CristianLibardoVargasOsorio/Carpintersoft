import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f5f3ed] py-8 border-t border-[#f0eee8] shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[#40484b]">
        <div className="flex flex-wrap items-center gap-3 text-center md:text-left">
          <span className="font-headline text-[18px] font-semibold text-[#003745]">Carpintersoft</span>
          <span className="text-[13px] text-[#566B72]">
            © 2025 Carpintersoft Inc. Ingeniería y diseño paramétrico en madera.
          </span>
        </div>
        <div className="flex items-center gap-6 text-[13px]">
          <a href="#terminos" onClick={(e) => e.preventDefault()} className="hover:text-[#1b1c18] transition-colors">
            Términos del Fabricante
          </a>
          <a href="#garantia" onClick={(e) => e.preventDefault()} className="hover:text-[#1b1c18] transition-colors">
            Garantía de Ensamble
          </a>
          <a href="#soporte" onClick={(e) => e.preventDefault()} className="hover:text-[#1b1c18] transition-colors">
            Soporte Técnico
          </a>
        </div>
      </div>
    </footer>
  );
};
