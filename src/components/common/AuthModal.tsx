"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Lock, Phone, User, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuthStore();
  const { addToast } = useToastStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      addToast("Vui lòng nhập số điện thoại hoặc email", "error");
      return;
    }

    login(identifier.trim(), name.trim() || undefined);
    addToast(`Chào mừng bạn ${name || "Biker"} đã đăng nhập thành công!`, "success");
    setIdentifier("");
    setName("");
    setPassword("");
  };

  const handleQuickDemoLogin = () => {
    login("0908123456", "Nguyễn Tuấn Biker");
    addToast("Đăng nhập thành công với tài khoản mẫu Biker VIP!", "success");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-600/10 text-orange-600 flex items-center justify-center mx-auto mb-2 font-black text-xl">
            MP
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {mode === "login" ? "Đăng Nhập Tài Khoản Biker" : "Đăng Ký Thành Viên Mới"}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === "login"
              ? "Theo dõi tiến độ đơn hàng và tích điểm đổi quà phụ tùng"
              : "Nhận ngay voucher giảm 50.000đ cho đơn hàng đầu tiên"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và tên của bạn
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Biker"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Số điện thoại hoặc Email
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="0908 123 456 hoặc email@gmail.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-950/20 flex items-center justify-center gap-2"
          >
            <span>{mode === "login" ? "Đăng Nhập Ngay" : "Tạo Tài Khoản Biker"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Button */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Đăng Nhập Thử 1-Chạm (Tài Khoản Mẫu)</span>
          </button>

          <div className="text-center text-xs text-slate-500">
            {mode === "login" ? (
              <span>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="font-bold text-orange-600 hover:underline"
                >
                  Đăng ký ngay
                </button>
              </span>
            ) : (
              <span>
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-bold text-orange-600 hover:underline"
                >
                  Đăng nhập
                </button>
              </span>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <Link
              href="/admin/login"
              onClick={closeAuthModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Dành cho Quản trị viên: Đăng nhập Cổng Admin →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
