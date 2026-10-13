import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Không tìm thấy trang",
};

/**
 * Global not-found.tsx — shown for any unmatched URL.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <div className="text-8xl font-black text-orange-500">404</div>
        <h1 className="text-2xl font-black text-slate-900">Trang không tồn tại</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy kiểm tra lại đường dẫn.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
          >
            Về trang chủ
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl bg-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-300 transition-colors"
          >
            Xem phụ tùng
          </Link>
        </div>
      </div>
    </div>
  );
}
