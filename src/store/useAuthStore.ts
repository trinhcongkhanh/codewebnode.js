import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
}

interface AuthStore {
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (phoneOrEmail: string, name?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: {
        name: "Nguyễn Biker",
        phone: "0908123456",
        email: "biker@motoparts.vn",
      }, // Default logged in demo user so experience is immediate
      isAuthModalOpen: false,
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      login: (phoneOrEmail, name = "Khách Hàng Thân Thiết") =>
        set({
          user: {
            name,
            phone: phoneOrEmail.includes("@") ? "0908123456" : phoneOrEmail,
            email: phoneOrEmail.includes("@") ? phoneOrEmail : "khachhang@motoparts.vn",
          },
          isAuthModalOpen: false,
        }),
      logout: () => set({ user: null }),
    }),
    {
      name: "motor_auth_storage_v1",
      skipHydration: true,
    }
  )
);
