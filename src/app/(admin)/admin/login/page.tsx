"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bike,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  KeyRound,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const {
    loginStep1,
    verifyOTP,
    demoLogin,
    failedAttempts,
    lockUntil,
    is2FAPending,
  } = useAdminAuthStore();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    useAdminAuthStore.persist.rehydrate();
    setIsMounted(true);
    if (is2FAPending) {
      setStep("2fa");
    }
  }, [is2FAPending]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      const res = loginStep1(username, password);
      setIsLoading(false);
      if (res.success && res.require2FA) {
        setStep("2fa");
      } else if (!res.success) {
        setErrorMsg(res.error || "Tên đăng nhập hoặc mật khẩu không chính xác!");
      }
    }, 300);
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      const res = verifyOTP(otpCode.trim());
      setIsLoading(false);
      if (res.success) {
        router.push("/admin");
      } else {
        setErrorMsg(res.error || "Mã xác thực 2FA không chính xác!");
      }
    }, 300);
  };

  const handleQuickDemo = () => {
    demoLogin();
    router.push("/admin");
  };

  if (!isMounted) return null;

  const isLocked = lockUntil && Date.now() < lockUntil;
  const remainingMinutes = lockUntil ? Math.ceil((lockUntil - Date.now()) / 60000) : 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-100">
      {/* Background ambient decorative glowing orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/60 rounded-full blur-2xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-6 animate-in zoom-in-95 duration-200">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-950/40">
            <Bike className="w-8 h-8" />
          </div>
          <div className="pt-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              MOTO<span className="text-orange-500">PARTS</span> ADMIN PORTAL
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Hệ Thống Bảo Mật Cấp Cao & Quản Trị Phụ Tùng
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-bold text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Xác thực 2 yếu tố (2FA) & Chống Brute-force</span>
          </div>
        </div>

        {/* Brute-force Locked Alert */}
        {isLocked && (
          <div className="p-4 bg-red-950/80 border border-red-700 rounded-2xl text-red-200 text-xs space-y-1">
            <div className="font-bold flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>Tài khoản tạm thời bị khóa!</span>
            </div>
            <p className="text-[11px] text-red-300">
              Đã nhập sai quá 5 lần. Vui lòng quay lại sau {remainingMinutes} phút để tiếp tục.
            </p>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && !isLocked && (
          <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-center gap-2 animate-in shake duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Username & Password */}
        {step === "credentials" && !isLocked && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Tài khoản quản trị (Username)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Mật khẩu bảo mật (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Mặc định: <strong className="text-slate-200">admin</strong></span>
              <span>Mật khẩu: <strong className="text-slate-200">admin123</strong></span>
            </div>

            {failedAttempts > 0 && failedAttempts < 5 && (
              <div className="text-[11px] text-amber-400 font-semibold text-center">
                ⚠️ Đã nhập sai {failedAttempts}/5 lần
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:from-orange-700 active:to-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 transition-all disabled:opacity-50"
            >
              <span>{isLoading ? "Đang xác thực bước 1..." : "Tiếp Tục (Bước 1/2)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Two-Factor Authentication OTP (2FA) */}
        {step === "2fa" && !isLocked && (
          <form onSubmit={handleOTPSubmit} className="space-y-4 animate-in fade-in">
            <div className="p-4 bg-orange-950/40 border border-orange-900/60 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-orange-400 font-bold">
                <KeyRound className="w-4 h-4" />
                <span>Xác thực 2 yếu tố (2FA Security Code)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Nhập mã OTP 6 chữ số từ ứng dụng xác thực bảo mật của quản trị viên.
              </p>
              <div className="p-2 bg-slate-900 rounded-lg text-[10px] text-amber-300 font-mono">
                Mã OTP mẫu: <strong>888888</strong> (hoặc mã PIN <strong>8888</strong>)
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-center">
                Nhập mã OTP 6 số
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="888888"
                className="w-full py-3 text-center rounded-xl bg-slate-800/80 border border-slate-700 text-lg font-mono tracking-widest text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 font-black"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLoading ? "Đang xác thực 2FA..." : "Hoàn Tất Đăng Nhập"}</span>
              </button>
            </div>
          </form>
        )}

        {/* 1-Click Demo Login */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Đăng Nhập Thử 1-Chạm (Bypass Demo 2FA)</span>
          </button>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <span>← Quay lại Website Khách Hàng (Storefront)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
