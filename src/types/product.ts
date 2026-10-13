export interface VehicleManufacturer {
  id: string;
  name: string;
  country: string;
  logoUrl?: string;
}

export interface VehicleModel {
  id: string;
  manufacturerId: string;
  name: string;
  type: 'tay_ga' | 'xe_so' | 'tay_con' | 'phan_khoi_lon';
  yearRange: {
    from: number;
    to: number;
  };
}

export interface VehicleYear {
  id: string;
  modelId: string;
  year: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName?: string;
}

export interface ProductFitment {
  id: string;
  productId: string;
  manufacturerId: string;
  manufacturerName: string;
  modelId: string;
  modelName: string;
  yearFrom: number;
  yearTo: number;
  notes?: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  technicalSpecs: Record<string, string>;
  inStock: boolean;
  stockQuantity: number;
  warehouseLocation: string; // e.g. "Kệ A3 — Ngăn số 2"
  shelf: string;
  compartment: string;
  lowStockThreshold: number;
  weightGrams: number;
  fitments: ProductFitment[];
  relatedProductIds?: string[];
  isFeatured?: boolean;
  createdAt: string;
}

export interface FitmentFilterState {
  manufacturerId: string | null;
  modelId: string | null;
  year: number | null;
}
