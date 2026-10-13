import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Wrench,
  Cog,
  Link2,
  Activity,
  Disc,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { initialCategories } from "@/data/mockData";

const categoryIconMap: Record<string, React.ReactNode> = {
  "cat-phuong-thang": <ShieldAlert className="w-6 h-6 text-orange-500" />,
  "cat-bao-duong": <Wrench className="w-6 h-6 text-blue-500" />,
  "cat-noi-truyen-dong": <Cog className="w-6 h-6 text-amber-500" />,
  "cat-sen-dia": <Link2 className="w-6 h-6 text-emerald-500" />,
  "cat-phuoc-nhun": <Activity className="w-6 h-6 text-purple-500" />,
  "cat-lop-vo": <Disc className="w-6 h-6 text-rose-500" />,
};

export function CategoryGrid() {
  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-orange-600 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phụ Tùng Theo Hệ Thống Kỹ Thuật</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Danh Mục Phụ Tùng Xe Máy
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>Xem tất cả danh mục</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {initialCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?cat=${cat.slug}`}
              className="group p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-orange-500/50 hover:shadow-xl hover-lift transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden shine-box"
            >
              <div className="w-14 h-14 rounded-2xl bg-white group-hover:bg-orange-50 border border-slate-200 group-hover:border-orange-200 flex items-center justify-center mb-3 transition-all duration-300 shadow-xs group-hover:scale-110 group-hover:rotate-3">
                {categoryIconMap[cat.id] || <Wrench className="w-6 h-6 text-slate-600" />}
              </div>
              <h3 className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
