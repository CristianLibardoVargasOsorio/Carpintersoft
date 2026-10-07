import React, { useState } from 'react';
import { Screen } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: Screen; label: string }[] = [
    { id: 'catalogo', label: 'Catálogo' },
    { id: 'personalizador-3d', label: 'Personalizador 3D' },
    { id: 'asistente-ia', label: 'Asistente IA' },
    { id: 'mis-pedidos', label: 'Mis Pedidos' },
    { id: 'cotizaciones-guardadas', label: 'Cotizaciones guardadas' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#fbf9f3]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#f0eee8]">
      <div className="h-20 w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6 xl:gap-8">
          <button
            onClick={() => onNavigate('catalogo')}
            className="flex items-center gap-2 focus:outline-none text-left cursor-pointer group"
          >
            <img
              alt="Carpintersoft Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1X9oukXY8HeTKmKv4b6U2CvdpDE4b0Odcc5X_maDnsGSZfxv0qCpXHwnqMUiL5ieBGP8v3fFHblAPxuTEW3i_QT_LaX6t8yuzJsRR1Wqz5E2NhnqJkyiQ21KjChrYUDQLC-QSn66oGFCsr8K2QvrPH5kQw8wWCacIYBsfEDBElFLFiAXgjLSdQK0o7GzmV_IrU0EzVyGp-n6quz47mhANB9XPTUBCrHdhzeJAE5YIh-ra6XKiNjCpD8wQ"
            />
            <div className="flex flex-col">
              <span className="font-headline text-[18px] font-semibold text-[#003745] tracking-tight leading-none">
                Carpintersoft
              </span>
              <span className="font-headline text-[11px] font-semibold text-[#566B72] uppercase tracking-wider">
                Estudio 3D
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-[#f5f3ed] rounded-xl">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 font-headline text-[13px] font-semibold transition-all rounded-lg cursor-pointer ${
                    isActive
                      ? 'bg-[#0d4f60] text-white shadow-sm'
                      : 'text-[#40484b] hover:bg-[#f0eee8] hover:text-[#1b1c18]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('asistente-ia')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 font-headline text-[13px] font-semibold text-[#40484b] hover:bg-[#f0eee8] hover:text-[#1b1c18] transition-all rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span>Ayuda</span>
          </button>

          {/* Cart / Current Quote Widget */}
          <div
            onClick={onOpenCart}
            className="flex items-center bg-[#f5f3ed] p-1 pl-3.5 rounded-xl gap-2.5 cursor-pointer hover:bg-[#eae8e2] transition-colors shadow-sm"
            role="button"
            tabIndex={0}
            title="Ver Cotización Actual"
          >
            <div className="flex flex-col text-right">
              <span className="font-headline text-[10px] font-semibold text-[#566B72] uppercase tracking-wider">
                Cotización Actual
              </span>
              <span className="font-headline text-[16px] font-bold text-[#003745] leading-tight">
                ${cartTotal.toLocaleString('es-CL')}
              </span>
            </div>
            <button
              type="button"
              className="w-10 h-10 rounded-lg bg-[#683f00] hover:bg-[#E58D17] text-white flex items-center justify-center transition-colors relative shadow-[0_2px_8px_-2px_rgba(16,62,74,0.08)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C63C28] text-white font-headline text-[9px] font-bold flex items-center justify-center rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* User Profile Avatar */}
          <div
            className="w-8 h-8 rounded-full bg-[#003745] flex items-center justify-center shadow-sm cursor-pointer hover:ring-2 hover:ring-[#ED991F] transition-all"
            title="Perfil del Maestro / Cliente"
          >
            <span className="material-symbols-outlined text-white text-[18px]">person</span>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-lg bg-[#f0eee8] text-[#003745] flex items-center justify-center hover:bg-[#eae8e2] transition-colors"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#fbf9f3] border-b border-[#DCD7CA] px-4 py-3 shadow-lg flex flex-col gap-1.5 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 font-headline text-[14px] font-semibold rounded-lg ${
                currentScreen === item.id
                  ? 'bg-[#0d4f60] text-white'
                  : 'text-[#40484b] hover:bg-[#f0eee8]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate('checkout');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 font-headline text-[14px] font-semibold text-[#683f00] hover:bg-[#f0eee8] flex items-center justify-between"
          >
            <span>Ir a Checkout</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      )}
    </header>
  );
};
