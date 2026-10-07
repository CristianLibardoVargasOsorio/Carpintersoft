import React from 'react';
import { QuoteItem } from '../types';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: QuoteItem;
}

export const PDFModal: React.FC<PDFModalProps> = ({ isOpen, onClose, quote }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-[#DCD7CA]">
        {/* Modal Action Header */}
        <div className="bg-[#003745] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#ffddb9]">picture_as_pdf</span>
            <span className="font-headline text-[16px] font-bold">
              Ficha Técnica de Fabricación & Cotización CNC #CS-8924
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-[#0d4f60] hover:bg-[#2c6577] text-white font-headline text-[12px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Formal Printable Document Content */}
        <div className="p-8 space-y-6 text-[#1b1c18] bg-white print:p-0">
          {/* Header of Quotation */}
          <div className="flex flex-wrap justify-between items-start border-b border-[#DCD7CA] pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <img
                  alt="Carpintersoft"
                  className="h-7 w-auto object-contain"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1X9oukXY8HeTKmKv4b6U2CvdpDE4b0Odcc5X_maDnsGSZfxv0qCpXHwnqMUiL5ieBGP8v3fFHblAPxuTEW3i_QT_LaX6t8yuzJsRR1Wqz5E2NhnqJkyiQ21KjChrYUDQLC-QSn66oGFCsr8K2QvrPH5kQw8wWCacIYBsfEDBElFLFiAXgjLSdQK0o7GzmV_IrU0EzVyGp-n6quz47mhANB9XPTUBCrHdhzeJAE5YIh-ra6XKiNjCpD8wQ"
                />
                <span className="font-headline text-[20px] font-bold text-[#003745]">
                  Carpintersoft SpA
                </span>
              </div>
              <p className="text-[12px] text-[#566B72] mt-1">
                Ingeniería paramétrica en madera & fabricación digital CNC
              </p>
              <p className="text-[12px] text-[#566B72]">
                RUT: 76.918.234-5 • Santiago, Chile • contacto@carpintersoft.cl
              </p>
            </div>
            <div className="text-right">
              <span className="font-headline text-[12px] font-bold text-[#683f00] uppercase block">
                Presupuesto Formal Validador
              </span>
              <span className="font-mono text-[18px] font-bold text-[#003745]">#COT-2026-982</span>
              <p className="text-[12px] text-[#566B72] mt-1">Fecha Emisión: 07 Octubre 2026</p>
              <p className="text-[12px] text-[#566B72]">Validez: 15 días continuos</p>
            </div>
          </div>

          {/* Model Showcase & Technical Blueprint Table */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 rounded-xl overflow-hidden border border-[#DCD7CA] shadow-sm">
              <img
                src={quote.model.image}
                alt={quote.model.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 bg-[#f5f3ed] text-center font-headline text-[11px] font-bold text-[#003745]">
                {quote.model.modelCode} • Render Aprobado
              </div>
            </div>

            <div className="md:col-span-2 space-y-2 text-[13px]">
              <h3 className="font-headline text-[18px] font-bold text-[#003745]">
                {quote.model.name}
              </h3>
              <div className="grid grid-cols-2 gap-2 bg-[#f5f3ed] p-3 rounded-xl border border-[#DCD7CA]">
                <div>
                  <span className="text-[#566B72] text-[11px] block">Dimensiones de Corte:</span>
                  <strong className="font-mono text-[#003745]">
                    {quote.alto}cm (Alto) × {quote.ancho}cm (Ancho) × {quote.prof}cm (Fondo)
                  </strong>
                </div>
                <div>
                  <span className="text-[#566B72] text-[11px] block">Especie Maderera:</span>
                  <strong className="text-[#003745]">{quote.wood.name}</strong>
                </div>
                <div>
                  <span className="text-[#566B72] text-[11px] block">Baldas / Estantes:</span>
                  <strong className="text-[#003745]">{quote.shelves} niveles ajustables</strong>
                </div>
                <div>
                  <span className="text-[#566B72] text-[11px] block">Tolerancia Mecanizado:</span>
                  <strong className="text-[#2D7A4C] font-mono">±1.5 mm Homologado CNC</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Items Table */}
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-[#f0eee8] text-[#003745] font-headline text-[12px] font-semibold">
                <th className="p-2.5 rounded-l-lg">Ítem de Fabricación</th>
                <th className="p-2.5">Detalle Técnico</th>
                <th className="p-2.5 text-right rounded-r-lg">Subtotal CLP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD7CA]/70 text-[#40484b]">
              <tr>
                <td className="p-2.5 font-medium text-[#1b1c18]">Materia Prima Certificada</td>
                <td className="p-2.5 text-[#566B72]">{quote.wood.name} + cantos termofusionados</td>
                <td className="p-2.5 text-right font-mono">${quote.materialsCost.toLocaleString('es-CL')}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-[#1b1c18]">Mano de Obra & Fresado CNC</td>
                <td className="p-2.5 text-[#566B72]">Perforado minifix, ranurado y despiece digital</td>
                <td className="p-2.5 text-right font-mono">${quote.laborCost.toLocaleString('es-CL')}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-[#1b1c18]">Tratamiento de Superficie</td>
                <td className="p-2.5 text-[#566B72]">{quote.finish}</td>
                <td className="p-2.5 text-right font-mono">${quote.finishCost.toLocaleString('es-CL')}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-[#2D7A4C]">Descuento Estudio 3D (-6%)</td>
                <td className="p-2.5 text-[#2D7A4C]">Bonificación de calibración automática</td>
                <td className="p-2.5 text-right font-mono text-[#2D7A4C]">-${quote.discount.toLocaleString('es-CL')}</td>
              </tr>
              {quote.includeInstallation && (
                <tr>
                  <td className="p-2.5 font-medium text-[#003745]">Armado e Instalación a Muro</td>
                  <td className="p-2.5 text-[#566B72]">Fijación oculta y garantía de ensamble 5 años</td>
                  <td className="p-2.5 text-right font-mono">${quote.installationCost.toLocaleString('es-CL')}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Grand Total */}
          <div className="bg-[#f5f3ed] p-4 rounded-xl border border-[#DCD7CA] flex justify-between items-baseline font-headline">
            <div>
              <span className="text-[12px] text-[#566B72] uppercase block">Total Final (IVA Incluido):</span>
              <span className="text-[11px] text-[#2D7A4C]">
                ✓ Acepta 50% anticipo para corte ($
                {Math.round(quote.totalCost * 0.5).toLocaleString('es-CL')} CLP)
              </span>
            </div>
            <span className="text-[26px] font-bold text-[#003745]">
              ${quote.totalCost.toLocaleString('es-CL')} <span className="text-[14px]">CLP</span>
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#f0eee8] px-6 py-4 flex justify-end gap-3 border-t border-[#DCD7CA]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-[#DCD7CA] text-[#003745] font-headline text-[13px] font-semibold hover:bg-[#eae8e2] cursor-pointer"
          >
            Cerrar Vista Previa
          </button>
        </div>
      </div>
    </div>
  );
};
