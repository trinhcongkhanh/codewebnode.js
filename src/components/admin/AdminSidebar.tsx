"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Bike,
  Boxes,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Tổng Quan (Dashboard)",
    icon: <LayoutDashboard className="w-4 h-4" />,
    exact: true,
  },
  {
    href: "/admin/products",
    label: "Quản Lý Sản Phẩm",
    icon: <Package className="w-4 h-4" />,
    exact: true,
  },
  {
    href: "/admin/products/fitment",
    label: "Tương Thích Dòng Xe (Fitment)",
    icon: <Bike className="w-4 h-4" />,
  },
  {
    href: "/admin/inventory",
    label: "Quản Lý Tồn Kho & Kệ",
    icon: <Boxes className="w-4 h-4" />,
  },
  {
    href: "/admin/orders",
    label: "Quản Lý Đơn Hàng & Đổi Trả",
    icon: <ShoppingBag className="w-4 h-4" />,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-white block">
              MOTO<span className="text-orange-500">PARTS</span>
            </span>
            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block -mt-1">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
          Hệ Thống Quản Trị
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-orange-600 text-white shadow-md shadow-orange-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Return to Storefront */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className="p-3 bg-slate-800/60 rounded-xl text-[11px] text-slate-400 space-y-1 border border-slate-800">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Môi Trường Demo Cục Bộ</span>
          </div>
          <p>Dữ liệu được lưu trữ và đồng bộ hóa qua bộ nhớ trình duyệt.</p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
        >
          <span>Về Cửa Hàng (Storefront)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
