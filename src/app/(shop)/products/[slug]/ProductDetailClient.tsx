"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Bike,
  Package,
  Layers,
} from "lucide-react";
import { Product } from "@/types/product";
import { formatVND } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useFitmentStore } from "@/store/useFitmentStore";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { hasSelectedVehicle, getSelectedVehicleInfo, checkCompatibility } = useFitmentStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
    useFitmentStore.persist.rehydrate();
    setIsMounted(true);
  }, []);

  const selectedVehicle = isMounted ? getSelectedVehicleInfo() : null;
  const compatibility = isMounted ? checkCompatibility(product) : { isCompatible: true, verified: false };

  const handleQuantityChange = (delta: number) => {
    const nextQty = quantity + delta;
    if (nextQty >= 1 && nextQty <= product.stockQuantity) {
      setQuantity(nextQty);
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    addItem(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.originalPrice && (
              <span className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">
                Tiết kiệm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? "border-orange-600 ring-2 ring-orange-500/20"
                      : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Column */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand & SKU bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Mã SKU: <strong className="text-slate-800">{product.sku}</strong>
                </span>
              </div>

              {/* Warehouse shelf location */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                <Package className="w-3.5 h-3.5 text-slate-600" />
                <span>Vị trí kho: <strong className="text-slate-800">{product.warehouseLocation}</strong></span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Vehicle Compatibility Banner */}
            <div className="p-4 rounded-xl border transition-all duration-200">
              {selectedVehicle ? (
                compatibility.isCompatible ? (
                  <div className="flex items-start gap-3 bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-lg text-xs text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-emerald-800">
                        Cam kết 100% gắn vừa cho xe của bạn: {selectedVehicle.modelName} ({selectedVehicle.year})
                      </p>
                      <p className="text-emerald-700 mt-0.5">
                        {compatibility.notes || "Phụ tùng chuẩn kích thước chân ốc, không cần chế cháo hay độ thêm pát."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 bg-rose-50/80 border border-rose-200 p-3.5 rounded-lg text-xs text-rose-900">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-rose-800">
                        Cảnh báo: Không tương thích với {selectedVehicle.modelName} ({selectedVehicle.year})
                      </p>
                      <p className="text-rose-700 mt-0.5">
                        Phụ tùng này có thông số kỹ thuật khác biệt. Vui lòng kiểm tra lại bảng danh sách tương thích bên dưới để tránh mua nhầm.
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-orange-600" />
                    <span>Bạn chưa chọn dòng xe? Kiểm tra ngay để đảm bảo lắp vừa:</span>
                  </div>
                  <button
                    onClick={() => router.push("/products")}
                    className="text-orange-600 font-bold hover:underline shrink-0"
                  >
                    Chọn xe ngay →
                  </button>
                </div>
              )}
            </div>

            {/* Price section */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-baseline gap-4">
              <span className="text-2xl sm:text-3xl font-black text-orange-600">
                {formatVND(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatVND(product.originalPrice)}
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-600 ml-auto">
                {product.inStock ? `Còn ${product.stockQuantity} món trong kho` : "Tạm hết hàng"}
              </span>
            </div>

            {/* Technical Description */}
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
              <p>{product.description}</p>
            </div>

            {/* Specifications Key-Value grid */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-orange-600" />
                Thông Số Kỹ Thuật Chi Tiết
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(product.technicalSpecs).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex justify-between">
                    <span className="text-slate-500 font-medium">{key}:</span>
                    <span className="text-slate-900 font-semibold text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity Controls & Purchase CTAs */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-700">Số lượng:</span>
              <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 text-slate-600 hover:text-orange-600 disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stockQuantity}
                  className="p-2 text-slate-600 hover:text-orange-600 disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-slate-400">
                (Tối đa {product.stockQuantity} sản phẩm)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : product.inStock
                    ? "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAdded ? "Đã Thêm Vào Giỏ Hàng!" : "Thêm Vào Giỏ Hàng"}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-950/20"
              >
                <Zap className="w-4 h-4" />
                <span>Mua Ngay — Giao Hỏa Tốc</span>
              </button>
            </div>

            {/* Confidence assurance icons */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 text-center">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bảo hành chính hãng 12T</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Kiểm tra hàng rồi thanh toán</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-orange-600" />
                <span>Đổi mới nếu không vừa xe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
