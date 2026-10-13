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
  Ticket,
  Check,
  Sparkles,
} from "lucide-react";
import { useCartStore, AVAILABLE_COUPONS } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { formatVND } from "@/lib/utils";
import { initialProducts } from "@/data/mockData";
import { ProductCard } from "@/components/common/ProductCard";

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const { addToast } = useToastStore();

  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTotalItems,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
    getGrandTotal,
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
  const discountAmount = getDiscountAmount();
  const freeShippingThreshold = 1000000;
  const isFreeShip = subtotal >= freeShippingThreshold || appliedCoupon?.code === "FREESHIP";
  const shippingFee = isFreeShip ? 0 : 35000;
  const grandTotal = getGrandTotal(shippingFee);

  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      addToast(res.message, "success");
      setCouponCode("");
    } else {
      addToast(res.message, "error");
    }
  };

  const handleQuickApply = (code: string) => {
    const res = applyCoupon(code);
    if (res.success) {
      addToast(res.message, "success");
    } else {
      addToast(res.message, "error");
    }
  };

  // Cross sell suggestions (items not in cart)
  const crossSellProducts = initialProducts
    .filter((p) => !items.some((item) => item.product.id === p.id))
    .slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-5 text-orange-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Giỏ Hàng Của Bạn Đang Trống
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          Bạn chưa chọn món phụ tùng nào. Hãy sử dụng bộ lọc Hãng xe — Dòng xe — Đời xe để lựa chọn đúng phụ tùng gắn vừa zin nhé!
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-orange-950/20"
          >
            <Bike className="w-4 h-4" />
            <span>Tra Cứu & Mua Phụ Tùng Ngay</span>
          </Link>
          <Link
            href="/"
            className="px-5 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
          >
            Về Trang Chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tiếp tục mua thêm phụ tùng</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Giỏ Hàng ({totalItems} sản phẩm)
          </h1>
          <button
            onClick={() => {
              clearCart();
              addToast("Đã xóa tất cả sản phẩm khỏi giỏ hàng", "info");
            }}
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa tất cả</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items and Freeship Ticker */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Notification Box */}
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-600" />
                {isFreeShip ? (
                  <strong className="text-emerald-700">
                    Đã đủ điều kiện miễn phí vận chuyển toàn quốc!
                  </strong>
                ) : (
                  <span>
                    Mua thêm{" "}
                    <strong className="text-orange-600">
                      {formatVND(freeShippingThreshold - subtotal)}
                    </strong>{" "}
                    để được Miễn phí giao hàng (Freeship)
                  </span>
                )}
              </span>
              <span className="font-bold text-orange-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-orange-200/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Table / Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                      {product.brand}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="block text-xs sm:text-sm font-bold text-slate-900 hover:text-orange-600 line-clamp-2 transition-colors mt-0.5 leading-snug"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-slate-400 mt-1">
                      SKU: <span className="font-mono">{product.sku}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity control */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-2.5 py-1.5 text-slate-600 hover:text-orange-600 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-2.5 py-1.5 text-slate-600 hover:text-orange-600 transition-colors"
                      disabled={quantity >= product.stockQuantity}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total price for line */}
                  <div className="text-right">
                    <div className="text-sm font-black text-orange-600">
                      {formatVND(product.price * quantity)}
                    </div>
                    {quantity > 1 && (
                      <div className="text-[10px] text-slate-400">
                        {formatVND(product.price)} / món
                      </div>
                    )}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      removeItem(product.id);
                      addToast(`Đã xóa "${product.name}" khỏi giỏ hàng`, "info");
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Coupon & Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-orange-600" />
              <span>Mã Giảm Giá & Voucher</span>
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs">
                <div>
                  <span className="font-bold text-orange-900">
                    Đã áp dụng: {appliedCoupon.code}
                  </span>
                  <p className="text-[11px] text-orange-700 mt-0.5">
                    {appliedCoupon.description} (-{formatVND(discountAmount)})
                  </p>
                </div>
                <button
                  onClick={() => {
                    removeCoupon();
                    addToast("Đã hủy áp dụng mã", "info");
                  }}
                  className="text-rose-600 hover:text-rose-700 font-bold text-xs"
                >
                  Gỡ
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã ưu đãi..."
                  className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase font-semibold"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Áp Dụng
                </button>
              </form>
            )}

            {/* Quick Suggestions */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[11px] text-slate-400 block font-medium">
                Mã giảm giá có sẵn:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_COUPONS.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleQuickApply(c.code)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-[11px] font-mono font-bold transition-colors"
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
              Tóm Tắt Đơn Hàng
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Tạm tính ({totalItems} món):</span>
                <span className="font-bold text-slate-900">{formatVND(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá ({appliedCoupon?.code}):</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600">Miễn phí (Freeship)</span>
                  ) : (
                    formatVND(shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
                <span className="text-xl font-black text-orange-600">
                  {formatVND(grandTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-black text-sm transition-all shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2"
            >
              <span>Tiến Hành Thanh Toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1.5">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Bảo hành chính hãng 100% đổi trả 7 ngày</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Hỗ trợ kiểm tra hàng trước khi thanh toán</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Products Section */}
      <section className="pt-8 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Có Thể Bạn Cũng Cần Phụ Tùng Này
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {crossSellProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
