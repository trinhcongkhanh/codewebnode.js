import { NextRequest, NextResponse } from "next/server";
import { initialProducts } from "@/data/mockData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase().trim() || "";
  const mfg = searchParams.get("mfg");
  const model = searchParams.get("model");
  const year = searchParams.get("year") ? Number(searchParams.get("year")) : null;

  let results = initialProducts;

  if (q) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.fitments.some((f) => f.modelName.toLowerCase().includes(q))
    );
  }

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

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
  });
}
