"use client";

import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-black text-slate-900">Lỗi hệ thống Admin</h2>
        <p className="text-sm text-slate-500">{error.message ?? "Có lỗi không mong muốn trong trang quản trị."}</p>
        {error.digest && (
          <p className="text-xs text-slate-400 font-mono">Mã lỗi: {error.digest}</p>
        )}
        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
          >
            Thử lại
          </button>
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-300 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
