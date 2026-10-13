import React from "react";
import Link from "next/link";
import {
  Bike,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Wrench,
  Flame,
} from "lucide-react";
import { VehicleFitmentSelector } from "@/components/common/VehicleFitmentSelector";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { ProductCard } from "@/components/common/ProductCard";
import { initialProducts } from "@/data/mockData";

export default function HomePage() {
  const featuredProducts = initialProducts.filter((p) => p.isFeatured);
  const maintenanceProducts = initialProducts.filter(
    (p) => p.categoryId === "cat-bao-duong" || p.categoryId === "cat-phuong-thang"
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden pt-8 pb-14 border-b border-slate-800">
        {/* Background glow and subtle mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-slate-950 to-slate-950 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-600/20 text-orange-400 border border-orange-500/30">
                <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                <span>Kho Phụ Tùng Xe Máy Chuẩn Kỹ Thuật Số 1 Việt Nam</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Phụ Tùng Xe Máy Chính Hãng <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400">
                  Chuẩn Khít Từng Đời Xe
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Nói không với hàng giả và phụ tùng lắp lệch thông số. Tra cứu nhanh theo Hãng xe, Dòng xe và Năm sản xuất để được đảm bảo lắp vừa 100%.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-sm transition-all duration-150 flex items-center gap-2 shadow-lg shadow-orange-950/40"
                >
                  <Bike className="w-4 h-4" />
                  <span>Khám Phá Toàn Bộ Phụ Tùng</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/products?cat=phu-tung-bao-duong"
                  className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
                >
                  Gói Bảo Dưỡng Định Kỳ
                </Link>
              </div>
            </div>

            {/* Hero Brand Badges */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Đối Tác Thương Hiệu Toàn Cầu
                  </span>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ủy Quyền
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {["Brembo", "NGK", "DID", "Motul", "FCC", "YSS"].map((brand) => (
                    <div
                      key={brand}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-black text-slate-200 hover:border-orange-500/50 hover:text-orange-400 transition-colors"
                    >
                      {brand}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Cam kết bảo hành: 12 tháng</span>
                  <span className="text-orange-400 font-medium">Đổi trả trong 7 ngày</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prominent Vehicle Fitment Filter Component */}
          <div className="mt-6">
            <VehicleFitmentSelector variant="banner" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoryGrid />

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Sản Phẩm Đang Được Biker Đánh Giá Cao
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Phụ Tùng Bán Chạy Nhất (Hot Deals)
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Xem tất cả phụ tùng</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Special Maintenance Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-600/30 text-orange-400 border border-orange-500/30">
              <Wrench className="w-3.5 h-3.5" />
              <span>Gợi ý kỹ thuật viên khuyên dùng</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Bảo Dưỡng Phanh & Nồi Xe Định Kỳ Mỗi 10.000 KM
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tránh hao xăng, rung giật ga đầu và mất phanh nguy hiểm. Bộ combo Bố thắng Brembo Sinter + Nồi FCC + Bugi NGK Iridium giúp xe vận hành êm ái như xe mới đập hộp.
            </p>
            <div className="pt-2">
              <Link
                href="/products?cat=he-thong-phanh"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors shadow-md"
              >
                <span>Xem Phụ Tùng Hệ Thống Phanh</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance & Consumables Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
              Định Kỳ 5.000 - 10.000 KM
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Phụ Tùng Bảo Dưỡng Nhanh & Nhớt Cao Cấp
            </h2>
          </div>
          <Link
            href="/products?cat=phu-tung-bao-duong"
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Xem đồ bảo dưỡng</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {maintenanceProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
