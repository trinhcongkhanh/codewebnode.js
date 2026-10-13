"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bike, Check, X, RotateCcw, ChevronRight, Sparkles } from "lucide-react";
import { useFitmentStore } from "@/store/useFitmentStore";
import { initialManufacturers, initialModels } from "@/data/mockData";

interface VehicleFitmentSelectorProps {
  variant?: "banner" | "compact" | "modal";
  onApplied?: () => void;
}

export function VehicleFitmentSelector({
  variant = "banner",
  onApplied,
}: VehicleFitmentSelectorProps) {
  const router = useRouter();
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

  const [isMounted, setIsMounted] = useState(false);
  const [selectedMfg, setSelectedMfg] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | "">("");

  useEffect(() => {
    useFitmentStore.persist.rehydrate();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setSelectedMfg(manufacturerId || "");
      setSelectedModel(modelId || "");
      setSelectedYear(year || "");
    }
  }, [isMounted, manufacturerId, modelId, year]);

  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm animate-pulse h-28" />
    );
  }

  const availableModels = selectedMfg
    ? initialModels.filter((m) => m.manufacturerId === selectedMfg)
    : [];

  const currentModelData = availableModels.find((m) => m.id === selectedModel);

  // Generate years list based on model's year range
  const availableYears: number[] = [];
  if (currentModelData) {
    for (let y = currentModelData.yearRange.to; y >= currentModelData.yearRange.from; y--) {
      availableYears.push(y);
    }
  }

  const handleMfgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedMfg(val);
    setSelectedModel("");
    setSelectedYear("");
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedModel(val);
    setSelectedYear("");
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? Number(e.target.value) : "";
    setSelectedYear(val);
  };

  const handleApply = () => {
    if (selectedMfg && selectedModel && selectedYear) {
      setManufacturer(selectedMfg);
      setModel(selectedModel);
      setYear(Number(selectedYear));
      if (onApplied) onApplied();
      router.push(`/products?mfg=${selectedMfg}&model=${selectedModel}&year=${selectedYear}`);
    }
  };

  const handleClear = () => {
    setSelectedMfg("");
    setSelectedModel("");
    setSelectedYear("");
    clearFitment();
  };

  const activeVehicle = getSelectedVehicleInfo();

  if (variant === "compact") {
    return (
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Bike className="w-4 h-4 text-orange-600" /> Chọn Dòng Xe Của Bạn
          </span>
          {activeVehicle && (
            <button
              onClick={handleClear}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Đặt lại
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            value={selectedMfg}
            onChange={handleMfgChange}
            className="w-full text-xs rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="">1. Chọn Hãng xe</option>
            {initialManufacturers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            value={selectedModel}
            onChange={handleModelChange}
            disabled={!selectedMfg}
            className="w-full text-xs rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="">2. Chọn Dòng xe</option>
            {availableModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={handleYearChange}
            disabled={!selectedModel}
            className="w-full text-xs rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="">3. Chọn Năm SX</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                Năm {y}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleApply}
          disabled={!selectedMfg || !selectedModel || !selectedYear}
          className="mt-2 w-full py-1.5 px-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" /> Lọc Phụ Tùng Tương Thích
        </button>
      </div>
    );
  }

  // Primary Banner Variant (Used in Hero section and Product Listing Header)
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-xl border border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hệ thống tra cứu tương thích chuẩn xác</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bike className="w-5 h-5 text-orange-500" />
            Chọn xe của bạn để lọc phụ tùng gắn vừa zin
          </h3>
          <p className="text-xs md:text-sm text-slate-400">
            Tránh 100% tình trạng mua nhầm phụ tùng không lắp vừa vào xe.
          </p>
        </div>

        {activeVehicle && (
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-400">Đang chọn:</span>
            <span className="font-semibold text-orange-400">
              {activeVehicle.manufacturerName} {activeVehicle.modelName} ({activeVehicle.year})
            </span>
            <button
              onClick={handleClear}
              className="text-slate-400 hover:text-white ml-1 p-0.5"
              title="Xóa lựa chọn xe"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
        {/* Step 1: Hãng xe */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            1. Hãng sản xuất
          </label>
          <select
            value={selectedMfg}
            onChange={handleMfgChange}
            className="w-full text-sm rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
          >
            <option value="">Chọn hãng xe (Honda, Yamaha...)</option>
            {initialManufacturers.map((m) => (
              <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                {m.name} ({m.country})
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Dòng xe */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            2. Dòng xe máy
          </label>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            disabled={!selectedMfg}
            className="w-full text-sm rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-white disabled:bg-slate-800/40 disabled:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
          >
            <option value="">
              {selectedMfg ? "Chọn dòng xe (SH 125i, Winner X...)" : "Vui lòng chọn hãng xe trước"}
            </option>
            {availableModels.map((m) => (
              <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: Đời xe / Năm */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            3. Đời xe (Năm sản xuất)
          </label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            disabled={!selectedModel}
            className="w-full text-sm rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-white disabled:bg-slate-800/40 disabled:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
          >
            <option value="">
              {selectedModel ? "Chọn năm sản xuất" : "Vui lòng chọn dòng xe"}
            </option>
            {availableYears.map((y) => (
              <option key={y} value={y} className="bg-slate-900 text-white">
                Năm {y}
              </option>
            ))}
          </select>
        </div>

        {/* CTA Button */}
        <div className="sm:col-span-3 lg:col-span-1 flex items-end">
          <button
            onClick={handleApply}
            disabled={!selectedMfg || !selectedModel || !selectedYear}
            className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-orange-950/30"
          >
            <span>Tìm Phụ Tùng Tương Thích</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
