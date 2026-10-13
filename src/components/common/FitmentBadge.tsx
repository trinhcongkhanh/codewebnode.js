"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Bike } from "lucide-react";
import { Product } from "@/types/product";
import { useFitmentStore } from "@/store/useFitmentStore";

interface FitmentBadgeProps {
  product: Product;
  compact?: boolean;
}

export function FitmentBadge({ product, compact = false }: FitmentBadgeProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { getSelectedVehicleInfo, checkCompatibility } = useFitmentStore();

  useEffect(() => {
    useFitmentStore.persist.rehydrate();
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const selectedVehicle = getSelectedVehicleInfo();
  if (!selectedVehicle) {
    if (compact) return null;
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
        <Bike className="w-3.5 h-3.5 text-slate-500" />
        <span>Chọn xe để kiểm tra lắp vừa</span>
      </div>
    );
  }

  const compatibility = checkCompatibility(product);

  if (compatibility.isCompatible) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
          compact ? "py-0.5 px-2" : ""
        } ${
          compatibility.verified
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-teal-50 text-teal-700 border-teal-200"
        }`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="truncate">
          Gắn vừa: <strong className="font-semibold">{selectedVehicle.modelName} ({selectedVehicle.year})</strong>
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 ${
        compact ? "py-0.5 px-2" : ""
      }`}
    >
      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
      <span className="truncate">
        Chưa xác nhận cho: <strong>{selectedVehicle.modelName}</strong>
      </span>
    </div>
  );
}
