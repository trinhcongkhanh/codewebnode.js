"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Bike, Sparkles } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { ProductCard } from "@/components/common/ProductCard";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, clearWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    useWishlistStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Đang tải danh sách yêu thích...
      </div>
    );
  }

  const handleAddAllToCart = () => {
    if (items.length === 0) return;
    items.forEach((item) => {
      if (item.inStock) {
        addItem(item, 1);
      }
    });
    addToast(`Đã thêm tất cả ${items.length} món yêu thích vào giỏ hàng!`, "success");
    openCart();
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-5 text-rose-500">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Danh Sách Yêu Thích Của Bạn Đang Trống
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          Hãy bấm vào biểu tượng Trái tim trên các sản phẩm phụ tùng để lưu lại những món bạn quan tâm và dễ dàng mua sắm sau này!
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-orange-950/20"
          >
            <Bike className="w-4 h-4" />
            <span>Khám Phá Phụ Tùng Ngay</span>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tiếp tục tìm phụ tùng</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Heart className="w-5 h-5 fill-rose-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Danh Sách Yêu Thích
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Bạn đang lưu {items.length} món phụ tùng trong danh sách chờ mua.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAddAllToCart}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Thêm Tất Cả Vào Giỏ</span>
            </button>
            <button
              onClick={() => {
                clearWishlist();
                addToast("Đã xóa toàn bộ danh sách yêu thích", "info");
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors"
              title="Xóa toàn bộ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Wishlist items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
