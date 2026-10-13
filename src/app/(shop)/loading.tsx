// Loading skeleton for shop pages
export default function ShopLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header skeleton */}
      <header className="h-16 bg-white border-b border-slate-200 animate-pulse" />
      {/* Content skeleton */}
      <main className="flex-1 bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
