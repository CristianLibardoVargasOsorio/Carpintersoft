export type Screen = 
  | 'catalogo' 
  | 'personalizador-3d' 
  | 'asistente-ia' 
  | 'mis-pedidos' 
  | 'cotizaciones-guardadas' 
  | 'checkout';

export interface FurnitureModel {
  id: string;
  name: string;
  category: string;
  modelCode: string;
  basePrice: number;
  image: string;
  imageAlt: string;
  badge?: string;
  badgeType?: 'bestseller' | 'high_capacity' | 'compact' | 'standard';
  has3D: boolean;
  baseAlto: number;
  baseAncho: number;
  baseProf: number;
  parametricRange: string;
  dispatchDays: string;
  features: string[];
  woods: string[];
  defaultShelves: number;
}

export interface WoodOption {
  id: string;
  name: string;
  shortName: string;
  colorHex: string;
  surchargePercent: number;
  description: string;
}

export interface CustomizationState {
  model: FurnitureModel;
  alto: number; // in cm
  ancho: number; // in cm
  prof: number; // in cm
  shelves: number;
  wood: WoodOption;
  finish: string;
  hardware: string;
  includeInstallation: boolean;
  notes?: string;
}

export interface QuoteItem {
  id: string;
  model: FurnitureModel;
  alto: number;
  ancho: number;
  prof: number;
  shelves: number;
  wood: WoodOption;
  finish: string;
  hardware: string;
  includeInstallation: boolean;
  baseCost: number;
  materialsCost: number;
  laborCost: number;
  finishCost: number;
  discount: number;
  installationCost: number;
  totalCost: number;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  date: string;
  clientName: string;
  clientRut: string;
  address: string;
  installationTier: 'certified' | 'delivery' | 'pickup';
  slotDate: string;
  slotTime: string;
  paymentMethod: 'transfer' | 'cod' | 'webpay';
  item: QuoteItem;
  total: number;
  downpayment: number;
  status: 'cnc_queued' | 'cutting' | 'assembly' | 'finishing' | 'delivered';
  cncStation: string;
}
