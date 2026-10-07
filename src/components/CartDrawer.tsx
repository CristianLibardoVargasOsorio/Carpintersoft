import React from 'react';
import { QuoteItem, Screen } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  onRemoveItem: (id: string) => void;
  onNavigate: (screen: Screen) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const totalSum = items.reduce((sum, item) => sum + item.totalCost, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#ffffff] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-[#f5f3ed] border-b border-[#DCD7CA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003745] text-[24px]">shopping_bag</span>
              <h2 className="font-headline text-[18px] font-bold text-[#003745]">
                Cotización Actual en Taller
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-[#566B72] hover:text-[#003745] hover:bg-[#e4e2dd] flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#566B72]">
                <span className="material-symbols-outlined text-[48px] text-[#DCD7CA] mb-2">
                  shelves
                </span>
                <p className="font-headline text-[16px] font-semibold text-[#1b1c18]">
                  Tu cotizador está vacío
                </p>
                <p className="text-[13px] mt-1 text-[#566B72]">
                  Explora el catálogo o abre el Personalizador 3D para configurar tu mueble.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('catalogo');
                  }}
                  className="mt-4 px-4 py-2 rounded-lg bg-[#003745] text-white font-headline text-[13px] font-bold cursor-pointer hover:bg-[#0d4f60]"
                >
                  Explorar Catálogo 3D
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#f5f3ed] border border-[#DCD7CA] flex flex-col gap-3 relative group"
                >
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-3 right-3 text-[#566B72] hover:text-[#C63C28] transition-colors cursor-pointer"
                    title="Eliminar de la cotización"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>

                  <div className="flex gap-3">
                    <img
                      src={item.model.image}
                      alt={item.model.name}
                      className="w-16 h-16 rounded-lg object-cover border border-[#DCD7CA]"
                    />
                    <div className="flex-1 pr-6">
                      <span className="text-[10px] font-headline font-semibold text-[#566B72] uppercase">
                        {item.model.modelCode}
                      </span>
                      <h3 className="font-headline text-[14px] font-bold text-[#003745] leading-tight">
                        {item.model.name}
                      </h3>
                      <p className="text-[12px] text-[#40484b] mt-0.5 font-mono">
                        {item.alto} × {item.ancho} × {item.prof} cm
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DCD7CA]/70 flex flex-wrap items-center justify-between text-[11px] text-[#566B72]">
                    <span>Madera: <strong className="text-[#1b1c18]">{item.wood.name}</strong></span>
                    <span>{item.shelves} Baldas</span>
                  </div>

                  <div className="flex items-center justify-between font-headline">
                    <span className="text-[12px] text-[#566B72]">Subtotal CNC:</span>
                    <span className="text-[16px] font-bold text-[#003745]">
                      ${item.totalCost.toLocaleString('es-CL')} CLP
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer actions */}
          {items.length > 0 && (
            <div className="p-6 bg-[#f5f3ed] border-t border-[#DCD7CA] flex flex-col gap-3">
              <div className="flex items-baseline justify-between font-headline">
                <span className="text-[14px] text-[#566B72] font-semibold">Total Presupuestado:</span>
                <span className="text-[24px] font-bold text-[#003745]">
                  ${totalSum.toLocaleString('es-CL')} <span className="text-[14px] text-[#566B72]">CLP</span>
                </span>
              </div>
              <p className="text-[11px] text-[#566B72]">
                Incluye IVA y corte parametrizado CNC. Los detalles de instalación se eligen en Checkout.
              </p>

              <button
                onClick={() => {
                  onClose();
                  onNavigate('checkout');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#683f00] hover:bg-[#E58D17] text-white font-headline text-[15px] font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Proceder al Checkout</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigate('personalizador-3d');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#eae8e2] text-[#003745] font-headline text-[13px] font-semibold border border-[#DCD7CA] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>Modificar en Personalizador 3D</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
