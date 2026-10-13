import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus, PaymentMethod, ShippingCarrier } from "@/types/order";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Chờ xác nhận";
    case "packing":
      return "Đang đóng gói";
    case "shipping":
      return "Đã giao cho ĐVVC";
    case "completed":
      return "Thành công";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
}

export function getOrderStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "packing":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "shipping":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "completed":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "cancelled":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
  }
}

export function getPaymentMethodName(method: PaymentMethod): string {
  switch (method) {
    case "qr_transfer":
      return "Chuyển khoản QR ngân hàng";
    case "momo":
      return "Ví điện tử MoMo";
    case "zalopay":
      return "Ví điện tử ZaloPay";
    case "cod":
      return "Thanh toán khi nhận hàng (COD)";
    default:
      return method;
  }
}

export function getCarrierName(carrier: ShippingCarrier): string {
  switch (carrier) {
    case "ghn":
      return "Giao Hàng Nhanh (GHN)";
    case "ghtk":
      return "Giao Hàng Tiết Kiệm (GHTK)";
    case "viettel_post":
      return "Viettel Post";
    default:
      return carrier;
  }
}
