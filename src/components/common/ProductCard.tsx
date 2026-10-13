"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Eye, Check } from "lucide-react";
import { Product } from "@/types/product";
import { formatVND } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { FitmentBadge } from "./FitmentBadge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = React.useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      {/* Product Image Area */}
      <Link href={`/products/${product.slug}`} className="relative aspect-4/3 bg-slate-100 overflow-hidden block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs">
              -{discountPercent}%
            </span>
          )}
          <span className="bg-slate-900/80 backdrop-blur-xs text-white font-semibold text-[10px] px-2 py-0.5 rounded">
            {product.brand}
          </span>
        </div>

        {/* Quick detail overlay button */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Xem chi tiết
          </span>
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

          {/* SKU & Category */}
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
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
            className={`p-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
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
              <span>Hết hàng</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
