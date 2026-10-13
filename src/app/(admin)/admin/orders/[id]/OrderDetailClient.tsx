"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  User,
  MapPin,
  Truck,
  CreditCard,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Package,
  AlertTriangle,
  Send,
} from "lucide-react";
import { Order, OrderStatus } from "@/types/order";
import {
  getOrderById,
  updateOrderStatus,
  handleReturnRequest,
  subscribeToStoreUpdates,
} from "@/services";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatVND, formatDate, getPaymentMethodName, getCarrierName } from "@/lib/utils";

interface OrderDetailClientProps {
  orderId: string;
}

export default function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Return request resolution state
  const [resolutionNote, setResolutionNote] = useState("");

  const loadData = () => {
    const found = getOrderById(orderId);
    setOrder(found || null);
  };

  useEffect(() => {
    loadData();
    setIsMounted(true);
    const unsubscribe = subscribeToStoreUpdates(() => loadData());
    return () => unsubscribe();
  }, [orderId]);

  if (!isMounted) return null;

  if (!order) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">
          Không tìm thấy đơn hàng {orderId}
        </h2>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại danh sách đơn hàng</span>
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus);
  };

  const handleResolveReturn = (status: "approved" | "rejected" | "completed") => {
    handleReturnRequest(order.id, {
      status,
      resolutionNote: resolutionNote.trim() || `Quản trị viên đã ${status === "approved" ? "chấp thuận đổi phụ tùng mới" : status === "rejected" ? "từ chối do không đúng chính sách" : "hoàn tất thủ tục đổi hàng"}.`,
    });
    setResolutionNote("");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Navigation & Status Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                {order.orderCode}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tạo lúc: {formatDate(order.createdAt)} • Vận đơn: <strong className="font-mono text-slate-800">{order.trackingCode}</strong>
            </p>
          </div>
        </div>

        {/* Status Transition Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {order.status === "pending" && (
            <button
              onClick={() => handleUpdateStatus("packing")}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Chuyển Sang: Đang Đóng Gói</span>
            </button>
          )}

          {order.status === "packing" && (
            <button
              onClick={() => handleUpdateStatus("shipping")}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Chuyển Sang: Đã Bàn Giao ĐVVC</span>
            </button>
          )}

          {order.status === "shipping" && (
            <button
              onClick={() => handleUpdateStatus("completed")}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Xác Nhận: Giao Hàng Thành Công</span>
            </button>
          )}

          {order.status !== "cancelled" && order.status !== "completed" && (
            <button
              onClick={() => handleUpdateStatus("cancelled")}
              className="px-3 py-2 border border-slate-300 hover:border-rose-300 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
            >
              Hủy Đơn Hàng
            </button>
          )}
        </div>
      </div>

      {/* Return Request Management Panel (If customer requested return) */}
      {order.returnRequest && (
        <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-purple-700" />
              <h2 className="text-sm font-bold text-purple-950 uppercase tracking-wide">
                Xử Lý Yêu Cầu Đổi Trả Phụ Tùng
              </h2>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              order.returnRequest.status === "pending"
                ? "bg-amber-100 text-amber-800 border-amber-300"
                : order.returnRequest.status === "approved"
                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                : order.returnRequest.status === "rejected"
                ? "bg-rose-100 text-rose-800 border-rose-300"
                : "bg-purple-100 text-purple-800 border-purple-300"
            }`}>
              Trạng thái đổi trả: {
                order.returnRequest.status === "pending"
                  ? "Chờ Duyệt"
                  : order.returnRequest.status === "approved"
                  ? "Đã Chấp Thuận Đổi"
                  : order.returnRequest.status === "rejected"
                  ? "Từ Chối Đổi"
                  : "Hoàn Tất Đổi Hàng"
              }
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-purple-200 text-xs space-y-2">
            <p className="text-slate-500">
              Thời gian yêu cầu: <strong>{formatDate(order.returnRequest.requestedAt)}</strong>
            </p>
            <p className="text-slate-800 font-semibold">
              Lý do đổi trả: <span className="text-purple-950">{order.returnRequest.reason}</span>
            </p>
            <p className="text-slate-600">
              Ghi chú của khách: &quot;{order.returnRequest.customerNote}&quot;
            </p>
            {order.returnRequest.resolutionNote && (
              <p className="text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200">
                Ghi chú giải quyết: <strong>{order.returnRequest.resolutionNote}</strong>
              </p>
            )}
          </div>

          {/* Action buttons for Return Request */}
          {order.returnRequest.status === "pending" && (
            <div className="space-y-3 pt-2">
              <input
                type="text"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Ghi chú hướng xử lý (ví dụ: Đồng ý nhận lại phuộc YSS, gửi mã đổi sang dòng SH...)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-purple-300 bg-white focus:outline-none focus:border-purple-600"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleResolveReturn("approved")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Chấp Thuận Đổi Hàng
                </button>
                <button
                  onClick={() => handleResolveReturn("rejected")}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Từ Chối Yêu Cầu
                </button>
              </div>
            </div>
          )}

          {order.returnRequest.status === "approved" && (
            <button
              onClick={() => handleResolveReturn("completed")}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Xác Nhận Đã Nhận Lại Hàng & Hoàn Tất Đổi Mới
            </button>
          )}
        </div>
      )}

      {/* 2-Columns Layout: Order Items on Left, Customer Info on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items list & Calculations (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Danh Sách Phụ Tùng Đặt Mua</span>
            <span className="text-xs font-normal text-slate-500">{order.items.length} mặt hàng</span>
          </h2>

          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase">
                      {item.brand}
                    </span>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      SKU: {item.sku} • Đơn giá: {formatVND(item.price)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-500 block">x{item.quantity}</span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {formatVND(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính phụ tùng:</span>
              <span className="font-semibold text-slate-900">{formatVND(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển ({getCarrierName(order.carrier)}):</span>
              <span className="font-semibold text-slate-900">
                {order.shippingFee === 0 ? "Miễn phí" : formatVND(order.shippingFee)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold">
              <span className="text-slate-900">Tổng giá trị đơn hàng:</span>
              <span className="text-xl font-black text-orange-600">{formatVND(order.total)}</span>
            </div>
          </div>

          {/* Timeline of Order Status Progression */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-600" />
              Lịch Sử Tiến Trình Đơn Hàng
            </h3>

            <div className="space-y-4 pl-4 border-l-2 border-slate-200 relative">
              {order.timeline.map((evt, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-orange-600 ring-4 ring-white" />
                  <p className="text-xs font-bold text-slate-900">{evt.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{evt.description}</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                    {formatDate(evt.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Customer & Delivery Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer info card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-slate-500" /> Thông Tin Người Nhận
            </h2>
            <div className="text-xs space-y-1.5">
              <p className="font-bold text-slate-900 text-sm">{order.customer.fullName}</p>
              <p className="text-slate-600 font-mono">Điện thoại: <strong>{order.customer.phone}</strong></p>
              {order.customer.email && (
                <p className="text-slate-600">Email: {order.customer.email}</p>
              )}
            </div>
          </div>

          {/* Shipping Address card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-slate-500" /> Địa Chỉ Giao Hàng
            </h2>
            <div className="text-xs space-y-1 text-slate-700 leading-relaxed">
              <p className="font-medium">{order.customer.address}</p>
              <p className="text-slate-500">
                {order.customer.ward}, {order.customer.district}, {order.customer.city}
              </p>
              {order.customer.notes && (
                <p className="mt-2 text-[11px] bg-slate-50 p-2 rounded-lg text-slate-600 border border-slate-100">
                  Ghi chú: &quot;{order.customer.notes}&quot;
                </p>
              )}
            </div>
          </div>

          {/* Payment & Carrier Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-slate-500" /> Vận Chuyển & Thanh Toán
            </h2>
            <div className="text-xs space-y-2">
              <div>
                <span className="text-slate-400 block text-[11px]">Đơn vị vận chuyển:</span>
                <span className="font-bold text-slate-900">{getCarrierName(order.carrier)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Hình thức thanh toán:</span>
                <span className="font-bold text-slate-900">{getPaymentMethodName(order.paymentMethod)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Trạng thái tiền:</span>
                <span className={`font-bold uppercase text-[11px] ${order.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
                  {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán (Thu COD)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
