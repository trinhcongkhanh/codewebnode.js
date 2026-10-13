import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/services/productService";
import { initialProducts } from "@/data/mockData";

/**
 * GET /api/products/search
 *
 * Query params:
 *   q      — full-text search (name, sku, brand, category)
 *   mfg    — filter by manufacturer ID
 *   model  — filter by model ID
 *   year   — filter by year (requires mfg + model)
 *   cat    — filter by category slug
 *   page   — page number (1-indexed, default 1)
 *   limit  — results per page (default 20, max 100)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q      = searchParams.get("q")?.trim() ?? "";
  const mfg    = searchParams.get("mfg");
  const model  = searchParams.get("model");
  const year   = searchParams.get("year") ? Number(searchParams.get("year")) : null;
  const cat    = searchParams.get("cat");
  const page   = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit  = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20")));

  // Start with full-text search (falls through to all products if q is empty)
  let results = searchProducts(q);

  // Fitment filter (requires all three params)
  if (mfg && model && year) {
    results = results.filter((p) =>
      p.fitments.some(
        (f) =>
          f.manufacturerId === mfg &&
          f.modelId === model &&
          year >= f.yearFrom &&
          year <= f.yearTo
      )
    );
  }

  // Category filter (by slug)
  if (cat) {
    results = results.filter((p) => {
      const category = initialProducts.find((prod) => prod.id === p.id);
      return category?.categoryId === cat || p.categoryName.toLowerCase().includes(cat.toLowerCase());
    });
  }

  // Pagination
  const total = results.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = results.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    count: paginated.length,
    total,
    page,
    totalPages,
    data: paginated,
  });
}
