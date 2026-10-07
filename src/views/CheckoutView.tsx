import React, { useState } from 'react';
import { QuoteItem, OrderRecord, Screen } from '../types';
import { OrderSuccessModal } from '../components/OrderSuccessModal';

interface CheckoutViewProps {
  currentQuote: QuoteItem;
  onNavigate: (screen: Screen) => void;
  onOrderCreated: (order: OrderRecord) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  currentQuote,
  onNavigate,
  onOrderCreated,
}) => {
  // Form fields
  const [clientName, setClientName] = useState('Rodrigo Valenzuela Lagos');
  const [clientRut, setClientRut] = useState('16.482.930-K');
  const [clientPhone, setClientPhone] = useState('8472 1093');
  const [clientEmail, setClientEmail] = useState('r.valenzuela@arquitectura.cl');
  const [docType, setDocType] = useState<'boleta' | 'factura'>('boleta');

  const [region, setRegion] = useState('Región Metropolitana de Santiago');
  const [commune, setCommune] = useState('Providencia');
  const [address, setAddress] = useState('Av. Pocuro 2180');
  const [aptNumber, setAptNumber] = useState('Depto 504 - Torre B');
  const [floor, setFloor] = useState('Piso 5+ con ascensor de carga disponible');

  const [wallType, setWallType] = useState<'concrete' | 'drywall'>('concrete');
  const [hallwayWidth, setHallwayWidth] = useState<'standard' | 'narrow'>('standard');

  const [installationTier, setInstallationTier] = useState<'certified' | 'delivery' | 'pickup'>('certified');
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'cod' | 'webpay'>('transfer');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<OrderRecord | null>(null);

  // Dynamic calculations based on options selected
  const baseCost = currentQuote.baseCost;
  const discountCost = Math.round(baseCost * 0.041);
  const dispatchCost = installationTier === 'pickup' ? 0 : 18500;
  const installationServiceCost = installationTier === 'certified' ? 28000 : 0;
  const totalCost = baseCost - discountCost + dispatchCost + installationServiceCost;
  const downpayment = Math.round(totalCost * 0.5);

  const deliverySlots = [
    { date: 'Miércoles 28 Mayo', time: 'Turno Mañana: 09:00 - 14:00', crew: 'Cuadrilla A (2 Maestros)' },
    { date: 'Jueves 29 Mayo', time: 'Turno Tarde: 14:30 - 19:00', crew: 'Cuadrilla B (2 Maestros)' },
    { date: 'Viernes 30 Mayo', time: 'Turno Mañana: 09:00 - 14:00', crew: 'Cuadrilla A (2 Maestros)' },
  ];

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: '#CS-8924',
      date: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' }),
      clientName,
      clientRut,
      address: `${address}, ${aptNumber}, ${commune}`,
      installationTier,
      slotDate: deliverySlots[selectedSlot].date,
      slotTime: deliverySlots[selectedSlot].time,
      paymentMethod,
      item: currentQuote,
      total: totalCost,
      downpayment,
      status: 'cnc_queued',
      cncStation: 'Estación #04 • Santiago Centro',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessOrder(newOrder);
      onOrderCreated(newOrder);
    }, 900);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Ambient Draughting Bar */}
      <div className="w-full bg-[#f5f3ed] py-2.5 px-4 sm:px-6 lg:px-8 border-b border-[#f0eee8]">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-y-2 text-[#40484b]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 font-headline text-[13px]">
            <button onClick={() => onNavigate('catalogo')} className="hover:text-[#003745] transition-colors cursor-pointer">
              Inicio
            </button>
            <span className="material-symbols-outlined text-[14px] text-[#c0c8cc]">chevron_right</span>
            <button onClick={() => onNavigate('personalizador-3d')} className="hover:text-[#003745] transition-colors cursor-pointer">
              Personalizador 3D
            </button>
            <span className="material-symbols-outlined text-[14px] text-[#c0c8cc]">chevron_right</span>
            <span className="text-[#003745] font-semibold">Checkout & Fabricación</span>
            <span className="material-symbols-outlined text-[14px] text-[#c0c8cc]">chevron_right</span>
            <span className="text-[#566B72]">Confirmación</span>
          </nav>

          {/* CNC Queue Status Badge */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full shadow-xs border border-[#DCD7CA]/50 text-[#1b1c18]">
            <span className="w-2 h-2 rounded-full bg-[#2D7A4C] animate-pulse"></span>
            <span className="font-headline text-[11px] text-[#566B72]">Cupo Máquina CNC Asignado:</span>
            <span className="font-headline text-[11px] font-bold text-[#003745]">
              Estación #04 • Santiago Centro
            </span>
          </div>
        </div>
      </div>

      {/* Stepper Header Section */}
      <section className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-[#fbf9f3]">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xs border border-[#DCD7CA]/60">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1: Completed */}
              <div className="flex items-center gap-3.5 p-2">
                <div className="w-10 h-10 rounded-full bg-[#2D7A4C]/10 text-[#2D7A4C] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline text-[11px] text-[#2D7A4C] uppercase tracking-wider font-bold">
                    Paso 1 • Completado
                  </span>
                  <span className="font-headline text-[15px] font-bold text-[#003745] truncate">
                    Taller & Medidas 3D
                  </span>
                  <span className="text-[12px] text-[#566B72]">Plano de corte CNC validado</span>
                </div>
              </div>

              {/* Step 2: Active */}
              <div className="flex items-center gap-3.5 p-2 rounded-lg bg-[#f5f3ed] border border-[#0d4f60]/20 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#0d4f60] text-white flex items-center justify-center shrink-0 font-headline text-[16px] font-bold">
                  2
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline text-[11px] text-[#683f00] uppercase tracking-wider font-bold">
                    Paso 2 • En Proceso
                  </span>
                  <span className="font-headline text-[15px] font-bold text-[#003745] truncate">
                    Despacho & Instalación
                  </span>
                  <span className="text-[12px] text-[#40484b]">Acceso, fijación y cuadrilla</span>
                </div>
              </div>

              {/* Step 3: Pending */}
              <div className="flex items-center gap-3.5 p-2 opacity-60">
                <div className="w-10 h-10 rounded-full bg-[#e4e2dd] text-[#566B72] flex items-center justify-center shrink-0 font-headline text-[16px] font-bold">
                  3
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline text-[11px] text-[#566B72] uppercase tracking-wider font-semibold">
                    Paso 3 • Final
                  </span>
                  <span className="font-headline text-[15px] font-bold text-[#1b1c18] truncate">
                    Pago & Orden a Fábrica
                  </span>
                  <span className="text-[12px] text-[#566B72]">Anticipo 50% o contra entrega</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Checkout Body */}
      <main className="w-full pb-16 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmitOrder}>
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Form & Specifications (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* SECTION 1: Contact & Billing */}
              <section className="bg-white rounded-xl p-6 shadow-xs border border-[#DCD7CA]/60">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f0eee8]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#003745] text-[24px]">contact_page</span>
                    <h2 className="font-headline text-[18px] font-bold text-[#003745]">
                      1. Datos de Contacto y Facturación
                    </h2>
                  </div>
                  <span className="font-headline text-[11px] text-[#566B72] uppercase tracking-wider font-semibold">
                    Taller #CS-8924
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1">
                    <label className="font-headline text-[12px] text-[#1b1c18] font-bold">
                      Nombre y Apellidos *
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      placeholder="Ej. Juan Pérez"
                      className="h-11 px-3.5 rounded-lg bg-[#fbf9f3] text-[#1b1c18] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d4f60] border border-[#DCD7CA]/70"
                    />
                  </div>

                  {/* RUT / ID */}
                  <div className="flex flex-col gap-1">
                    <label className="font-headline text-[12px] text-[#1b1c18] font-bold">
                      RUT o Cédula de Identidad *
                    </label>
                    <input
                      type="text"
                      value={clientRut}
                      onChange={(e) => setClientRut(e.target.value)}
                      required
                      placeholder="12.345.678-9"
                      className="h-11 px-3.5 rounded-lg bg-[#fbf9f3] text-[#1b1c18] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d4f60] border border-[#DCD7CA]/70 font-mono"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1">
                    <label className="font-headline text-[12px] text-[#1b1c18] font-bold">
                      Teléfono de Coordinación Móvil *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 font-headline text-[13px] text-[#566B72] font-semibold">
                        +56 9
                      </span>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        required
                        className="h-11 pl-16 pr-3.5 w-full rounded-lg bg-[#fbf9f3] text-[#1b1c18] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d4f60] border border-[#DCD7CA]/70 font-mono"
                      />
                    </div>
                    <span className="text-[11px] text-[#566B72]">
                      El maestro instalador te llamará 30 min antes de llegar.
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label className="font-headline text-[12px] text-[#1b1c18] font-bold">
                      Correo Electrónico (Planos y Boleta) *
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      required
                      className="h-11 px-3.5 rounded-lg bg-[#fbf9f3] text-[#1b1c18] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d4f60] border border-[#DCD7CA]/70"
                    />
                  </div>
                </div>

                {/* Document Type Toggles */}
                <div className="mt-4 p-3 bg-[#f5f3ed] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#DCD7CA]/50">
                  <span className="font-headline text-[12px] text-[#1b1c18] font-bold">
                    Tipo de Documento Tributario:
                  </span>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-headline text-[13px]">
                      <input
                        type="radio"
                        name="doc-type"
                        checked={docType === 'boleta'}
                        onChange={() => setDocType('boleta')}
                        className="w-4 h-4 text-[#003745] accent-[#003745]"
                      />
                      <span>Boleta Electrónica</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-headline text-[13px]">
                      <input
                        type="radio"
                        name="doc-type"
                        checked={docType === 'factura'}
                        onChange={() => setDocType('factura')}
                        className="w-4 h-4 text-[#003745] accent-[#003745]"
                      />
                      <span>Factura con RUT Empresa</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Delivery Address & Architectural Access Evaluation */}
              <section className="bg-white rounded-xl p-6 shadow-xs border border-[#DCD7CA]/60">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f0eee8]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#003745] text-[24px]">pin_drop</span>
                    <h2 className="font-headline text-[18px] font-bold text-[#003745]">
                      2. Despacho & Evaluación Técnica de Acceso
                    </h2>
                  </div>
                  <span className="bg-[#f0eee8] px-2.5 py-0.5 rounded text-[10px] font-headline text-[#566B72] font-bold uppercase">
                    TOLERANCIA LOGÍSTICA
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-headline text-[12px] text-[#1b1c18] font-bold">
                      Región de Destino *
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="h-11 px-3.5 rounded-lg bg-[#fbf9f3] text-[#1b1c18] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d4f60] border border-[#DCD7CA]/70"
                    >
                      <option>Región Metropolitana de Santiago</option>
                      <option>Región de Valparaíso</option>
                      <option>Región de O'Higgins</option>
                      <option>Región del Biobío</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-headline text-[12px] text-[#1b1c18] font-bold">
                      Comuna / Ciudad *
                    </label>
                    <select
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="h-11 px-3.5 rounded-lg bg-[#fbf9f3] text-[#1b1c18] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d4f60] border border-[#DCD7CA]/70"
                    >
                      <option>Providencia</option>
                      <option>Las Condes</option>
                      <option>Vitacura</option>
                      <option>Ñuñoa</option>
                      <option>Santiago Centro</option>
                      <option>Lo Barnechea</option>
                      <option>La Reina</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="font-headline text-[12px] text-[#1b1c18] font-bold">
                      Dirección de Entrega y Calle *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="Calle, Avenida o Pasaje"
                      className="h-11 px-3.5 rounded-lg bg-[#fbf9f3] text-[#1b1c18] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d4f60] border border-[#DCD7CA]/70"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-headline text-[12px] text-[#1b1c18] font-bold">
                      Número Depto / Casa / Torre
                    </label>
                    <input
                      type="text"
                      value={aptNumber}
                      onChange={(e) => setAptNumber(e.target.value)}
                      className="h-11 px-3.5 rounded-lg bg-[#fbf9f3] text-[#1b1c18] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d4f60] border border-[#DCD7CA]/70"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-headline text-[12px] text-[#1b1c18] font-bold">
                      Piso del Domicilio
                    </label>
                    <select
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      className="h-11 px-3.5 rounded-lg bg-[#fbf9f3] text-[#1b1c18] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d4f60] border border-[#DCD7CA]/70"
                    >
                      <option>Piso 1 / Casa a ras de suelo</option>
                      <option>Piso 2 a 4 con escaleras amplias</option>
                      <option>Piso 5+ con ascensor de carga disponible</option>
                      <option>Piso 5+ sin ascensor de carga (requiere cuadrilla extra)</option>
                    </select>
                  </div>
                </div>

                {/* Woodworking Technical Questions */}
                <div className="mt-5 p-4 rounded-xl bg-[#f5f3ed] flex flex-col gap-3.5 border border-[#DCD7CA]/60">
                  <div className="flex items-center gap-2 text-[#003745]">
                    <span className="material-symbols-outlined text-[20px]">carpenter</span>
                    <span className="font-headline text-[14px] font-bold">
                      Cuestionario Técnico de Montaje en Muro
                    </span>
                  </div>
                  <p className="text-[12px] text-[#40484b] leading-relaxed">
                    Nuestros muebles suspendidos y modulares requieren fijaciones calculadas según la
                    estructura de tu pared para garantizar soporte de hasta 120 kg.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Wall structure */}
                    <div className="flex flex-col gap-1.5">
                      <span className="font-headline text-[10px] text-[#566B72] font-bold uppercase tracking-wider">
                        TIPO DE MURO DE INSTALACIÓN:
                      </span>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white text-[#1b1c18] text-[12px] cursor-pointer shadow-xs border border-[#DCD7CA]/50 font-medium">
                          <input
                            type="radio"
                            name="wall-type"
                            checked={wallType === 'concrete'}
                            onChange={() => setWallType('concrete')}
                            className="text-[#003745] accent-[#003745]"
                          />
                          <span>Hormigón armado / Ladrillo macizo (Estándar)</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white text-[#1b1c18] text-[12px] cursor-pointer shadow-xs border border-[#DCD7CA]/50 font-medium">
                          <input
                            type="radio"
                            name="wall-type"
                            checked={wallType === 'drywall'}
                            onChange={() => setWallType('drywall')}
                            className="text-[#003745] accent-[#003745]"
                          />
                          <span>Tabiquería / Volcanita / Yeso-Cartón (Reforzado)</span>
                        </label>
                      </div>
                    </div>

                    {/* Clearances */}
                    <div className="flex flex-col gap-1.5">
                      <span className="font-headline text-[10px] text-[#566B72] font-bold uppercase tracking-wider">
                        ANCHO DE ACCESO Y PASILLOS:
                      </span>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white text-[#1b1c18] text-[12px] cursor-pointer shadow-xs border border-[#DCD7CA]/50 font-medium">
                          <input
                            type="radio"
                            name="hallway-width"
                            checked={hallwayWidth === 'standard'}
                            onChange={() => setHallwayWidth('standard')}
                            className="text-[#003745] accent-[#003745]"
                          />
                          <span>Puertas estándar (&gt;85 cm de paso libre)</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white text-[#1b1c18] text-[12px] cursor-pointer shadow-xs border border-[#DCD7CA]/50 font-medium">
                          <input
                            type="radio"
                            name="hallway-width"
                            checked={hallwayWidth === 'narrow'}
                            onChange={() => setHallwayWidth('narrow')}
                            className="text-[#003745] accent-[#003745]"
                          />
                          <span>Pasaje angosto o escalera caracol (&lt;80 cm)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: Certified Installation Service (Featured Card in Deep Petroleum) */}
              <section className="bg-[#0d4f60] text-white rounded-xl p-6 shadow-md relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#683f00] text-white flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[22px]">verified</span>
                    </div>
                    <div>
                      <h2 className="font-headline text-[17px] font-bold text-white">
                        Servicio de Ensamble e Instalación Especializada
                      </h2>
                      <p className="text-[12px] text-[#89bfd3]">
                        Ejecutado por carpinteros matriculados con herramental Festool & Milwaukee
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#ffddb9] text-[#2b1700] font-headline text-[11px] font-bold tracking-wide self-start sm:self-auto">
                    RECOMENDADO
                  </span>
                </div>

                {/* Radio Selector Tiles for Service Option */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
                  {/* Option 1: Full Installation */}
                  <label
                    onClick={() => setInstallationTier('certified')}
                    className={`relative flex flex-col p-4 rounded-xl cursor-pointer shadow-xs transition-all ${
                      installationTier === 'certified'
                        ? 'bg-white text-[#1b1c18] ring-2 ring-[#ED991F]'
                        : 'bg-white/90 text-[#1b1c18] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-headline text-[13px] font-bold text-[#003745]">
                        Instalación Certificada
                      </span>
                      <input
                        type="radio"
                        name="installation-tier"
                        checked={installationTier === 'certified'}
                        onChange={() => setInstallationTier('certified')}
                        className="w-4 h-4 text-[#003745] accent-[#003745]"
                      />
                    </div>
                    <span className="font-headline text-[15px] font-bold text-[#683f00] mb-1">
                      +$28.000 CLP
                    </span>
                    <p className="text-[11px] text-[#40484b] flex-1 leading-relaxed">
                      Fijación oculta a plomo milimétrico, nivelación de puertas, anclaje seguro y
                      calibración de herrajes Blum.
                    </p>
                    <div className="mt-3 pt-2 border-t border-[#f0eee8] flex items-center gap-1 text-[#2D7A4C] font-headline text-[11px] font-bold">
                      <span className="material-symbols-outlined text-[15px]">verified_user</span>
                      <span>5 Años Garantía Ensamble</span>
                    </div>
                  </label>

                  {/* Option 2: Delivery Only */}
                  <label
                    onClick={() => setInstallationTier('delivery')}
                    className={`relative flex flex-col p-4 rounded-xl cursor-pointer shadow-xs transition-all ${
                      installationTier === 'delivery'
                        ? 'bg-white text-[#1b1c18] ring-2 ring-[#ED991F]'
                        : 'bg-white/90 text-[#1b1c18] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-headline text-[13px] font-bold text-[#003745]">
                        Solo Despacho
                      </span>
                      <input
                        type="radio"
                        name="installation-tier"
                        checked={installationTier === 'delivery'}
                        onChange={() => setInstallationTier('delivery')}
                        className="w-4 h-4 text-[#003745] accent-[#003745]"
                      />
                    </div>
                    <span className="font-headline text-[15px] font-bold text-[#566B72] mb-1">
                      $0 CLP extra
                    </span>
                    <p className="text-[11px] text-[#40484b] flex-1 leading-relaxed">
                      Entrega a pie de camión o departamento en cajas selladas con manual de montaje e
                      instructivo 3D.
                    </p>
                    <div className="mt-3 pt-2 border-t border-[#f0eee8] flex items-center gap-1 text-[#566B72] font-headline text-[11px]">
                      <span className="material-symbols-outlined text-[15px]">info</span>
                      <span>Garantía de piezas 1 año</span>
                    </div>
                  </label>

                  {/* Option 3: Workshop Pickup */}
                  <label
                    onClick={() => setInstallationTier('pickup')}
                    className={`relative flex flex-col p-4 rounded-xl cursor-pointer shadow-xs transition-all ${
                      installationTier === 'pickup'
                        ? 'bg-white text-[#1b1c18] ring-2 ring-[#ED991F]'
                        : 'bg-white/90 text-[#1b1c18] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-headline text-[13px] font-bold text-[#003745]">
                        Retiro en Taller
                      </span>
                      <input
                        type="radio"
                        name="installation-tier"
                        checked={installationTier === 'pickup'}
                        onChange={() => setInstallationTier('pickup')}
                        className="w-4 h-4 text-[#003745] accent-[#003745]"
                      />
                    </div>
                    <span className="font-headline text-[15px] font-bold text-[#2D7A4C] mb-1">
                      Ahorras $18.500
                    </span>
                    <p className="text-[11px] text-[#40484b] flex-1 leading-relaxed">
                      Retiro asistido con elevador en nuestra fábrica central en San Miguel (Santiago).
                    </p>
                    <div className="mt-3 pt-2 border-t border-[#f0eee8] flex items-center gap-1 text-[#566B72] font-headline text-[11px]">
                      <span className="material-symbols-outlined text-[15px]">store</span>
                      <span>Sin costo de despacho</span>
                    </div>
                  </label>
                </div>

                {/* Date & Time Slot Selector */}
                <div className="mt-4 p-4 rounded-xl bg-white text-[#1b1c18] shadow-xs relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#003745] text-[20px]">
                        calendar_month
                      </span>
                      <span className="font-headline text-[14px] font-bold text-[#003745]">
                        Ventana de Fabricación & Montaje Disponible
                      </span>
                    </div>
                    <span className="font-headline text-[11px] text-[#566B72]">
                      Tiempo estimado de corte: 4 días hábiles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {deliverySlots.map((slot, idx) => (
                      <label
                        key={idx}
                        onClick={() => setSelectedSlot(idx)}
                        className={`p-3 rounded-lg cursor-pointer flex flex-col shadow-xs transition-all border ${
                          selectedSlot === idx
                            ? 'bg-[#f5f3ed] border-[#003745] ring-2 ring-[#003745]'
                            : 'bg-white hover:bg-[#f5f3ed] border-[#DCD7CA]/70'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-headline text-[12px] font-bold text-[#003745]">
                            {slot.date}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-[#2D7A4C]"></span>
                        </div>
                        <span className="text-[11px] text-[#40484b]">{slot.time}</span>
                        <span className="font-headline text-[11px] text-[#2D7A4C] font-semibold mt-1">
                          {slot.crew}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Included perks */}
                  <div className="mt-4 pt-3 border-t border-[#f0eee8] grid grid-cols-1 md:grid-cols-3 gap-2 text-[#40484b] text-[12px]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#2D7A4C] text-[18px]">
                        check_circle
                      </span>
                      <span>Fijación invisible Fischer DuoPower</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#2D7A4C] text-[18px]">
                        check_circle
                      </span>
                      <span>Retiro y reciclaje de cartones</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#2D7A4C] text-[18px]">
                        check_circle
                      </span>
                      <span>Certificado de Carga y Plomo</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 4: Payment Methods */}
              <section className="bg-white rounded-xl p-6 shadow-xs border border-[#DCD7CA]/60">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f0eee8]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#003745] text-[24px]">payments</span>
                    <h2 className="font-headline text-[18px] font-bold text-[#003745]">
                      3. Método de Pago & Inicio de Fabricación
                    </h2>
                  </div>
                  <span className="font-headline text-[11px] text-[#2D7A4C] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">lock</span> Transacción
                    Cifrada 256-bit
                  </span>
                </div>

                <div className="flex flex-col gap-3.5">
                  {/* Payment Option 1: 50% Downpayment via Bank Transfer */}
                  <div
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-4 rounded-xl shadow-xs transition-all border cursor-pointer ${
                      paymentMethod === 'transfer'
                        ? 'bg-[#f5f3ed] border-[#003745] ring-2 ring-[#003745]'
                        : 'bg-white hover:bg-[#f5f3ed]/50 border-[#DCD7CA]/70'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment-method"
                        checked={paymentMethod === 'transfer'}
                        onChange={() => setPaymentMethod('transfer')}
                        className="mt-1 w-4 h-4 text-[#003745] accent-[#003745]"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-headline text-[14px] font-bold text-[#003745]">
                            Transferencia Bancaria con Anticipo del 50%
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#ffddb9] text-[#2b1700] font-headline text-[10px] font-bold">
                            INICIO INMEDIATO EN CNC
                          </span>
                        </div>
                        <p className="text-[12px] text-[#40484b] mt-1">
                          Abona el <strong>50% (${downpayment.toLocaleString('es-CL')} CLP)</strong> hoy
                          para reservar la madera y cortes mecanizados. El saldo restante (50%) se cancela
                          únicamente contra recepción conforme tras el montaje en tu hogar.
                        </p>

                        {/* Bank Details Drawer */}
                        {paymentMethod === 'transfer' && (
                          <div className="mt-3 p-3.5 rounded-lg bg-white border border-[#DCD7CA] shadow-inner flex flex-col gap-1.5 text-[12px]">
                            <div className="flex flex-wrap items-center justify-between text-[#1b1c18]">
                              <span className="font-bold text-[#003745]">
                                Banco de Chile • Cuenta Corriente
                              </span>
                              <span className="font-mono bg-[#f0eee8] px-2 py-0.5 rounded font-bold text-[11px]">
                                N° 00-192-84019-02
                              </span>
                            </div>
                            <div className="text-[#566B72] flex flex-wrap gap-x-4">
                              <span>
                                Razón Social: <strong>Carpintersoft SpA</strong>
                              </span>
                              <span>
                                RUT: <strong>76.918.234-5</strong>
                              </span>
                              <span>
                                Email: <strong>pagos@carpintersoft.cl</strong>
                              </span>
                            </div>
                            <div className="mt-2 pt-2 border-t border-[#f0eee8] flex items-center justify-between">
                              <span className="text-[#566B72] font-headline text-[11px]">
                                Monto a transferir ahora (50%):
                              </span>
                              <span className="font-headline text-[16px] text-[#003745] font-bold">
                                ${downpayment.toLocaleString('es-CL')} CLP
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Payment Option 2: Payment on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-xl shadow-xs transition-all border cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-[#f5f3ed] border-[#003745] ring-2 ring-[#003745]'
                        : 'bg-white hover:bg-[#f5f3ed]/50 border-[#DCD7CA]/70'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment-method"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 w-4 h-4 text-[#003745] accent-[#003745]"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-headline text-[14px] font-bold text-[#003745]">
                            Pago Contra Entrega e Instalación Conforme
                          </span>
                          <span className="font-headline text-[11px] text-[#566B72]">
                            Tarjeta Débito/Crédito o Efectivo
                          </span>
                        </div>
                        <p className="text-[12px] text-[#40484b] mt-1">
                          Nuestro equipo instalador lleva terminal POS inalámbrico. Inspeccionas los
                          acabados, uniones a 45° y funcionamiento de cajones antes de realizar el pago total.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Payment Option 3: Webpay */}
                  <div
                    onClick={() => setPaymentMethod('webpay')}
                    className={`p-4 rounded-xl shadow-xs transition-all border cursor-pointer ${
                      paymentMethod === 'webpay'
                        ? 'bg-[#f5f3ed] border-[#003745] ring-2 ring-[#003745]'
                        : 'bg-white hover:bg-[#f5f3ed]/50 border-[#DCD7CA]/70'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment-method"
                        checked={paymentMethod === 'webpay'}
                        onChange={() => setPaymentMethod('webpay')}
                        className="mt-1 w-4 h-4 text-[#003745] accent-[#003745]"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-headline text-[14px] font-bold text-[#003745]">
                            Webpay Plus • Hasta 6 Cuotas Sin Interés
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-[#f0eee8] text-[10px] font-bold">
                              VISA
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-[#f0eee8] text-[10px] font-bold">
                              Mastercard
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-[#f0eee8] text-[10px] font-bold">
                              Redcompra
                            </span>
                          </div>
                        </div>
                        <p className="text-[12px] text-[#40484b] mt-1">
                          Paga la totalidad de forma digital en 3 o 6 cuotas con tu tarjeta bancaria preferida con respaldo Transbank.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: Sticky Technical Fabrication Summary (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-24">
              <div className="bg-white rounded-xl shadow-sm border border-[#DCD7CA]/60 overflow-hidden flex flex-col">
                {/* Product Showcase Banner */}
                <div className="relative w-full h-52 bg-[#eae8e2] overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida/AEtjO1Xu85oIlimq1yLPx7VQoNIyRkOgNz2xdUI0xo8PouUsuL_Wgh48ZN-MVxfScRT8eUbQDJKFaN9NUOBNF1kRUGSM0tUaMi4y5XyxzoLdwoCtFoXM-bnnEXjP_l8LeURsj2MIC6G9k2fXeiv6hDt00mz1_yo_boEdz7f1Epc0424fFGCcdgFb0aLjr3aK771DUKmtIZ96JxBPY3o0g-DVelEdREeAEUA4SBHk3KdLTCVLa87y1PpwHOaiU1k"
                    alt={currentQuote.model.name}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  />
                  {/* Floating Dimensional Tag */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2D7A4C]"></span>
                    <span className="font-headline text-[11px] font-bold text-[#003745]">
                      Render 3D Aprobado #982
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#003745]/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[12px] font-mono font-bold">
                    {currentQuote.alto} × {currentQuote.ancho} × {currentQuote.prof} cm
                  </div>
                </div>

                {/* Product Technical Specs Grid */}
                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-headline text-[11px] text-[#683f00] uppercase tracking-wider font-bold">
                        Proyecto Personalizado
                      </span>
                      <span className="font-headline text-[11px] text-[#566B72]">Escala 1:1</span>
                    </div>
                    <h3 className="font-headline text-[20px] font-bold text-[#003745] leading-tight mt-0.5">
                      {currentQuote.model.name}
                    </h3>
                    <p className="text-[12px] text-[#566B72]">
                      Diseño paramétrico con módulos flotantes y nicho TV integrado
                    </p>
                  </div>

                  {/* Workshop Blueprint Metadata Table */}
                  <div className="bg-[#f5f3ed] rounded-xl p-3 flex flex-col gap-1.5 text-[12px] border border-[#DCD7CA]/50">
                    <div className="flex justify-between py-1 px-1.5 rounded">
                      <span className="text-[#566B72]">Cotas Generales:</span>
                      <span className="font-mono font-bold text-[#1b1c18]">
                        Alto {currentQuote.alto} × Ancho {currentQuote.ancho} × Prof {currentQuote.prof} cm
                      </span>
                    </div>
                    <div className="flex justify-between py-1 px-1.5 rounded">
                      <span className="text-[#566B72]">Materia Prima:</span>
                      <span className="font-bold text-[#003745]">
                        {currentQuote.wood.name} + Enchapado FSC
                      </span>
                    </div>
                    <div className="flex justify-between py-1 px-1.5 rounded">
                      <span className="text-[#566B72]">Tratamiento Superficie:</span>
                      <span className="text-[#1b1c18]">{currentQuote.finish}</span>
                    </div>
                    <div className="flex justify-between py-1 px-1.5 rounded">
                      <span className="text-[#566B72]">Correderas y Bisagras:</span>
                      <span className="text-[#1b1c18] font-semibold">{currentQuote.hardware}</span>
                    </div>
                    <div className="flex justify-between py-1 px-1.5 rounded">
                      <span className="text-[#566B72]">Tolerancia de Calibración:</span>
                      <span className="font-mono text-[#2D7A4C] font-bold">
                        ±1.5 mm CNC Homologado
                      </span>
                    </div>
                  </div>

                  {/* Itemized Price Breakdown */}
                  <div className="flex flex-col gap-2 pt-1 text-[13px]">
                    <div className="flex justify-between text-[#40484b]">
                      <span>Valor Base de Fabricación:</span>
                      <span className="font-mono font-bold text-[#1b1c18]">
                        ${baseCost.toLocaleString('es-CL')} CLP
                      </span>
                    </div>
                    <div className="flex justify-between text-[#2D7A4C]">
                      <span className="flex items-center gap-1 font-semibold">
                        <span>Descuento Estudio 3D (-6%):</span>
                        <span className="material-symbols-outlined text-[15px]">high_res</span>
                      </span>
                      <span className="font-mono font-bold">
                        -${discountCost.toLocaleString('es-CL')} CLP
                      </span>
                    </div>
                    <div className="flex justify-between text-[#40484b]">
                      <span>Despacho Especializado Protegido:</span>
                      <span className="font-mono font-bold text-[#1b1c18]">
                        ${dispatchCost.toLocaleString('es-CL')} CLP
                      </span>
                    </div>
                    {installationTier === 'certified' && (
                      <div className="flex justify-between text-[#003745]">
                        <span className="flex items-center gap-1 font-semibold">
                          <span>Armado & Fijación Oculta a Muro:</span>
                          <span className="material-symbols-outlined text-[15px] text-[#683f00]">
                            verified
                          </span>
                        </span>
                        <span className="font-mono font-bold text-[#003745]">
                          +$28.000 CLP
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#566B72] text-[11px]">
                      <span>IVA (19% D.L. 825 incluido):</span>
                      <span className="font-mono">
                        ${Math.round(totalCost * 0.19).toLocaleString('es-CL')} CLP
                      </span>
                    </div>

                    {/* Grand Total Box */}
                    <div className="mt-2 p-4 rounded-xl bg-[#f0eee8] flex flex-col gap-1 border border-[#DCD7CA]">
                      <div className="flex items-baseline justify-between">
                        <span className="font-headline text-[15px] text-[#003745] font-bold">
                          TOTAL FINAL:
                        </span>
                        <span className="font-headline text-3xl font-extrabold text-[#003745] leading-none tracking-tight">
                          ${totalCost.toLocaleString('es-CL')}{' '}
                          <span className="text-[14px] text-[#566B72]">CLP</span>
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-[#DCD7CA]/70 flex items-center justify-between text-[#683f00] font-headline text-[12px]">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">pie_chart</span>
                          <span>Anticipo 50% para inicio en taller:</span>
                        </span>
                        <span className="font-bold text-[14px]">
                          ${downpayment.toLocaleString('es-CL')} CLP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Guarantee Commitment Callout */}
                  <div className="p-3 rounded-lg bg-[#f5f3ed] flex items-start gap-2 border border-[#DCD7CA]/50">
                    <span className="material-symbols-outlined text-[#683f00] text-[20px] shrink-0 mt-0.5">
                      verified_user
                    </span>
                    <p className="text-[11px] text-[#40484b] leading-relaxed">
                      <strong>Garantía de Satisfacción 100%:</strong> Si las cotas del mueble difieren
                      de tu plano o espacio al instalarlo, rectificamos la pieza en taller sin ningún costo adicional.
                    </p>
                  </div>

                  {/* PRIMARY CTA BUTTON (Amber #ED991F) */}
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-xl bg-[#683f00] hover:bg-[#E58D17] text-white font-headline text-[15px] font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined text-[20px] animate-spin">
                            sync
                          </span>
                          <span>Enviando orden a corte CNC...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirmar Pedido y Enviar a Fabricación CNC</span>
                          <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
                        </>
                      )}
                    </button>

                    {/* Safety Micro-Bar */}
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[#566B72] font-headline text-[11px] pt-1">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#2D7A4C]">
                          lock
                        </span>
                        Pago Seguro SSL
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#003745]">
                          forest
                        </span>
                        Madera FSC Sustentable
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#683f00]">
                          support_agent
                        </span>
                        Maestro Asignado
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Helper Mini-Card */}
              <div className="p-4 rounded-xl bg-white shadow-xs border border-[#DCD7CA]/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#003745]/10 text-[#003745] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                  </div>
                  <div>
                    <div className="font-headline text-[12px] text-[#003745] font-bold">
                      ¿Dudas con las cotas de tu muro?
                    </div>
                    <div className="text-[11px] text-[#566B72]">
                      Habla con el jefe de planta: +56 2 2840 9100
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.open('https://wa.me/56984721093', '_blank')}
                  className="px-3 py-1.5 rounded-lg bg-[#f0eee8] text-[#003745] font-headline text-[11px] font-bold hover:bg-[#eae8e2] transition-colors cursor-pointer"
                >
                  WhatsApp Taller
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Order Success Modal */}
      {successOrder && (
        <OrderSuccessModal
          isOpen={true}
          order={successOrder}
          onClose={() => setSuccessOrder(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
