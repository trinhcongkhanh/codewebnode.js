"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Bike,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Wrench,
  X,
  ChevronDown,
} from "lucide-react";
import { Product } from "@/types/product";
import {
  getStoredProducts,
  getCategories,
  getManufacturers,
  getModels,
  subscribeToStoreUpdates,
} from "@/data/storeManager";
import { useFitmentStore } from "@/store/useFitmentStore";
import { ProductCard } from "@/components/common/ProductCard";
import { VehicleFitmentSelector } from "@/components/common/VehicleFitmentSelector";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("cat") || "all"
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") || ""
  );
  const [sortBy, setSortBy] = useState<string>("featured");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyCompatible, setOnlyCompatible] = useState<boolean>(false);

  // Fitment Store
  const {
    manufacturerId,
    modelId,
    year,
    setManufacturer,
    setModel,
    setYear,
    clearFitment,
    getSelectedVehicleInfo,
  } = useFitmentStore();

  const categories = getCategories();
  const manufacturers = getManufacturers();

  useEffect(() => {
    useFitmentStore.persist.rehydrate();
    setProducts(getStoredProducts());
    setIsMounted(true);

    const unsubscribe = subscribeToStoreUpdates(() => {
      setProducts(getStoredProducts());
    });

    return () => unsubscribe();
  }, []);

  // Sync URL query params if present
  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setSelectedCategory(cat);

    const q = searchParams.get("q");
    if (q) setSearchQuery(q);

    const mfg = searchParams.get("mfg");
    const mod = searchParams.get("model");
    const yr = searchParams.get("year");

    if (mfg && mod && yr) {
      setManufacturer(mfg);
      setModel(mod);
      setYear(Number(yr));
      setOnlyCompatible(true);
    }
  }, [searchParams, setManufacturer, setModel, setYear]);

  const activeVehicle = isMounted ? getSelectedVehicleInfo() : null;

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category filter
      if (selectedCategory !== "all") {
        const catObj = categories.find((c) => c.slug === selectedCategory);
        if (catObj && product.categoryId !== catObj.id) {
          return false;
        }
      }

      // 2. Search Query filter (matches name, SKU, brand, or model name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesFitment = product.fitments.some((f) =>
          f.modelName.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesSku && !matchesBrand && !matchesFitment) {
          return false;
        }
      }

      // 3. In stock only filter
      if (onlyInStock && !product.inStock) {
        return false;
      }

      // 4. Vehicle Fitment filter
      if (onlyCompatible && activeVehicle) {
        const isMatched = product.fitments.some(
          (f) =>
            f.manufacturerId === activeVehicle.manufacturerId &&
            f.modelId === activeVehicle.modelId &&
            activeVehicle.year >= f.yearFrom &&
            activeVehicle.year <= f.yearTo
        );
        if (!isMatched) {
          return false;
        }
      }

      return true;
    });
  }, [
    products,
    selectedCategory,
    searchQuery,
    onlyInStock,
    onlyCompatible,
    activeVehicle,
    categories,
  ]);

  // Sort Pipeline
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
      case "featured":
      default:
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  const handleClearAllFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setOnlyInStock(false);
    setOnlyCompatible(false);
    clearFitment();
    router.push("/products");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Danh Sách Phụ Tùng Xe Máy
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Tìm thấy <strong className="text-orange-600 font-bold">{sortedProducts.length}</strong> sản phẩm phù hợp tiêu chuẩn kỹ thuật
          </p>
        </div>

        {/* Selected Vehicle Badge Header */}
        {activeVehicle && (
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl text-xs">
            <Bike className="w-5 h-5 text-orange-600 shrink-0" />
            <div>
              <span className="text-orange-950 font-medium">Đang lọc phụ tùng cho xe:</span>
              <p className="font-bold text-orange-700 text-sm">
                {activeVehicle.manufacturerName} {activeVehicle.modelName} ({activeVehicle.year})
              </p>
            </div>
            <button
              onClick={() => {
                clearFitment();
                setOnlyCompatible(false);
              }}
              className="text-orange-400 hover:text-orange-800 p-1 ml-2 transition-colors"
              title="Xóa lựa chọn xe"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Embedded Vehicle Fitment Selector Banner */}
      <VehicleFitmentSelector variant="banner" />

      {/* Main Filter & Product Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filter (Desktop) */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-600" /> Bộ Lọc Phụ Tùng
            </span>
            <button
              onClick={handleClearAllFilters}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Đặt lại
            </button>
          </div>

          {/* Vehicle Compatibility Toggle */}
          {activeVehicle && (
            <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-orange-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyCompatible}
                  onChange={(e) => setOnlyCompatible(e.target.checked)}
                  className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                />
                <span>Chỉ hiện phụ tùng gắn vừa {activeVehicle.modelName}</span>
              </label>
              <p className="text-[11px] text-orange-700 leading-normal pl-6">
                Tự động ẩn các sản phẩm không tương thích với đời {activeVehicle.year}.
              </p>
            </div>
          )}

          {/* In stock only toggle */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
              <span>Chỉ hiện sản phẩm còn hàng trong kho</span>
            </label>
          </div>

          {/* Categories Filter */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Danh Mục Hệ Thống
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedCategory === "all"
                    ? "bg-orange-50 text-orange-600 font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>Tất cả phụ tùng</span>
                <span className="text-[11px] text-slate-400">{products.length}</span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? "bg-orange-50 text-orange-600 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid Area (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            {/* Search Input Filter */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Lọc từ khóa, SKU..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
              />
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Bộ lọc ({filteredProducts.length})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 hidden sm:inline">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500 font-medium"
              >
                <option value="featured">Nổi bật nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name-asc">Tên phụ tùng (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {(selectedCategory !== "all" || searchQuery || onlyInStock || onlyCompatible) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500">Đang lọc theo:</span>

              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                  Danh mục: {categories.find((c) => c.slug === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory("all")} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                  Từ khóa: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {onlyInStock && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Còn hàng
                  <button onClick={() => setOnlyInStock(false)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {onlyCompatible && activeVehicle && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-800 border border-orange-200">
                  Khớp xe: {activeVehicle.modelName}
                  <button onClick={() => setOnlyCompatible(false)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleClearAllFilters}
                className="text-xs text-rose-600 hover:underline font-semibold ml-1"
              >
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Product Grid */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Không tìm thấy phụ tùng phù hợp
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {activeVehicle
                  ? `Hiện tại chưa có mã phụ tùng nào thuộc nhóm này được xác nhận lắp vừa cho ${activeVehicle.modelName} (${activeVehicle.year}). Bạn hãy thử bỏ bộ lọc xe hoặc tìm theo từ khóa khác.`
                  : "Không có sản phẩm nào khớp với bộ lọc bạn đã chọn. Vui lòng thử lại với các tiêu chí khác."}
              </p>
              <button
                onClick={handleClearAllFilters}
                className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Đặt lại toàn bộ bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500 text-xs">
          Đang tải danh sách phụ tùng...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
