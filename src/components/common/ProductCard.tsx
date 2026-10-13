"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Eye, Check, Heart, Star } from "lucide-react";
import { Product } from "@/types/product";
import { formatVND } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToastStore } from "@/store/useToastStore";
import { FitmentBadge } from "./FitmentBadge";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();

  const [isAdded, setIsAdded] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    addToast(`Đã thêm "${product.name}" vào giỏ hàng!`, "success");
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleItem(product);
    if (added) {
      addToast(`Đã thêm "${product.name}" vào danh sách yêu thích!`, "info");
    } else {
      addToast(`Đã bỏ "${product.name}" khỏi danh sách yêu thích!`, "info");
    }
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-orange-500/50 hover:shadow-2xl hover-lift transition-all duration-300 flex flex-col h-full relative">
        {/* Product Image Area */}
        <Link href={`/products/${product.slug}`} className="relative aspect-4/3 bg-slate-100 overflow-hidden block shine-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-105 transition-all duration-500"
            loading="lazy"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
            {discountPercent > 0 && (
              <span className="bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                -{discountPercent}%
              </span>
            )}
            <span className="bg-slate-950/80 backdrop-blur-xs text-white font-semibold text-[10px] px-2 py-0.5 rounded-md">
              {product.brand}
            </span>
          </div>

          {/* Top Right Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs ${
              isFavorited
                ? "bg-rose-50 text-rose-600 scale-110"
                : "bg-white/90 backdrop-blur-xs text-slate-500 hover:text-rose-600 hover:bg-white"
            }`}
            title={isFavorited ? "Bỏ yêu thích" : "Lưu vào yêu thích"}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-600 text-rose-600 animate-heart" : ""}`} />
          </button>

          {/* Quick View Button on Hover */}
          <div className="absolute inset-x-0 bottom-2.5 px-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={handleOpenQuickView}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-xs flex items-center justify-center gap-1.5 shadow-lg transition-transform hover:scale-[1.02]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem Nhanh</span>
            </button>
          </div>
        </Link>

        {/* Product Information */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Fitment Indicator */}
            <div className="mb-2">
              <FitmentBadge product={product} compact />
            </div>

            {/* Title */}
            <Link
              href={`/products/${product.slug}`}
              className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 line-clamp-2 transition-colors leading-snug"
              title={product.name}
            >
              {product.name}
            </Link>

            {/* Rating & Sold count */}
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
              <div className="flex items-center text-amber-500 font-bold gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
              <span>•</span>
              <span className="truncate">Đã bán {Math.floor(product.price % 80) + 120}</span>
            </div>

            {/* SKU & Category */}
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 truncate">
              <span>SKU: {product.sku}</span>
              <span>•</span>
              <span className="truncate">{product.categoryName}</span>
            </div>
          </div>

          {/* Pricing and Action Button */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <div className="text-sm sm:text-base font-extrabold text-orange-600">
                {formatVND(product.price)}
              </div>
              {product.originalPrice && (
                <div className="text-[11px] text-slate-400 line-through">
                  {formatVND(product.originalPrice)}
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : product.inStock
                  ? "bg-slate-900 hover:bg-orange-600 active:bg-orange-700 text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
              title="Thêm vào giỏ hàng"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Đã thêm</span>
                </>
              ) : product.inStock ? (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Thêm</span>
                </>
              ) : (
                <span>Hết</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
