"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Check,
  Star,
  ShieldCheck,
  Wrench,
  Bike,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Product } from "@/types/product";
import { formatVND } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { FitmentBadge } from "./FitmentBadge";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen || !product) return null;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    addToast(`Đã thêm ${quantity}x "${product.name}" vào giỏ hàng!`, "success");
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images Section */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnail selector if multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === idx
                        ? "border-orange-600 ring-2 ring-orange-500/20"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Chính hãng 100% • Bảo hành 12 tháng</span>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
              </div>

              <h2 className="text-lg font-black text-slate-900 leading-snug">
                {product.name}
              </h2>

              {/* Fitment Indicator */}
              <div>
                <FitmentBadge product={product} />
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-black text-orange-600">
                  {formatVND(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Key Specs */}
              {product.technicalSpecs && Object.keys(product.technicalSpecs).length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                    <Wrench className="w-3.5 h-3.5 text-orange-600" />
                    Thông số tóm tắt:
                  </div>
                  {Object.entries(product.technicalSpecs).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-slate-600">
                      <span className="font-medium text-slate-500">{key}:</span>
                      <span className="font-semibold text-slate-800">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-slate-800 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 10, q + 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : product.inStock
                      ? "bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white shadow-orange-900/20"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Đã thêm vào giỏ
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Thêm Vào Giỏ Hàng
                    </>
                  )}
                </button>
              </div>

              {/* View Full Page */}
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="w-full py-2 text-center text-xs text-slate-500 hover:text-orange-600 font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>Xem đầy đủ thông số & đánh giá chi tiết</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
