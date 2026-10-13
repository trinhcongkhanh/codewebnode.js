"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Bike,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatVND } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTotalItems,
  } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Đang tải thông tin giỏ hàng...
      </div>
    );
  }

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const shippingFee = subtotal >= 1000000 ? 0 : 35000;
  const grandTotal = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5 text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">
          Giỏ Hàng Của Bạn Đang Trống
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          Bạn chưa chọn món phụ tùng nào. Hãy sử dụng bộ lọc Hãng xe — Dòng xe — Đời xe để lựa chọn đúng phụ tùng gắn vừa xe nhé!
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-md shadow-orange-950/20"
          >
            <Bike className="w-4 h-4" />
            <span>Tra Cứu & Mua Phụ Tùng Ngay</span>
          </Link>
          <Link
            href="/"
            className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            Về Trang Chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
            Giỏ Hàng Của Bạn ({totalItems} sản phẩm)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Vui lòng kiểm tra lại số lượng và tương thích trước khi bấm thanh toán.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" /> Xóa sạch giỏ hàng
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart items table/cards */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors line-clamp-2 block leading-snug"
                    >
                      {product.name}
                    </Link>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      SKU: {product.sku}
                    </p>
                    <div className="text-xs font-bold text-slate-700 sm:hidden mt-1">
                      Đơn giá: {formatVND(product.price)}
                    </div>
                  </div>
                </div>

                {/* Right controls: Unit price, Qty, Line total, Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="hidden sm:block text-right">
                    <span className="text-xs font-semibold text-slate-500 block">Đơn giá</span>
                    <span className="text-xs font-bold text-slate-900">
                      {formatVND(product.price)}
                    </span>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-1.5 text-slate-600 hover:text-orange-600 disabled:opacity-40 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stockQuantity}
                      className="p-1.5 text-slate-600 hover:text-orange-600 disabled:opacity-40 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-xs font-semibold text-slate-500 block sm:hidden">Thành tiền</span>
                    <span className="text-sm font-extrabold text-orange-600">
                      {formatVND(product.price * quantity)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Xóa phụ tùng"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Checkout Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
            Tóm Tắt Đơn Hàng
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tổng phụ tùng ({totalItems}):</span>
              <span className="font-semibold text-slate-900">{formatVND(subtotal)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-slate-400" /> Phí vận chuyển ước tính:
              </span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold">Miễn phí (Freeship)</span>
                ) : (
                  formatVND(shippingFee)
                )}
              </span>
            </div>

            {shippingFee > 0 && (
              <p className="text-[11px] text-orange-700 bg-orange-50 p-2 rounded-lg border border-orange-200">
                Mua thêm <strong>{formatVND(1000000 - subtotal)}</strong> để nhận ưu đãi miễn phí giao hàng toàn quốc!
              </p>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
              <span className="text-xl font-black text-orange-600">
                {formatVND(grandTotal)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 text-right">
              (Đã bao gồm thuế GTGT nếu có)
            </p>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-orange-950/20 flex items-center justify-center gap-2"
          >
            <span>Tiến Hành Đặt Hàng & Thanh Toán</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            href="/products"
            className="w-full py-2.5 px-4 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tiếp tục chọn thêm phụ tùng</span>
          </Link>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Được mở hộp kiểm tra phụ tùng trước khi trả tiền
            </p>
            <p className="flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5 text-orange-600" />
              Đổi mới miễn phí trong 7 ngày nếu không gắn vừa xe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
