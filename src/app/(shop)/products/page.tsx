"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bike,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Wrench,
  X,
  LayoutGrid,
  List,
  Tag,
  Check,
  Eye,
  ShoppingBag,
  Star,
  Heart,
} from "lucide-react";
import { Product } from "@/types/product";
import {
  getStoredProducts,
  getCategories,
  subscribeToStoreUpdates,
} from "@/services";
import { formatVND } from "@/lib/utils";
import { useFitmentStore } from "@/store/useFitmentStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToastStore } from "@/store/useToastStore";
import { ProductCard } from "@/components/common/ProductCard";
import { VehicleFitmentSelector } from "@/components/common/VehicleFitmentSelector";
import { FitmentBadge } from "@/components/common/FitmentBadge";
import { QuickViewModal } from "@/components/common/QuickViewModal";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("cat") || "all"
  );
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") || ""
  );
  const [sortBy, setSortBy] = useState<string>("featured");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlySale, setOnlySale] = useState<boolean>(false);
  const [onlyCompatible, setOnlyCompatible] = useState<boolean>(false);

  // Cart & Wishlist for List View
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Fitment Store
  const {
    setManufacturer,
    setModel,
    setYear,
    clearFitment,
    getSelectedVehicleInfo,
  } = useFitmentStore();

  const categories = getCategories();

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

  // Extract all available brands
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

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

      // 2. Brand filter
      if (selectedBrand !== "all" && product.brand !== selectedBrand) {
        return false;
      }

      // 3. Price Range filter
      if (priceRange === "under-300k" && product.price >= 300000) return false;
      if (priceRange === "300k-800k" && (product.price < 300000 || product.price > 800000)) return false;
      if (priceRange === "800k-1500k" && (product.price < 800000 || product.price > 1500000)) return false;
      if (priceRange === "over-1500k" && product.price <= 1500000) return false;

      // 4. Search Query filter
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

      // 5. In stock only filter
      if (onlyInStock && !product.inStock) {
        return false;
      }

      // 6. Sale only filter
      if (onlySale && (!product.originalPrice || product.originalPrice <= product.price)) {
        return false;
      }

      // 7. Vehicle Fitment filter
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
    selectedBrand,
    priceRange,
    searchQuery,
    onlyInStock,
    onlySale,
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
      case "discount":
        return list.sort((a, b) => {
          const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discB - discA;
        });
      case "featured":
      default:
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  const handleClearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRange("all");
    setSearchQuery("");
    setOnlyInStock(false);
    setOnlySale(false);
    setOnlyCompatible(false);
    clearFitment();
    router.push("/products");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    priceRange !== "all" ||
    searchQuery !== "" ||
    onlyInStock ||
    onlySale ||
    onlyCompatible;

  // Filter content component reused for desktop sidebar and mobile drawer
  const FilterContent = () => (
    <div className="space-y-6">
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

      {/* Stock & Sale toggles */}
      <div className="space-y-2.5 pt-1 border-t border-slate-100">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
          />
          <span>Chỉ hiện sản phẩm còn hàng</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={onlySale}
            onChange={(e) => setOnlySale(e.target.checked)}
            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
          />
          <span className="text-rose-600 font-bold">Chỉ sản phẩm đang giảm giá 🔥</span>
        </label>
      </div>

      {/* Price Range Filter */}
      <div className="pt-2 border-t border-slate-100">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
          Mức Giá
        </h3>
        <div className="space-y-1.5">
          {[
            { id: "all", label: "Tất cả mức giá" },
            { id: "under-300k", label: "Dưới 300.000đ" },
            { id: "300k-800k", label: "300.000đ — 800.000đ" },
            { id: "800k-1500k", label: "800.000đ — 1.500.000đ" },
            { id: "over-1500k", label: "Trên 1.500.000đ" },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setPriceRange(range.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                priceRange === range.id
                  ? "bg-orange-50 text-orange-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{range.label}</span>
              {priceRange === range.id && <Check className="w-3.5 h-3.5 text-orange-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="pt-2 border-t border-slate-100">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
          Thương Hiệu Chính Hãng
        </h3>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedBrand("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              selectedBrand === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Tất cả
          </button>
          {availableBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedBrand === brand
                  ? "bg-orange-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="pt-2 border-t border-slate-100">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
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
    </div>
  );

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
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-600" /> Bộ Lọc Phụ Tùng
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" /> Đặt lại
              </button>
            )}
          </div>

          <FilterContent />
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-orange-600" /> Bộ Lọc Nhanh
                  </h2>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterContent />
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 flex gap-2">
                <button
                  onClick={handleClearAllFilters}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Xóa lọc
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
                >
                  Xem kết quả ({sortedProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Area (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            {/* Search Input Filter */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Lọc từ khóa, SKU, hãng..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
              />
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 bg-slate-50"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
              <span>Bộ lọc ({sortedProducts.length})</span>
            </button>

            {/* View Mode Toggle & Sort Dropdown */}
            <div className="flex items-center gap-3">
              {/* Grid / List switch */}
              <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-orange-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Dạng lưới"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-orange-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Dạng danh sách"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 hidden sm:inline">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500 font-bold"
                >
                  <option value="featured">Nổi bật nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="discount">Giảm giá nhiều nhất</option>
                  <option value="name-asc">Tên phụ tùng (A - Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 font-medium">Đang lọc theo:</span>

              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  Danh mục: {categories.find((c) => c.slug === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory("all")} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedBrand !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                  Hãng: {selectedBrand}
                  <button onClick={() => setSelectedBrand("all")} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {priceRange !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  Giá: {
                    priceRange === "under-300k" ? "< 300k" :
                    priceRange === "300k-800k" ? "300k - 800k" :
                    priceRange === "800k-1500k" ? "800k - 1.5tr" : "> 1.5tr"
                  }
                  <button onClick={() => setPriceRange("all")} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  Từ khóa: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {onlyInStock && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Còn hàng
                  <button onClick={() => setOnlyInStock(false)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {onlySale && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                  Đang giảm giá
                  <button onClick={() => setOnlySale(false)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {onlyCompatible && activeVehicle && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200">
                  Khớp xe: {activeVehicle.modelName}
                  <button onClick={() => setOnlyCompatible(false)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleClearAllFilters}
                className="text-xs text-rose-600 hover:underline font-bold ml-1"
              >
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Product Output (Grid or List) */}
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
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => {
                const discount = product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;
                const isFav = isInWishlist(product.id);

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-orange-500/50 hover:shadow-xl transition-all duration-300 p-4 flex flex-col sm:flex-row gap-5 items-start sm:items-center relative"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="w-full sm:w-48 aspect-4/3 sm:aspect-square bg-slate-100 rounded-xl overflow-hidden shrink-0 relative block"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                          -{discount}%
                        </span>
                      )}
                    </Link>

                    {/* Middle Info */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                          {product.brand}
                        </span>
                        <FitmentBadge product={product} compact />
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm sm:text-base font-bold text-slate-900 hover:text-orange-600 transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>4.9</span>
                        </div>
                        <span>•</span>
                        <span>SKU: {product.sku}</span>
                        <span>•</span>
                        <span>{product.inStock ? "✅ Còn hàng" : "❌ Hết hàng"}</span>
                      </div>
                    </div>

                    {/* Right Price & Actions */}
                    <div className="w-full sm:w-auto sm:border-l sm:border-slate-100 sm:pl-6 sm:text-right flex sm:flex-col justify-between items-center sm:items-end gap-3 shrink-0">
                      <div>
                        <div className="text-lg font-black text-orange-600">
                          {formatVND(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-xs text-slate-400 line-through">
                            {formatVND(product.originalPrice)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const added = toggleItem(product);
                            addToast(
                              added
                                ? `Đã thêm "${product.name}" vào yêu thích!`
                                : `Đã bỏ "${product.name}" khỏi yêu thích!`,
                              "info"
                            );
                          }}
                          className={`p-2 rounded-xl border border-slate-200 transition-colors ${
                            isFav ? "bg-rose-50 text-rose-600" : "hover:bg-slate-100 text-slate-500"
                          }`}
                          title="Yêu thích"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-rose-600 text-rose-600" : ""}`} />
                        </button>

                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Xem nhanh"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            addItem(product, 1);
                            addToast(`Đã thêm "${product.name}" vào giỏ hàng!`, "success");
                          }}
                          disabled={!product.inStock}
                          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-slate-200 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-950/20"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Thêm</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal for List Mode */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
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
