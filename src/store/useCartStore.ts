import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: "fixed" | "percent";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
}

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "FREESHIP",
    description: "Miễn phí vận chuyển toàn quốc (Giảm 35k)",
    discountType: "fixed",
    discountValue: 35000,
    minOrderValue: 200000,
  },
  {
    code: "CHAOBIKER",
    description: "Giảm ngay 50.000đ cho biker mới",
    discountType: "fixed",
    discountValue: 50000,
    minOrderValue: 300000,
  },
  {
    code: "PRO10",
    description: "Giảm 10% tổng đơn hàng (Tối đa 150k)",
    discountType: "percent",
    discountValue: 10,
    minOrderValue: 500000,
    maxDiscount: 150000,
  },
  {
    code: "VIPMOTUL",
    description: "Giảm 100.000đ cho đơn phụ tùng từ 1 triệu",
    discountType: "fixed",
    discountValue: 100000,
    minOrderValue: 1000000,
  },
];

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: Coupon | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getGrandTotal: (shippingFee?: number) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentQty = updatedItems[existingIndex].quantity;
            const newQty = Math.min(
              currentQty + quantity,
              product.stockQuantity || 99
            );
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: newQty,
            };
            return { items: updatedItems, isOpen: true };
          }

          const addQty = Math.min(quantity, product.stockQuantity || 99);
          return {
            items: [...state.items, { product, quantity: addQty }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }

          const updatedItems = state.items.map((item) => {
            if (item.product.id === productId) {
              const maxStock = item.product.stockQuantity || 99;
              return {
                ...item,
                quantity: Math.min(quantity, maxStock),
              };
            }
            return item;
          });

          return { items: updatedItems };
        });
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      applyCoupon: (code: string) => {
        const normalized = code.trim().toUpperCase();
        const found = AVAILABLE_COUPONS.find((c) => c.code === normalized);
        if (!found) {
          return { success: false, message: "Mã giảm giá không tồn tại hoặc đã hết hạn" };
        }

        const subtotal = get().getSubtotal();
        if (subtotal < found.minOrderValue) {
          return {
            success: false,
            message: `Mã ${found.code} yêu cầu đơn hàng tối thiểu từ ${(found.minOrderValue).toLocaleString("vi-VN")}đ`,
          };
        }

        set({ appliedCoupon: found });
        return { success: true, message: `Áp dụng thành công mã ${found.code}: ${found.description}` };
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getDiscountAmount: () => {
        const { appliedCoupon } = get();
        if (!appliedCoupon) return 0;
        const subtotal = get().getSubtotal();
        if (subtotal < appliedCoupon.minOrderValue) return 0;

        if (appliedCoupon.discountType === "fixed") {
          return Math.min(appliedCoupon.discountValue, subtotal);
        } else {
          const discount = (subtotal * appliedCoupon.discountValue) / 100;
          return appliedCoupon.maxDiscount
            ? Math.min(discount, appliedCoupon.maxDiscount)
            : discount;
        }
      },

      getGrandTotal: (shippingFee = 0) => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        return Math.max(0, subtotal - discount + shippingFee);
      },
    }),
    {
      name: "motor_cart_storage_v1",
      skipHydration: true,
    }
  )
);
