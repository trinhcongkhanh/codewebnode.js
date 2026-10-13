import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";
import { initialManufacturers, initialModels } from "@/data/mockData";

export interface SelectedVehicleInfo {
  manufacturerId: string;
  manufacturerName: string;
  modelId: string;
  modelName: string;
  year: number;
}

interface FitmentStore {
  manufacturerId: string | null;
  modelId: string | null;
  year: number | null;

  setManufacturer: (id: string | null) => void;
  setModel: (id: string | null) => void;
  setYear: (year: number | null) => void;
  setFullFitment: (manufacturerId: string, modelId: string, year: number) => void;
  clearFitment: () => void;

  hasSelectedVehicle: () => boolean;
  getSelectedVehicleInfo: () => SelectedVehicleInfo | null;
  checkCompatibility: (product: Product) => {
    isCompatible: boolean;
    verified: boolean;
    notes?: string;
  };
}

export const useFitmentStore = create<FitmentStore>()(
  persist(
    (set, get) => ({
      manufacturerId: null,
      modelId: null,
      year: null,

      setManufacturer: (id) =>
        set({
          manufacturerId: id,
          modelId: null,
          year: null,
        }),

      setModel: (id) =>
        set({
          modelId: id,
          year: null,
        }),

      setYear: (year) =>
        set({
          year,
        }),

      setFullFitment: (manufacturerId, modelId, year) =>
        set({
          manufacturerId,
          modelId,
          year,
        }),

      clearFitment: () =>
        set({
          manufacturerId: null,
          modelId: null,
          year: null,
        }),

      hasSelectedVehicle: () => {
        const { manufacturerId, modelId, year } = get();
        return Boolean(manufacturerId && modelId && year);
      },

      getSelectedVehicleInfo: () => {
        const { manufacturerId, modelId, year } = get();
        if (!manufacturerId || !modelId || !year) return null;

        const mfg = initialManufacturers.find((m) => m.id === manufacturerId);
        const mod = initialModels.find((m) => m.id === modelId);

        return {
          manufacturerId,
          manufacturerName: mfg ? mfg.name : "Hãng xe",
          modelId,
          modelName: mod ? mod.name : "Dòng xe",
          year,
        };
      },

      checkCompatibility: (product: Product) => {
        const { manufacturerId, modelId, year } = get();
        if (!manufacturerId || !modelId || !year) {
          return { isCompatible: true, verified: false };
        }

        const match = product.fitments.find(
          (f) =>
            f.manufacturerId === manufacturerId &&
            f.modelId === modelId &&
            year >= f.yearFrom &&
            year <= f.yearTo
        );

        if (match) {
          return {
            isCompatible: true,
            verified: match.verified,
            notes: match.notes,
          };
        }

        return {
          isCompatible: false,
          verified: false,
          notes: "Không có thông tin tương thích với xe bạn đã chọn",
        };
      },
    }),
    {
      name: "motor_fitment_storage_v1",
      skipHydration: true,
    }
  )
);
