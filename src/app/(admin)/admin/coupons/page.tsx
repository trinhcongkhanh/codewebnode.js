"use client";

import React, { useState } from "react";
import {
  TicketPercent,
  Plus,
  Search,
  Check,
  Copy,
  Trash2,
  Power,
  Sparkles,
  Calendar,
  Percent,
  DollarSign,
  X,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";

interface CouponItem {
  id: string;
  code: string;
  description: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrder: number;
  usageCount: number;
  maxUsage: number;
  expiresAt: string;
  isActive: boolean;
}

const INITIAL_COUPONS: CouponItem[] = [
  {
    id: "cp-1",
    code: "FREESHIP",
    description: "Miễn phí vận chuyển toàn quốc cho đơn từ 200.000đ",
    discountType: "fixed",
    discountValue: 35000,
    minOrder: 200000,
    usageCount: 142,
    maxUsage: 500,
    expiresAt: "31/12/2026",
    isActive: true,
  },
  {
    id: "cp-2",
    code: "CHAOBIKER",
    description: "Giảm 50.000đ cho đơn hàng phụ tùng đầu tiên",
    discountType: "fixed",
    discountValue: 50000,
    minOrder: 300000,
    usageCount: 88,
    maxUsage: 200,
    expiresAt: "31/12/2026",
    isActive: true,
  },
  {
    id: "cp-3",
    code: "PRO10",
    description: "Giảm 10% tổng giá trị đơn hàng (tối đa 100.000đ)",
    discountType: "percent",
    discountValue: 10,
    minOrder: 500000,
    usageCount: 65,
    maxUsage: 150,
    expiresAt: "30/11/2026",
    isActive: true,
  },
  {
    id: "cp-4",
    code: "VIPMOTUL",
    description: "Giảm 15% khi mua nhớt Motul 300V hoặc phụ tùng bảo dưỡng",
    discountType: "percent",
    discountValue: 15,
    minOrder: 400000,
    usageCount: 39,
    maxUsage: 100,
    expiresAt: "31/12/2026",
    isActive: true,
  },
];

export default function AdminCouponsPage() {
  const { addToast } = useToastStore();
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Coupon Form
  const [newCode, setNewCode] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"percent" | "fixed">("percent");
  const [newValue, setNewValue] = useState<number>(10);
  const [newMinOrder, setNewMinOrder] = useState<number>(300000);
  const [newMaxUsage, setNewMaxUsage] = useState<number>(100);

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleToggleStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.isActive;
          addToast(`Đã ${next ? "kích hoạt" : "tạm dừng"} mã ${c.code}!`, "info");
          return { ...c, isActive: next };
        }
        return c;
      })
    );
  };

  const handleDelete = (id: string, code: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    addToast(`Đã xóa mã voucher "${code}"!`, "info");
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast(`Đã copy mã "${code}" vào clipboard!`, "success");
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) {
      addToast("Vui lòng nhập mã voucher!", "error");
      return;
    }

    const created: CouponItem = {
      id: `cp-${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      description: newDesc.trim() || `Giảm ${newValue}${newType === "percent" ? "%" : "đ"} cho đơn hàng`,
      discountType: newType,
      discountValue: Number(newValue),
      minOrder: Number(newMinOrder),
      usageCount: 0,
      maxUsage: Number(newMaxUsage),
      expiresAt: "31/12/2026",
      isActive: true,
    };

    setCoupons([created, ...coupons]);
    addToast(`Đã tạo thành công voucher "${created.code}"!`, "success");
    setIsModalOpen(false);
    setNewCode("");
    setNewDesc("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <TicketPercent className="w-6 h-6 text-orange-600" />
            Quản Lý Mã Giảm Giá & Vouchers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Thiết lập các chiến dịch kích cầu, mã miễn phí vận chuyển và ưu đãi tri ân biker.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-orange-950/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Mã Khuyến Mãi Mới</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã coupon, nội dung..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <div className="text-xs text-slate-500">
          Tổng cộng: <strong className="text-slate-900">{coupons.length}</strong> mã voucher
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Mã Voucher</th>
                <th className="py-3 px-4">Mức Giảm</th>
                <th className="py-3 px-4">Đơn Tối Thiểu</th>
                <th className="py-3 px-4">Lượt Đã Dùng</th>
                <th className="py-3 px-4">Hạn Dùng</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                        title="Copy mã"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-xs">{coupon.description}</p>
                  </td>

                  <td className="py-3.5 px-4 font-black text-orange-600 text-sm">
                    {coupon.discountType === "percent"
                      ? `-${coupon.discountValue}%`
                      : `-${formatVND(coupon.discountValue)}`}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {formatVND(coupon.minOrder)}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{coupon.usageCount}</span>
                      <span className="text-slate-400">/ {coupon.maxUsage}</span>
                    </div>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${(coupon.usageCount / coupon.maxUsage) * 100}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {coupon.expiresAt}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                        coupon.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          coupon.isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span>{coupon.isActive ? "Đang chạy" : "Tạm dừng"}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(coupon.id)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                          coupon.isActive
                            ? "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
                            : "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        }`}
                        title={coupon.isActive ? "Tạm dừng mã" : "Kích hoạt mã"}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                        title="Xóa voucher"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tạo mã mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <TicketPercent className="w-5 h-5 text-orange-600" />
                Tạo Mã Giảm Giá Mới
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã Voucher *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="VD: SIEUSALE20"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Loại Giảm Giá
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as "percent" | "fixed")}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="percent">Giảm theo %</option>
                    <option value="fixed">Giảm số tiền cố định (VND)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giá trị giảm ({newType === "percent" ? "%" : "VNĐ"}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đơn hàng tối thiểu (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả hiển thị cho khách
                </label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="VD: Giảm 20% cho phụ tùng bảo dưỡng và thay nhớt..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giới hạn số lượt sử dụng
                </label>
                <input
                  type="number"
                  value={newMaxUsage}
                  onChange={(e) => setNewMaxUsage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-950/20"
                >
                  Tạo Mã Voucher Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
