"use client";

import Link from "next/link";

/**
 * Global error boundary — catches unhandled errors in server components.
 * Must be a Client Component.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md text-center px-6 py-12 space-y-6">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-2xl font-black text-slate-900">Có lỗi xảy ra</h1>
          <p className="text-sm text-slate-500">
            {error.message ?? "Đã có lỗi không mong muốn. Vui lòng thử lại."}
          </p>
          {error.digest && (
            <p className="text-xs text-slate-400 font-mono">ID: {error.digest}</p>
          )}
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
              Về trang chủ
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
