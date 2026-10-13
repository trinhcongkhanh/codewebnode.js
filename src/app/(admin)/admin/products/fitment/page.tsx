"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bike,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Check,
  Package,
} from "lucide-react";
import { Product, ProductFitment } from "@/types/product";
import {
  getStoredProducts,
  getManufacturers,
  getModels,
  addProductFitment,
  removeProductFitment,
  subscribeToStoreUpdates,
} from "@/data/storeManager";
import { formatVND } from "@/lib/utils";

function FitmentAdminContent() {
  const searchParams = useSearchParams();
  const preselectedProductId = searchParams.get("product");

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  // New Fitment Form State
  const [selectedMfg, setSelectedMfg] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [yearFrom, setYearFrom] = useState<number>(2018);
  const [yearTo, setYearTo] = useState<number>(2024);
  const [notes, setNotes] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [formError, setFormError] = useState<string>("");

  const manufacturers = getManufacturers();

  const loadData = () => {
    const list = getStoredProducts();
    setProducts(list);
    if (!selectedProductId && list.length > 0) {
      if (preselectedProductId && list.some((p) => p.id === preselectedProductId)) {
        setSelectedProductId(preselectedProductId);
      } else {
        setSelectedProductId(list[0].id);
      }
    }
  };

  useEffect(() => {
    loadData();
    setIsMounted(true);
    const unsubscribe = subscribeToStoreUpdates(() => loadData());
    return () => unsubscribe();
  }, [preselectedProductId]);

  if (!isMounted) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId);
  const availableModels = selectedMfg ? getModels(selectedMfg) : [];

  const handleMfgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedMfg(val);
    setSelectedModel("");
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modId = e.target.value;
    setSelectedModel(modId);
    const mod = availableModels.find((m) => m.id === modId);
    if (mod) {
      setYearFrom(mod.yearRange.from);
      setYearTo(mod.yearRange.to);
    }
  };

  const handleAddFitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !selectedMfg || !selectedModel) {
      setFormError("Vui lòng chọn Hãng xe và Dòng xe");
      return;
    }

    const mfg = manufacturers.find((m) => m.id === selectedMfg);
    const mod = availableModels.find((m) => m.id === selectedModel);

    if (!mfg || !mod) return;

    addProductFitment(selectedProductId, {
      manufacturerId: mfg.id,
      manufacturerName: mfg.name,
      modelId: mod.id,
      modelName: mod.name,
      yearFrom: Number(yearFrom),
      yearTo: Number(yearTo),
      notes: notes.trim() || "Gắn vừa như zin",
      verified: isVerified,
    });

    setNotes("");
    setFormError("");
  };

  const handleRemoveFitment = (fitmentId: string) => {
    if (!selectedProductId) return;
    removeProductFitment(selectedProductId, fitmentId);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Bike className="w-6 h-6 text-orange-600" />
          Quản Lý Dữ Liệu Tương Thích Dòng Xe (Vehicle Fitment)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Gán nhãn các dòng xe (Hãng xe → Dòng xe → Đời xe) mà phụ tùng có thể gắn vừa chuẩn xác.
        </p>
      </div>

      {/* Main Grid: Select Product on Left, Fitment Assignment on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Selector Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Chọn Phụ Tùng
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {products.length} sản phẩm
            </span>
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {products.map((p) => {
              const isSelected = p.id === selectedProductId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-3 border ${
                    isSelected
                      ? "border-orange-500 bg-orange-50/60 ring-1 ring-orange-500/20"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-11 h-11 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? "text-orange-700" : "text-slate-800"}`}>
                      {p.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                      <span className="font-mono">{p.sku}</span>
                      <span>•</span>
                      <span className="text-orange-600 font-semibold">{p.fitments.length} dòng xe</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Assigned Fitments and Add New Fitment Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {currentProduct ? (
            <>
              {/* Current Product Header Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentProduct.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                      {currentProduct.brand} • {currentProduct.categoryName}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {currentProduct.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      SKU: <strong className="text-slate-800">{currentProduct.sku}</strong> — Giá: <strong className="text-orange-600">{formatVND(currentProduct.price)}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    Đã gán: {currentProduct.fitments.length} dòng xe
                  </span>
                </div>
              </div>

              {/* Add New Fitment Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Gán Thêm Dòng Xe Tương Thích
                </h3>

                <form onSubmit={handleAddFitment} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        1. Chọn Hãng xe
                      </label>
                      <select
                        value={selectedMfg}
                        onChange={handleMfgChange}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="">-- Chọn Hãng (Honda, Yamaha...) --</option>
                        {manufacturers.map((m) => (
                          <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                            {m.name} ({m.country})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        2. Chọn Dòng xe máy
                      </label>
                      <select
                        value={selectedModel}
                        onChange={handleModelChange}
                        disabled={!selectedMfg}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white disabled:opacity-50 focus:outline-none focus:border-orange-500"
                      >
                        <option value="">-- Chọn Dòng xe (SH, Winner X...) --</option>
                        {availableModels.map((m) => (
                          <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                            {m.name} (Đời {m.yearRange.from} - {m.yearRange.to})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Năm bắt đầu</label>
                      <input
                        type="number"
                        value={yearFrom}
                        onChange={(e) => setYearFrom(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Năm kết thúc</label>
                      <input
                        type="number"
                        value={yearTo}
                        onChange={(e) => setYearTo(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Xác minh chuẩn zin</label>
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isVerified}
                          onChange={(e) => setIsVerified(e.target.checked)}
                          className="rounded border-slate-700 text-orange-600 focus:ring-orange-500 w-4 h-4"
                        />
                        <span className="text-emerald-400 font-semibold">Đã kiểm tra thực tế</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Ghi chú kỹ thuật lắp ráp (Khuyên dùng)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ví dụ: Lắp chuẩn heo phanh trước Nissin hoặc Brembo..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {formError && (
                    <p className="text-xs text-rose-400 font-medium">{formError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedMfg || !selectedModel}
                    className="py-2.5 px-5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-orange-950/40"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Lưu Dữ Liệu Tương Thích Vào Hệ Thống</span>
                  </button>
                </form>
              </div>

              {/* Table of Assigned Fitments */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Các Dòng Xe Đang Được Gán Tương Thích
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {currentProduct.fitments.length} bản ghi
                  </span>
                </div>

                {currentProduct.fitments.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Chưa có dòng xe nào được gán tương thích cho phụ tùng này.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-800 border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
                          <th className="py-2.5 px-4">Hãng Xe</th>
                          <th className="py-2.5 px-4">Dòng Xe</th>
                          <th className="py-2.5 px-4">Năm Sản Xuất</th>
                          <th className="py-2.5 px-4">Ghi Chú</th>
                          <th className="py-2.5 px-4">Trạng Thái</th>
                          <th className="py-2.5 px-4 text-right">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentProduct.fitments.map((fit) => (
                          <tr key={fit.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-bold text-slate-900">{fit.manufacturerName}</td>
                            <td className="py-3 px-4 font-semibold text-orange-600">{fit.modelName}</td>
                            <td className="py-3 px-4 font-mono">
                              {fit.yearFrom} — {fit.yearTo}
                            </td>
                            <td className="py-3 px-4 text-slate-500">{fit.notes || "Gắn vừa như zin"}</td>
                            <td className="py-3 px-4">
                              {fit.verified ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> Đã Xác Minh
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                  Chưa xác minh
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleRemoveFitment(fit.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                                title="Xóa liên kết này"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Vui lòng chọn phụ tùng từ danh sách bên trái.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FitmentAdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-500">Đang tải cấu hình fitment...</div>}>
      <FitmentAdminContent />
    </Suspense>
  );
}
