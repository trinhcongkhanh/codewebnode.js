"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bike,
  ShoppingBag,
  Menu,
  X,
  ShieldAlert,
  PhoneCall,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useFitmentStore } from "@/store/useFitmentStore";
import { SearchSuggestions } from "./SearchSuggestions";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const { getSelectedVehicleInfo, clearFitment } = useFitmentStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
    useFitmentStore.persist.rehydrate();
    setIsMounted(true);
  }, []);

  const totalItems = isMounted ? getTotalItems() : 0;
  const selectedVehicle = isMounted ? getSelectedVehicleInfo() : null;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        {/* Top utility bar */}
        <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-orange-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Cam kết phụ tùng chính hãng 100% — Bảo hành lắp vừa zin
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">
                Giao hàng toàn quốc hỏa tốc (GHN / GHTK / Viettel Post)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="tel:19008888"
                className="flex items-center gap-1 hover:text-white transition-colors text-slate-400"
              >
                <PhoneCall className="w-3 h-3 text-orange-500" />
                Hotline tư vấn kỹ thuật: <strong className="text-white">1900 8888</strong>
              </a>
              <span className="text-slate-700">|</span>
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-slate-300 hover:text-orange-400 font-medium transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-orange-500" />
                <span>Trang Quản Trị (Admin)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-950/20 group-hover:scale-105 transition-transform">
                  <Bike className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-black tracking-tight text-slate-900">
                      MOTO<span className="text-orange-600">PARTS</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded tracking-widest">
                      PRO
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase -mt-0.5">
                    Phụ Tùng Xe Máy Chuẩn Kỹ Thuật
                  </p>
                </div>
              </Link>
            </div>

            {/* Technical Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-4">
              <SearchSuggestions />
            </div>

            {/* Quick Vehicle Status & Cart Action */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Vehicle Pill */}
              <div className="hidden lg:flex items-center">
                {selectedVehicle ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-medium text-orange-900">
                    <Bike className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold text-orange-700">
                      {selectedVehicle.modelName} ({selectedVehicle.year})
                    </span>
                    <button
                      onClick={clearFitment}
                      className="text-orange-400 hover:text-orange-800 p-0.5 ml-0.5"
                      title="Đổi xe khác"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/products"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <Bike className="w-3.5 h-3.5 text-orange-600" />
                    <span>Chọn xe của bạn</span>
                  </Link>
                )}
              </div>

              {/* Cart Drawer Trigger */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2 group shadow-xs"
                aria-label="Giỏ hàng"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:text-orange-600 transition-colors" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                  Giỏ Hàng
                </span>
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="mt-3 md:hidden">
            <SearchSuggestions />
          </div>
        </div>

        {/* Secondary Navigation */}
        <nav className="bg-slate-50 border-t border-slate-200/80 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-6 py-2.5">
                <Link
                  href="/products"
                  className="text-slate-800 hover:text-orange-600 transition-colors flex items-center gap-1.5"
                >
                  <Bike className="w-4 h-4 text-orange-600" />
                  <span>Tất Cả Phụ Tùng</span>
                </Link>
                <Link
                  href="/products?cat=he-thong-phanh"
                  className="text-slate-600 hover:text-orange-600 transition-colors"
                >
                  Bố Thắng & Phanh Đĩa
                </Link>
                <Link
                  href="/products?cat=noi-va-truyen-dong"
                  className="text-slate-600 hover:text-orange-600 transition-colors"
                >
                  Bộ Nồi & Dây Curoa
                </Link>
                <Link
                  href="/products?cat=nhong-sen-dia"
                  className="text-slate-600 hover:text-orange-600 transition-colors"
                >
                  Nhông Sên Dĩa DID
                </Link>
                <Link
                  href="/products?cat=phu-tung-bao-duong"
                  className="text-slate-600 hover:text-orange-600 transition-colors"
                >
                  Bugi Iridium & Nhớt Motul
                </Link>
                <Link
                  href="/products?cat=giam-xoc-phuoc"
                  className="text-slate-600 hover:text-orange-600 transition-colors"
                >
                  Phuộc YSS / RCB
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldAlert className="w-3 h-3 text-emerald-600" />
                  Bảo hành chính hãng 12T
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              🏍️ Xem Tất Cả Phụ Tùng
            </Link>
            <Link
              href="/products?cat=he-thong-phanh"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
            >
              🛑 Hệ Thống Phanh & Bố Thắng
            </Link>
            <Link
              href="/products?cat=noi-va-truyen-dong"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
            >
              ⚙️ Bộ Nồi & Dây Curoa
            </Link>
            <Link
              href="/products?cat=nhong-sen-dia"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
            >
              ⛓️ Nhông Sên Dĩa DID
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-orange-600 hover:bg-orange-50"
            >
              🛒 Giỏ Hàng Của Bạn ({totalItems})
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-900 bg-slate-100"
            >
              ⚙️ Vào Bảng Quản Trị (Admin Dashboard)
            </Link>
          </div>
        )}
      </header>

      {/* Cart Drawer instance */}
      <CartDrawer />
    </>
  );
}
