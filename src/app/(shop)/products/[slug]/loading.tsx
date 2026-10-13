// Loading skeleton for product detail page
export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image skeleton */}
        <div className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
        {/* Detail skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-6 w-1/3 rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-16 rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-12 rounded-xl bg-orange-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
