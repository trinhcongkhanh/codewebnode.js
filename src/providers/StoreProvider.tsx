"use client";

import React from "react";
import { useCartStore } from "@/store/useCartStore";
import { useFitmentStore } from "@/store/useFitmentStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

/**
 * StoreProvider
 *
 * Hydrates Zustand persisted stores on the client side.
 * Must wrap the app so stores are rehydrated from localStorage
 * before any component reads from them — avoids hydration mismatch.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    useCartStore.persist.rehydrate();
    useFitmentStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    useAuthStore.persist.rehydrate();
    useAdminAuthStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
