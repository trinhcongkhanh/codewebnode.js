"use client";

import React from "react";
import Link from "next/link";
import { Plus, Check, Sparkles } from "lucide-react";
import { Product } from "@/types/product";
import { formatVND } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

interface CrossSellListProps {
  currentProduct: Product;
  relatedProducts: Product[];
}

export function CrossSellList({
  currentProduct,
  relatedProducts,
}: CrossSellListProps) {
  const { addItem } = useCartStore();
  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});

  if (!relatedProducts || relatedProducts.length === 0) return null;

  const handleAddCrossSell = (product: Product) => {
    addItem(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-white rounded-2xl border border-orange-200/80 p-5 md:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-orange-600" />
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Gợi Ý Mua Kèm Chuyên Gia (Cross-Sell / Up-Sell)
        </h3>
      </div>
      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        Các phụ tùng được khuyến nghị thay thế đồng bộ khi lắp <strong>{currentProduct.name}</strong> để đạt hiệu năng phanh và bảo dưỡng tối ưu nhất:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedProducts.map((rel) => {
          const isAdded = addedIds[rel.id];
          return (
            <div
              key={rel.id}
              className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex gap-3">
                <Link
                  href={`/products/${rel.slug}`}
                  className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100 block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rel.images[0]}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-orange-600 uppercase">
                    {rel.brand}
                  </span>
                  <Link
                    href={`/products/${rel.slug}`}
                    className="text-xs font-bold text-slate-900 hover:text-orange-600 line-clamp-2 transition-colors block leading-tight mt-0.5"
                  >
                    {rel.name}
                  </Link>
                  <p className="text-xs font-extrabold text-slate-900 mt-1">
                    {formatVND(rel.price)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleAddCrossSell(rel)}
                className={`mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-800"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã thêm vào giỏ</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm nhanh ({formatVND(rel.price)})</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
