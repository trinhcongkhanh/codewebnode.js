"use client";

import React from "react";
import {
  Flame,
  Truck,
  ShieldCheck,
  Zap,
  RotateCcw,
  Bike,
  Sparkles,
} from "lucide-react";

export function MarqueeBanner() {
  const items = [
    { icon: Flame, text: "GIẢM GIÁ ĐẾN 35% TOÀN BỘ PHỤ TÙNG", color: "text-orange-400" },
    { icon: Truck, text: "MIỄN PHÍ GIAO HÀNG VỚI MÃ 'FREESHIP'", color: "text-amber-400" },
    { icon: ShieldCheck, text: "CAM KẾT 100% CHÍNH HÃNG — ĐỀN GẤP 10", color: "text-emerald-400" },
    { icon: Zap, text: "GIAO HỎA TỐC 2H NỘI THÀNH", color: "text-yellow-400" },
    { icon: RotateCcw, text: "ĐỔI TRẢ MIỄN PHÍ 7 NGÀY NẾU KHÔNG VỪA XE", color: "text-blue-400" },
    { icon: Bike, text: "TRA CỨU CHUẨN XÁC TỪNG ĐỜI XE", color: "text-purple-400" },
  ];

  return (
    <div className="bg-slate-950 border-y border-slate-800/80 py-2.5 overflow-hidden select-none">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {/* First copy */}
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={`m1-${idx}`} className="flex items-center gap-2 text-xs font-black tracking-wider text-slate-200">
              <Icon className={`w-4 h-4 ${item.color} shrink-0 animate-pulse`} />
              <span>{item.text}</span>
              <span className="text-slate-700 mx-3">•</span>
            </div>
          );
        })}

        {/* Second duplicate copy for seamless infinite loop */}
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={`m2-${idx}`} className="flex items-center gap-2 text-xs font-black tracking-wider text-slate-200">
              <Icon className={`w-4 h-4 ${item.color} shrink-0 animate-pulse`} />
              <span>{item.text}</span>
              <span className="text-slate-700 mx-3">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
