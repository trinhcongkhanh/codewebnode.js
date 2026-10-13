"use client";

import { useSyncExternalStore } from "react";
import { subscribeToProductUpdates, getStoredProducts } from "@/services/productService";
import { subscribeToOrderUpdates, getStoredOrders } from "@/services/orderService";
import { Product } from "@/types/product";
import { Order } from "@/types/order";

/**
 * Reactive hook that returns live products from localStorage.
 * Re-renders automatically when any service write triggers STORE_UPDATE_EVENT.
 */
export function useProducts(): Product[] {
  return useSyncExternalStore(
    subscribeToProductUpdates,
    getStoredProducts,
    getStoredProducts
  );
}

/**
 * Reactive hook that returns live orders from localStorage.
 * Re-renders automatically when any service write triggers STORE_UPDATE_EVENT.
 */
export function useOrders(): Order[] {
  return useSyncExternalStore(
    subscribeToOrderUpdates,
    getStoredOrders,
    getStoredOrders
  );
}

/**
 * Convenience hook that returns both live data slices.
 */
export function useStoreData() {
  const products = useProducts();
  const orders = useOrders();
  return { products, orders };
}
