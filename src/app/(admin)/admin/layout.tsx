"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldAlert, ArrowRight, Sparkles, KeyRound, Unlock, LogOut } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isAuthenticated,
    isLocked,
    adminUser,
    demoLogin,
    unlockScreen,
    logout,
  } = useAdminAuthStore();

  const [isMounted, setIsMounted] = useState(false);
  const [unlockInput, setUnlockInput] = useState("");
  const [unlockError, setUnlockError] = useState("");

  useEffect(() => {
    useAdminAuthStore.persist.rehydrate();
    setIsMounted(true);
  }, []);

  // If on /admin/login, render only children (no sidebar/header)
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-bold">
        Đang khởi động Cổng Quản Trị MotoParts Pro...
      </div>
    );
  }

  // Security gate: If not authenticated, require admin login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-white">Yêu Cầu Xác Thực Quản Trị Viên</h1>
            <p className="text-xs text-slate-400">
              Bạn đang truy cập phân hệ quản trị điều hành của MotoParts Pro. Vui lòng đăng nhập với tư cách quản trị viên để tiếp tục.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/admin/login"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 transition-all"
            >
              <span>Đi Đến Màn Hình Đăng Nhập Quản Trị (2FA)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                demoLogin();
                router.refresh();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Đăng Nhập Nhanh (Super Admin Demo)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <Link href="/" className="text-xs text-slate-500 hover:text-white transition-colors">
              ← Quay lại Website Khách Hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Quick Screen Lock Overlay
  if (isLocked) {
    const handleUnlockSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const ok = unlockScreen(unlockInput.trim());
      if (ok) {
        setUnlockInput("");
        setUnlockError("");
      } else {
        setUnlockError("Mã PIN hoặc mật khẩu không chính xác!");
      }
    };

    return (
      <div className="min-h-screen bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center z-50">
        <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-orange-500/40 flex items-center justify-center mx-auto text-orange-400 font-black text-xl shadow-lg">
            {adminUser?.avatar || "TÚ"}
          </div>

          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
              🔒 MÀN HÌNH ĐANG KHÓA BẢO VỆ
            </span>
            <h2 className="text-base font-black text-white">{adminUser?.fullName}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Nhập mã PIN hoặc mật khẩu để tiếp tục làm việc</p>
          </div>

          {unlockError && (
            <p className="text-xs text-red-400 font-bold bg-red-950/50 p-2 rounded-xl border border-red-800">
              {unlockError}
            </p>
          )}

          <form onSubmit={handleUnlockSubmit} className="space-y-3">
            <input
              type="password"
              autoFocus
              required
              value={unlockInput}
              onChange={(e) => setUnlockInput(e.target.value)}
              placeholder="Nhập mã PIN (Mặc định: 8888)..."
              className="w-full py-2.5 px-4 text-center rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-bold"
            />

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-950/30"
            >
              <Unlock className="w-4 h-4" />
              <span>Mở Khóa Làm Việc</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
            <button
              onClick={() => {
                unlockScreen("8888");
              }}
              className="text-amber-400 hover:underline text-[11px]"
            >
              ⚡ Mở khóa nhanh (8888)
            </button>
            <button
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              className="text-red-400 hover:underline text-[11px] flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100/80">
      <Suspense fallback={<aside className="w-64 bg-slate-950 border-r border-slate-800 shrink-0" />}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={<header className="h-16 bg-white border-b border-slate-200" />}>
          <AdminHeader />
        </Suspense>
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
