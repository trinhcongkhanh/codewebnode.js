import { Product, VehicleManufacturer, VehicleModel, ProductCategory, ProductFitment } from "@/types/product";
import { Order, OrderStatus } from "@/types/order";
import { InventoryItem, InventoryUpdatePayload } from "@/types/inventory";
import {
  initialManufacturers,
  initialModels,
  initialCategories,
  initialProducts,
  initialOrders,
} from "./mockData";

const STORAGE_KEYS = {
  PRODUCTS: "motor_store_products_v1",
  ORDERS: "motor_store_orders_v1",
  MODELS: "motor_store_models_v1",
  CATEGORIES: "motor_store_categories_v1",
};

const UPDATE_EVENT = "motor_store_data_updated";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyUpdate() {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }
}

// ---------------- PRODUCTS ----------------

export function getStoredProducts(): Product[] {
  if (!isBrowser()) return initialProducts;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
      return initialProducts;
    }
    return JSON.parse(data);
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
    console.error("Failed to save products to localStorage", err);
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getStoredProducts();
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  const products = getStoredProducts();
  return products.find((p) => p.id === id);
}

export function upsertProduct(product: Product): void {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.unshift(product);
  }
  saveProducts(products);
}

export function deleteProduct(productId: string): void {
  const products = getStoredProducts();
  const filtered = products.filter((p) => p.id !== productId);
  saveProducts(filtered);
}

// ---------------- FITMENT MANAGEMENT ----------------

export function addProductFitment(productId: string, fitment: Omit<ProductFitment, "id" | "productId">): void {
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

// ---------------- INVENTORY ----------------

export function getStoredInventory(): InventoryItem[] {
  const products = getStoredProducts();
  return products.map((p) => {
    let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
    if (p.stockQuantity <= 0) {
      status = 'out_of_stock';
    } else if (p.stockQuantity <= p.lowStockThreshold) {
      status = 'low_stock';
    }

    return {
      id: `inv-${p.id}`,
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      brand: p.brand,
      categoryName: p.categoryName,
      quantity: p.stockQuantity,
      lowStockThreshold: p.lowStockThreshold,
      shelf: p.shelf || "Kệ A1",
      compartment: p.compartment || "Ngăn 1",
      warehouseLocation: p.warehouseLocation || `${p.shelf || "Kệ A1"} — ${p.compartment || "Ngăn 1"}`,
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

// ---------------- ORDERS ----------------

export function getStoredOrders(): Order[] {
  if (!isBrowser()) return initialOrders;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
      return initialOrders;
    }
    return JSON.parse(data);
  } catch {
    return initialOrders;
  }
}

export function saveOrders(orders: Order[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    notifyUpdate();
  } catch (err) {
    console.error("Failed to save orders to localStorage", err);
  }
}

export function getOrderById(id: string): Order | undefined {
  const orders = getStoredOrders();
  return orders.find((o) => o.id === id || o.orderCode === id);
}

export function createOrder(newOrder: Omit<Order, "id" | "orderCode" | "createdAt" | "updatedAt">): Order {
  const orders = getStoredOrders();
  const now = new Date().toISOString();
  const orderCode = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(orders.length + 1).padStart(3, "0")}`;
  const fullOrder: Order = {
    ...newOrder,
    id: `ord-${Date.now()}`,
    orderCode,
    createdAt: now,
    updatedAt: now,
  };

  orders.unshift(fullOrder);
  saveOrders(orders);
  return fullOrder;
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus, reasonOrNote?: string): void {
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;

  const now = new Date().toISOString();
  order.status = newStatus;
  order.updatedAt = now;

  const statusTitles: Record<OrderStatus, string> = {
    pending: "Chờ xác nhận",
    packing: "Đang đóng gói hàng tại kho",
    shipping: "Đã bàn giao cho đơn vị vận chuyển",
    completed: "Giao hàng thành công",
    cancelled: "Đơn hàng đã hủy",
  };

  order.timeline.push({
    status: newStatus,
    timestamp: now,
    title: statusTitles[newStatus] || newStatus,
    description: reasonOrNote || `Trạng thái đơn hàng chuyển thành ${statusTitles[newStatus]}`,
  });

  saveOrders(orders);
}

export function handleReturnRequest(
  orderId: string,
  resolution: { status: 'approved' | 'rejected' | 'completed'; resolutionNote: string }
): void {
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order || !order.returnRequest) return;

  const now = new Date().toISOString();
  order.returnRequest.status = resolution.status;
  order.returnRequest.resolvedAt = now;
  order.returnRequest.resolutionNote = resolution.resolutionNote;
  order.updatedAt = now;

  order.timeline.push({
    status: order.status,
    timestamp: now,
    title: `Xử lý yêu cầu đổi trả: ${resolution.status === 'approved' ? 'Chấp thuận' : resolution.status === 'rejected' ? 'Từ chối' : 'Đã hoàn tất đổi hàng'}`,
    description: resolution.resolutionNote,
  });

  saveOrders(orders);
}

// ---------------- VEHICLES & CATEGORIES ----------------

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

export function subscribeToStoreUpdates(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(UPDATE_EVENT, callback);
  return () => {
    window.removeEventListener(UPDATE_EVENT, callback);
  };
}
