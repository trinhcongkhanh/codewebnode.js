/**
 * Product Service Layer
 *
 * Encapsulates all business logic related to products and inventory.
 * Keeps pages and components free of data-fetching / mutation logic.
 */

import {
  Product,
  VehicleManufacturer,
  VehicleModel,
  ProductCategory,
  ProductFitment,
} from "@/types/product";
import { InventoryItem, InventoryUpdatePayload } from "@/types/inventory";
import {
  initialManufacturers,
  initialModels,
  initialCategories,
  initialProducts,
} from "@/data/mockData";
import { STORAGE_KEYS, STORE_UPDATE_EVENT } from "@/constants";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyUpdate(): void {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(STORE_UPDATE_EVENT));
  }
}

// ─── Products ──────────────────────────────────────────────────────────────────

export function getStoredProducts(): Product[] {
  if (!isBrowser()) return initialProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
      return initialProducts;
    }
    return JSON.parse(raw) as Product[];
  } catch {
    return initialProducts;
  }
}

export function saveProducts(products: Product[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    notifyUpdate();
  } catch (err) {
    console.error("[productService] Failed to persist products:", err);
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  return getStoredProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getStoredProducts().find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return getStoredProducts().filter((p) => p.isFeatured);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return getStoredProducts().filter((p) => p.categoryId === categoryId);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return getStoredProducts();
  return getStoredProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q)
  );
}

export function upsertProduct(product: Product): void {
  const products = getStoredProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    products[idx] = product;
  } else {
    products.unshift(product);
  }
  saveProducts(products);
}

export function deleteProduct(productId: string): void {
  saveProducts(getStoredProducts().filter((p) => p.id !== productId));
}

// ─── Fitments ──────────────────────────────────────────────────────────────────

export function addProductFitment(
  productId: string,
  fitment: Omit<ProductFitment, "id" | "productId">
): void {
  const products = getStoredProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const newFitment: ProductFitment = {
    ...fitment,
    id: `fit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    productId,
  };
  product.fitments.push(newFitment);
  saveProducts(products);
}

export function removeProductFitment(productId: string, fitmentId: string): void {
  const products = getStoredProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  product.fitments = product.fitments.filter((f) => f.id !== fitmentId);
  saveProducts(products);
}

// ─── Inventory ─────────────────────────────────────────────────────────────────

export function getStoredInventory(): InventoryItem[] {
  return getStoredProducts().map((p) => {
    let status: InventoryItem["status"] = "in_stock";
    if (p.stockQuantity <= 0) status = "out_of_stock";
    else if (p.stockQuantity <= p.lowStockThreshold) status = "low_stock";

    return {
      id: `inv-${p.id}`,
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      brand: p.brand,
      categoryName: p.categoryName,
      quantity: p.stockQuantity,
      lowStockThreshold: p.lowStockThreshold,
      shelf: p.shelf ?? "Kệ A1",
      compartment: p.compartment ?? "Ngăn 1",
      warehouseLocation: p.warehouseLocation ?? `${p.shelf} — ${p.compartment}`,
      status,
      lastRestockedAt: p.createdAt,
    };
  });
}

export function updateInventory(payload: InventoryUpdatePayload): void {
  const products = getStoredProducts();
  const product = products.find((p) => p.id === payload.productId);
  if (!product) return;

  product.stockQuantity = payload.quantity;
  product.inStock = payload.quantity > 0;
  product.shelf = payload.shelf;
  product.compartment = payload.compartment;
  product.warehouseLocation = `${payload.shelf} — ${payload.compartment}`;
  product.lowStockThreshold = payload.lowStockThreshold;

  saveProducts(products);
}

// ─── Vehicle & Category Lookups ────────────────────────────────────────────────

export function getManufacturers(): VehicleManufacturer[] {
  return initialManufacturers;
}

export function getModels(manufacturerId?: string): VehicleModel[] {
  if (!manufacturerId) return initialModels;
  return initialModels.filter((m) => m.manufacturerId === manufacturerId);
}

export function getCategories(): ProductCategory[] {
  return initialCategories;
}

// ─── Reactive Subscription ─────────────────────────────────────────────────────

export function subscribeToProductUpdates(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(STORE_UPDATE_EVENT, callback);
  return () => window.removeEventListener(STORE_UPDATE_EVENT, callback);
}

// Backward compatibility alias
export const subscribeToStoreUpdates = subscribeToProductUpdates;

