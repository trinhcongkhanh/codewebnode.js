"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { getStoredInventory } from "@/data/storeManager";

export function AdminHeader() {
  const [lowStockCount, setLowStockCount] = React.useState(0);

  React.useEffect(() => {
    const inv = getStoredInventory();
    const count = inv.filter((i) => i.status === "low_stock" || i.status === "out_of_stock").length;
    setLowStockCount(count);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          MotoParts Pro Administration
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Low Stock Warning Pill */}
        {lowStockCount > 0 && (
          <Link
            href="/admin/inventory"
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-semibold hover:bg-amber-100 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{lowStockCount} sản phẩm sắp hết hàng</span>
          </Link>
        )}

        {/* View Storefront */}
        <Link
          href="/"
          className="text-xs font-semibold text-slate-600 hover:text-orange-600 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:border-orange-200 bg-slate-50"
        >
          <span>Xem Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            TÚ
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-slate-800 block leading-tight">
              Kỹ Thuật Viên Tú
            </span>
            <span className="text-[10px] text-slate-400 block">
              Quản Trị Viên Kho
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
