"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Bike,
  Boxes,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  TicketPercent,
  Users,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

interface NavGroup {
  groupTitle: string;
  items: {
    href: string;
    label: string;
    icon: React.ReactNode;
    exact?: boolean;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: "TỔNG QUAN",
    items: [
      {
        href: "/admin",
        label: "Bảng Điều Hành (Dashboard)",
        icon: <LayoutDashboard className="w-4 h-4" />,
        exact: true,
      },
    ],
  },
  {
    groupTitle: "HÀNG HÓA & KHO BÃI",
    items: [
      {
        href: "/admin/products",
        label: "Quản Lý Sản Phẩm",
        icon: <Package className="w-4 h-4" />,
        exact: true,
      },
      {
        href: "/admin/products/fitment",
        label: "Tương Thích Xe (Fitment)",
        icon: <Bike className="w-4 h-4" />,
      },
      {
        href: "/admin/inventory",
        label: "Quản Lý Kho & Vị Trí Kệ",
        icon: <Boxes className="w-4 h-4" />,
      },
    ],
  },
  {
    groupTitle: "KINH DOANH & ĐƠN HÀNG",
    items: [
      {
        href: "/admin/orders",
        label: "Đơn Hàng & Đổi Trả",
        icon: <ShoppingBag className="w-4 h-4" />,
      },
      {
        href: "/admin/coupons",
        label: "Mã Giảm Giá & Voucher",
        icon: <TicketPercent className="w-4 h-4" />,
      },
    ],
  },
  {
    groupTitle: "KHÁCH HÀNG & HỆ THỐNG",
    items: [
      {
        href: "/admin/customers",
        label: "Khách Hàng & Biker VIP",
        icon: <Users className="w-4 h-4" />,
      },
      {
        href: "/admin/settings",
        label: "Cài Đặt Cửa Hàng & VietQR",
        icon: <Settings className="w-4 h-4" />,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, logout } = useAdminAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 selection:bg-orange-500 selection:text-white">
      {/* Brand header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black shadow-md shadow-orange-950/40 group-hover:scale-105 transition-transform">
            <Bike className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-black tracking-tight text-white">
                MOTO<span className="text-orange-500">PARTS</span>
              </span>
              <span className="text-[9px] uppercase font-black bg-orange-600/30 text-orange-400 border border-orange-500/30 px-1 py-0.2 rounded">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Admin Executive
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 p-3.5 space-y-5 overflow-y-auto custom-scrollbar">
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3 py-1">
              {group.groupTitle}
            </div>
            {group.items.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-950/40 font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={isActive ? "text-white" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User profile & Storefront actions footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/80 space-y-2.5">
        {/* Admin User Card */}
        <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-black text-xs shrink-0">
              {adminUser?.avatar || "AD"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {adminUser?.fullName || "Quản Trị Viên"}
              </p>
              <p className="text-[10px] text-amber-400 font-semibold truncate leading-tight mt-0.5">
                Super Admin
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Đăng xuất khỏi trang Admin"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* View Storefront Link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all group"
        >
          <span>Xem Website Khách Hàng</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400" />
        </Link>
      </div>
    </aside>
  );
}
