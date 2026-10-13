"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  PackageSearch,
  Search,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  User,
  CreditCard,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { getStoredOrders } from "@/services";
import { Order, OrderStatus } from "@/types/order";
import { formatVND, formatDate } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { addToast } = useToastStore();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("code") || "");
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setSearchTerm(code);
      handleSearch(code);
    }
  }, [searchParams]);

  const handleSearch = (termToSearch?: string) => {
    const term = (termToSearch || searchTerm).trim().toLowerCase();
    if (!term) return;

    setHasSearched(true);
    const allOrders = getStoredOrders();
    const found = allOrders.find(
      (o) =>
        o.orderCode.toLowerCase().includes(term) ||
        o.id.toLowerCase().includes(term) ||
        (o.customer?.phone || "").replace(/\s+/g, "").includes(term)
    );

    setSearchedOrder(found || null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast("Đã sao chép mã đơn hàng!", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return {
          label: "Chờ xác nhận",
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock,
        };
      case "packing":
        return {
          label: "Đang đóng gói hàng",
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Package,
        };
      case "shipping":
        return {
          label: "Đang giao hàng",
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          icon: Truck,
        };
      case "completed":
        return {
          label: "Giao thành công",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle2,
        };
      case "cancelled":
        return {
          label: "Đã hủy đơn",
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          icon: XCircle,
        };
      default:
        return {
          label: status,
          bg: "bg-slate-50 text-slate-700 border-slate-200",
          icon: Clock,
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/20 text-orange-600 flex items-center justify-center mx-auto mb-3">
          <PackageSearch className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Tra Cứu Tiến Độ Đơn Hàng
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Nhập mã đơn hàng (VD: <strong className="text-slate-800">ORD-20261013-001</strong>) hoặc số điện thoại đặt hàng để kiểm tra lộ trình vận chuyển theo thời gian thực.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập mã đơn hàng hoặc số điện thoại..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Tra Cứu Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Suggestion tags */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Gợi ý mẫu:</span>
          {["ORD-20261013-001", "ORD-20261013-002", "0909123456"].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setSearchTerm(code);
                handleSearch(code);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 font-medium transition-colors text-[11px]"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Result Section */}
      {searchedOrder && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Order Header Summary */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Mã đơn hàng:</span>
                  <span className="text-base font-mono font-black text-orange-400">
                    {searchedOrder.orderCode}
                  </span>
                  <button
                    onClick={() => handleCopy(searchedOrder.orderCode)}
                    className="text-slate-400 hover:text-white p-1"
                    title="Sao chép mã"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ngày đặt: {formatDate(searchedOrder.createdAt)}
                </p>
              </div>

              <div>
                {(() => {
                  const badge = getStatusBadge(searchedOrder.status);
                  const Icon = badge.icon;
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${badge.bg}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{badge.label}</span>
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Tracking Quick Facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <span className="text-slate-400 block">Đơn vị vận chuyển:</span>
                <span className="font-bold text-white uppercase mt-0.5 block">
                  {searchedOrder.carrier || "GHN Express"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Mã vận đơn (Tracking):</span>
                <span className="font-mono font-bold text-white mt-0.5 block">
                  {searchedOrder.trackingCode || "Chờ tạo mã"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Thanh toán:</span>
                <span className="font-bold text-white mt-0.5 block">
                  {searchedOrder.paymentMethod === "qr_transfer"
                    ? "Chuyển khoản VietQR"
                    : searchedOrder.paymentMethod === "cod"
                    ? "COD nhận hàng"
                    : "Ví điện tử"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Tổng tiền:</span>
                <span className="font-black text-orange-400 text-sm mt-0.5 block">
                  {formatVND(searchedOrder.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline and Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Timeline */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                Lịch Sử Tiến Độ Giao Hàng
              </h3>

              <div className="space-y-4 pt-2">
                {searchedOrder.timeline && searchedOrder.timeline.length > 0 ? (
                  searchedOrder.timeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative pb-4 last:pb-0">
                      {idx < searchedOrder.timeline.length - 1 && (
                        <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-slate-200" />
                      )}
                      <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-600 shrink-0 font-bold text-xs z-10">
                        ✓
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                          <span className="text-[11px] text-slate-400">
                            {formatDate(item.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Đơn hàng đang chờ xử lý bước đầu tiên.</p>
                )}
              </div>
            </div>

            {/* Recipient & Package Items */}
            <div className="lg:col-span-5 space-y-6">
              {/* Recipient Info */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-600" />
                  Thông Tin Người Nhận
                </h3>
                <div className="space-y-1.5 text-slate-600">
                  <p className="font-bold text-slate-900">{searchedOrder.customer?.fullName || "Khách hàng"}</p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{searchedOrder.customer?.phone}</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>
                      {searchedOrder.customer?.address}, {searchedOrder.customer?.ward},{" "}
                      {searchedOrder.customer?.district}, {searchedOrder.customer?.city}
                    </span>
                  </p>
                </div>
              </div>

              {/* Items in Package */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-600" />
                  Kiện Hàng ({searchedOrder.items.length} món)
                </h3>
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto space-y-2 pt-1">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="pt-2 flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                        <span className="text-[11px] text-slate-400">
                          SL: {item.quantity} x {formatVND(item.price)}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Result State */}
      {hasSearched && !searchedOrder && (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <PackageSearch className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Không Tìm Thấy Đơn Hàng Phù Hợp
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Vui lòng kiểm tra lại mã đơn hàng hoặc số điện thoại đã nhập. Bạn cũng có thể liên hệ tổng đài <strong>1900 8888</strong> để được kiểm tra trực tiếp.
          </p>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
          Đang tải trang tra cứu đơn...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
