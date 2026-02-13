export interface Product {
  upc: string;
  name: string;
  segment: number;
  shelf: number;
  position: number;
  facings: number;
  isNew: boolean;
  isMove?: boolean;
  isChange?: boolean;
  srp?: string;
  imageUrl?: string;
}

export interface PlanogramMetadata {
  id: string;
  name: string;
  subtitle: string;
  pogNumber: string;
  liveDate: string;
  sides: number;
  shelves: number;
  totalProducts: number;
  upcRedirects: Record<string, string>;
  products: Product[];
  pdfUrl: string;
}

export type PlanogramId = 'pallet' | 'endcap';

export interface StoreMap {
  [storeNumber: string]: PlanogramId;
}

export enum ViewMode {
  STORE_SELECT = 'STORE_SELECT',
  BROWSE = 'BROWSE',
  SCAN = 'SCAN',
  MANUAL = 'MANUAL',
  PDF = 'PDF'
}
