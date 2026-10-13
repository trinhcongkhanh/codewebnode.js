"use client";

import React, { useState } from "react";
import {
  Settings,
  Store,
  QrCode,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building,
  ShieldCheck,
  Lock,
  KeyRound,
  History,
  AlertTriangle,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

export default function AdminSettingsPage() {
  const { addToast } = useToastStore();
  const { auditLogs, changePassword, changePin } = useAdminAuthStore();

  // General Settings
  const [storeName, setStoreName] = useState("MotoParts Pro Vietnam");
  const [hotline, setHotline] = useState("1900 8888");
  const [email, setEmail] = useState("support@motopartspro.vn");

  // VietQR Settings
  const [bankName, setBankName] = useState("MB Bank (Ngân hàng Quân Đội)");
  const [accountNumber, setAccountNumber] = useState("0908123456");
  const [accountHolder, setAccountHolder] = useState("NGUYEN VAN TU");
  const [transferPrefix, setTransferPrefix] = useState("MP");

  // Password & PIN Change States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");

  // Branches Settings
  const [branchHcm, setBranchHcm] = useState({
    address: "Số 128 Đường Điện Biên Phủ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh",
    phone: "0908 123 456",
    hours: "08:00 - 21:00",
  });

  const [branchHn, setBranchHn] = useState({
    address: "Số 45 Phố Trần Khát Chân, Phường Thanh Nhàn, Quận Hai Bà Trưng, Hà Nội",
    phone: "0912 345 678",
    hours: "08:00 - 20:30",
  });

  const [branchDn, setBranchDn] = useState({
    address: "Số 89 Đường Điện Biên Phủ, Phường Chính Gián, Quận Thanh Khê, TP. Đà Nẵng",
    phone: "0918 888 999",
    hours: "08:30 - 20:00",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Đã lưu toàn bộ cấu hình hệ thống & thông tin chi nhánh thành công!", "success");
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      addToast("Vui lòng nhập đầy đủ mật khẩu cũ và mới!", "error");
      return;
    }
    const ok = changePassword(oldPassword, newPassword);
    if (ok) {
      addToast("Đổi mật khẩu quản trị viên thành công!", "success");
      setOldPassword("");
      setNewPassword("");
    } else {
      addToast("Mật khẩu cũ không chính xác!", "error");
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPin || !newPin) {
      addToast("Vui lòng nhập đầy đủ mã PIN cũ và mới!", "error");
      return;
    }
    const ok = changePin(oldPin, newPin);
    if (ok) {
      addToast("Đổi mã PIN mở khóa màn hình thành công!", "success");
      setOldPin("");
      setNewPin("");
    } else {
      addToast("Mã PIN cũ không chính xác!", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-orange-600" />
            Cài Đặt Cửa Hàng, Chi Nhánh & Bảo Mật
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấu hình thông tin thương hiệu, tài khoản VietQR, chính sách bảo mật và lịch sử truy vết.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-orange-950/20"
        >
          <Save className="w-4 h-4" />
          <span>Lưu Cài Đặt Chung</span>
        </button>
      </div>

      {/* SECTION A: BẢO MẬT QUẢN TRỊ VIÊN & MÃ PIN */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-orange-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              1. Bảo Mật Cấp Cao (Mật Khẩu & Mã PIN Cấp 2)
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            2FA Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Change Password */}
          <form onSubmit={handleChangePasswordSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-black text-slate-900 uppercase block flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-orange-600" />
              Đổi Mật Khẩu Đăng Nhập
            </span>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Mật khẩu cũ (Mặc định: admin123)</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Cập Nhật Mật Khẩu Mới
            </button>
          </form>

          {/* Change PIN */}
          <form onSubmit={handleChangePinSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-black text-slate-900 uppercase block flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-600" />
              Đổi Mã PIN Mở Khóa Nhanh (4 Chữ Số)
            </span>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Mã PIN cũ (Mặc định: 8888)</label>
              <input
                type="password"
                maxLength={6}
                required
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                placeholder="Nhập mã PIN cũ..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Mã PIN mới</label>
              <input
                type="password"
                maxLength={6}
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Nhập mã PIN mới..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Cập Nhật Mã PIN Mới
            </button>
          </form>
        </div>
      </div>

      {/* SECTION B: NHẬT KÝ BẢO MẬT & TRUY VẾT (AUDIT LOGS) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              2. Nhật Ký Bảo Mật & Lịch Sử Truy Vết (Security Audit Trail)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Ghi nhận tự động các thao tác quản trị
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-4">Thời Gian</th>
                <th className="py-2.5 px-4">Hành Động</th>
                <th className="py-2.5 px-4">Chi Tiết Tác Vụ</th>
                <th className="py-2.5 px-4">Địa Chỉ IP / Vị Trí</th>
                <th className="py-2.5 px-4 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {log.ip}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        log.status === "success"
                          ? "bg-emerald-100 text-emerald-800"
                          : log.status === "warning"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.status === "success" ? "Hợp lệ" : log.status === "warning" ? "Cảnh báo" : "Từ chối"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION C: THÔNG TIN THƯƠNG HIỆU */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Building className="w-5 h-5 text-orange-600" />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            3. Thông Tin Thương Hiệu & Tổng Đài
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên cửa hàng hiển thị
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Hotline tổng đài (Miễn phí)
            </label>
            <input
              type="text"
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email nhận thông báo đơn
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION D: CẤU HÌNH VIETQR */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              4. Cấu Hình Tài Khoản Ngân Hàng VietQR
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Napas 247 Dynamic QR
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ngân hàng nhận thanh toán
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Số tài khoản ngân hàng
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên chủ tài khoản (In hoa)
            </label>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold font-mono uppercase focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tiền tố nội dung CK (Prefix)
            </label>
            <input
              type="text"
              value={transferPrefix}
              onChange={(e) => setTransferPrefix(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION E: CẤU HÌNH 3 CHI NHÁNH CỬA HÀNG */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Store className="w-5 h-5 text-orange-600" />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            5. Cấu Hình Địa Chỉ 3 Chi Nhánh Mua Hàng Trực Tiếp
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chi nhánh 1: TP.HCM */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-black text-slate-900 uppercase block text-orange-600">
              📍 Chi Nhánh 1 — TP. Hồ Chí Minh
            </span>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Địa chỉ</label>
              <textarea
                rows={2}
                value={branchHcm.address}
                onChange={(e) => setBranchHcm({ ...branchHcm, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Hotline</label>
                <input
                  type="text"
                  value={branchHcm.phone}
                  onChange={(e) => setBranchHcm({ ...branchHcm, phone: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Giờ mở cửa</label>
                <input
                  type="text"
                  value={branchHcm.hours}
                  onChange={(e) => setBranchHcm({ ...branchHcm, hours: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Chi nhánh 2: Hà Nội */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-black text-slate-900 uppercase block text-orange-600">
              📍 Chi Nhánh 2 — Hà Nội
            </span>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Địa chỉ</label>
              <textarea
                rows={2}
                value={branchHn.address}
                onChange={(e) => setBranchHn({ ...branchHn, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Hotline</label>
                <input
                  type="text"
                  value={branchHn.phone}
                  onChange={(e) => setBranchHn({ ...branchHn, phone: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Giờ mở cửa</label>
                <input
                  type="text"
                  value={branchHn.hours}
                  onChange={(e) => setBranchHn({ ...branchHn, hours: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Chi nhánh 3: Đà Nẵng */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-black text-slate-900 uppercase block text-orange-600">
              📍 Chi Nhánh 3 — Đà Nẵng
            </span>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Địa chỉ</label>
              <textarea
                rows={2}
                value={branchDn.address}
                onChange={(e) => setBranchDn({ ...branchDn, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Hotline</label>
                <input
                  type="text"
                  value={branchDn.phone}
                  onChange={(e) => setBranchDn({ ...branchDn, phone: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Giờ mở cửa</label>
                <input
                  type="text"
                  value={branchDn.hours}
                  onChange={(e) => setBranchDn({ ...branchDn, hours: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
