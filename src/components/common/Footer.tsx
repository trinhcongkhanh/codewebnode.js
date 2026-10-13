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
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Trụ sở chính: Tầng 6, Tòa nhà Kaze Tech, Quận 1, TP. Hồ Chí Minh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Tổng đài đặt hàng: 1900 8888 (08:00 - 21:00)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Email hỗ trợ: support@motopartspro.vn</span>
              </p>
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

          {/* Vehicle Lines */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Dòng Xe Phổ Biến
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/products?mfg=mfg-honda&model=mod-sh125i&year=2022" className="hover:text-orange-400 transition-colors">
                  Phụ tùng Honda SH 125i
                </Link>
              </li>
              <li>
                <Link href="/products?mfg=mfg-honda&model=mod-sh150i&year=2022" className="hover:text-orange-400 transition-colors">
                  Phụ tùng Honda SH 150i
                </Link>
              </li>
              <li>
                <Link href="/products?mfg=mfg-honda&model=mod-winner-x&year=2023" className="hover:text-orange-400 transition-colors">
                  Phụ tùng Honda Winner X
                </Link>
              </li>
              <li>
                <Link href="/products?mfg=mfg-yamaha&model=mod-exciter-155&year=2023" className="hover:text-orange-400 transition-colors">
                  Phụ tùng Yamaha Exciter 155
                </Link>
              </li>
              <li>
                <Link href="/products?mfg=mfg-honda&model=mod-airblade&year=2022" className="hover:text-orange-400 transition-colors">
                  Phụ tùng Air Blade 125/160
                </Link>
              </li>
              <li>
                <Link href="/products?mfg=mfg-honda&model=mod-vario-160&year=2023" className="hover:text-orange-400 transition-colors">
                  Phụ tùng Vario 160
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

        {/* Bottom copyright & disclaimer */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MotoParts Pro Vietnam. Bản quyền thuộc về KazeLAB & Tú.</p>
          <p className="text-[11px]">
            Hệ thống minh họa thương mại điện tử phụ tùng xe máy Next.js App Router & OpenNext AWS Architecture.
          </p>
        </div>
      </div>
    </footer>
  );
}
