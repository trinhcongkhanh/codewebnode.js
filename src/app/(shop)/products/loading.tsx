// Loading skeleton for products listing page
export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Filter bar skeleton */}
      <div className="h-14 rounded-2xl bg-slate-200 animate-pulse mb-8" />
      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
