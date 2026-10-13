export type OrderStatus =
  | 'pending'    // Chờ xác nhận
  | 'packing'    // Đang đóng gói
  | 'shipping'   // Đã giao cho đơn vị vận chuyển
  | 'completed'  // Thành công
  | 'cancelled'; // Đã hủy

export type PaymentMethod =
  | 'qr_transfer'  // Chuyển khoản QR ngân hàng
  | 'momo'         // Ví điện tử MoMo
  | 'zalopay'      // Ví điện tử ZaloPay
  | 'cod';         // Thanh toán khi nhận hàng (COD)

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type ShippingCarrier = 'ghn' | 'ghtk' | 'viettel_post';

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  notes?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  reason: string;
  customerNote: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  title: string;
  description: string;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. "ORD-20261013-001"
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  carrier: ShippingCarrier;
  trackingCode?: string;
  timeline: OrderTimelineEvent[];
  returnRequest?: ReturnRequest;
  createdAt: string;
  updatedAt: string;
}
