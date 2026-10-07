import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { OrderRecord, Screen } from '../types';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRecord;
  onNavigate: (screen: Screen) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  order,
  onNavigate,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#003745', '#ED991F', '#2D7A4C', '#683f00'],
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#DCD7CA] text-center p-8 space-y-6">
        {/* Animated Success Badge */}
        <div className="w-16 h-16 mx-auto rounded-full bg-[#2D7A4C]/10 text-[#2D7A4C] flex items-center justify-center">
          <span className="material-symbols-outlined text-[36px]">check_circle</span>
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#ffddb9] text-[#683f00] font-headline text-[12px] font-bold uppercase tracking-wider">
            Cupo CNC Reservado
          </span>
          <h2 className="font-headline text-[24px] font-bold text-[#003745]">
            ¡Pedido {order.orderNumber} Confirmado!
          </h2>
          <p className="text-[14px] text-[#566B72]">
            Tu diseño paramétrico ha sido validado e ingresado a nuestra estación mecanizada en San Miguel.
          </p>
        </div>

        {/* Technical Ticket Summary */}
        <div className="bg-[#f5f3ed] p-4 rounded-xl border border-[#DCD7CA] text-left space-y-2.5 text-[13px]">
          <div className="flex justify-between items-center">
            <span className="text-[#566B72]">Estación CNC Asignada:</span>
            <span className="font-headline font-bold text-[#003745] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#2D7A4C] animate-pulse"></span>
              {order.cncStation}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#566B72]">Mueble a Fabricar:</span>
            <span className="font-semibold text-[#1b1c18]">{order.item.model.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#566B72]">Fecha de Montaje:</span>
            <span className="font-semibold text-[#003745]">{order.slotDate}</span>
          </div>
          <div className="flex justify-between items-center border-t border-[#DCD7CA] pt-2">
            <span className="text-[#566B72]">Monto Total:</span>
            <span className="font-headline text-[16px] font-bold text-[#003745]">
              ${order.total.toLocaleString('es-CL')} CLP
            </span>
          </div>
          <div className="flex justify-between items-center text-[#683f00] font-headline text-[12px]">
            <span>Anticipo 50% para inicio:</span>
            <span className="font-bold">${order.downpayment.toLocaleString('es-CL')} CLP</span>
          </div>
        </div>

        <p className="text-[12px] text-[#566B72]">
          Hemos enviado la confirmación y planos CAD al correo indicado. El maestro carpintero asignado te contactará 30 min antes del despacho.
        </p>

        {/* Modal Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onNavigate('mis-pedidos');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#003745] hover:bg-[#0d4f60] text-white font-headline text-[14px] font-bold transition-all shadow-md cursor-pointer"
          >
            Ver en Mis Pedidos
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigate('catalogo');
            }}
            className="py-3 px-4 rounded-xl bg-white hover:bg-[#f5f3ed] text-[#003745] font-headline text-[14px] font-semibold border border-[#DCD7CA] transition-all cursor-pointer"
          >
            Volver al Catálogo
          </button>
        </div>
      </div>
    </div>
  );
};
