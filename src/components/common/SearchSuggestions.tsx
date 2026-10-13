"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Wrench, ArrowRight, Loader2, X } from "lucide-react";
import { Product } from "@/types/product";
import { getStoredProducts } from "@/services";
import { formatVND } from "@/lib/utils";

const POPULAR_SEARCH_TERMS = [
  "Bố thắng trước SH",
  "Bugi NGK CPR8EAIX-9",
  "Nồi trước FCC",
  "Nhông sên dĩa DID",
  "Dây curoa Bando",
  "Nhớt Motul 300V",
];

export function SearchSuggestions() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search filter effect with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(() => {
      const allProducts = getStoredProducts();
      const q = query.toLowerCase().trim();
      const matched = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.fitments.some((f) => f.modelName.toLowerCase().includes(q))
      );
      setResults(matched.slice(0, 5));
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectKeyword = (term: string) => {
    setQuery(term);
    setIsOpen(false);
    router.push(`/products?q=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Tìm phụ tùng, mã SKU (Bố thắng, Bugi NGK, Nồi trước...)..."
          className="w-full pl-10 pr-10 py-2 rounded-full border border-slate-300 bg-slate-50/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
        />
        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {isLoading && (
            <div className="p-4 flex items-center justify-center gap-2 text-slate-500 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
              <span>Đang tra cứu cơ sở dữ liệu phụ tùng...</span>
            </div>
          )}

          {!isLoading && query && results.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Gợi ý sản phẩm phù hợp</span>
                <span className="text-orange-600 font-normal">
                  {results.length} kết quả
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-bold text-orange-600">
                          {formatVND(product.price)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          SKU: {product.sku}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 shrink-0" />
                  </Link>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 px-2 pb-1 text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
                >
                  Xem tất cả kết quả cho &quot;{query}&quot;
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="p-6 text-center">
              <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Không tìm thấy phụ tùng phù hợp với &quot;{query}&quot;
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Thử tìm theo tên phụ tùng như &quot;Bố thắng&quot;, &quot;Bugi&quot; hoặc theo mã SKU
              </p>
            </div>
          )}

          {/* Quick Keywords when input is empty */}
          {!query && (
            <div className="p-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
                Từ khóa kỹ thuật phổ biến
              </p>
              <div className="flex flex-wrap gap-1.5 px-2">
                {POPULAR_SEARCH_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectKeyword(term)}
                    className="text-xs bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 px-2.5 py-1 rounded-full transition-colors border border-slate-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
