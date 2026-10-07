import React from 'react';
import { Screen, CustomizationState } from '../types';
import { INITIAL_SAVED_QUOTES, CATALOG_MODELS, WOOD_OPTIONS } from '../data/mockData';

interface SavedQuotesViewProps {
  onNavigate: (screen: Screen) => void;
  onLoadCustomization: (custom: CustomizationState) => void;
}

export const SavedQuotesView: React.FC<SavedQuotesViewProps> = ({
  onNavigate,
  onLoadCustomization,
}) => {
  const handleResumeIn3D = (quoteId: string) => {
    if (quoteId === 'Q-844') {
      const tvModel = CATALOG_MODELS.find((m) => m.id === 'mueble-tv-multimedia') || CATALOG_MODELS[0];
      onLoadCustomization({
        model: tvModel,
        alto: 50,
        ancho: 180,
        prof: 42,
        shelves: 2,
        wood: WOOD_OPTIONS[4], // Oscuro
        finish: 'Poro Mate Satinado Ecológico',
        hardware: 'Blum Cierre Suave Negro Mate',
        includeInstallation: true,
      });
    } else {
      const estanteria = CATALOG_MODELS[0];
      onLoadCustomization({
        model: estanteria,
        alto: 180,
        ancho: 160,
        prof: 40,
        shelves: 4,
        wood: WOOD_OPTIONS[0], // Roble
        finish: 'Poro Mate Satinado Ecológico',
        hardware: 'Blum Cierre Suave Negro Mate',
        includeInstallation: true,
      });
    }
    onNavigate('personalizador-3d');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0eee8] text-[#003745] font-headline text-[11px] font-semibold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[14px]">bookmark</span>
            Tus Proyectos Paramétricos
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-[#003745]">
            Cotizaciones Guardadas
          </h1>
          <p className="text-[15px] text-[#566B72] mt-1">
            Reanuda configuraciones 3D guardadas previamente o envíalas directamente a producción en taller.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INITIAL_SAVED_QUOTES.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#DCD7CA]/70 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                <img
                  src={q.image}
                  alt={q.title}
                  className="w-24 h-24 rounded-xl object-cover border border-[#DCD7CA]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-[11px] text-[#566B72] font-semibold">
                      {q.id} • {q.modelCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#f0eee8] text-[#003745] font-headline text-[11px] font-semibold">
                      {q.status}
                    </span>
                  </div>
                  <h3 className="font-headline text-[17px] font-bold text-[#003745] mt-1">
                    {q.title}
                  </h3>
                  <div className="text-[12px] text-[#566B72] space-y-0.5 mt-2">
                    <p>
                      Cotas: <strong className="text-[#1b1c18] font-mono">{q.dimensions}</strong>
                    </p>
                    <p>
                      Madera: <strong className="text-[#1b1c18]">{q.woodName}</strong>
                    </p>
                    <p>Guardado: {q.date}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#f0eee8] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-[#566B72] uppercase font-headline font-semibold block">
                    Presupuesto CNC
                  </span>
                  <span className="font-headline text-[20px] font-bold text-[#003745]">
                    ${q.total.toLocaleString('es-CL')} CLP
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResumeIn3D(q.id)}
                    className="px-4 py-2 rounded-xl bg-[#683f00] hover:bg-[#E58D17] text-white font-headline text-[13px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                    <span>Reanudar en 3D</span>
                  </button>
                  <button
                    onClick={() => onNavigate('checkout')}
                    className="px-3.5 py-2 rounded-xl bg-[#003745] hover:bg-[#0d4f60] text-white font-headline text-[13px] font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Ordenar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
