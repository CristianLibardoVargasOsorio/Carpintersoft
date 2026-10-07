import React, { useState, useMemo } from 'react';
import { FurnitureModel, Screen } from '../types';
import { CATALOG_MODELS } from '../data/mockData';

interface CatalogViewProps {
  onSelectModel: (model: FurnitureModel) => void;
  onNavigate: (screen: Screen) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onSelectModel, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos los Modelos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWoodFilter, setSelectedWoodFilter] = useState<string | null>(null);
  const [leadTimeFilter, setLeadTimeFilter] = useState<'all' | 'express' | 'standard'>('all');
  const [only3D, setOnly3D] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories = [
    'Todos los Modelos',
    'Salas & Living',
    'Dormitorios & Closets',
    'Oficina & Home Office',
    'Comedores & Cocina',
    'Estanterías Modulares',
    'Muebles de Entrada',
  ];

  const woodColors = [
    { name: 'Roble Americano', hex: '#B88B4A' },
    { name: 'Cedro Real', hex: '#8E4A28' },
    { name: 'Pino Radiata Premium', hex: '#D6A96E' },
    { name: 'Nogal Oscuro', hex: '#4A3222' },
    { name: 'Melamina Roble Grafito', hex: '#2C302E' },
  ];

  // Filtered & Sorted models
  const filteredModels = useMemo(() => {
    return CATALOG_MODELS.filter((model) => {
      // Category filter
      if (selectedCategory !== 'Todos los Modelos' && model.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = model.name.toLowerCase().includes(query);
        const matchCode = model.modelCode.toLowerCase().includes(query);
        const matchCategory = model.category.toLowerCase().includes(query);
        if (!matchName && !matchCode && !matchCategory) return false;
      }
      // Only 3D
      if (only3D && !model.has3D) {
        return false;
      }
      // Lead time
      if (leadTimeFilter === 'express') {
        const days = parseInt(model.dispatchDays.split(' ')[0], 10);
        if (days > 10) return false;
      } else if (leadTimeFilter === 'standard') {
        const days = parseInt(model.dispatchDays.split(' ')[0], 10);
        if (days > 15) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price_desc') return b.basePrice - a.basePrice;
      if (sortBy === 'days') return parseInt(a.dispatchDays) - parseInt(b.dispatchDays);
      return 0; // popular default
    });
  }, [selectedCategory, searchQuery, only3D, leadTimeFilter, sortBy]);

  const handleSelectModel = (model: FurnitureModel) => {
    onSelectModel(model);
    onNavigate('personalizador-3d');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="relative w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto py-8">
        {/* Top Engineering Metrics Ribbon */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-[#f5f3ed] rounded-xl border border-[#f0eee8]">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#0d4f60] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-[11px] font-semibold text-[#566B72] uppercase">
                  Base Paramétrica
                </span>
                <span className="font-headline text-[16px] font-bold text-[#003745] leading-tight">
                  48 Modelos 3D Activos
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#683f00] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">straighten</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-[11px] font-semibold text-[#566B72] uppercase">
                  Corte Computarizado CNC
                </span>
                <span className="font-headline text-[16px] font-bold text-[#003745] leading-tight">
                  Tolerancia ±1.5 mm
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#bce6f6] text-[#003745] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-[11px] font-semibold text-[#566B72] uppercase">
                  Despacho de Taller
                </span>
                <span className="font-headline text-[16px] font-bold text-[#003745] leading-tight">
                  10 a 15 Días Hábiles
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header & Search / Sort */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0eee8] text-[#003745] font-headline text-[11px] font-semibold tracking-widest uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-[#E58D17] animate-pulse"></span>
                Taller Digital de Madera Maciza & Placas Técnicas
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-[#003745] tracking-tight text-balance leading-tight">
                Catálogo de Muebles a Medida & Personalizables en 3D
              </h1>
              <p className="text-[16px] text-[#40484b] mt-3 max-w-2xl text-balance">
                Selecciona una base de diseño paramétrico, adapta dimensiones al milímetro, elige maderas nobles y calcula tu cotización al instante.
              </p>
            </div>

            {/* Catalog Search & Filter Controls */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative min-w-[280px] sm:min-w-[320px]">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#566B72] text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por mueble, ambiente, ensamble..."
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-white text-[#1b1c18] text-[14px] placeholder:text-[#566B72] focus:outline-none focus:ring-2 focus:ring-[#003745] shadow-xs border border-[#DCD7CA]/60 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#566B72] hover:text-[#1b1c18]"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 px-4 pr-10 rounded-xl bg-white text-[#003745] font-headline text-[13px] font-semibold appearance-none cursor-pointer shadow-xs border border-[#DCD7CA]/60 focus:outline-none w-full"
                >
                  <option value="popular">Más populares</option>
                  <option value="price_asc">Precio: menor a mayor</option>
                  <option value="price_desc">Precio: mayor a menor</option>
                  <option value="days">Tiempo récord de taller</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#566B72] text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Room Navigation Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {categories.map((cat) => {
              const count =
                cat === 'Todos los Modelos'
                  ? CATALOG_MODELS.length
                  : CATALOG_MODELS.filter((m) => m.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-headline text-[13px] font-semibold shadow-xs whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#003745] text-white shadow-sm'
                      : 'bg-[#f5f3ed] text-[#40484b] hover:bg-[#f0eee8] hover:text-[#1b1c18]'
                  }`}
                >
                  {cat} {cat === 'Todos los Modelos' ? `(48)` : count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Toolbar */}
          <div className="mt-4 p-4 bg-white rounded-xl shadow-xs border border-[#DCD7CA]/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              {/* Wood Species Selector */}
              <div className="flex items-center gap-2">
                <span className="font-headline text-[11px] font-semibold text-[#566B72] uppercase tracking-wider">
                  Maderas:
                </span>
                <div className="flex items-center gap-2 ml-1">
                  {woodColors.map((wc) => (
                    <button
                      key={wc.name}
                      onClick={() =>
                        setSelectedWoodFilter(selectedWoodFilter === wc.name ? null : wc.name)
                      }
                      className={`w-6 h-6 rounded-full shadow-inner transition-transform hover:scale-110 cursor-pointer ${
                        selectedWoodFilter === wc.name
                          ? 'ring-2 ring-[#003745] ring-offset-2 scale-110'
                          : ''
                      }`}
                      style={{ backgroundColor: wc.hex }}
                      title={wc.name}
                    />
                  ))}
                  {selectedWoodFilter && (
                    <button
                      onClick={() => setSelectedWoodFilter(null)}
                      className="text-[11px] text-[#566B72] hover:text-[#003745] underline ml-1"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>

              <div className="h-4 w-px bg-[#f0eee8] hidden sm:block"></div>

              {/* Manufacturing Lead Time */}
              <div className="flex items-center gap-2">
                <span className="font-headline text-[11px] font-semibold text-[#566B72] uppercase tracking-wider">
                  Fabricación:
                </span>
                <div className="flex items-center gap-1 bg-[#f5f3ed] p-1 rounded-lg">
                  <button
                    onClick={() => setLeadTimeFilter('all')}
                    className={`px-2.5 py-1 rounded font-headline text-[11px] font-semibold transition-all cursor-pointer ${
                      leadTimeFilter === 'all'
                        ? 'text-[#003745] bg-white shadow-xs'
                        : 'text-[#566B72] hover:text-[#003745]'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setLeadTimeFilter('express')}
                    className={`px-2.5 py-1 rounded font-headline text-[11px] font-semibold transition-all cursor-pointer ${
                      leadTimeFilter === 'express'
                        ? 'text-[#003745] bg-white shadow-xs'
                        : 'text-[#566B72] hover:text-[#003745]'
                    }`}
                  >
                    Express ≤ 10 días
                  </button>
                  <button
                    onClick={() => setLeadTimeFilter('standard')}
                    className={`px-2.5 py-1 rounded font-headline text-[11px] font-semibold transition-all cursor-pointer ${
                      leadTimeFilter === 'standard'
                        ? 'text-[#003745] bg-white shadow-xs'
                        : 'text-[#566B72] hover:text-[#003745]'
                    }`}
                  >
                    Estándar ≤ 15 días
                  </button>
                </div>
              </div>

              <div className="h-4 w-px bg-[#f0eee8] hidden md:block"></div>

              {/* 3D Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={only3D}
                  onChange={(e) => setOnly3D(e.target.checked)}
                  className="w-4 h-4 text-[#003745] accent-[#003745] rounded cursor-pointer"
                />
                <span className="font-headline text-[13px] font-semibold text-[#003745] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-[#E58D17]">
                    3d_rotation
                  </span>
                  Solo con Visor 3D Interactivo
                </span>
              </label>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 font-headline text-[11px] text-[#566B72]">
              <span className="hidden sm:inline">Vista de cuadrícula técnica</span>
              <div className="flex items-center bg-[#f5f3ed] p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-[#003745] shadow-xs' : 'text-[#566B72]'
                  }`}
                  title="Cuadrícula"
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded cursor-pointer ${
                    viewMode === 'list' ? 'bg-white text-[#003745] shadow-xs' : 'text-[#566B72]'
                  }`}
                  title="Lista técnica"
                >
                  <span className="material-symbols-outlined text-[16px]">view_list</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="group flex flex-col bg-white rounded-xl p-4 shadow-sm hover:shadow-xl border border-[#DCD7CA]/50 transition-all duration-300"
            >
              {/* Image Preview Container */}
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#f5f3ed] mb-4">
                <img
                  src={model.image}
                  alt={model.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {model.badge && (
                    <span
                      className={`px-2.5 py-0.5 rounded font-headline text-[11px] font-bold text-white shadow-xs ${
                        model.badgeType === 'bestseller'
                          ? 'bg-[#E58D17]'
                          : model.badgeType === 'high_capacity'
                          ? 'bg-[#003745]'
                          : model.badgeType === 'compact'
                          ? 'bg-[#2D7A4C]'
                          : 'bg-[#0d4f60]'
                      }`}
                    >
                      {model.badge}
                    </span>
                  )}
                  {model.has3D && (
                    <span className="px-2.5 py-0.5 rounded font-headline text-[11px] font-bold bg-[#0d4f60]/90 backdrop-blur-md text-white shadow-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">view_in_ar</span> 3D
                      Vivo
                    </span>
                  )}
                </div>

                {/* 360 quick preview trigger */}
                <button
                  onClick={() => handleSelectModel(model)}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#003745] flex items-center justify-center hover:bg-[#003745] hover:text-white transition-colors shadow-xs cursor-pointer"
                  title="Abrir en Visor 3D"
                >
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                </button>
              </div>

              {/* Title and metadata */}
              <div className="flex flex-col flex-1">
                <h3 className="font-headline text-[17px] font-bold text-[#003745] group-hover:text-[#E58D17] transition-colors leading-snug">
                  {model.name}
                </h3>
                <span className="font-headline text-[11px] text-[#566B72] mb-3">
                  {model.category} • Modelo {model.modelCode}
                </span>

                {/* Technical Specification mini-table */}
                <div className="p-2.5 rounded-lg bg-[#f5f3ed] mb-3 space-y-1.5 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-[#566B72]">Medidas base:</span>
                    <span className="font-headline font-bold text-[#003745]">
                      {model.baseAlto} × {model.baseAncho} × {model.baseProf} cm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#566B72]">Rango paramétrico:</span>
                    <span className="text-[#1b1c18] font-medium">{model.parametricRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#566B72]">Despacho estimado:</span>
                    <span className="text-[#2D7A4C] font-semibold">{model.dispatchDays}</span>
                  </div>
                </div>

                {/* Wood species swatches */}
                <div className="flex items-center justify-between mb-4 pt-1">
                  <span className="font-headline text-[11px] text-[#566B72]">
                    {model.features[0] || 'Maderas configurables'}
                  </span>
                  <div className="flex items-center gap-1">
                    {model.woods.map((woodColor, idx) => (
                      <span
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full shadow-inner inline-block"
                        style={{ backgroundColor: woodColor }}
                      />
                    ))}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="mt-auto pt-2 border-t border-[#f0eee8] flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline text-[11px] text-[#566B72] uppercase font-semibold">
                      Precio Base
                    </span>
                    <div className="text-right">
                      <span className="font-headline text-[18px] font-bold text-[#003745]">
                        ${model.basePrice.toLocaleString('es-CL')}
                      </span>
                      <span className="text-[10px] text-[#566B72] block">CLP + IVA estimado</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectModel(model)}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#683f00] hover:bg-[#E58D17] text-white font-headline text-[13px] font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer hover:shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                    <span>Personalizar en 3D</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if search yields nothing */}
        {filteredModels.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-[#DCD7CA]/60 my-6">
            <span className="material-symbols-outlined text-[48px] text-[#566B72] mb-2">
              search_off
            </span>
            <h3 className="font-headline text-[18px] font-bold text-[#003745]">
              No se encontraron modelos con los filtros seleccionados
            </h3>
            <p className="text-[14px] text-[#566B72] mt-1">
              Prueba cambiando la búsqueda o restableciendo los filtros de madera y fabricación.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todos los Modelos');
                setSelectedWoodFilter(null);
                setLeadTimeFilter('all');
                setOnly3D(false);
              }}
              className="mt-4 px-4 py-2 bg-[#003745] text-white rounded-lg font-headline text-[13px] font-bold cursor-pointer hover:bg-[#0d4f60]"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

        {/* AI Parametric Space Assistant Banner */}
        <div className="mt-12">
          <div className="relative overflow-hidden rounded-2xl bg-[#003745] text-white p-6 sm:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Subtle blueprint decorative vectors */}
            <svg
              className="absolute right-0 bottom-0 pointer-events-none opacity-10 w-96 h-96 text-white"
              fill="none"
              viewBox="0 0 200 200"
            >
              <path
                d="M0 20H200M0 40H200M0 60H200M0 80H200M0 100H200M0 120H200M0 140H200M0 160H200M0 180H200"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <path
                d="M20 0V200M40 0V200M60 0V200M80 0V200M100 0V200M120 0V200M140 0V200M160 0V200M180 0V200"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" />
              <rect height="80" stroke="currentColor" strokeWidth="1" width="80" x="60" y="60" />
            </svg>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d4f60] text-[#89bfd3] font-headline text-[11px] font-semibold mb-3">
                <span className="material-symbols-outlined text-[16px] text-[#E58D17]">
                  auto_awesome
                </span>
                <span>Motor de Dimensionamiento Inteligente</span>
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                ¿No encuentras la medida exacta para tu espacio?
              </h2>
              <p className="text-[15px] sm:text-[16px] text-white/90 mt-2 leading-relaxed">
                Nuestro Asistente IA analiza los metros cuadrados de tu habitación, vigas, enchufes y
                ventanas para sugerirte el modelo paramétrico óptimo listo para enviar a corte.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-[13px] text-white/80">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#E58D17] text-[18px]">
                    check_circle
                  </span>
                  Ajuste milimétrico a tus planos
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#E58D17] text-[18px]">
                    check_circle
                  </span>
                  Optimización de corte sin desperdicio
                </span>
              </div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onNavigate('asistente-ia')}
                className="px-6 py-3.5 rounded-xl bg-[#E58D17] hover:bg-[#ffb963] text-white font-headline text-[15px] font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">psychology</span>
                <span>Consultar con IA de Diseño</span>
              </button>
              <button
                onClick={() => onNavigate('asistente-ia')}
                className="px-4 py-2.5 rounded-xl bg-[#0d4f60] hover:bg-white/10 text-white font-headline text-[13px] font-semibold text-center transition-colors cursor-pointer"
              >
                Subir Plano o Foto en PDF / DWG
              </button>
            </div>
          </div>
        </div>

        {/* Results Count & Technical Pagination */}
        <div className="mt-10 pt-6 border-t border-[#DCD7CA]/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[13px] text-[#566B72]">
            Mostrando <strong className="text-[#003745] font-semibold">{filteredModels.length}</strong>{' '}
            de <strong className="text-[#003745] font-semibold">48</strong> modelos paramétricos configurables
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-lg bg-white text-[#566B72] hover:text-[#003745] flex items-center justify-center shadow-xs border border-[#DCD7CA]/60 disabled:opacity-40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-10 h-10 rounded-lg font-headline text-[13px] font-semibold flex items-center justify-center shadow-xs cursor-pointer ${
                currentPage === 1 ? 'bg-[#003745] text-white' : 'bg-white text-[#1b1c18] border border-[#DCD7CA]/60'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-10 h-10 rounded-lg font-headline text-[13px] font-semibold flex items-center justify-center shadow-xs cursor-pointer ${
                currentPage === 2 ? 'bg-[#003745] text-white' : 'bg-white text-[#1b1c18] border border-[#DCD7CA]/60'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-10 h-10 rounded-lg font-headline text-[13px] font-semibold flex items-center justify-center shadow-xs cursor-pointer ${
                currentPage === 3 ? 'bg-[#003745] text-white' : 'bg-white text-[#1b1c18] border border-[#DCD7CA]/60'
              }`}
            >
              3
            </button>
            <span className="px-1 text-[#566B72] font-headline text-[13px]">...</span>
            <button
              onClick={() => setCurrentPage(6)}
              className="w-10 h-10 rounded-lg bg-white text-[#1b1c18] font-headline text-[13px] font-semibold flex items-center justify-center shadow-xs border border-[#DCD7CA]/60 cursor-pointer hover:bg-[#f0eee8]"
            >
              6
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(6, currentPage + 1))}
              className="w-10 h-10 rounded-lg bg-white text-[#566B72] hover:text-[#003745] flex items-center justify-center shadow-xs border border-[#DCD7CA]/60 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
