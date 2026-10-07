import React, { useState } from 'react';
import { Screen, OrderRecord } from '../types';
import { PDFModal } from '../components/PDFModal';

interface OrdersViewProps {
  orders: OrderRecord[];
  onNavigate: (screen: Screen) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onNavigate }) => {
  const [selectedPdfOrder, setSelectedPdfOrder] = useState<OrderRecord | null>(null);

  const steps = [
    { title: 'Pedido y Planos Validados', desc: 'Tolerancia ±1.5 mm verificada', icon: 'check_circle', done: true },
    { title: 'Mecanizado CNC en Taller', desc: 'Estación #04 • Santiago Centro', icon: 'precision_manufacturing', active: true },
    { title: 'Ensamble & Calibración Herrajes', desc: 'Guías Blum cierre suave', icon: 'handyman', done: false },
    { title: 'Acabado Poro Mate Satinado', desc: 'Sellado y control de calidad', icon: 'brush', done: false },
    { title: 'Despacho & Montaje en Muro', desc: 'Cuadrilla A (2 Maestros)', icon: 'local_shipping', done: false },
  ];

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0eee8] text-[#003745] font-headline text-[11px] font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#2D7A4C] animate-pulse"></span>
            Línea de Producción Conectada
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-[#003745]">
            Mis Pedidos & Estado en Taller CNC
          </h1>
          <p className="text-[15px] text-[#566B72] mt-1">
            Monitorea el avance de corte mecanizado, ensamblado artesanal y la fecha agendada de montaje en tu hogar.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#DCD7CA]/60 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#f5f3ed] text-[#566B72] flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">inventory_2</span>
            </div>
            <h3 className="font-headline text-[18px] font-bold text-[#003745]">
              No tienes órdenes en producción activa
            </h3>
            <p className="text-[14px] text-[#566B72]">
              Configura tu primer mueble en 3D o explora el catálogo para reservar tu cupo en la máquina CNC.
            </p>
            <button
              onClick={() => onNavigate('catalogo')}
              className="px-6 py-3 rounded-xl bg-[#003745] hover:bg-[#0d4f60] text-white font-headline text-[14px] font-bold transition-all shadow-md cursor-pointer"
            >
              Explorar Catálogo 3D
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#DCD7CA]/70 flex flex-col gap-6"
              >
                {/* Order Top Ribbon */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#f0eee8]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0d4f60] text-white flex items-center justify-center font-headline text-[18px] font-bold">
                      CNC
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline text-[18px] font-bold text-[#003745]">
                          Orden {ord.orderNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb9] text-[#683f00] font-headline text-[11px] font-bold">
                          {ord.status === 'cnc_queued' ? 'Corte CNC en Proceso' : 'En Taller'}
                        </span>
                      </div>
                      <span className="text-[12px] text-[#566B72]">
                        Ingresado: {ord.date} • {ord.address}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedPdfOrder(ord)}
                      className="px-3.5 py-2 rounded-lg bg-[#f5f3ed] hover:bg-[#eae8e2] text-[#003745] font-headline text-[12px] font-semibold border border-[#DCD7CA] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                      <span>Descargar Planos & Boleta</span>
                    </button>
                    <button
                      onClick={() => {
                        const msg = encodeURIComponent(`Hola, consulto por el estado de mi orden ${ord.orderNumber} en la estación ${ord.cncStation}.`);
                        window.open(`https://wa.me/56984721093?text=${msg}`, '_blank');
                      }}
                      className="px-3.5 py-2 rounded-lg bg-[#003745] hover:bg-[#0d4f60] text-white font-headline text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#2D7A4C]">chat</span>
                      <span>Hablar con Jefe de Planta</span>
                    </button>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="py-2">
                  <span className="font-headline text-[12px] text-[#566B72] font-semibold uppercase tracking-wider block mb-4">
                    Etapas de Fabricación & Ensamble:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                    {steps.map((st, sIdx) => (
                      <div
                        key={sIdx}
                        className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                          st.active
                            ? 'bg-[#f5f3ed] border-[#003745] ring-2 ring-[#003745]/30'
                            : st.done
                            ? 'bg-white border-[#2D7A4C]/40'
                            : 'bg-[#fbf9f3] border-[#DCD7CA]/40 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="material-symbols-outlined text-[20px] text-[#003745]">
                            {st.icon}
                          </span>
                          {st.done ? (
                            <span className="material-symbols-outlined text-[16px] text-[#2D7A4C]">
                              check_circle
                            </span>
                          ) : st.active ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#E58D17] animate-ping"></span>
                          ) : (
                            <span className="text-[10px] font-headline text-[#566B72]">Paso {sIdx + 1}</span>
                          )}
                        </div>
                        <span className="font-headline text-[12px] font-bold text-[#003745]">
                          {st.title}
                        </span>
                        <span className="text-[11px] text-[#566B72]">{st.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details & Specifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#f5f3ed] p-5 rounded-xl border border-[#DCD7CA]/60">
                  <div className="flex gap-4">
                    <img
                      src={ord.item.model.image}
                      alt={ord.item.model.name}
                      className="w-20 h-20 rounded-lg object-cover border border-[#DCD7CA]"
                    />
                    <div>
                      <span className="font-headline text-[10px] font-bold text-[#566B72] uppercase">
                        {ord.item.model.modelCode}
                      </span>
                      <h4 className="font-headline text-[15px] font-bold text-[#003745]">
                        {ord.item.model.name}
                      </h4>
                      <p className="text-[12px] text-[#1b1c18] font-mono mt-0.5">
                        {ord.item.alto} × {ord.item.ancho} × {ord.item.prof} cm
                      </p>
                      <p className="text-[11px] text-[#566B72] mt-0.5">Madera: {ord.item.wood.name}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[12px]">
                    <div className="flex justify-between">
                      <span className="text-[#566B72]">Estación CNC Asignada:</span>
                      <strong className="text-[#003745] font-headline">{ord.cncStation}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#566B72]">Ventana de Montaje:</span>
                      <strong className="text-[#2D7A4C]">{ord.slotDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#566B72]">Servicio de Instalación:</span>
                      <strong className="text-[#1b1c18]">Certificada (5 Años Garantía)</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[12px] md:border-l md:border-[#DCD7CA] md:pl-6">
                    <div className="flex justify-between">
                      <span className="text-[#566B72]">Total Fabricación:</span>
                      <strong className="text-[#003745] font-headline text-[15px]">
                        ${ord.total.toLocaleString('es-CL')} CLP
                      </strong>
                    </div>
                    <div className="flex justify-between text-[#683f00] font-headline">
                      <span>Anticipo 50% Transferido:</span>
                      <strong>${ord.downpayment.toLocaleString('es-CL')} CLP</strong>
                    </div>
                    <div className="flex justify-between text-[#566B72]">
                      <span>Saldo al Recibir Conforme:</span>
                      <strong>${(ord.total - ord.downpayment).toLocaleString('es-CL')} CLP</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPdfOrder && (
        <PDFModal
          isOpen={true}
          onClose={() => setSelectedPdfOrder(null)}
          quote={selectedPdfOrder.item}
        />
      )}
    </div>
  );
};
