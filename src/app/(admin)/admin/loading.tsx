// Loading skeleton for admin dashboard pages
export default function AdminLoading() {
  return (
    <div className="flex min-h-screen bg-slate-100/70">
      {/* Sidebar skeleton */}
      <aside className="w-64 bg-slate-900 shrink-0 animate-pulse" />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header skeleton */}
        <header className="h-16 bg-white border-b border-slate-200 animate-pulse" />
        {/* Content skeleton */}
        <main className="flex-1 p-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
          <div className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
        </main>
      </div>
    </div>
  );
}
