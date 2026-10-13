export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  brand: string;
  categoryName: string;
  quantity: number;
  lowStockThreshold: number;
  shelf: string; // e.g. "Kệ A3"
  compartment: string; // e.g. "Ngăn số 2"
  warehouseLocation: string; // "Kệ A3 — Ngăn số 2"
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastRestockedAt: string;
}

export interface InventoryUpdatePayload {
  productId: string;
  quantity: number;
  shelf: string;
  compartment: string;
  lowStockThreshold: number;
}
