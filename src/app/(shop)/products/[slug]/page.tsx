import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getStoredProducts } from "@/services/productService";
import { ProductDetailClient } from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * generateStaticParams — pre-render all product detail pages at build time.
 * Falls back to on-demand SSR if a slug is missing (new product added after build).
 */
export async function generateStaticParams() {
  const products = getStoredProducts();
  return products.map((p) => ({ slug: p.slug }));
}

/**
 * generateMetadata — per-product dynamic SEO metadata.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

/**
 * Product Detail Page (Server Component)
 * Fetches data server-side, delegates interactivity to ProductDetailClient.
 */
export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
