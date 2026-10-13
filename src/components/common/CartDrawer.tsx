"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Ticket,
  Check,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { formatVND } from "@/lib/utils";

export function CartDrawer() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const { addToast } = useToastStore();

  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
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

  if (!isMounted) return null;
  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const discountAmount = getDiscountAmount();
  const freeShippingThreshold = 1000000; // 1.000.000 VND
  const isFreeShip = subtotal >= freeShippingThreshold || appliedCoupon?.code === "FREESHIP";
  const shippingFee = isFreeShip ? 0 : 35000;
  const grandTotal = getGrandTotal(shippingFee);

  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      addToast(res.message, "success");
      setCouponInput("");
    } else {
      addToast(res.message, "error");
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-base font-black text-slate-900">
                Giỏ Hàng Của Bạn ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-4 py-2.5 bg-orange-50/70 border-b border-orange-100">
            <div className="flex items-center justify-between text-xs font-medium text-orange-950 mb-1">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-orange-600" />
                {isFreeShip ? (
                  <span className="text-emerald-700 font-bold">
                    Đã được MIỄN PHÍ VẬN CHUYỂN toàn quốc!
                  </span>
                ) : (
                  <span>
                    Mua thêm{" "}
                    <strong className="text-orange-600">
                      {formatVND(freeShippingThreshold - subtotal)}
                    </strong>{" "}
                    để được Freeship
                  </span>
                )}
              </span>
              <span className="text-[11px] font-black text-orange-600">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Giỏ hàng đang trống
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Bạn chưa chọn món phụ tùng nào. Hãy lọc theo dòng xe của bạn để chọn phụ tùng chuẩn zin nhé!
                </p>
                <button
                  onClick={closeCart}
                  className="mt-4 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  Khám Phá Phụ Tùng Ngay
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-xs"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={closeCart}
                        className="text-xs font-bold text-slate-900 hover:text-orange-600 line-clamp-2 transition-colors leading-snug"
                      >
                        {product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 shrink-0 transition-colors"
                        title="Xóa phụ tùng"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Thương hiệu: <span className="font-semibold text-slate-700">{product.brand}</span>
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:text-orange-600 transition-colors"
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:text-orange-600 transition-colors"
                          disabled={quantity >= product.stockQuantity}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="text-xs font-black text-orange-600">
                        {formatVND(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer summary */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* Coupon Box */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-orange-600" />
                    <div>
                      <span className="font-bold text-orange-950">Mã: {appliedCoupon.code}</span>
                      <p className="text-[10px] text-orange-700">Giảm: -{formatVND(discountAmount)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeCoupon();
                      addToast("Đã hủy áp dụng mã giảm giá", "info");
                    }}
                    className="text-rose-600 hover:text-rose-700 font-semibold text-xs"
                  >
                    Gỡ bỏ
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Nhập mã ưu đãi (VD: FREESHIP)..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0"
                  >
                    Áp Dụng
                  </button>
                </form>
              )}

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính:</span>
                  <span className="font-bold text-slate-800">{formatVND(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Giảm giá ({appliedCoupon?.code}):</span>
                    <span>-{formatVND(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Phí giao hàng:</span>
                  <span className="font-semibold text-slate-800">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">Miễn phí</span>
                    ) : (
                      formatVND(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>Tổng thanh toán:</span>
                  <span className="text-base text-orange-600 font-black">
                    {formatVND(grandTotal)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold text-center transition-colors"
                >
                  Xem Giỏ Hàng
                </Link>

                <button
                  onClick={handleCheckoutClick}
                  className="py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-orange-950/20"
                >
                  <span>Thanh Toán Ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
