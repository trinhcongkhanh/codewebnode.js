"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bike,
  ShoppingBag,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  Heart,
  PackageSearch,
  Percent,
  User,
  LogOut,
  ChevronDown,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useFitmentStore } from "@/store/useFitmentStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";
import { SearchSuggestions } from "./SearchSuggestions";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const { getSelectedVehicleInfo, clearFitment } = useFitmentStore();
  const { getTotalItems: getWishlistTotal } = useWishlistStore();
  const { user, openAuthModal, logout } = useAuthStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
    useFitmentStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    useAuthStore.persist.rehydrate();
    setIsMounted(true);
  }, []);

  const totalItems = isMounted ? getTotalItems() : 0;
  const wishlistCount = isMounted ? getWishlistTotal() : 0;
  const selectedVehicle = isMounted ? getSelectedVehicleInfo() : null;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        {/* Top utility bar */}
        <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-orange-400 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                Phụ tùng chính hãng 100% — Cam kết bảo hành lắp vừa zin
              </span>
              <span className="text-slate-700">|</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                Mã <strong className="text-amber-400">FREESHIP</strong> đơn từ 200k
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/track-order"
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <PackageSearch className="w-3.5 h-3.5 text-orange-400" />
                <span>Tra cứu đơn</span>
              </Link>
              <span className="text-slate-700">|</span>
              <Link
                href="/my-orders"
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-orange-400" />
                <span>Đơn hàng của tôi</span>
              </Link>
              <span className="text-slate-700">|</span>
              <a
                href="tel:19008888"
                className="flex items-center gap-1 hover:text-white transition-colors text-slate-400"
              >
                <PhoneCall className="w-3 h-3 text-orange-500" />
                Hotline: <strong className="text-white">1900 8888</strong>
              </a>
              <span className="text-slate-700">|</span>
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs transition-all shadow-sm hover:shadow-orange-500/25 group cursor-pointer"
                title="Cổng Đăng Nhập Dành Riêng Cho Quản Trị Viên"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>Đăng nhập Admin</span>
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
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-950/20 group-hover:scale-105 transition-transform">
                  <Bike className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-black tracking-tight text-slate-900">
                      MOTO<span className="text-orange-600">PARTS</span>
                    </span>
                    <span className="text-[10px] uppercase font-black bg-slate-950 text-white px-1.5 py-0.5 rounded tracking-widest">
                      PRO
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase -mt-0.5">
                    Phụ Tùng Xe Máy Chuẩn Kỹ Thuật
                  </p>
                </div>
              </Link>
            </div>

            {/* Technical Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-4">
              <SearchSuggestions />
            </div>

            {/* Actions: Vehicle Info + Wishlist + Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Selected Vehicle Pill */}
              <div className="hidden lg:flex items-center">
                {selectedVehicle ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-medium text-orange-900">
                    <Bike className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="font-bold text-orange-700">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-xs font-bold text-slate-700 transition-colors"
                  >
                    <Bike className="w-3.5 h-3.5 text-orange-600" />
                    <span>Chọn xe của bạn</span>
                  </Link>
                )}
              </div>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 group shadow-xs"
                title="Danh sách yêu thích"
              >
                <div className="relative">
                  <Heart className="w-5 h-5 group-hover:text-rose-600 transition-colors" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline text-xs font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                  Yêu Thích
                </span>
              </Link>

              {/* User Account / Auth Dropdown */}
              {isMounted && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2 group shadow-xs"
                    aria-label="Tài khoản cá nhân"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-[10px] text-slate-400 font-bold leading-none">Tài khoản</p>
                      <p className="text-xs font-black text-slate-900 leading-tight max-w-[80px] truncate mt-0.5">
                        {user.name.split(" ").slice(-1)[0]}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                          <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.phone || user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-100 text-orange-700">
                            ⭐ Biker Thân Thiết
                          </span>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/my-orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            <FileText className="w-4 h-4 text-orange-500" />
                            <span>Đơn hàng của tôi</span>
                          </Link>
                          <Link
                            href="/wishlist"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            <Heart className="w-4 h-4 text-rose-500" />
                            <span>Sản phẩm yêu thích ({wishlistCount})</span>
                          </Link>
                          <Link
                            href="/track-order"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <PackageSearch className="w-4 h-4 text-slate-500" />
                            <span>Tra cứu vận đơn</span>
                          </Link>
                          <Link
                            href="/admin/login"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-amber-800 bg-amber-50/80 hover:bg-amber-100 border-t border-b border-amber-100 my-1 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            <span>Quản Trị Hệ Thống (Admin Portal)</span>
                          </Link>
                        </div>
                        <div className="border-t border-slate-100 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                              addToast("Đã đăng xuất tài khoản", "info");
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 group shadow-xs"
                >
                  <User className="w-4 h-4 group-hover:text-orange-600 transition-colors" />
                  <span className="hidden sm:inline text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                    Đăng Nhập
                  </span>
                </button>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2 group shadow-xs"
                aria-label="Giỏ hàng"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:text-orange-600 transition-colors" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50">
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
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-6 py-2.5">
                <Link
                  href="/products"
                  className="text-slate-900 hover:text-orange-600 transition-colors flex items-center gap-1.5"
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
                <Link
                  href="/track-order"
                  className="text-slate-600 hover:text-orange-600 flex items-center gap-1 transition-colors"
                >
                  <PackageSearch className="w-3.5 h-3.5 text-orange-600" />
                  <span>Tra cứu tiến độ đơn</span>
                </Link>
                <span className="text-slate-300">|</span>
                <Link
                  href="/admin/login"
                  className="text-amber-800 hover:text-amber-900 bg-amber-100/90 hover:bg-amber-200 border border-amber-300/70 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all font-black text-xs shadow-2xs"
                  title="Cổng Đăng Nhập Quản Trị Viên"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Đăng Nhập Admin</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2.5 shadow-lg">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-900 hover:bg-slate-100"
            >
              🏍️ Xem Tất Cả Phụ Tùng
            </Link>
            <Link
              href="/products?cat=he-thong-phanh"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100 font-medium"
            >
              🛑 Hệ Thống Phanh & Bố Thắng
            </Link>
            <Link
              href="/products?cat=noi-va-truyen-dong"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100 font-medium"
            >
              ⚙️ Bộ Nồi & Dây Curoa
            </Link>
            <Link
              href="/products?cat=nhong-sen-dia"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100 font-medium"
            >
              ⛓️ Nhông Sên Dĩa DID
            </Link>
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {isMounted && user ? (
                <div className="p-3 bg-orange-50/70 border border-orange-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-black text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">{user.name}</p>
                      <p className="text-[10px] text-slate-500">{user.phone || user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      addToast("Đã đăng xuất tài khoản", "info");
                    }}
                    className="text-[11px] font-bold text-red-600 hover:underline px-2 py-1"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="w-full py-2.5 px-3 bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs"
                >
                  <User className="w-4 h-4" />
                  <span>Đăng Nhập / Đăng Ký Tài Khoản</span>
                </button>
              )}

              <Link
                href="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100"
              >
                <span>📋 Đơn Hàng Của Tôi</span>
                <span className="text-xs text-orange-600 font-bold">Xem tất cả</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50"
              >
                <span>❤️ Danh Sách Yêu Thích</span>
                <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {wishlistCount}
                </span>
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-orange-600 hover:bg-orange-50"
              >
                📦 Tra Cứu Đơn Hàng Của Bạn
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-slate-900 bg-slate-100"
              >
                <span>🛒 Giỏ Hàng</span>
                <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {totalItems}
                </span>
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors mt-2"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Đăng Nhập Quản Trị Viên</span>
                </span>
                <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-black uppercase">
                  Admin
                </span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer instance */}
      <CartDrawer />
    </>
  );
}
