"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  PackageCheck,
  RotateCcw,
  Clock,
  Eye,
} from "lucide-react";
import { Order, OrderStatus } from "@/types/order";
import {
  getStoredOrders,
  updateOrderStatus,
  subscribeToStoreUpdates,
} from "@/data/storeManager";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatVND, formatDate, getPaymentMethodName, getCarrierName } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isMounted, setIsMounted] = useState(false);

  const loadData = () => {
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    loadData();
    setIsMounted(true);
    const unsubscribe = subscribeToStoreUpdates(() => loadData());
    return () => unsubscribe();
  }, []);

  if (!isMounted) return null;

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCode = o.orderCode.toLowerCase().includes(q);
      const matchCustomer = o.customer.fullName.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.toLowerCase().includes(q);
      if (!matchCode && !matchCustomer && !matchPhone) return false;
    }
    return true;
  });

  const handleNextStatus = (order: Order) => {
    let nextStatus: OrderStatus | null = null;
    if (order.status === "pending") nextStatus = "packing";
    else if (order.status === "packing") nextStatus = "shipping";
    else if (order.status === "shipping") nextStatus = "completed";

    if (nextStatus) {
      updateOrderStatus(order.id, nextStatus);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, "cancelled", "Hủy theo yêu cầu quản trị viên");
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
            Quản Lý Đơn Hàng & Xử Lý Giao Nhận
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi quy trình xử lý đơn hàng từ lúc đặt mua đến khi hoàn tất giao hàng và đổi trả phụ tùng.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã đơn, họ tên, số điện thoại..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Trạng thái đơn:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-orange-500"
          >
            <option value="all">Tất cả đơn ({orders.length})</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="packing">Đang đóng gói</option>
            <option value="shipping">Đã giao vận chuyển</option>
            <option value="completed">Thành công</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Mã Đơn & Ngày Đặt</th>
                <th className="py-3 px-4">Khách Hàng & Liên Hệ</th>
                <th className="py-3 px-4">Phụ Tùng Đặt Mua</th>
                <th className="py-3 px-4">Thanh Toán</th>
                <th className="py-3 px-4">Tổng Tiền</th>
                <th className="py-3 px-4">Trạng Thái Đơn</th>
                <th className="py-3 px-4 text-right">Chuyển Bước / Xem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Không có đơn hàng nào khớp với tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono font-bold text-slate-900 hover:text-orange-600 block text-xs"
                      >
                        {order.orderCode}
                      </Link>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{order.customer.fullName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{order.customer.phone}</span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                        {order.customer.city}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {order.items.length} mặt hàng
                      </span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[200px] block">
                        {order.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 block">
                        {getPaymentMethodName(order.paymentMethod)}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          order.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {order.paymentStatus === "paid" ? "Đã Thanh Toán" : "Chờ Thu Tiền (COD)"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-orange-600 text-sm">
                      {formatVND(order.total)}
                    </td>

                    <td className="py-3.5 px-4">
                      <OrderStatusBadge status={order.status} />
                      {order.returnRequest && (
                        <span className="block mt-1 text-[10px] text-purple-700 bg-purple-50 font-bold px-1.5 py-0.5 rounded border border-purple-200">
                          Có yêu cầu đổi trả
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Status Progression Button */}
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleNextStatus(order)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                          >
                            Duyệt & Đóng Gói
                          </button>
                        )}
                        {order.status === "packing" && (
                          <button
                            onClick={() => handleNextStatus(order)}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                          >
                            Giao Cho ĐVVC
                          </button>
                        )}
                        {order.status === "shipping" && (
                          <button
                            onClick={() => handleNextStatus(order)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                          >
                            Giao Thành Công
                          </button>
                        )}

                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Xem chi tiết đơn"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
