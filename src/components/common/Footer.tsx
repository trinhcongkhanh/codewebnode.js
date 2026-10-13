import React from "react";
import Link from "next/link";
import {
  Bike,
  ShieldCheck,
  Truck,
  RotateCcw,
  MapPin,
  Mail,
  Phone,
  Store,
  Clock,
  ExternalLink,
  Wrench,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* 4 Feature Value Props */}
      <div className="border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Chính Hãng 100%</h4>
              <p className="text-xs text-slate-400">
                Cam kết nguồn gốc xuất xứ từ Brembo, NGK, FCC, DID, Motul
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Bảo Đảm Lắp Vừa</h4>
              <p className="text-xs text-slate-400">
                Tra cứu tương thích chính xác theo Hãng - Dòng - Đời xe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Giao Hàng Toàn Quốc</h4>
              <p className="text-xs text-slate-400">
                Hỏa tốc cùng GHN, GHTK, Viettel Post, kiểm hàng trước khi trả
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Đổi Trả Dễ Dàng</h4>
              <p className="text-xs text-slate-400">
                Đổi trả trong 7 ngày nếu không vừa xe hoặc lỗi kỹ thuật
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                <Bike className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                MOTO<span className="text-orange-500">PARTS</span> PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Hệ thống bán lẻ và phân phối phụ tùng xe máy cao cấp hàng đầu Việt Nam. Tích hợp bộ lọc tra cứu thông minh giúp biker và thợ sửa xe tìm đúng món đồ chuẩn zin cho từng dòng xe.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Tổng đài đặt hàng & kỹ thuật: <strong className="text-white">1900 8888</strong> (08:00 - 21:00)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Email hỗ trợ: support@motopartspro.vn</span>
              </p>
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <p className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                  Trụ sở chính & Tổng kho:
                </p>
                <p className="flex items-start gap-2 text-[11px] text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span>Tầng 6, Tòa nhà Kaze Tech, 128 Điện Biên Phủ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh</span>
                </p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Danh Mục Phụ Tùng
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/products?cat=he-thong-phanh" className="hover:text-orange-400 transition-colors">
                  Bố thắng đĩa & Phanh
                </Link>
              </li>
              <li>
                <Link href="/products?cat=noi-va-truyen-dong" className="hover:text-orange-400 transition-colors">
                  Bộ nồi trước & Dây curoa
                </Link>
              </li>
              <li>
                <Link href="/products?cat=nhong-sen-dia" className="hover:text-orange-400 transition-colors">
                  Nhông sên dĩa DID vàng
                </Link>
              </li>
              <li>
                <Link href="/products?cat=phu-tung-bao-duong" className="hover:text-orange-400 transition-colors">
                  Bugi Iridium & Lọc gió
                </Link>
              </li>
              <li>
                <Link href="/products?cat=giam-xoc-phuoc" className="hover:text-orange-400 transition-colors">
                  Phuộc YSS / RCB
                </Link>
              </li>
              <li>
                <Link href="/products?cat=lop-va-vo-xe" className="hover:text-orange-400 transition-colors">
                  Lốp Michelin không săm
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Policies */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Chính Sách & Hỗ Trợ
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-orange-400 transition-colors">
                  Về MotoParts Pro
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition-colors">
                  Liên hệ & Hệ thống chi nhánh
                </Link>
              </li>
              <li>
                <Link href="/policy" className="hover:text-orange-400 transition-colors">
                  Chính sách bảo hành & đổi trả
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-orange-400 transition-colors">
                  Tra cứu tiến độ giao hàng
                </Link>
              </li>
              <li>
                <Link href="/my-orders" className="hover:text-orange-400 transition-colors">
                  Lịch sử đơn hàng của tôi
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-orange-400 transition-colors">
                  Danh sách phụ tùng yêu thích
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery & Payment Partners */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Đối Tác Vận Chuyển
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-[11px] bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">
                GHN Express
              </span>
              <span className="text-[11px] bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">
                GHTK
              </span>
              <span className="text-[11px] bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">
                Viettel Post
              </span>
            </div>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Phương Thức Thanh Toán
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="text-[11px] bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">
                QR VietQR
              </span>
              <span className="text-[11px] bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">
                MoMo
              </span>
              <span className="text-[11px] bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">
                ZaloPay
              </span>
              <span className="text-[11px] bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">
                COD Nhận hàng
              </span>
            </div>
          </div>
        </div>

        {/* Hệ Thống Cửa Hàng & Địa Chỉ Mua Hàng Trực Tiếp (Showrooms) */}
        <div className="border-t border-slate-800 mt-10 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4 text-orange-500" />
                Hệ Thống Cửa Hàng & Địa Chỉ Mua Hàng Trực Tiếp
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Biker có thể đến mua trực tiếp, đối chiếu đời xe zin và được thợ máy hỗ trợ lắp ráp phụ tùng tại chỗ.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors shrink-0"
            >
              <span>Xem chi tiết chỉ đường</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Chi nhánh 1 - TP. Hồ Chí Minh */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 hover:border-orange-500/50 hover:bg-slate-800 transition-all space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Chi Nhánh 1 — TP. Hồ Chí Minh
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Có Xưởng Lắp
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                📍 <strong>Địa chỉ mua hàng:</strong> Số 128 Đường Điện Biên Phủ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh
              </p>
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/50 gap-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-orange-500" />
                  Hotline: <strong className="text-slate-200">0908 123 456</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>08:00 - 21:00</span>
                </span>
              </div>
            </div>

            {/* Chi nhánh 2 - Hà Nội */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 hover:border-orange-500/50 hover:bg-slate-800 transition-all space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Chi Nhánh 2 — Hà Nội
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Tổng Kho Miền Bắc
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                📍 <strong>Địa chỉ mua hàng:</strong> Số 45 Phố Trần Khát Chân, Phường Thanh Nhàn, Quận Hai Bà Trưng, Hà Nội
              </p>
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/50 gap-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-orange-500" />
                  Hotline: <strong className="text-slate-200">0912 345 678</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>08:00 - 20:30</span>
                </span>
              </div>
            </div>

            {/* Chi nhánh 3 - Đà Nẵng */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 hover:border-orange-500/50 hover:bg-slate-800 transition-all space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Chi Nhánh 3 — Đà Nẵng
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Miền Trung
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                📍 <strong>Địa chỉ mua hàng:</strong> Số 89 Đường Điện Biên Phủ, Phường Chính Gián, Quận Thanh Khê, TP. Đà Nẵng
              </p>
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/50 gap-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-orange-500" />
                  Hotline: <strong className="text-slate-200">0918 888 999</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>08:30 - 20:00</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MotoParts Pro Vietnam. Bản quyền thuộc về KazeLAB & Tú.</p>
          <div className="flex items-center gap-4">
            <p className="text-[11px] hidden md:block">
              Hệ thống thương mại điện tử phụ tùng xe máy chuẩn Next.js App Router.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-orange-400 transition-colors px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              <span>Cổng Quản Trị Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
