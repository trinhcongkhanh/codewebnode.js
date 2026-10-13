import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  role: string;
  avatar: string;
  email: string;
  lastLogin: string;
  ip: string;
}

export interface SecurityAuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
  status: "success" | "warning" | "danger";
}

interface AdminAuthStore {
  isAuthenticated: boolean;
  isLocked: boolean;
  is2FAPending: boolean;
  adminUser: AdminUser | null;
  adminPassword: string;
  securityPin: string;
  failedAttempts: number;
  lockUntil: number | null;
  auditLogs: SecurityAuditLog[];

  // Actions
  loginStep1: (username: string, password: string) => { success: boolean; error?: string; require2FA?: boolean };
  verifyOTP: (otp: string) => { success: boolean; error?: string };
  demoLogin: () => void;
  lockScreen: () => void;
  unlockScreen: (pinOrPass: string) => boolean;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => boolean;
  changePin: (oldPin: string, newPin: string) => boolean;
  addAuditLog: (action: string, details: string, status?: "success" | "warning" | "danger") => void;
}

const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: "log-1",
    action: "Đăng nhập thành công",
    details: "Xác thực 2 yếu tố (2FA OTP) hoàn tất thành công",
    timestamp: "Hôm nay, 08:30:15",
    ip: "118.69.182.10 (TP. Hồ Chí Minh)",
    status: "success",
  },
  {
    id: "log-2",
    action: "Cập nhật tồn kho",
    details: "Điều chỉnh số lượng Kệ A3 — Ngăn số 2 (+15 cái)",
    timestamp: "Hôm nay, 09:15:22",
    ip: "118.69.182.10 (TP. Hồ Chí Minh)",
    status: "success",
  },
  {
    id: "log-3",
    action: "Cảnh báo bảo mật",
    details: "Phát hiện 1 lượt thử mật khẩu sai từ thiết bị lạ",
    timestamp: "Hôm qua, 22:40:11",
    ip: "14.161.35.88 (Hà Nội)",
    status: "warning",
  },
];

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: true,
      isLocked: false,
      is2FAPending: false,
      adminUser: {
        id: "adm-001",
        username: "admin",
        fullName: "Kỹ Thuật Viên Tú",
        role: "Tổng Quản Trị Hệ Thống (Super Admin)",
        avatar: "TÚ",
        email: "admin@motopartspro.vn",
        lastLogin: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        ip: "118.69.182.10 (TP.HCM)",
      },
      adminPassword: "admin123",
      securityPin: "8888",
      failedAttempts: 0,
      lockUntil: null,
      auditLogs: INITIAL_AUDIT_LOGS,

      loginStep1: (username: string, password: string) => {
        const state = get();
        const now = Date.now();

        // Check brute force lockout
        if (state.lockUntil && now < state.lockUntil) {
          const remainingMinutes = Math.ceil((state.lockUntil - now) / 60000);
          return {
            success: false,
            error: `Tài khoản tạm thời bị khóa do nhập sai nhiều lần. Vui lòng thử lại sau ${remainingMinutes} phút!`,
          };
        }

        // Validate credentials
        const isValid =
          (username === "admin" && password === state.adminPassword) ||
          (username === "admin" && password === "admin123") ||
          (username.trim().length > 0 && password === state.adminPassword);

        if (isValid) {
          // Trigger 2FA step
          set({
            is2FAPending: true,
            failedAttempts: 0,
            lockUntil: null,
          });
          return { success: true, require2FA: true };
        } else {
          const nextAttempts = state.failedAttempts + 1;
          let newLockUntil = null;
          let error = `Mật khẩu hoặc tên đăng nhập không đúng (Sai ${nextAttempts}/5 lần).`;

          if (nextAttempts >= 5) {
            newLockUntil = now + 5 * 60 * 1000; // 5 minute lock
            error = "Bạn đã nhập sai quá 5 lần! Hệ thống tạm thời khóa đăng nhập trong 5 phút để bảo vệ.";
          }

          set({
            failedAttempts: nextAttempts,
            lockUntil: newLockUntil,
          });

          get().addAuditLog(
            "Đăng nhập thất bại",
            `Nhập sai thông tin đăng nhập cho user "${username}" (${nextAttempts}/5 lần)`,
            nextAttempts >= 5 ? "danger" : "warning"
          );

          return { success: false, error };
        }
      },

      verifyOTP: (otp: string) => {
        const state = get();
        // Accepted OTP: 888888 or 8888 or state.securityPin
        if (otp === "888888" || otp === "8888" || otp === state.securityPin) {
          const nowStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
          set({
            isAuthenticated: true,
            isLocked: false,
            is2FAPending: false,
            failedAttempts: 0,
            adminUser: {
              id: "adm-001",
              username: "admin",
              fullName: "Kỹ Thuật Viên Tú",
              role: "Tổng Quản Trị Hệ Thống (Super Admin)",
              avatar: "TÚ",
              email: "admin@motopartspro.vn",
              lastLogin: nowStr,
              ip: "118.69.182.10 (TP.HCM)",
            },
          });

          get().addAuditLog(
            "Xác thực 2FA thành công",
            "Mã OTP 6 số hợp lệ. Đăng nhập quyền Super Admin",
            "success"
          );

          return { success: true };
        }

        return { success: false, error: "Mã OTP 2FA không chính xác! Vui lòng kiểm tra lại." };
      },

      demoLogin: () => {
        const nowStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
        set({
          isAuthenticated: true,
          isLocked: false,
          is2FAPending: false,
          failedAttempts: 0,
          lockUntil: null,
          adminUser: {
            id: "adm-001",
            username: "admin",
            fullName: "Kỹ Thuật Viên Tú",
            role: "Tổng Quản Trị Hệ Thống (Super Admin)",
            avatar: "TÚ",
            email: "admin@motopartspro.vn",
            lastLogin: nowStr,
            ip: "118.69.182.10 (TP.HCM)",
          },
        });

        get().addAuditLog(
          "Đăng nhập nhanh (Bypass Demo)",
          "Xác thực quyền Super Admin 1-chạm",
          "success"
        );
      },

      lockScreen: () => {
        set({ isLocked: true });
        get().addAuditLog("Khóa màn hình làm việc", "Kích hoạt bảo vệ màn hình tức thì", "warning");
      },

      unlockScreen: (pinOrPass: string) => {
        const state = get();
        if (
          pinOrPass === state.securityPin ||
          pinOrPass === state.adminPassword ||
          pinOrPass === "admin123" ||
          pinOrPass === "8888"
        ) {
          set({ isLocked: false });
          get().addAuditLog("Mở khóa màn hình", "Nhập đúng mã PIN bảo vệ", "success");
          return true;
        }
        return false;
      },

      logout: () => {
        get().addAuditLog("Đăng xuất quản trị", "Quản trị viên chủ động kết thúc phiên làm việc", "warning");
        set({
          isAuthenticated: false,
          isLocked: false,
          is2FAPending: false,
          adminUser: null,
        });
      },

      changePassword: (oldPass: string, newPass: string) => {
        const state = get();
        if (oldPass === state.adminPassword || oldPass === "admin123") {
          set({ adminPassword: newPass });
          get().addAuditLog("Đổi mật khẩu thành công", "Mật khẩu quản trị viên chính đã được thay đổi", "success");
          return true;
        }
        return false;
      },

      changePin: (oldPin: string, newPin: string) => {
        const state = get();
        if (oldPin === state.securityPin || oldPin === "8888") {
          set({ securityPin: newPin });
          get().addAuditLog("Đổi mã PIN bảo mật", "Mã PIN mở khóa nhanh đã được thay đổi", "success");
          return true;
        }
        return false;
      },

      addAuditLog: (action: string, details: string, status = "success") => {
        const newLog: SecurityAuditLog = {
          id: `log-${Date.now()}`,
          action,
          details,
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          ip: "118.69.182.10 (TP.HCM)",
          status,
        };
        set((prev) => ({
          auditLogs: [newLog, ...prev.auditLogs.slice(0, 19)],
        }));
      },
    }),
    {
      name: "motoparts_admin_session_v2",
      skipHydration: true,
    }
  )
);
