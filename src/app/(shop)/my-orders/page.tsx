"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Bike,
  PackageSearch,
  ExternalLink,
} from "lucide-react";
import { getStoredOrders, getStoredProducts } from "@/services";
import { Order, OrderStatus } from "@/types/order";
import { formatVND, formatDate } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    setOrders(getStoredOrders());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Đang tải lịch sử đơn hàng...
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "all") return true;
    return o.status === activeTab;
  });

  const handleReorder = (order: Order) => {
    const allProducts = getStoredProducts();
    let count = 0;

    order.items.forEach((item) => {
      const foundProduct = allProducts.find((p) => p.id === item.productId);
      if (foundProduct && foundProduct.inStock) {
        addItem(foundProduct, item.quantity);
        count++;
      }
    });

    if (count > 0) {
      addToast(`Đã thêm ${count} món phụ tùng từ đơn ${order.orderCode} vào giỏ!`, "success");
      openCart();
    } else {
      addToast("Các phụ tùng trong đơn này hiện tạm hết hàng.", "error");
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return { label: "Chờ xác nhận", bg: "bg-amber-50 text-amber-700 border-amber-200" };
      case "packing":
        return { label: "Đang đóng gói", bg: "bg-blue-50 text-blue-700 border-blue-200" };
      case "shipping":
        return { label: "Đang giao hàng", bg: "bg-purple-50 text-purple-700 border-purple-200" };
      case "completed":
        return { label: "Hoàn tất", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "cancelled":
        return { label: "Đã hủy", bg: "bg-rose-50 text-rose-700 border-rose-200" };
      default:
        return { label: status, bg: "bg-slate-50 text-slate-700 border-slate-200" };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-orange-600/10 text-orange-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Đơn Hàng Của Tôi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quản lý và tra cứu tiến độ tất cả các đơn hàng phụ tùng đã đặt.
          </p>
        </div>

        <Link
          href="/track-order"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors self-start sm:self-auto"
        >
          <PackageSearch className="w-4 h-4 text-orange-400" />
          <span>Tra Cứu Nhanh Bằng Mã</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: "all", label: "Tất Cả Đơn" },
          { id: "pending", label: "Chờ Xác Nhận" },
          { id: "packing", label: "Đang Đóng Gói" },
          { id: "shipping", label: "Đang Giao Hàng" },
          { id: "completed", label: "Đã Hoàn Tất" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Không Có Đơn Hàng Nào Trong Mục Này
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Bạn chưa có đơn phụ tùng nào thuộc trạng thái này. Khám phá kho phụ tùng để đặt hàng ngay!
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              <Bike className="w-4 h-4" />
              <span>Khám Phá Phụ Tùng Ngay</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition-all"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-slate-500">Mã đơn:</span>
                    <strong className="font-mono font-black text-slate-900 text-sm">
                      {order.orderCode}
                    </strong>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{formatDate(order.createdAt)}</span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border self-start sm:self-auto ${badge.bg}`}
                  >
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Items List */}
                <div className="p-4 sm:p-6 divide-y divide-slate-100 space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400"}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            SKU: {item.sku} • SL: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <span className="font-bold text-slate-900 shrink-0">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="p-4 sm:p-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs">
                    <span className="text-slate-500">Tổng thanh toán: </span>
                    <strong className="text-orange-600 font-black text-base">
                      {formatVND(order.total)}
                    </strong>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Mua Lại Đơn Này</span>
                    </button>

                    <Link
                      href={`/track-order?code=${order.orderCode}`}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Xem Lộ Trình</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
