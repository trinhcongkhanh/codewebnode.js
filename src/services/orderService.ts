/**
 * Order Service Layer
 *
 * Encapsulates all business logic related to orders and their lifecycle.
 */

import { Order, OrderStatus } from "@/types/order";
import { initialOrders } from "@/data/mockData";
import { STORAGE_KEYS, STORE_UPDATE_EVENT, ORDER_STATUS_LABELS } from "@/constants";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyUpdate(): void {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(STORE_UPDATE_EVENT));
  }
}

// ─── CRUD ──────────────────────────────────────────────────────────────────────

export function getStoredOrders(): Order[] {
  if (!isBrowser()) return initialOrders;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
      return initialOrders;
    }
    return JSON.parse(raw) as Order[];
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
    console.error("[orderService] Failed to persist orders:", err);
  }
}

export function getOrderById(id: string): Order | undefined {
  return getStoredOrders().find((o) => o.id === id || o.orderCode === id);
}

export function createOrder(
  newOrder: Omit<Order, "id" | "orderCode" | "createdAt" | "updatedAt">
): Order {
  const orders = getStoredOrders();
  const now = new Date().toISOString();
  const datePart = now.slice(0, 10).replace(/-/g, "");
  const orderCode = `ORD-${datePart}-${String(orders.length + 1).padStart(3, "0")}`;

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

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  reasonOrNote?: string
): void {
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;

  const now = new Date().toISOString();
  order.status = newStatus;
  order.updatedAt = now;
  order.timeline.push({
    status: newStatus,
    timestamp: now,
    title: ORDER_STATUS_LABELS[newStatus] ?? newStatus,
    description:
      reasonOrNote ?? `Trạng thái đơn hàng chuyển thành ${ORDER_STATUS_LABELS[newStatus]}`,
  });

  saveOrders(orders);
}

export function handleReturnRequest(
  orderId: string,
  resolution: {
    status: "approved" | "rejected" | "completed";
    resolutionNote: string;
  }
): void {
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order || !order.returnRequest) return;

  const now = new Date().toISOString();
  order.returnRequest.status = resolution.status;
  order.returnRequest.resolvedAt = now;
  order.returnRequest.resolutionNote = resolution.resolutionNote;
  order.updatedAt = now;

  const resolutionLabel =
    resolution.status === "approved"
      ? "Chấp thuận"
      : resolution.status === "rejected"
      ? "Từ chối"
      : "Đã hoàn tất đổi hàng";

  order.timeline.push({
    status: order.status,
    timestamp: now,
    title: `Xử lý yêu cầu đổi trả: ${resolutionLabel}`,
    description: resolution.resolutionNote,
  });

  saveOrders(orders);
}

// ─── Reactive Subscription ─────────────────────────────────────────────────────

export function subscribeToOrderUpdates(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(STORE_UPDATE_EVENT, callback);
  return () => window.removeEventListener(STORE_UPDATE_EVENT, callback);
}
