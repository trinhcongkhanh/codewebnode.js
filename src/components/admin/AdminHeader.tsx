"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  AlertTriangle,
  Bell,
  CheckCircle2,
  LogOut,
  ChevronDown,
  Shield,
  Package,
  RotateCcw,
  Lock,
} from "lucide-react";
import { getStoredInventory, getStoredOrders } from "@/services";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

export function AdminHeader() {
  const router = useRouter();
  const { adminUser, logout, lockScreen } = useAdminAuthStore();

  const [lowStockCount, setLowStockCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const inv = getStoredInventory();
    const count = inv.filter((i) => i.status === "low_stock" || i.status === "out_of_stock").length;
    setLowStockCount(count);

    const orders = getStoredOrders();
    setPendingOrdersCount(orders.filter((o) => o.status === "pending").length);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: System context & Live status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 hidden sm:inline">
            Hệ Thống Sẵn Sàng (Live Engine)
          </span>
        </div>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <span className="text-xs font-medium text-slate-500 hidden md:inline">
          MotoParts Pro Administration Hub
        </span>
      </div>

      {/* Right: Actions, Alerts, Notifications & User */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Low Stock Warning Pill */}
        {lowStockCount > 0 && (
          <Link
            href="/admin/inventory"
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{lowStockCount} mã cần nhập thêm</span>
          </Link>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            aria-label="Thông báo hệ thống"
          >
            <Bell className="w-4 h-4" />
            {pendingOrdersCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-600 animate-ping" />
            )}
            {pendingOrdersCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-600" />
            )}
          </button>

          {/* Quick Lock Button */}
          <button
            onClick={lockScreen}
            className="p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 relative transition-colors ml-1"
            title="Khóa nhanh màn hình làm việc khi rời máy"
          >
            <Lock className="w-4 h-4" />
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 space-y-3 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-black text-slate-900 uppercase">
                    Thông Báo Điều Hành
                  </span>
                  <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full">
                    {pendingOrdersCount} đơn mới
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {pendingOrdersCount > 0 ? (
                    <Link
                      href="/admin/orders"
                      onClick={() => setNotificationsOpen(false)}
                      className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-100 flex items-start gap-2.5 hover:bg-orange-100/60 transition-colors block"
                    >
                      <Package className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">
                          Có {pendingOrdersCount} đơn hàng mới cần xác nhận!
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Nhấn vào đây để kiểm tra và đóng gói hàng.
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-3 text-center text-slate-400 text-xs">
                      Không có thông báo khẩn cấp nào.
                    </div>
                  )}

                  {lowStockCount > 0 && (
                    <Link
                      href="/admin/inventory"
                      onClick={() => setNotificationsOpen(false)}
                      className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-start gap-2.5 hover:bg-amber-100/60 transition-colors block"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">
                          {lowStockCount} sản phẩm dưới mức an toàn!
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Xem vị trí ngăn kệ để chuẩn bị nhập kho.
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* View Storefront Link */}
        <Link
          href="/"
          target="_blank"
          className="text-xs font-bold text-slate-700 hover:text-orange-600 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-xl border border-slate-200 hover:border-orange-200 bg-slate-50 shadow-2xs"
        >
          <span>Xem Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        {/* Admin User Profile Dropdown */}
        <div className="relative pl-2 border-l border-slate-200">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 text-left p-1 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-xs shadow-xs">
              {adminUser?.avatar || "AD"}
            </div>
            <div className="hidden lg:block">
              <span className="text-xs font-black text-slate-900 block leading-tight">
                {adminUser?.fullName || "Quản Trị Viên"}
              </span>
              <span className="text-[10px] text-orange-600 font-bold block leading-tight">
                Super Admin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
                  <p className="text-xs font-black text-slate-900">{adminUser?.fullName}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{adminUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black bg-orange-100 text-orange-700">
                    {adminUser?.role}
                  </span>
                </div>
                <div className="py-1">
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    ⚙️ Cài đặt hệ thống
                  </Link>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất quản trị</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
