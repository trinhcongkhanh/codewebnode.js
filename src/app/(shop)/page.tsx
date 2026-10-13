"use client";

import React, { useState, useEffect } from "react";
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
  Clock,
  Ticket,
  Percent,
  Star,
  Quote,
  HelpCircle,
  ChevronDown,
  Copy,
  Check,
  Truck,
  RotateCcw,
  Headphones,
  Award,
  Layers,
} from "lucide-react";
import { VehicleFitmentSelector } from "@/components/common/VehicleFitmentSelector";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { ProductCard } from "@/components/common/ProductCard";
import { initialProducts } from "@/data/mockData";
import { AVAILABLE_COUPONS } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { formatVND } from "@/lib/utils";

export default function HomePage() {
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Flash Sale Countdown State (Hour : Min : Sec)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 50 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    addToast(`Đã sao chép mã ưu đãi "${code}"! Hãy dùng khi thanh toán.`, "success");
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  // Filtered by tab
  const filteredProducts = initialProducts.filter((p) => {
    if (activeTab === "all") return p.isFeatured;
    if (activeTab === "phanh") return p.categoryId === "cat-he-thong-phanh";
    if (activeTab === "noi") return p.categoryId === "cat-noi-va-truyen-dong";
    if (activeTab === "nsd") return p.categoryId === "cat-nhong-sen-dia";
    if (activeTab === "bao-duong") return p.categoryId === "cat-phu-tung-bao-duong";
    return true;
  });

  // Flash sale products
  const flashSaleProducts = initialProducts
    .filter((p) => p.originalPrice && p.originalPrice > p.price)
    .slice(0, 4);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Làm sao để biết phụ tùng có lắp vừa xe của tôi không?",
      a: "Bạn chỉ cần sử dụng thanh 'Bộ Lọc Dòng Xe' ở đầu trang: chọn Hãng xe (VD: Honda) -> Dòng xe (VD: SH 150i) -> Năm sản xuất (VD: 2022). Hệ thống sẽ tự động lọc ra các phụ tùng có kích thước, chân ốc và thông số kỹ thuật chuẩn zin 100% cho xe bạn.",
    },
    {
      q: "Chính sách đổi trả trong trường hợp mua nhầm thế nào?",
      a: "MotoParts Pro hỗ trợ đổi trả trong vòng 7 ngày hoàn toàn miễn phí nếu phụ tùng chưa qua lắp ráp thử trầy xước và còn nguyên bao bì tem mác. Đội ngũ kỹ thuật sẽ hỗ trợ bạn đổi sang đúng mã phụ tùng phù hợp.",
    },
    {
      q: "Hàng có được kiểm tra trước khi thanh toán không?",
      a: "Tất cả các đơn hàng gửi qua GHN, GHTK, Viettel Post đều hỗ trợ hình thức 'Đồng kiểm': quý khách được phép mở hộp kiểm tra đúng mẫu mã, tem niêm phong chính hãng trước khi thanh toán tiền cho shipper.",
    },
    {
      q: "Thời gian giao hàng mất bao lâu?",
      a: "Khu vực nội thành TP. Hồ Chí Minh và Hà Nội hỗ trợ giao hỏa tốc từ 2h - 4h. Các tỉnh thành khác nhận hàng từ 1 - 3 ngày làm việc.",
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* ─── Hero Section with Animated Ambient Glow & Floating Badges ─── */}
      <section className="relative bg-slate-950 text-white overflow-hidden pt-8 pb-16 border-b border-slate-800">
        {/* Pulsing Gradient Ambient Light */}
        <div className="absolute top-10 -left-20 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div
          className="absolute bottom-10 right-0 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-950/30 via-slate-950 to-slate-950 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-orange-600/20 text-orange-400 border border-orange-500/30 shadow-md">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>Kho Phụ Tùng Xe Máy Chuẩn Kỹ Thuật Số 1 Việt Nam</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Phụ Tùng Xe Máy Chính Hãng <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400">
                  Chuẩn Khít Từng Đời Xe
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Nói không với hàng giả và phụ tùng lệch chân ốc. Tra cứu chuẩn xác theo Hãng xe, Dòng xe và Năm sản xuất để được bảo đảm tương thích kỹ thuật 100%.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/products"
                  className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 shadow-xl shadow-orange-950/50 hover-lift"
                >
                  <Bike className="w-4 h-4" />
                  <span>Tra Cứu Phụ Tùng Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/products?cat=phu-tung-bao-duong"
                  className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm transition-all border border-slate-800 hover-lift"
                >
                  Combo Bảo Dưỡng 10.000 KM
                </Link>
              </div>

              {/* Mini Quick Stats Banner */}
              <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg border-t border-slate-800/80">
                <div>
                  <div className="text-base sm:text-lg font-black text-white">100%</div>
                  <div className="text-[10px] text-slate-400 font-medium">Chính hãng nhập khẩu</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-orange-400">1.200+</div>
                  <div className="text-[10px] text-slate-400 font-medium">Mã phụ tùng có sẵn</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-emerald-400">7 Ngày</div>
                  <div className="text-[10px] text-slate-400 font-medium">Đổi trả nếu không vừa</div>
                </div>
              </div>
            </div>

            {/* Hero Brand Badges & Floating Elements */}
            <div className="lg:col-span-5 hidden lg:block relative">
              {/* Floating Badge Top Right */}
              <div className="absolute -top-4 -right-3 z-20 animate-float bg-slate-900/95 backdrop-blur-md border border-orange-500/40 rounded-2xl p-3 shadow-2xl flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
                  ⚡
                </div>
                <div>
                  <span className="font-bold text-white block">Giao Hỏa Tốc</span>
                  <span className="text-[10px] text-orange-400">Nội thành 2H</span>
                </div>
              </div>

              {/* Floating Badge Bottom Left */}
              <div className="absolute -bottom-4 -left-3 z-20 animate-float-reverse bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-3 shadow-2xl flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-white block">Lắp Vừa 100%</span>
                  <span className="text-[10px] text-emerald-400">Đổi trả miễn phí</span>
                </div>
              </div>

              {/* Main Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800 shadow-2xl space-y-4 relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Đối Tác Thương Hiệu Toàn Cầu
                  </span>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ủy Quyền
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  {[
                    { name: "Brembo", tag: "Phanh Ý" },
                    { name: "NGK", tag: "Bugi Nhật" },
                    { name: "DID", tag: "Sên Vàng" },
                    { name: "Motul", tag: "Nhớt Pháp" },
                    { name: "FCC", tag: "Bộ Nồi Zin" },
                    { name: "YSS", tag: "Phuộc Thái" },
                  ].map((brand) => (
                    <div
                      key={brand.name}
                      className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 hover:border-orange-500/60 hover:text-orange-400 transition-all hover-lift"
                    >
                      <div className="text-xs font-black">{brand.name}</div>
                      <div className="text-[10px] text-slate-500">{brand.tag}</div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Bảo hành chính hãng: 12 tháng</span>
                  <span className="text-orange-400 font-bold">Đồng kiểm khi nhận hàng</span>
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

      {/* ─── Flash Sale (Giờ Vàng Giá Sốc) ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-orange-950 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-900/40 animate-bounce">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    GIỜ VÀNG GIÁ SỐC — FLASH SALE
                  </h2>
                  <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md animate-pulse">
                    HOT DEAL
                  </span>
                </div>
                <p className="text-xs text-rose-200 mt-0.5">
                  Số lượng có hạn, ưu đãi tự động kết thúc khi hết thời gian đếm ngược
                </p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-bold mr-1">Kết thúc sau:</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                <span className="bg-slate-950/90 border border-rose-500/40 px-3 py-1.5 rounded-xl text-rose-400 shadow-md">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span>:</span>
                <span className="bg-slate-950/90 border border-rose-500/40 px-3 py-1.5 rounded-xl text-rose-400 shadow-md">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span>:</span>
                <span className="bg-slate-950/90 border border-rose-500/40 px-3 py-1.5 rounded-xl text-rose-400 shadow-md">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Flash Sale Selling Status Bar */}
          <div className="mb-6 p-3 rounded-2xl bg-slate-950/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Đang có 128 biker cùng xem trang này — Tốc độ chốt đơn nhanh!</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-300 font-medium">Tiến độ đợt mở bán:</span>
              <div className="w-36 h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div className="w-[84%] h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full progress-striped" />
              </div>
              <span className="font-mono font-black text-rose-400">84%</span>
            </div>
          </div>

          {/* Flash Sale Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Voucher Banner Section ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-orange-600 animate-pulse" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Mã Giảm Giá & Ưu Đãi Biker Độc Quyền
            </h2>
          </div>
          <span className="text-xs text-slate-500">Bấm mã để sao chép nhanh</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AVAILABLE_COUPONS.map((coupon) => (
            <div
              key={coupon.code}
              className="relative p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-orange-500/50 hover:shadow-xl hover-lift transition-all flex flex-col justify-between group shine-box"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-xl">
                    {coupon.code}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Đơn từ {(coupon.minOrderValue / 1000).toFixed(0)}k
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-snug">
                  {coupon.description}
                </p>
              </div>

              <button
                onClick={() => handleCopyCoupon(coupon.code)}
                className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  copiedCoupon === coupon.code
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-700 active:scale-95"
                }`}
              >
                {copiedCoupon === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao Chép Mã</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Categories Section ───────────────────────────────────────── */}
      <CategoryGrid />

      {/* ─── Featured Products with Category Tabs ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Lựa Chọn Hàng Đầu Của Giới Biker & Thợ Sửa Xe
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Phụ Tùng Bán Chạy Nhất (Hot Deals)
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>Xem tất cả phụ tùng</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {[
            { id: "all", label: "Tất Cả Nổi Bật" },
            { id: "phanh", label: "🛑 Bố Thắng & Phanh" },
            { id: "noi", label: "⚙️ Bộ Nồi & Curoa" },
            { id: "nsd", label: "⛓️ Nhông Sên Dĩa" },
            { id: "bao-duong", label: "🛢️ Nhớt & Bảo Dưỡng" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all hover-lift ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/30 scale-105"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── Special Maintenance Combo Banner ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-600/30 text-orange-400 border border-orange-500/30">
              <Wrench className="w-3.5 h-3.5" />
              <span>Gợi ý kỹ thuật viên khuyên dùng</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Combo Bảo Dưỡng Toàn Diện <br />
              Định Kỳ Mỗi 10.000 KM
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tránh hao xăng, rung đầu ga sớm và chai cứng má phanh nguy hiểm. Bộ combo Bố thắng Brembo Sinter + Nồi FCC Zin + Bugi NGK Iridium giúp xe vận hành êm ái, bốc ga như lúc mới mua.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/products?cat=he-thong-phanh"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-orange-950/40 hover-lift"
              >
                <span>Xem Phụ Tùng Hệ Thống Phanh</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?cat=noi-va-truyen-dong"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-colors border border-slate-700 hover-lift"
              >
                <span>Bộ Nồi & Dây Curoa</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Customer Reviews & Testimonials ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-widest">
            <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            Đánh Giá Chân Thực
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Khách Hàng Nói Gì Về MotoParts Pro?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Hơn 15.000 biker trên khắp cả nước đã tin tưởng lựa chọn phụ tùng chuẩn fitment của chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Nguyễn Tuấn Anh",
              bike: "Honda SH 150i (2022)",
              product: "Bố thắng đĩa Brembo Sinter",
              comment:
                "Tra cứu xe trên web ra đúng mã bố thắng cho đời SH 2022 của mình, mang ra tiệm thợ lắp vừa khít không phải chế cháo gì cả. Thắng ăn và êm hơn bố zin rất nhiều!",
              rating: 5,
            },
            {
              name: "Trần Minh Hoàng",
              bike: "Yamaha Exciter 155 (2023)",
              product: "Bộ nhông sên dĩa DID vàng 428HD",
              comment:
                "Đóng gói rất kỹ, có cả tem chống hàng giả 7 màu của DID. Chạy 2.000km rồi sên vẫn căng êm, không bị chùng nhão như mấy bộ mua trôi nổi trước đây. Giao hàng hỏa tốc 2h quá tiện.",
              rating: 5,
            },
            {
              name: "Lê Quốc Bảo",
              bike: "Honda Winner X (2023)",
              product: "Nhớt Motul 300V Factory Line 10W40",
              comment:
                "Check mã vạch chính hãng chuẩn chỉ. Đi tour xa máy mát rượi, sang số cực êm. Rất thích bộ lọc chọn xe thông minh của shop, không sợ mua nhầm đồ xe khác.",
              rating: 5,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-orange-500/40 hover:shadow-xl hover-lift transition-all shine-box"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-orange-600 font-semibold">{item.bike}</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                  Đã mua hàng
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4 Golden Value Props ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover-lift hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">100% Chính Hãng</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Đền gấp 10 lần nếu phát hiện hàng giả, hàng nhái trôi nổi.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover-lift hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Bảo Đảm Lắp Vừa Zin</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Hỗ trợ đổi trả miễn phí trong 7 ngày nếu không tương thích xe.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover-lift hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Giao Toàn Quốc & Đồng Kiểm</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Mở hộp kiểm tra đúng hàng chính hãng trước khi thanh toán.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover-lift hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Tư Vấn Kỹ Thuật 24/7</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Đội ngũ thợ xe dày dạn kinh nghiệm sẵn sàng giải đáp hotline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Frequently Asked Questions (FAQ) ─────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            Giải Đáp Thắc Mắc
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Câu Hỏi Thường Gặp
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all hover:border-orange-500/30"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-orange-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-orange-600" : "text-slate-400"
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
