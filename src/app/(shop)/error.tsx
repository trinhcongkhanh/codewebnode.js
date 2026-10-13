"use client";

import Link from "next/link";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 items-center justify-center px-4">
      <div className="max-w-md text-center space-y-5">
        <div className="text-5xl">🔧</div>
        <h2 className="text-xl font-black text-slate-900">Có lỗi xảy ra</h2>
        <p className="text-sm text-slate-500">{error.message ?? "Vui lòng thử lại."}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
          >
            Thử lại
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-300 transition-colors"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
