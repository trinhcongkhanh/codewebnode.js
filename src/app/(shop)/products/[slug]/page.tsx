import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Bike, CheckCircle2, AlertTriangle } from "lucide-react";
import { initialProducts } from "@/data/mockData";
import { CrossSellList } from "@/components/storefront/CrossSellList";
import { ProductCard } from "@/components/common/ProductCard";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return initialProducts.map((p) => ({
    slug: p.slug,
  }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function ProductDetailLoader({ params }: PageProps) {
  const { slug } = await params;
  const product = initialProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = initialProducts.filter((p) =>
    product.relatedProductIds?.includes(p.id)
  );

  const sameCategoryProducts = initialProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
        <Link href="/" className="hover:text-orange-600 transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/products" className="hover:text-orange-600 transition-colors">
          Phụ tùng
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link
          href={`/products?cat=${product.categoryId}`}
          className="hover:text-orange-600 transition-colors"
        >
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Interactive Product Section */}
      <ProductDetailClient product={product} />

      {/* Cross-sell & Up-sell Component */}
      {relatedProducts.length > 0 && (
        <CrossSellList
          currentProduct={product}
          relatedProducts={relatedProducts}
        />
      )}

      {/* Compatible Vehicles Technical Specifications Table */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bike className="w-5 h-5 text-orange-600" />
            Bảng Tra Cứu Tương Thích Dòng Xe Chi Tiết
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dữ liệu kỹ thuật chuẩn xác đã được kỹ thuật viên kho kiểm định gắn khít từng chân ốc và khớp nối.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                <th className="py-3 px-4">Hãng Xe</th>
                <th className="py-3 px-4">Dòng Xe</th>
                <th className="py-3 px-4">Đời Xe / Năm Phù Hợp</th>
                <th className="py-3 px-4">Ghi Chú Kỹ Thuật</th>
                <th className="py-3 px-4 text-center">Trạng Thái Xác Minh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {product.fitments.map((fit) => (
                <tr key={fit.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{fit.manufacturerName}</td>
                  <td className="py-3 px-4 font-semibold text-orange-600">{fit.modelName}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 font-medium px-2 py-0.5 rounded text-slate-800">
                      Năm {fit.yearFrom} — {fit.yearTo}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{fit.notes || "Gắn vừa như zin"}</td>
                  <td className="py-3 px-4 text-center">
                    {fit.verified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Chuẩn Zin 100%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5" /> Cần Thử Xe
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Same Category Products */}
      {sameCategoryProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Phụ Tùng Cùng Nhóm {product.categoryName}
            </h2>
            <Link
              href={`/products?cat=${product.categoryId}`}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              Xem thêm
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sameCategoryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
          Đang tải thông số kỹ thuật phụ tùng...
        </div>
      }
    >
      <ProductDetailLoader params={params} />
    </Suspense>
  );
}
