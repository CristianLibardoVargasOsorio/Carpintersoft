import React, { useState, useRef } from 'react';
import { Screen, CustomizationState } from '../types';
import { CATALOG_MODELS } from '../data/mockData';

interface AIAssistantViewProps {
  onNavigate: (screen: Screen) => void;
  onApplyDimensions: (custom: Partial<CustomizationState>) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  file?: { name: string; size: string; type: string };
  isCard?: boolean;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  onNavigate,
  onApplyDimensions,
}) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'render' | 'interference'>('blueprint');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [showCotas, setShowCotas] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [uploadedPlanName, setUploadedPlanName] = useState<string>('Plano_Living_A102.pdf');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: '¡Hola! Soy tu asistente de ingeniería y ebanistería. Interpreto planos técnicos arquitectónicos en PDF, DWG o imágenes de plano para calcular cotas exactas, tolerancias de apertura y despiece de corte óptimo.',
      time: '10:40 AM',
    },
    {
      id: 'msg-2',
      sender: 'user',
      text: 'Adjunto plano técnico de mi living comedor. Necesito diseñar un mueble integral para TV y biblioteca en el muro principal de 4.85m, respetando el ventanal corredizo lateral y un enchufe doble a 45cm del piso.',
      time: '10:42 AM',
      file: {
        name: 'Plano_Living_A102.pdf',
        size: '4.2 MB',
        type: 'Planta Arq. GF Plan Escala 1:50',
      },
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const promptChips = [
    '📐 Optimizar living 24.5 m²',
    '⚡ Enchufes a media altura',
    '🪵 Roble Macizo + Chapa Nogal',
    '📦 Muro TV con biblioteca',
  ];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');

    // Simulate AI Engineer Analysis
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: `Entendido. He procesado tu requerimiento "${currentInput}". Las tolerancias de ensamble CNC y el cubicaje de madera se recalcularon en tiempo real. Ajusté el vano para garantizar ventilación posterior y libre acceso al registro eléctrico.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 800);
  };

  const handleLoadDimensionsTo3D = () => {
    setIsSyncing(true);
    // Apply 3200mm (320cm) or custom dimensions
    const tvModel =
      CATALOG_MODELS.find((m) => m.id === 'mueble-tv-multimedia') || CATALOG_MODELS[0];
    onApplyDimensions({
      model: tvModel,
      ancho: 200,
      alto: 210,
      prof: 42,
      shelves: 4,
    });

    setTimeout(() => {
      setIsSyncing(false);
      onNavigate('personalizador-3d');
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedPlanName(file.name);
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: `He subido un nuevo archivo de plano: ${file.name}. Por favor recalcula los vanos y distancias de muros.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        file: {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: 'Planta de Arquitectura',
        },
      };
      setMessages((prev) => [...prev, userMsg]);

      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: `Plano "${file.name}" analizado exitosamente con visión espacial. Detecté 3 muros de carga y una altura de losa de 2.50m. El modelo paramétrico óptimo ha sido calibrado.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Contextual Bar */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto py-3 bg-[#f5f3ed]/70 border-b border-[#f0eee8]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex items-center gap-1.5 font-headline text-[13px] text-[#566B72]">
              <span>Estudio de Fabricación</span>
              <span className="material-symbols-outlined text-[16px] text-[#c0c8cc]">chevron_right</span>
              <span className="text-[#003745] font-semibold">Asistente de Diseño IA</span>
              <span className="material-symbols-outlined text-[16px] text-[#c0c8cc]">chevron_right</span>
              <span className="text-[#3b6471] font-semibold">Análisis de Espacios & Planos</span>
            </nav>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-xs border border-[#DCD7CA]/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D7A4C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2D7A4C]"></span>
              </span>
              <span className="font-headline text-[11px] text-[#003745] font-semibold tracking-wide">
                Motor GPT-4o Spatial Vision & CAD Paramétrico Activo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Informe técnico PDF de medidas generado exitosamente.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f5f3ed] text-[#003745] rounded-lg font-headline text-[12px] font-semibold transition-all shadow-xs border border-[#DCD7CA]/60 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span className="hidden sm:inline">Exportar Informe PDF</span>
            </button>
            <button
              onClick={() => onNavigate('cotizaciones-guardadas')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f5f3ed] text-[#003745] rounded-lg font-headline text-[12px] font-semibold transition-all shadow-xs border border-[#DCD7CA]/60 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span className="hidden sm:inline">Historial</span>
            </button>
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'msg-start',
                    sender: 'ai',
                    text: '¡Nuevo proyecto iniciado! Sube tu plano técnico en PDF o imagen, o escribe las dimensiones de tu habitación.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#003745] hover:bg-[#0d4f60] text-white rounded-lg font-headline text-[12px] font-semibold transition-all shadow-xs cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Nuevo Proyecto</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Dual-Column Workspace */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto py-5 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Conversational AI Design Expert (5 cols desktop) */}
          <div className="lg:col-span-5 flex flex-col bg-white rounded-xl shadow-sm border border-[#DCD7CA]/60 overflow-hidden h-[720px]">
            {/* Chat Header */}
            <div className="px-5 py-4 bg-[#f5f3ed] border-b border-[#DCD7CA]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-xl bg-[#0d4f60] flex items-center justify-center text-white shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">architecture</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#2D7A4C] rounded-full ring-2 ring-white"></span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-[15px] font-bold text-[#003745]">
                      Maestro IA Carpintersoft
                    </span>
                    <span className="font-headline text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#bce6f6] text-[#003745]">
                      v3.2 CAD
                    </span>
                  </div>
                  <span className="text-[12px] text-[#566B72]">
                    Cálculo de vanos, despiece CNC y cubaje de madera
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  className="w-8 h-8 rounded-lg text-[#566B72] hover:text-[#003745] hover:bg-[#eae8e2] flex items-center justify-center transition-colors cursor-pointer"
                  title="Ajustes de tolerancia"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                </button>
                <button
                  onClick={() => setMessages(messages.slice(0, 2))}
                  className="w-8 h-8 rounded-lg text-[#566B72] hover:text-[#003745] hover:bg-[#eae8e2] flex items-center justify-center transition-colors cursor-pointer"
                  title="Limpiar conversación"
                >
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                </button>
              </div>
            </div>

            {/* Suggested Prompt Chips Carousel */}
            <div className="px-4 py-2 bg-[#f0eee8]/60 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#DCD7CA]/40">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(chip.replace(/^[^\w\s]+/, '').trim());
                  }}
                  className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-[#ffddb9] text-[#003745] font-headline text-[11px] font-semibold transition-all shadow-xs cursor-pointer border border-[#DCD7CA]/40"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#fbf9f3]/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-[#0d4f60] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl p-3.5 shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#003745] text-white rounded-tr-xs'
                        : 'bg-[#f5f3ed] text-[#1b1c18] rounded-tl-xs border border-[#DCD7CA]/60'
                    }`}
                  >
                    {/* Attached file chip */}
                    {msg.file && (
                      <div className="mb-2 flex items-center gap-2.5 p-2 px-3 bg-[#0d4f60]/80 rounded-lg text-white font-headline text-[12px]">
                        <span className="material-symbols-outlined text-[#bfe9f8] text-[20px]">
                          description
                        </span>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-white">{msg.file.name}</span>
                          <span className="text-[#bfe9f8] text-[10px]">
                            {msg.file.size} · {msg.file.type}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-[#2D7A4C] ml-auto">
                          verified
                        </span>
                      </div>
                    )}

                    <p className="text-[13px] leading-relaxed">{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1 font-headline ${
                        msg.sender === 'user' ? 'text-white/70 text-right' : 'text-[#566B72]'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-[#3b6471] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Structured Technical Response Card (Always present as primary analysis result) */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0d4f60] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <div className="flex-1 bg-[#f5f3ed] p-4 rounded-xl rounded-tl-xs space-y-3.5 shadow-xs border border-[#DCD7CA]/60">
                  <div className="space-y-0.5">
                    <span className="font-headline text-[10px] text-[#3b6471] uppercase tracking-wider font-bold">
                      Análisis Espacial Concluido
                    </span>
                    <h4 className="font-headline text-[16px] font-bold text-[#003745]">
                      Solución Paramétrica Muro TV #MED-04 Pro
                    </h4>
                  </div>

                  {/* Technical Findings */}
                  <div className="space-y-2 text-[12px] text-[#1b1c18]">
                    <div className="flex items-start gap-2 bg-white p-2 px-2.5 rounded-lg border border-[#DCD7CA]/50">
                      <span className="material-symbols-outlined text-[18px] text-[#683f00] mt-0.5">
                        straighten
                      </span>
                      <div>
                        <strong className="text-[#003745] font-headline">Vano útil verificado:</strong>{' '}
                        <span>
                          3.40 m libres (descontando 60 cm para cortinero del ventanal W1 y 85 cm de
                          radio de circulación hacia el comedor).
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-white p-2 px-2.5 rounded-lg border border-[#DCD7CA]/50">
                      <span className="material-symbols-outlined text-[18px] text-[#683f00] mt-0.5">
                        electrical_services
                      </span>
                      <div>
                        <strong className="text-[#003745] font-headline">Interferencia resuelta:</strong>{' '}
                        <span>
                          Enchufe doble 220V absorbido mediante zócalo pasacables registrable a 450 mm.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-white p-2 px-2.5 rounded-lg border border-[#DCD7CA]/50">
                      <span className="material-symbols-outlined text-[18px] text-[#683f00] mt-0.5">
                        light_mode
                      </span>
                      <div>
                        <strong className="text-[#003745] font-headline">Iluminación LED rasante:</strong>{' '}
                        <span>
                          Cálculo lumínico en nichos para contrarrestar luz lateral directa de W1.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quotation / Specification Mini-Card */}
                  <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#DCD7CA]/60 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-headline text-[10px] text-[#566B72] uppercase font-semibold">
                          Módulo Recomendado
                        </span>
                        <p className="font-headline text-[14px] font-bold text-[#003745]">
                          Centro Nórdico Escandinavo Pro
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-headline text-[10px] text-[#566B72] uppercase font-semibold">
                          Presupuesto Estimado
                        </span>
                        <p className="font-headline text-[16px] font-bold text-[#683f00] leading-none">
                          $385.000 CLP
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-1.5 bg-[#f5f3ed] rounded-lg text-center font-headline text-[12px] border border-[#DCD7CA]/50">
                      <div>
                        <span className="block text-[#566B72] text-[9px] uppercase font-semibold">
                          Ancho
                        </span>
                        <span className="text-[#003745] font-bold">3200 mm</span>
                      </div>
                      <div>
                        <span className="block text-[#566B72] text-[9px] uppercase font-semibold">
                          Alto
                        </span>
                        <span className="text-[#003745] font-bold">2100 mm</span>
                      </div>
                      <div>
                        <span className="block text-[#566B72] text-[9px] uppercase font-semibold">
                          Fondo
                        </span>
                        <span className="text-[#003745] font-bold">420 mm</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#40484b] pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#9c6f44] inline-block shadow-inner"></span>
                        <span>Roble Americano + Chapa Nogal</span>
                      </div>
                      <span className="font-headline text-[11px] text-[#2D7A4C] font-bold">
                        94% Optimización corte
                      </span>
                    </div>

                    {/* Quick Action Button */}
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={handleLoadDimensionsTo3D}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#683f00] hover:bg-[#E58D17] text-white font-headline text-[12px] font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                        <span>{isSyncing ? 'Sincronizando...' : 'Cargar medidas en Visor 3D'}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('interference')}
                        className="p-2 bg-[#f5f3ed] hover:bg-[#eae8e2] text-[#003745] rounded-lg transition-colors cursor-pointer border border-[#DCD7CA]"
                        title="Ver tolerancias e interferencias"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          precision_manufacturing
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input & Attachment Area */}
            <div className="p-3 bg-white border-t border-[#DCD7CA]/60">
              <form onSubmit={handleSendMessage} className="space-y-1.5">
                <div className="relative bg-[#f5f3ed] rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-[#003745] focus-within:bg-white transition-all border border-[#DCD7CA]/60">
                  <textarea
                    rows={2}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Describe requerimientos de guardado, carga de peso o medidas en mm..."
                    className="w-full bg-transparent px-3 py-1 text-[#1b1c18] text-[13px] focus:outline-none resize-none placeholder:text-[#566B72]"
                  />
                  <div className="flex items-center justify-between pt-1 px-1">
                    <div className="flex items-center gap-1">
                      <label
                        htmlFor="ai-file-upload"
                        className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg text-[#566B72] hover:text-[#003745] hover:bg-[#eae8e2] transition-colors font-headline text-[11px] font-semibold"
                        title="Adjuntar plano PDF, DWG, JPG"
                      >
                        <span className="material-symbols-outlined text-[18px]">attach_file</span>
                        <span className="hidden sm:inline">Adjuntar Plano</span>
                      </label>
                      <input
                        id="ai-file-upload"
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.dwg,.dxf,.png,.jpg"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <button
                        type="button"
                        onClick={() => alert('Grabación de nota de voz lista.')}
                        className="p-1 rounded-lg text-[#566B72] hover:text-[#003745] hover:bg-[#eae8e2] transition-colors cursor-pointer"
                        title="Nota de voz"
                      >
                        <span className="material-symbols-outlined text-[18px]">mic</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1 rounded-lg text-[#566B72] hover:text-[#003745] hover:bg-[#eae8e2] transition-colors cursor-pointer"
                        title="Capturar plano con cámara"
                      >
                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-headline text-[#566B72] hidden md:inline">
                        Enter para enviar
                      </span>
                      <button
                        type="submit"
                        className="w-9 h-9 rounded-lg bg-[#683f00] hover:bg-[#E58D17] text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">send</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[#566B72] px-1 text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#2D7A4C]">
                      verified_user
                    </span>
                    <span>Validador de normas estructurales NCh y DIN activo</span>
                  </span>
                  <span className="font-mono text-[10px]">{inputText.length}/1500</span>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Blueprint CAD Viewer & Spatial Engine (7 cols desktop) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Viewer Container Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#DCD7CA]/60 overflow-hidden flex flex-col">
              {/* Tab Navigation Bar */}
              <div className="px-5 py-3 bg-[#f5f3ed] border-b border-[#DCD7CA]/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 p-1 bg-[#f0eee8] rounded-lg">
                  <button
                    onClick={() => setActiveTab('blueprint')}
                    className={`px-3 py-1.5 rounded-md font-headline text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'blueprint'
                        ? 'bg-white text-[#003745] shadow-xs font-bold'
                        : 'text-[#566B72] hover:text-[#1b1c18]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
                    <span>Plano Técnico Analizado</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('render')}
                    className={`px-3 py-1.5 rounded-md font-headline text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'render'
                        ? 'bg-white text-[#003745] shadow-xs font-bold'
                        : 'text-[#566B72] hover:text-[#1b1c18]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">photo_library</span>
                    <span>Render de Espacio IA</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('interference')}
                    className={`px-3 py-1.5 rounded-md font-headline text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'interference'
                        ? 'bg-white text-[#003745] shadow-xs font-bold'
                        : 'text-[#566B72] hover:text-[#1b1c18]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    <span>Mapa de Interferencias</span>
                  </button>
                </div>

                {/* Blueprint Badges */}
                <div className="flex items-center gap-2 font-headline text-[11px]">
                  <span className="px-2 py-1 rounded bg-[#bce6f6] text-[#003745] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">grid_goldenratio</span>
                    Escala 1:50 Calibrada
                  </span>
                  <span className="px-2 py-1 rounded bg-[#f0eee8] text-[#003745] font-semibold">
                    Living: 24.5 m²
                  </span>
                </div>
              </div>

              {/* Viewport Canvas */}
              <div className="relative w-full h-[520px] bg-[#f2ede4] overflow-hidden flex items-center justify-center select-none">
                {/* MODE 1: ARCHITECTURAL BLUEPRINT WITH CAD OVERLAYS */}
                {activeTab === 'blueprint' && (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <div className="relative max-w-full max-h-full aspect-[4/3] rounded-lg shadow-inner overflow-hidden flex items-center justify-center">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDtPJydsqggvd1QLw83HVYPmOLFnNfgh_m8x1NS-tpTUpIrrV8XvA9v_wAQWcrQ2U14D_dJswqPXAetCdkEthKuTv2_EG57SeH96clGQljbfsLT2Sxee6VffNCx93I9NzPRJvSEZ35t0QLUUjLBQY5gm9uTqGyWmhzeZ0Il33NeZfjoGLBPr7eJgsG-ExG-G_jjv61aSTLgfmltMOTzeznexLLgNgTcQo8BI1adMFKFnQzln-M5-87"
                        alt="Plano técnico arquitectónico departamento"
                        className="w-full h-full object-contain rounded transition-transform duration-300"
                        style={{ transform: `scale(${zoomScale})` }}
                      />

                      {/* Vector CAD Overlay */}
                      {showCotas && (
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          preserveAspectRatio="xMidYMid meet"
                          viewBox="0 0 800 600"
                        >
                          <defs>
                            <pattern
                              id="diagHatch"
                              patternUnits="userSpaceOnUse"
                              width="8"
                              height="8"
                              patternTransform="rotate(45 0 0)"
                            >
                              <line
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="8"
                                stroke="#ED991F"
                                strokeWidth="1.5"
                                strokeOpacity="0.3"
                              />
                            </pattern>
                          </defs>

                          {/* Bounding Box Zone */}
                          <rect
                            x="238"
                            y="380"
                            width="168"
                            height="34"
                            rx="3"
                            fill="url(#diagHatch)"
                            stroke="#ED991F"
                            strokeWidth="2.5"
                            strokeDasharray="4,2"
                          />

                          {/* Dimensions lines */}
                          <line
                            x1="238"
                            y1="365"
                            x2="406"
                            y2="365"
                            stroke="#0D4F60"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="238"
                            y1="360"
                            x2="238"
                            y2="370"
                            stroke="#0D4F60"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="406"
                            y1="360"
                            x2="406"
                            y2="370"
                            stroke="#0D4F60"
                            strokeWidth="1.5"
                          />
                          <text
                            x="322"
                            y="360"
                            fill="#0D4F60"
                            fontFamily="Space Grotesk"
                            fontSize="11"
                            fontWeight="700"
                            textAnchor="middle"
                          >
                            3200 mm ÚTIL
                          </text>

                          {/* Walkway clearance */}
                          <path
                            d="M 406 397 Q 440 370 480 370"
                            fill="none"
                            stroke="#2D7A4C"
                            strokeWidth="1.5"
                            strokeDasharray="3,3"
                          />
                          <text
                            x="445"
                            y="358"
                            fill="#2D7A4C"
                            fontFamily="Work Sans"
                            fontSize="9"
                            fontWeight="600"
                          >
                            Paso libre: 85 cm
                          </text>
                        </svg>
                      )}

                      {/* Interactive PIN 1: Electric Outlet */}
                      <div className="absolute top-[67%] left-[32%] transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto">
                        <div className="relative flex items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-[#C63C28] opacity-40"></span>
                          <button
                            type="button"
                            className="w-7 h-7 rounded-full bg-[#C63C28] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">power</span>
                          </button>
                          {/* Tooltip Card */}
                          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-[#30312d] text-white p-2.5 rounded-lg shadow-xl text-left whitespace-nowrap z-30 font-headline text-[11px] min-w-[200px]">
                            <div className="text-[#ffddb9] font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">bolt</span> Toma
                              Corriente Doble (220V)
                            </div>
                            <span className="text-[#c0c8cc]">Cota en muro: H = 450 mm</span>
                            <span className="text-[#2D7A4C] font-semibold">
                              ✓ Pasacables canalizado en zócalo
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive PIN 2: Window Obstacle */}
                      <div className="absolute top-[64%] left-[17%] transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto">
                        <div className="relative flex items-center justify-center">
                          <button
                            type="button"
                            className="w-7 h-7 rounded-full bg-[#3b6471] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">curtains</span>
                          </button>
                          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-[#30312d] text-white p-2.5 rounded-lg shadow-xl text-left whitespace-nowrap z-30 font-headline text-[11px] min-w-[210px]">
                            <div className="text-[#b5ebff] font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">window</span>{' '}
                              Ventanal Balcón W1
                            </div>
                            <span className="text-[#c0c8cc]">Despeje cortinero: 600 mm</span>
                            <span className="text-[#bce6f6] font-semibold">
                              Margen de repliegue verificado
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive PIN 3: Optimal Center TV */}
                      <div className="absolute top-[68%] left-[43%] transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto">
                        <div className="relative flex items-center justify-center">
                          <button
                            type="button"
                            className="w-7 h-7 rounded-full bg-[#683f00] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">tv</span>
                          </button>
                          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-[#30312d] text-white p-2.5 rounded-lg shadow-xl text-left whitespace-nowrap z-30 font-headline text-[11px] min-w-[200px]">
                            <div className="text-[#ffddb9] font-bold">Eje Óptimo de Pantalla (65")</div>
                            <span className="text-[#c0c8cc]">Distancia al sillón: 3.10 m (Ideal THX)</span>
                            <span className="text-[#2D7A4C] font-semibold">
                              Ángulo de visión 36° verificado
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 2: RENDER FOTORREALISTA */}
                {activeTab === 'render' && (
                  <div className="relative w-full h-full p-4 animate-fadeIn">
                    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg group">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUiMbwGI3E3v24ws0X2zhNhR1atyIEZicfBSWv88Ik8NxvCObTduh2Au90O6nCSf3BSfmUuiJa7tC45Zs_WL17ABoeCwAF43neonjaVhbsGafGeMPDwPCivtln_QvMQK9wrWEuCb-o6nDrQayQZ39_K4GjFf29DXKDvw346AWGDPsr8cTF3dw4wh4zml78RLb_rtmiC3bTWihXLMJt4BPftiNXAt7bSx7s2gCOFtVfaurIeQul3bmY"
                        alt="Render fotorrealista de living escandinavo"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#003745]/90 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
                        <span className="font-headline text-[11px] uppercase tracking-wider text-[#bce6f6] font-bold">
                          Simulación Fotorrealista IA
                        </span>
                        <h3 className="font-headline text-2xl font-bold">
                          Mueble Modular de Roble en Muro Living
                        </h3>
                        <p className="text-[13px] text-white/90 max-w-xl mt-1">
                          Cálculo lumínico con tira LED 3000K cálida integrada en repisas y zócalo
                          flotante pasacables según las medidas deducidas del plano.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 3: MAPA DE INTERFERENCIAS */}
                {activeTab === 'interference' && (
                  <div className="w-full h-full p-6 flex flex-col items-center justify-center animate-fadeIn">
                    <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg border border-[#DCD7CA] space-y-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-[#bce6f6] text-[#003745] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[28px]">
                          domain_verification
                        </span>
                      </div>
                      <div>
                        <h3 className="font-headline text-[18px] font-bold text-[#003745]">
                          Matriz de Tolerancias & Colisiones
                        </h3>
                        <p className="text-[12px] text-[#566B72] mt-1">
                          Análisis de interferencias físicas con instalaciones de obra gruesa.
                        </p>
                      </div>
                      <div className="space-y-2.5 text-left text-[12px]">
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f5f3ed] border border-[#DCD7CA]/40">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#2D7A4C]"></span>
                            Circulación comedor
                          </span>
                          <span className="font-headline text-[#2D7A4C] font-bold">
                            Despejado (+12 cm margen)
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f5f3ed] border border-[#DCD7CA]/40">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#2D7A4C]"></span>
                            Ventanal W1 corredera
                          </span>
                          <span className="font-headline text-[#2D7A4C] font-bold">
                            Tolerancia 600 mm OK
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f5f3ed] border border-[#DCD7CA]/40">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#2D7A4C]"></span>
                            Enchufes y canalizaciones
                          </span>
                          <span className="font-headline text-[#2D7A4C] font-bold">
                            Zócalo absorbente OK
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating HUD Toolbar (Bottom Center of Canvas) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-full shadow-lg border border-[#DCD7CA] z-20">
                  <button
                    onClick={() => setZoomScale((prev) => Math.min(1.8, prev + 0.15))}
                    className="w-8 h-8 rounded-full text-[#003745] hover:bg-[#f5f3ed] flex items-center justify-center transition-colors cursor-pointer"
                    title="Acercar plano"
                  >
                    <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                  </button>
                  <button
                    onClick={() => setZoomScale((prev) => Math.max(0.8, prev - 0.15))}
                    className="w-8 h-8 rounded-full text-[#003745] hover:bg-[#f5f3ed] flex items-center justify-center transition-colors cursor-pointer"
                    title="Alejar plano"
                  >
                    <span className="material-symbols-outlined text-[18px]">zoom_out</span>
                  </button>
                  <div className="w-px h-5 bg-[#DCD7CA] my-auto"></div>
                  <button
                    onClick={() => setZoomScale(1)}
                    className="w-8 h-8 rounded-full text-[#003745] hover:bg-[#f5f3ed] flex items-center justify-center transition-colors cursor-pointer"
                    title="Ajustar a pantalla"
                  >
                    <span className="material-symbols-outlined text-[18px]">fit_screen</span>
                  </button>
                  <button
                    onClick={() => setShowCotas(!showCotas)}
                    className={`px-2.5 py-1 rounded-full font-headline text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      showCotas
                        ? 'bg-[#bce6f6] text-[#003745]'
                        : 'bg-[#f0eee8] text-[#566B72]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">square_foot</span>
                    <span>{showCotas ? 'Cotas On' : 'Cotas Off'}</span>
                  </button>
                </div>

                {/* Floating Render PIP Card (Bottom right) */}
                {activeTab === 'blueprint' && (
                  <div
                    onClick={() => setActiveTab('render')}
                    className="absolute bottom-4 right-4 w-36 h-24 rounded-xl overflow-hidden shadow-xl border-2 border-white cursor-pointer transition-transform hover:scale-105 z-20 group"
                    title="Ver Render 3D del espacio"
                  >
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUiMbwGI3E3v24ws0X2zhNhR1atyIEZicfBSWv88Ik8NxvCObTduh2Au90O6nCSf3BSfmUuiJa7tC45Zs_WL17ABoeCwAF43neonjaVhbsGafGeMPDwPCivtln_QvMQK9wrWEuCb-o6nDrQayQZ39_K4GjFf29DXKDvw346AWGDPsr8cTF3dw4wh4zml78RLb_rtmiC3bTWihXLMJt4BPftiNXAt7bSx7s2gCOFtVfaurIeQul3bmY"
                      alt="Miniatura de render"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#003745]/40 group-hover:bg-[#003745]/20 transition-colors flex items-center justify-center">
                      <span className="bg-white/90 text-[#003745] font-headline text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs">
                        Ver Render 3D
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Active File Metadata Ribbon */}
              <div className="px-5 py-3 bg-[#f5f3ed] border-t border-[#DCD7CA]/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f0eee8] text-[#003745] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">layers</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline text-[13px] text-[#003745] font-bold flex items-center gap-1.5">
                      {uploadedPlanName}
                      <span className="text-[11px] font-normal text-[#566B72]">(4.2 MB)</span>
                    </span>
                    <span className="text-[12px] text-[#566B72]">
                      3 muros detectados · Altura de losa: 2.50m · Grosor de tabique: 15cm
                    </span>
                  </div>
                </div>

                <label
                  htmlFor="replace-plan"
                  className="cursor-pointer px-3.5 py-1.5 bg-white hover:bg-[#f5f3ed] text-[#003745] rounded-lg font-headline text-[12px] font-semibold transition-all shadow-xs border border-[#DCD7CA]/60 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  <span>Reemplazar Plano CAD</span>
                </label>
                <input
                  id="replace-plan"
                  type="file"
                  accept=".pdf,.dwg,.dxf,.png,.jpg"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            {/* Bottom Callout Banner */}
            <div className="bg-gradient-to-r from-[#003745] to-[#0d4f60] p-6 rounded-2xl shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#683f00] text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[32px]">view_in_ar</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-headline text-[11px] uppercase tracking-wider text-[#ffddb9] font-bold">
                    Paso Siguiente: Fabricación a Medida
                  </span>
                  <h3 className="font-headline text-[18px] text-white font-bold leading-tight">
                    ¿Conforme con la propuesta y dimensiones del plano?
                  </h3>
                  <p className="text-[13px] text-white/90 max-w-lg">
                    Transfiere automáticamente el vano de 3.20m x 2.10m al Personalizador 3D para probar
                    tiradores, vetas de madera y generar la orden de corte CNC.
                  </p>
                </div>
              </div>

              <button
                onClick={handleLoadDimensionsTo3D}
                className="shrink-0 flex items-center gap-2 px-6 py-3.5 bg-[#683f00] hover:bg-[#E58D17] text-white rounded-xl font-headline text-[15px] font-bold transition-all shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Abrir en Personalizador 3D</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
