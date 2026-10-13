// Global loading UI — shown while the root layout or pages are streaming
export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        <p className="text-sm font-medium text-slate-500">Đang tải…</p>
      </div>
    </div>
  );
}
