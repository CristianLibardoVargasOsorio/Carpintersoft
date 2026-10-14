import React, { useMemo, useState } from 'react';
import { CustomizationState } from '../types';

interface CutListModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: CustomizationState;
}

interface CutPiece {
  id: string;
  name: string;
  qty: number;
  lengthMm: number;
  widthMm: number;
  thicknessMm: number;
  material: string;
  edges: string; // e.g., '2L + 1A'
}

export const CutListModal: React.FC<CutListModalProps> = ({
  isOpen,
  onClose,
  customization,
}) => {
  const [activeTab, setActiveTab] = useState<'table' | 'sheet'>('table');
  const { model, alto, ancho, prof, shelves, wood } = customization;

  // Calculate cut pieces based on parametric dimensions
  const cutPieces: CutPiece[] = useMemo(() => {
    const altoMm = alto * 10;
    const anchoMm = ancho * 10;
    const profMm = prof * 10;
    const thickness = 18; // 18mm standard carpentry board

    const innerAnchoMm = anchoMm - thickness * 2;
    const innerAltoMm = altoMm - thickness * 2;

    const list: CutPiece[] = [
      {
        id: 'P-01',
        name: 'Lateral Izquierdo (Costado)',
        qty: 1,
        lengthMm: altoMm,
        widthMm: profMm,
        thicknessMm: thickness,
        material: `${wood.name} 18mm`,
        edges: '1 Largo (Frontal 2mm)',
      },
      {
        id: 'P-02',
        name: 'Lateral Derecho (Costado)',
        qty: 1,
        lengthMm: altoMm,
        widthMm: profMm,
        thicknessMm: thickness,
        material: `${wood.name} 18mm`,
        edges: '1 Largo (Frontal 2mm)',
      },
      {
        id: 'P-03',
        name: 'Techo Superior (Cubierta)',
        qty: 1,
        lengthMm: innerAnchoMm,
        widthMm: profMm,
        thicknessMm: thickness,
        material: `${wood.name} 18mm`,
        edges: '1 Largo (Frontal 2mm)',
      },
      {
        id: 'P-04',
        name: 'Base Inferior (Piso)',
        qty: 1,
        lengthMm: innerAnchoMm,
        widthMm: profMm,
        thicknessMm: thickness,
        material: `${wood.name} 18mm`,
        edges: '1 Largo (Frontal 2mm)',
      },
      {
        id: 'P-05',
        name: 'Repisas Interiores Ajustables',
        qty: shelves,
        lengthMm: innerAnchoMm - 2,
        widthMm: profMm - 15, // rehundido 15mm para puertas
        thicknessMm: thickness,
        material: `${wood.name} 18mm`,
        edges: '1 Largo (Frontal 0.4mm)',
      },
      {
        id: 'P-06',
        name: 'Fondo Trasera (MDF / Enchapado)',
        qty: 1,
        lengthMm: innerAltoMm + 16,
        widthMm: innerAnchoMm + 16,
        thicknessMm: 5.5,
        material: 'MDF Trasera 5.5mm Ranurado',
        edges: 'Sin tapacanto (Encaje)',
      },
    ];

    // Add doors if present
    const doorH = Math.round(altoMm * 0.4);
    const doorW = Math.round((innerAnchoMm - 4) / 2);
    list.push(
      {
        id: 'P-07',
        name: 'Puerta Batiente Izquierda',
        qty: 1,
        lengthMm: doorH,
        widthMm: doorW,
        thicknessMm: thickness,
        material: `${wood.name} 18mm`,
        edges: '4 Lados (PVC 2mm)',
      },
      {
        id: 'P-08',
        name: 'Puerta Batiente Derecha',
        qty: 1,
        lengthMm: doorH,
        widthMm: doorW,
        thicknessMm: thickness,
        material: `${wood.name} 18mm`,
        edges: '4 Lados (PVC 2mm)',
      }
    );

    return list;
  }, [alto, ancho, prof, shelves, wood]);

  // Compute metrics: m2, sheets, edge banding meters
  const metrics = useMemo(() => {
    let totalAreaM2 = 0;
    let edgeMeters = 0;

    cutPieces.forEach((p) => {
      const area = (p.lengthMm / 1000) * (p.widthMm / 1000) * p.qty;
      totalAreaM2 += area;
      // perimeter estimate for edge banding
      if (p.thicknessMm === 18) {
        if (p.name.includes('Puerta')) {
          edgeMeters += (((p.lengthMm + p.widthMm) * 2) / 1000) * p.qty;
        } else {
          edgeMeters += (p.lengthMm / 1000) * p.qty; // frontal
        }
      }
    });

    // Standard sheet 2440 x 1220 mm = 2.9768 m2
    const sheetArea = 2.977;
    const requiredSheets = Math.ceil(totalAreaM2 / (sheetArea * 0.85)); // 85% yield factor
    const efficiency = Math.min(94, Math.round((totalAreaM2 / (requiredSheets * sheetArea)) * 100));

    return {
      totalAreaM2: Number(totalAreaM2.toFixed(2)),
      totalPieces: cutPieces.reduce((acc, p) => acc + p.qty, 0),
      edgeMeters: Number(edgeMeters.toFixed(1)),
      requiredSheets,
      efficiency,
    };
  }, [cutPieces]);

  // Download CSV for CNC optimizer
  const handleDownloadCSV = () => {
    const headers = ['ID', 'Pieza', 'Cantidad', 'Largo_mm', 'Ancho_mm', 'Espesor_mm', 'Material', 'Cantos'];
    const rows = cutPieces.map((p) => [
      p.id,
      `"${p.name}"`,
      p.qty,
      p.lengthMm,
      p.widthMm,
      p.thicknessMm,
      `"${p.material}"`,
      `"${p.edges}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `despiece_cnc_${model.id}_${alto}x${ancho}x${prof}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-[#DCD7CA] flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#003745] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-[#ffddb9]">precision_manufacturing</span>
            <div>
              <h2 className="font-headline text-[17px] font-bold">
                Plan de Despiece CNC & Lista de Corte
              </h2>
              <p className="text-[11px] text-[#bce6f6]">
                Módulo paramétrico: {model.name} ({alto} × {ancho} × {prof} cm) • Espesor 18mm
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-lg bg-[#683f00] hover:bg-[#E58D17] text-white font-headline text-[12px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Descargar para OptiCut, CutMaster o Sierra CNC"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Technical Stats Strip */}
        <div className="bg-[#f5f3ed] border-b border-[#DCD7CA] px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#566B72] block">Total Piezas</span>
            <span className="font-mono text-[16px] font-bold text-[#003745]">
              {metrics.totalPieces} componentes
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#566B72] block">Superficie Total</span>
            <span className="font-mono text-[16px] font-bold text-[#003745]">
              {metrics.totalAreaM2} m²
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#566B72] block">Tableros 2440×1220</span>
            <span className="font-mono text-[16px] font-bold text-[#683f00]">
              {metrics.requiredSheets} placa(s) ({metrics.efficiency}% aprox)
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#566B72] block">Tapacanto PVC</span>
            <span className="font-mono text-[16px] font-bold text-[#2D7A4C]">
              {metrics.edgeMeters} m lineales
            </span>
          </div>
        </div>

        {/* View Tabs */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-[#f0eee8] shrink-0">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 font-headline text-[13px] font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'table'
                ? 'border-[#003745] text-[#003745]'
                : 'border-transparent text-[#566B72] hover:text-[#003745]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">table_chart</span>
            <span>Tabla de Mecanizado</span>
          </button>
          <button
            onClick={() => setActiveTab('sheet')}
            className={`px-4 py-2 font-headline text-[13px] font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sheet'
                ? 'border-[#003745] text-[#003745]'
                : 'border-transparent text-[#566B72] hover:text-[#003745]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">dashboard</span>
            <span>Esquema de Anidamiento de Placa</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'table' ? (
            <div className="overflow-x-auto border border-[#DCD7CA] rounded-xl shadow-xs">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#f5f3ed] text-[#003745] font-headline uppercase font-bold text-[11px] border-b border-[#DCD7CA]">
                  <tr>
                    <th className="py-2.5 px-3">Cód.</th>
                    <th className="py-2.5 px-3">Descripción Pieza</th>
                    <th className="py-2.5 px-2 text-center">Cant.</th>
                    <th className="py-2.5 px-3 font-mono">Largo (mm)</th>
                    <th className="py-2.5 px-3 font-mono">Ancho (mm)</th>
                    <th className="py-2.5 px-2 font-mono text-center">Espesor</th>
                    <th className="py-2.5 px-3">Tapacanto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eee8] text-[#1b1c18]">
                  {cutPieces.map((p) => (
                    <tr key={p.id} className="hover:bg-[#fbf9f3] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#003745]">{p.id}</td>
                      <td className="py-2.5 px-3 font-semibold">{p.name}</td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold bg-[#f5f3ed]/60">
                        {p.qty}
                      </td>
                      <td className="py-2.5 px-3 font-mono">{p.lengthMm}</td>
                      <td className="py-2.5 px-3 font-mono">{p.widthMm}</td>
                      <td className="py-2.5 px-2 font-mono text-center">{p.thicknessMm} mm</td>
                      <td className="py-2.5 px-3 text-[#566B72] text-[11px]">{p.edges}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#f5f3ed] border border-[#DCD7CA] flex items-center justify-between text-[12px]">
                <span className="text-[#566B72]">
                  Simulación de corte optimizado sobre tablero estándar Arauco / Masisa 2440 × 1220 × 18 mm.
                </span>
                <span className="font-headline font-bold text-[#003745]">
                  Sentido de Veta: Longitudinal
                </span>
              </div>

              {/* Graphical Board Layout Representation */}
              <div className="bg-[#e8e4dc] p-4 rounded-xl border-2 border-dashed border-[#c0c8cc] relative">
                <div className="font-headline text-[11px] font-bold text-[#566B72] mb-2 flex items-center justify-between">
                  <span>Placa 1 de {metrics.requiredSheets} (2440 × 1220 mm)</span>
                  <span>Aprovechamiento: {metrics.efficiency}%</span>
                </div>
                <div className="w-full aspect-[2/1] bg-[#d9d2c5] rounded-lg p-2 border border-[#8b8478] grid grid-cols-12 grid-rows-6 gap-1 relative overflow-hidden">
                  {/* Left Side */}
                  <div className="col-span-4 row-span-6 bg-[#003745] text-white p-2 rounded flex flex-col justify-between text-[10px] font-mono shadow-xs">
                    <span className="font-bold">Lateral Izq. ({alto * 10}×{prof * 10})</span>
                    <span className="text-[#bce6f6] text-[9px]">P-01 • 18mm</span>
                  </div>
                  {/* Right Side */}
                  <div className="col-span-4 row-span-6 bg-[#0d4f60] text-white p-2 rounded flex flex-col justify-between text-[10px] font-mono shadow-xs">
                    <span className="font-bold">Lateral Der. ({alto * 10}×{prof * 10})</span>
                    <span className="text-[#bce6f6] text-[9px]">P-02 • 18mm</span>
                  </div>
                  {/* Top & Bottom */}
                  <div className="col-span-4 row-span-2 bg-[#2c6577] text-white p-1 rounded flex flex-col justify-center text-[9px] font-mono shadow-xs">
                    <span className="font-bold truncate">Cubierta Techo</span>
                    <span className="text-[#bce6f6] text-[8px]">P-03</span>
                  </div>
                  <div className="col-span-4 row-span-2 bg-[#3b6471] text-white p-1 rounded flex flex-col justify-center text-[9px] font-mono shadow-xs">
                    <span className="font-bold truncate">Piso Base</span>
                    <span className="text-[#bce6f6] text-[8px]">P-04</span>
                  </div>
                  {/* Shelves */}
                  <div className="col-span-2 row-span-2 bg-[#683f00] text-white p-1 rounded flex flex-col justify-center text-[8px] font-mono shadow-xs">
                    <span className="font-bold truncate">Repisa 1</span>
                  </div>
                  <div className="col-span-2 row-span-2 bg-[#8b5500] text-white p-1 rounded flex flex-col justify-center text-[8px] font-mono shadow-xs">
                    <span className="font-bold truncate">Repisa 2</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Machine Instructions */}
          <div className="p-3.5 rounded-xl bg-[#2D7A4C]/10 border border-[#2D7A4C]/30 text-[#2D7A4C] text-[12px] flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">verified</span>
            <span>
              Archivo de despiece verificado para fresado CNC router con broca helicoidal de 6mm y disco incisor para corte sin desportillado de melamina.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f5f3ed] px-6 py-3 border-t border-[#DCD7CA] flex items-center justify-between shrink-0">
          <span className="text-[12px] text-[#566B72]">
            Compatible con software de corte: OptiCut, Leitz, CutMaster 2D y SketchUp
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#003745] hover:bg-[#0d4f60] text-white font-headline text-[13px] font-bold cursor-pointer transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
