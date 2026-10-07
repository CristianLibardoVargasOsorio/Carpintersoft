import React, { useState, useMemo } from 'react';
import { FurnitureModel, WoodOption, CustomizationState, Screen, QuoteItem } from '../types';
import { CATALOG_MODELS, WOOD_OPTIONS } from '../data/mockData';
import { ThreeCanvas } from '../components/ThreeCanvas';
import { PDFModal } from '../components/PDFModal';

interface PersonalizerViewProps {
  customization: CustomizationState;
  onChangeCustomization: (updated: CustomizationState) => void;
  onNavigate: (screen: Screen) => void;
  onAddToCart: (item: QuoteItem) => void;
}

export const PersonalizerView: React.FC<PersonalizerViewProps> = ({
  customization,
  onChangeCustomization,
  onNavigate,
  onAddToCart,
}) => {
  const [isRotating, setIsRotating] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [cameraView, setCameraView] = useState<'iso' | 'front' | 'top'>('iso');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [aiOptimizedToast, setAiOptimizedToast] = useState(false);

  const { model, alto, ancho, prof, shelves, wood, finish, hardware, includeInstallation } =
    customization;

  // Real-time dynamic pricing calculation mirroring workshop formulas
  const pricing = useMemo(() => {
    // Volumetric scale index compared to baseline 180x160x40
    const volFactor = (alto * ancho * prof) / (180 * 160 * 40);

    const baseWoodCost =
      (160000 * volFactor * (1 + wood.surchargePercent / 100) + shelves * 8500);
    const laborCost = 85000 + shelves * 3200;
    const finishCost = 28000 * volFactor;

    const subtotal = baseWoodCost + laborCost + finishCost;
    const discount = subtotal * 0.06; // 6% studio discount
    const installationCost = includeInstallation ? 28000 : 0;
    const finalTotal = Math.round(subtotal - discount + installationCost);

    const maxLoad = Math.round(55 + shelves * 10 - (ancho > 180 ? 15 : 0));

    return {
      materials: Math.round(baseWoodCost),
      labor: Math.round(laborCost),
      finish: Math.round(finishCost),
      discount: Math.round(discount),
      installation: installationCost,
      total: finalTotal,
      maxLoad,
    };
  }, [alto, ancho, prof, shelves, wood, includeInstallation]);

  // Construct current QuoteItem
  const currentQuoteItem: QuoteItem = useMemo(() => {
    return {
      id: `quote-${Date.now()}`,
      model,
      alto,
      ancho,
      prof,
      shelves,
      wood,
      finish,
      hardware,
      includeInstallation,
      baseCost: model.basePrice,
      materialsCost: pricing.materials,
      laborCost: pricing.labor,
      finishCost: pricing.finish,
      discount: pricing.discount,
      installationCost: pricing.installation,
      totalCost: pricing.total,
      createdAt: new Date().toISOString(),
    };
  }, [model, alto, ancho, prof, shelves, wood, finish, hardware, includeInstallation, pricing]);

  const handleModelChange = (modelId: string) => {
    const found = CATALOG_MODELS.find((m) => m.id === modelId);
    if (found) {
      onChangeCustomization({
        ...customization,
        model: found,
        alto: found.baseAlto,
        ancho: found.baseAncho,
        prof: found.baseProf,
        shelves: found.defaultShelves,
      });
    }
  };

  const handleReset = () => {
    onChangeCustomization({
      ...customization,
      alto: model.baseAlto,
      ancho: model.baseAncho,
      prof: model.baseProf,
      shelves: model.defaultShelves,
      wood: WOOD_OPTIONS[0],
      finish: 'Poro Mate Satinado Ecológico',
      hardware: 'Blum Cierre Suave Negro Mate',
      includeInstallation: true,
    });
    setCameraView('iso');
    setDoorsOpen(false);
    setIsRotating(false);
    setWireframe(false);
  };

  const handleAIOptimize = () => {
    // Proportional golden ratio adjustment
    onChangeCustomization({
      ...customization,
      alto: 185,
      ancho: 170,
      prof: 42,
      shelves: 4,
    });
    setAiOptimizedToast(true);
    setTimeout(() => setAiOptimizedToast(false), 3500);
  };

  const handleProceedToCheckout = () => {
    onAddToCart(currentQuoteItem);
    onNavigate('checkout');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Studio Breadcrumb & Live Canvas Status Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto py-3 bg-[#f5f3ed] flex flex-wrap items-center justify-between gap-3 border-b border-[#f0eee8]">
        <div className="flex items-center gap-2 font-headline text-[13px]">
          <span className="text-[#566B72] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">home_work</span>
            Estudio de Fabricación
          </span>
          <span className="text-[#c0c8cc]">/</span>
          <span className="text-[#1b1c18] font-semibold">Personalizador 3D Pro</span>
          <span className="text-[#c0c8cc]">/</span>
          <span className="px-2 py-0.5 rounded bg-[#f0eee8] text-[#003745] font-headline text-[11px] font-bold">
            Versión CAD v2.4
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2D7A4C] animate-pulse"></span>
            <span className="font-headline text-[11px] text-[#003745] font-semibold">
              WebGL Activo: 60 FPS • Render PBR
            </span>
          </div>
          <span className="hidden md:inline font-headline text-[11px] text-[#566B72]">
            Tolerancia Taller: ±1.5mm
          </span>
          <div className="h-4 w-px bg-[#DCD7CA]"></div>
          <button
            onClick={handleReset}
            className="text-[#566B72] hover:text-[#003745] transition-colors flex items-center gap-1 font-headline text-[12px] font-semibold cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Restablecer Todo</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column CAD Customization Layout */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Parameters, Dimensions & Materials (Cols 1 to 3) */}
        <section className="lg:col-span-3 flex flex-col gap-5 order-2 lg:order-1">
          {/* Furniture Family Selector Card */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#DCD7CA]/60">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003745] text-[20px]">shelves</span>
                <h2 className="font-headline text-[16px] font-bold text-[#003745]">Tipo de Mueble</h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#f0eee8] text-[#566B72] font-headline text-[10px] font-semibold">
                Base CAD
              </span>
            </div>

            <div className="relative mt-1">
              <select
                value={model.id}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full h-11 px-3 bg-[#f5f3ed] text-[#003745] font-headline text-[14px] font-semibold rounded-lg appearance-none cursor-pointer focus:outline-none focus:bg-white border border-transparent focus:border-[#003745]"
              >
                {CATALOG_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.modelCode})
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3 text-[#566B72] pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {CATALOG_MODELS.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleModelChange(m.id)}
                  className={`px-2.5 py-1 rounded font-headline text-[11px] font-semibold transition-colors cursor-pointer ${
                    model.id === m.id
                      ? 'bg-[#0d4f60] text-white shadow-xs'
                      : 'bg-[#f0eee8] hover:bg-[#eae8e2] text-[#40484b]'
                  }`}
                >
                  {m.name.split(' ')[0]} {m.modelCode}
                </button>
              ))}
            </div>
          </div>

          {/* Live Dimension Controls */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#DCD7CA]/60 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003745] text-[20px]">
                  straighten
                </span>
                <h3 className="font-headline text-[16px] font-bold text-[#003745]">
                  Dimensiones Milimétricas
                </h3>
              </div>
              <span className="text-[#2D7A4C] font-headline text-[11px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Estables
              </span>
            </div>

            {/* Height (Alto) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-headline text-[13px]">
                <span className="text-[#1b1c18] font-semibold">Altura Total (Alto)</span>
                <div className="flex items-center gap-1">
                  <span className="font-headline text-[18px] font-bold text-[#003745]">{alto}</span>
                  <span className="text-[#566B72] text-xs">cm</span>
                </div>
              </div>
              <input
                type="range"
                min="120"
                max="240"
                step="5"
                value={alto}
                onChange={(e) =>
                  onChangeCustomization({ ...customization, alto: parseInt(e.target.value, 10) })
                }
                className="w-full accent-[#003745] h-2 bg-[#f0eee8] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between font-headline text-[10px] text-[#566B72]">
                <span>Mín: 120 cm</span>
                <span className="text-[#003745] font-semibold">Recomendado: 180 cm</span>
                <span>Máx: 240 cm</span>
              </div>
            </div>

            {/* Width (Ancho) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-headline text-[13px]">
                <span className="text-[#1b1c18] font-semibold">Ancho Frontal (Ancho)</span>
                <div className="flex items-center gap-1">
                  <span className="font-headline text-[18px] font-bold text-[#003745]">{ancho}</span>
                  <span className="text-[#566B72] text-xs">cm</span>
                </div>
              </div>
              <input
                type="range"
                min="80"
                max="220"
                step="5"
                value={ancho}
                onChange={(e) =>
                  onChangeCustomization({ ...customization, ancho: parseInt(e.target.value, 10) })
                }
                className="w-full accent-[#003745] h-2 bg-[#f0eee8] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between font-headline text-[10px] text-[#566B72]">
                <span>Mín: 80 cm</span>
                <span className="text-[#003745] font-semibold">Estándar: 160 cm</span>
                <span>Máx: 220 cm</span>
              </div>
            </div>

            {/* Depth (Profundidad) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-headline text-[13px]">
                <span className="text-[#1b1c18] font-semibold">Profundidad Útil</span>
                <div className="flex items-center gap-1">
                  <span className="font-headline text-[18px] font-bold text-[#003745]">{prof}</span>
                  <span className="text-[#566B72] text-xs">cm</span>
                </div>
              </div>
              <input
                type="range"
                min="30"
                max="60"
                step="2"
                value={prof}
                onChange={(e) =>
                  onChangeCustomization({ ...customization, prof: parseInt(e.target.value, 10) })
                }
                className="w-full accent-[#003745] h-2 bg-[#f0eee8] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between font-headline text-[10px] text-[#566B72]">
                <span>Mín: 30 cm</span>
                <span className="text-[#003745] font-semibold">Equipos: 40 cm</span>
                <span>Máx: 60 cm</span>
              </div>
            </div>

            {/* Shelves Stepper */}
            <div className="pt-1 flex items-center justify-between bg-[#f5f3ed] p-2.5 rounded-lg border border-[#DCD7CA]/50">
              <div>
                <div className="font-headline text-[13px] font-bold text-[#1b1c18]">
                  Baldas / Niveles
                </div>
                <div className="text-[11px] text-[#566B72]">Distribución de carga</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChangeCustomization({
                      ...customization,
                      shelves: Math.max(2, shelves - 1),
                    })
                  }
                  className="w-8 h-8 rounded bg-white hover:bg-[#eae8e2] text-[#003745] flex items-center justify-center font-bold shadow-xs cursor-pointer border border-[#DCD7CA]"
                >
                  -
                </button>
                <span className="font-headline text-[16px] font-bold text-[#003745] w-6 text-center">
                  {shelves}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChangeCustomization({
                      ...customization,
                      shelves: Math.min(7, shelves + 1),
                    })
                  }
                  className="w-8 h-8 rounded bg-white hover:bg-[#eae8e2] text-[#003745] flex items-center justify-center font-bold shadow-xs cursor-pointer border border-[#DCD7CA]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Tactile Material Swatches */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#DCD7CA]/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003745] text-[20px]">palette</span>
                <h3 className="font-headline text-[16px] font-bold text-[#003745]">
                  Maderas y Muestras
                </h3>
              </div>
              <span className="font-headline text-[11px] text-[#683f00] font-bold">
                {wood.name}
              </span>
            </div>
            <p className="text-[12px] text-[#566B72]">
              Selecciona la chapa o tablero macizo para cálculo de cubicaje:
            </p>

            <div className="grid grid-cols-5 gap-2 pt-1">
              {WOOD_OPTIONS.map((w) => {
                const isSelected = wood.id === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => onChangeCustomization({ ...customization, wood: w })}
                    className="group relative flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
                    type="button"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg relative overflow-hidden shadow-xs transition-all ${
                        isSelected ? 'ring-2 ring-[#003745] ring-offset-2 scale-105' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: w.colorHex }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center text-white">
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-headline text-[10px] text-center truncate max-w-[54px] ${
                        isSelected ? 'font-bold text-[#003745]' : 'text-[#566B72]'
                      }`}
                    >
                      {w.shortName}
                    </span>
                    <span
                      className={`font-headline text-[9px] ${
                        w.surchargePercent > 0
                          ? 'text-[#683f00] font-bold'
                          : w.surchargePercent < 0
                          ? 'text-[#3b6471]'
                          : 'text-[#2D7A4C] font-semibold'
                      }`}
                    >
                      {w.surchargePercent > 0
                        ? `+${w.surchargePercent}%`
                        : w.surchargePercent < 0
                        ? `${w.surchargePercent}%`
                        : 'Base'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Finishes and Hardware Pickers */}
            <div className="pt-2 grid grid-cols-2 gap-3 border-t border-[#f0eee8]">
              <div>
                <label className="font-headline text-[11px] text-[#566B72] block mb-1 font-semibold">
                  Acabado Capa
                </label>
                <select
                  value={finish}
                  onChange={(e) =>
                    onChangeCustomization({ ...customization, finish: e.target.value })
                  }
                  className="w-full h-9 px-2 bg-[#f5f3ed] text-[#003745] font-headline text-[11px] font-semibold rounded-lg cursor-pointer border border-[#DCD7CA]/50"
                >
                  <option value="Poro Mate Satinado Ecológico">Poro Mate Satinado</option>
                  <option value="Poliuretano Brillante Alta Resistencia">Poliuretano Brillante</option>
                  <option value="Aceite de Teca Ecológico Hidrófugo">Aceite de Teca Natural</option>
                </select>
              </div>

              <div>
                <label className="font-headline text-[11px] text-[#566B72] block mb-1 font-semibold">
                  Herrajes & Rieles
                </label>
                <select
                  value={hardware}
                  onChange={(e) =>
                    onChangeCustomization({ ...customization, hardware: e.target.value })
                  }
                  className="w-full h-9 px-2 bg-[#f5f3ed] text-[#003745] font-headline text-[11px] font-semibold rounded-lg cursor-pointer border border-[#DCD7CA]/50"
                >
                  <option value="Blum Cierre Suave Negro Mate">Negro Mate Chasis</option>
                  <option value="Blum Dorado Cepillado">Dorado Cepillado</option>
                  <option value="Acero Inox Oculto Push-to-Open">Acero Inox Oculto</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Design Assistant Trigger */}
          <div className="bg-gradient-to-br from-[#0d4f60] to-[#003745] rounded-xl p-4 text-white shadow-md flex flex-col gap-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-headline text-[13px] font-bold text-[#bce6f6]">
                <span
                  className="material-symbols-outlined text-[18px] animate-spin"
                  style={{ animationDuration: '4s' }}
                >
                  auto_awesome
                </span>
                Asistente de Diseño IA
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-headline font-bold uppercase tracking-wider">
                Motor GPT-4o CAD
              </span>
            </div>
            <p className="text-[12px] text-white/90 leading-relaxed">
              ¿Dudas con el espacio? Sube las medidas de tu sala y la IA balanceará proporciones y tipo
              de ensamble según la regla del vano áureo.
            </p>
            <button
              onClick={handleAIOptimize}
              className="mt-1 w-full py-2.5 px-3 rounded-lg bg-[#683f00] hover:bg-[#E58D17] text-white font-headline text-[12px] font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>Sugerir Proporción Óptima</span>
            </button>
            {aiOptimizedToast && (
              <div className="text-[11px] text-[#bce6f6] font-headline font-semibold flex items-center gap-1 animate-fadeIn">
                <span className="material-symbols-outlined text-[14px]">check</span>
                <span>Proporciones recalibradas: 185×170×42 cm</span>
              </div>
            )}
          </div>
        </section>

        {/* CENTER PANEL: Real-time 3D WebGL Canvas & Viewport HUD (Cols 4 to 9) */}
        <main className="lg:col-span-6 flex flex-col gap-4 order-1 lg:order-2">
          <div className="relative">
            {/* The 3D Canvas */}
            <ThreeCanvas
              alto={alto}
              ancho={ancho}
              prof={prof}
              shelves={shelves}
              wood={wood}
              isRotating={isRotating}
              onToggleRotate={() => setIsRotating(!isRotating)}
              doorsOpen={doorsOpen}
              onToggleDoors={() => setDoorsOpen(!doorsOpen)}
              wireframe={wireframe}
              onToggleWireframe={() => setWireframe(!wireframe)}
              cameraView={cameraView}
              fallbackImage={model.image}
            />

            {/* Bottom Floating Camera & State Floating Bar */}
            <div className="mt-3 flex items-center justify-center gap-1.5 p-1.5 bg-white rounded-xl shadow-sm border border-[#DCD7CA]/70 w-fit mx-auto">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`px-3 py-1.5 rounded-lg font-headline text-[12px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  isRotating
                    ? 'bg-[#003745] text-white'
                    : 'bg-[#f5f3ed] hover:bg-[#eae8e2] text-[#003745]'
                }`}
                title="Girar 360°"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">360</span>
                <span>Giro 360°</span>
              </button>

              <button
                onClick={() => setCameraView('front')}
                className={`px-3 py-1.5 rounded-lg font-headline text-[12px] font-semibold transition-all cursor-pointer ${
                  cameraView === 'front'
                    ? 'bg-[#003745] text-white'
                    : 'hover:bg-[#f5f3ed] text-[#40484b]'
                }`}
                type="button"
              >
                Frontal
              </button>

              <button
                onClick={() => setCameraView('top')}
                className={`px-3 py-1.5 rounded-lg font-headline text-[12px] font-semibold transition-all cursor-pointer ${
                  cameraView === 'top'
                    ? 'bg-[#003745] text-white'
                    : 'hover:bg-[#f5f3ed] text-[#40484b]'
                }`}
                type="button"
              >
                Planta
              </button>

              <div className="w-px h-5 bg-[#DCD7CA] my-auto"></div>

              <button
                onClick={() => setDoorsOpen(!doorsOpen)}
                className={`px-3 py-1.5 rounded-lg font-headline text-[12px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  doorsOpen
                    ? 'bg-[#bce6f6] text-[#003745]'
                    : 'hover:bg-[#f5f3ed] text-[#40484b]'
                }`}
                title="Abrir puertas y cajones"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">meeting_room</span>
                <span>{doorsOpen ? 'Cerrar' : 'Desplegar'}</span>
              </button>

              <button
                onClick={() => setWireframe(!wireframe)}
                className={`p-1.5 px-2 rounded-lg font-headline text-[12px] font-semibold transition-all cursor-pointer ${
                  wireframe
                    ? 'bg-[#003745] text-white'
                    : 'hover:bg-[#f5f3ed] text-[#40484b]'
                }`}
                title="Malla de alambre / wireframe"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
              </button>
            </div>
          </div>

          {/* Workshop Technical Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 shadow-xs border border-[#DCD7CA]/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f5f3ed] flex items-center justify-center text-[#003745]">
                <span className="material-symbols-outlined text-[18px]">carpenter</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-[10px] text-[#566B72] uppercase font-bold">
                  Unión
                </span>
                <span className="font-headline text-[12px] font-bold text-[#003745] truncate">
                  Ensamble Milano
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-xs border border-[#DCD7CA]/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f5f3ed] flex items-center justify-center text-[#003745]">
                <span className="material-symbols-outlined text-[18px]">weight</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-[10px] text-[#566B72] uppercase font-bold">
                  Carga Máx
                </span>
                <span className="font-headline text-[12px] font-bold text-[#003745] truncate">
                  {pricing.maxLoad} kg dist.
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-xs border border-[#DCD7CA]/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f5f3ed] flex items-center justify-center text-[#003745]">
                <span className="material-symbols-outlined text-[18px]">shield</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-[10px] text-[#566B72] uppercase font-bold">
                  Garantía
                </span>
                <span className="font-headline text-[12px] font-bold text-[#003745] truncate">
                  5 Años Estruct.
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-xs border border-[#DCD7CA]/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f5f3ed] flex items-center justify-center text-[#003745]">
                <span className="material-symbols-outlined text-[18px]">eco</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-[10px] text-[#566B72] uppercase font-bold">
                  Certificado
                </span>
                <span className="font-headline text-[12px] font-bold text-[#003745] truncate">
                  Madera FSC 100%
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: Live Quotation & Production Actions (Cols 10 to 12) */}
        <aside className="lg:col-span-3 flex flex-col gap-5 order-3">
          {/* Primary Live Price Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-t-[#683f00] border-x border-b border-[#DCD7CA]/70 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-[#f5f3ed] text-[#566B72] font-headline text-[11px] font-semibold">
                Cotización Dinámica
              </span>
              <span className="font-headline text-[11px] text-[#2D7A4C] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A4C] animate-pulse"></span>
                En Tiempo Real
              </span>
            </div>

            <div>
              <span className="font-headline text-[11px] text-[#566B72] uppercase tracking-wider block font-semibold">
                Total Estimado Fabricación
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-headline text-[20px] font-bold text-[#003745]">$</span>
                <span className="font-headline text-3xl sm:text-4xl font-extrabold text-[#003745] tracking-tight">
                  {pricing.total.toLocaleString('es-CL')}
                </span>
                <span className="font-headline text-[13px] text-[#566B72] ml-1">CLP</span>
              </div>
              <span className="text-[11px] text-[#566B72]">
                IVA incluido • Precio garantizado por 15 días
              </span>
            </div>

            <hr className="border-[#f0eee8]" />

            {/* Itemized Cost Breakdown */}
            <div className="flex flex-col gap-2 text-[13px]">
              <div className="flex justify-between items-center text-[#40484b]">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#566B72]">forest</span>
                  <span>Materiales ({wood.shortName})</span>
                </span>
                <span className="font-mono font-semibold text-[#1b1c18]">
                  ${pricing.materials.toLocaleString('es-CL')}
                </span>
              </div>

              <div className="flex justify-between items-center text-[#40484b]">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#566B72]">handyman</span>
                  <span>Mano de obra artesanal</span>
                </span>
                <span className="font-mono font-semibold text-[#1b1c18]">
                  ${pricing.labor.toLocaleString('es-CL')}
                </span>
              </div>

              <div className="flex justify-between items-center text-[#40484b]">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#566B72]">brush</span>
                  <span>Acabado y sellado mate</span>
                </span>
                <span className="font-mono font-semibold text-[#1b1c18]">
                  ${pricing.finish.toLocaleString('es-CL')}
                </span>
              </div>

              <div className="flex justify-between items-center text-[#2D7A4C]">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-[15px]">local_offer</span>
                  <span>Descuento de lanzamiento (-6%)</span>
                </span>
                <span className="font-mono font-bold">
                  -${pricing.discount.toLocaleString('es-CL')}
                </span>
              </div>

              {includeInstallation && (
                <div className="flex justify-between items-center text-[#003745] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                    <span>Envío e Instalación a Muro</span>
                  </span>
                  <span className="font-mono">+${pricing.installation.toLocaleString('es-CL')}</span>
                </div>
              )}
            </div>

            <hr className="border-[#f0eee8]" />

            {/* Workshop Lead Time Progress Bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between font-headline text-[11px] font-semibold">
                <span className="text-[#1b1c18] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#683f00]">schedule</span>
                  Entrega Estimada de Taller
                </span>
                <span className="text-[#003745] font-bold">12 a 15 días hábiles</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#f0eee8] overflow-hidden">
                <div className="h-full bg-[#3b6471] w-3/4 rounded-full"></div>
              </div>
              <div className="flex justify-between text-[10px] text-[#566B72]">
                <span>Corte & Ensamble (Día 1-6)</span>
                <span>Laqueado & Control (Día 7-12)</span>
              </div>
            </div>

            {/* Installation Addon Checkbox */}
            <label className="p-3 rounded-lg bg-[#f5f3ed] hover:bg-[#eae8e2] flex items-start gap-2.5 cursor-pointer transition-colors border border-[#DCD7CA]/40">
              <input
                type="checkbox"
                checked={includeInstallation}
                onChange={(e) =>
                  onChangeCustomization({
                    ...customization,
                    includeInstallation: e.target.checked,
                  })
                }
                className="mt-0.5 accent-[#003745] w-4 h-4 rounded cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="font-headline text-[12px] text-[#003745] font-bold flex items-center gap-1">
                  Incluir Envío & Armado en Domicilio
                </span>
                <span className="text-[11px] text-[#566B72]">
                  Técnicos nivelan y anclan a muro con tornillería oculta (+ $28.000 CLP).
                </span>
              </div>
            </label>

            {/* Dimensional Safety Badge */}
            <div className="p-2 px-3 rounded-lg bg-[#2D7A4C]/10 text-[#2D7A4C] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="font-headline text-[11px] leading-tight font-medium">
                Medidas validadas dentro de límites de fabricación estructural segura.
              </span>
            </div>

            {/* Direct Conversion Actions */}
            <div className="flex flex-col gap-2 pt-1">
              {/* Primary CTA Button (Warm Amber) */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-[#683f00] hover:bg-[#E58D17] active:scale-[0.99] text-white font-headline text-[15px] font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                type="button"
              >
                <span>Confirmar Pedido & Continuar</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>

              {/* Secondary CTA Button (Petroleum Blue) */}
              <button
                onClick={() => setPdfModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0d4f60] hover:bg-[#003745] text-white font-headline text-[13px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                <span>Descargar Cotización Formal PDF</span>
              </button>

              {/* WhatsApp Share & Carpenter Consultation */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => {
                    const msg = encodeURIComponent(
                      `Hola, me interesa cotizar el modelo ${model.name} (${alto}x${ancho}x${prof}cm) en madera ${wood.name} por $${pricing.total} CLP.`
                    );
                    window.open(`https://wa.me/56984721093?text=${msg}`, '_blank');
                  }}
                  className="py-2 px-2 rounded-lg bg-[#f5f3ed] hover:bg-[#eae8e2] text-[#003745] font-headline text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#DCD7CA]/50"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#2D7A4C]">chat</span>
                  <span>Enviar a WhatsApp</span>
                </button>
                <button
                  onClick={() => onNavigate('asistente-ia')}
                  className="py-2 px-2 rounded-lg bg-[#f5f3ed] hover:bg-[#eae8e2] text-[#003745] font-headline text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#DCD7CA]/50"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#003745]">
                    engineering
                  </span>
                  <span>Hablar con Maestro</span>
                </button>
              </div>
            </div>
          </div>

          {/* Trust and Fabrication Note */}
          <div className="p-3.5 rounded-xl bg-[#f5f3ed] border border-[#DCD7CA]/50 flex items-start gap-2.5 text-[#566B72]">
            <span className="material-symbols-outlined text-[#003745] text-[20px] mt-0.5">lock</span>
            <div className="flex flex-col text-[11px]">
              <span className="font-headline font-bold text-[#003745]">Compromiso Carpintersoft</span>
              <span>
                Aceptamos Transferencia bancaria con 50% de anticipo al ordenar y saldo contra recepción
                conforme tras el montaje en tu hogar.
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* PDF Modal */}
      <PDFModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        quote={currentQuoteItem}
      />
    </div>
  );
};
