/**
 * Application-wide constants
 * Centralized location for all magic strings, config values, and enumerations.
 */

// ─── Site Metadata ─────────────────────────────────────────────────────────────
export const SITE_NAME = "MotoParts Pro";
export const SITE_DESCRIPTION =
  "Hệ thống cung cấp phụ tùng xe máy chính hãng tại Việt Nam. Tra cứu tương thích chính xác theo Hãng xe, Dòng xe và Đời xe.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ─── Pagination ────────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

// ─── Local Storage Keys ────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  PRODUCTS: "motor_store_products_v1",
  ORDERS: "motor_store_orders_v1",
  CATEGORIES: "motor_store_categories_v1",
  CART: "motor_cart_storage_v1",
  FITMENT: "motor_fitment_storage_v1",
} as const;

// ─── Custom Event Names ────────────────────────────────────────────────────────
export const STORE_UPDATE_EVENT = "motor_store_data_updated";

// ─── Order Status Labels ───────────────────────────────────────────────────────
export const ORDER_STATUS_LABELS = {
  pending: "Chờ xác nhận",
  packing: "Đang đóng gói",
  shipping: "Đã giao cho ĐVVC",
  completed: "Thành công",
  cancelled: "Đã hủy",
} as const;

// ─── Payment Method Labels ─────────────────────────────────────────────────────
export const PAYMENT_METHOD_LABELS = {
  qr_transfer: "Chuyển khoản QR ngân hàng",
  momo: "Ví điện tử MoMo",
  zalopay: "Ví điện tử ZaloPay",
  cod: "Thanh toán khi nhận hàng (COD)",
} as const;

// ─── Carrier Labels ────────────────────────────────────────────────────────────
export const CARRIER_LABELS = {
  ghn: "Giao Hàng Nhanh (GHN)",
  ghtk: "Giao Hàng Tiết Kiệm (GHTK)",
  viettel_post: "Viettel Post",
} as const;

// ─── Vehicle Type Labels ───────────────────────────────────────────────────────
export const VEHICLE_TYPE_LABELS = {
  tay_ga: "Xe Tay Ga",
  xe_so: "Xe Số",
  tay_con: "Xe Côn Tay",
  phan_khoi_lon: "Xe Phân Khối Lớn",
} as const;

// ─── Routes ────────────────────────────────────────────────────────────────────
export const ROUTES = {
  home: "/",
  products: "/products",
  cart: "/cart",
  checkout: "/checkout",
  admin: {
    dashboard: "/admin",
    products: "/admin/products",
    orders: "/admin/orders",
    inventory: "/admin/inventory",
  },
} as const;


// ─── Low Stock Warning Threshold (fallback) ────────────────────────────────────
export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

// ─── Inventory Status Labels ───────────────────────────────────────────────────
export const INVENTORY_STATUS_LABELS = {
  in_stock: "Còn hàng",
  low_stock: "Sắp hết hàng",
  out_of_stock: "Hết hàng",
} as const;
