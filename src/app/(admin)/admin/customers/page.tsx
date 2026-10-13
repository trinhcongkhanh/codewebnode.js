"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Star,
  Award,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Eye,
  CheckCircle2,
  X,
} from "lucide-react";
import { formatVND } from "@/lib/utils";

interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  tier: "vip" | "loyal" | "new";
  totalOrders: number;
  totalSpent: number;
  points: number;
  joinedDate: string;
}

const INITIAL_CUSTOMERS: CustomerItem[] = [
  {
    id: "cus-1",
    name: "Nguyễn Tuấn Biker",
    phone: "0908 123 456",
    email: "biker@motoparts.vn",
    address: "128 Điện Biên Phủ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh",
    tier: "vip",
    totalOrders: 6,
    totalSpent: 4850000,
    points: 485,
    joinedDate: "15/01/2026",
  },
  {
    id: "cus-2",
    name: "Trần Minh Hoàng",
    phone: "0912 345 678",
    email: "hoang.tm@gmail.com",
    address: "Số 45 Phố Trần Khát Chân, Q. Hai Bà Trưng, Hà Nội",
    tier: "loyal",
    totalOrders: 3,
    totalSpent: 1645000,
    points: 164,
    joinedDate: "02/02/2026",
  },
  {
    id: "cus-3",
    name: "Lê Quốc Bảo",
    phone: "0987 654 321",
    email: "bao.le@yahoo.com",
    address: "Số 89 Điện Biên Phủ, Quận Thanh Khê, Đà Nẵng",
    tier: "vip",
    totalOrders: 4,
    totalSpent: 5200000,
    points: 520,
    joinedDate: "10/02/2026",
  },
  {
    id: "cus-4",
    name: "Phạm Hùng Cường",
    phone: "0933 888 999",
    email: "cuong.pham@gmail.com",
    address: "12 Tân Sơn Nhì, Quận Tân Phú, TP. Hồ Chí Minh",
    tier: "new",
    totalOrders: 1,
    totalSpent: 450000,
    points: 45,
    joinedDate: "12/10/2026",
  },
  {
    id: "cus-5",
    name: "Đỗ Gia Huy",
    phone: "0903 777 666",
    email: "giahuy.do@outlook.com",
    address: "Số 28 Cầu Giấy, Quận Cầu Giấy, Hà Nội",
    tier: "loyal",
    totalOrders: 2,
    totalSpent: 980000,
    points: 98,
    joinedDate: "05/03/2026",
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  const filteredCustomers = customers.filter((c) => {
    if (filterTier !== "all" && c.tier !== filterTier) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalVips = customers.filter((c) => c.tier === "vip").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-orange-600" />
            Quản Lý Khách Hàng & Biker Thân Thiết
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Danh bạ biker, lịch sử đơn hàng và phân cấp thành viên tích điểm đổi quà.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tổng Số Thành Viên Biker
          </span>
          <div className="text-2xl font-black text-slate-900">{customers.length} khách hàng</div>
          <p className="text-[11px] text-slate-500">100% tài khoản đã xác minh số điện thoại</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Thành Viên VIP Đạt Chuẩn
          </span>
          <div className="text-2xl font-black text-orange-600">{totalVips} Biker VIP</div>
          <p className="text-[11px] text-slate-500">Chi tiêu trên 3.000.000đ phụ tùng</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tổng Doanh Thu Từ Thành Viên
          </span>
          <div className="text-2xl font-black text-emerald-600">{formatVND(totalSpentAll)}</div>
          <p className="text-[11px] text-slate-500">Bình quân 2.6 triệu / khách hàng</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo họ tên, số điện thoại, email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 hidden sm:inline">Lọc phân hạng:</span>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-orange-500"
          >
            <option value="all">Tất cả thành viên</option>
            <option value="vip">👑 Biker VIP</option>
            <option value="loyal">⭐ Biker Thân Thiết</option>
            <option value="new">Khách hàng mới</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Biker / Khách Hàng</th>
                <th className="py-3 px-4">Liên Hệ</th>
                <th className="py-3 px-4">Phân Hạng</th>
                <th className="py-3 px-4">Số Đơn Đã Mua</th>
                <th className="py-3 px-4">Tổng Chi Tiêu</th>
                <th className="py-3 px-4">Điểm Tích Lũy</th>
                <th className="py-3 px-4 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{customer.name}</span>
                        <span className="text-[10px] text-slate-400">Tham gia: {customer.joinedDate}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    <p className="font-semibold">{customer.phone}</p>
                    <p className="text-[11px] text-slate-400">{customer.email}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    {customer.tier === "vip" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                        👑 Biker VIP
                      </span>
                    ) : customer.tier === "loyal" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800 border border-orange-200">
                        ⭐ Thân Thiết
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                        Khách Mới
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {customer.totalOrders} đơn hàng
                  </td>

                  <td className="py-3.5 px-4 font-black text-orange-600 text-sm">
                    {formatVND(customer.totalSpent)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      +{customer.points} pts
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      title="Xem chi tiết thông tin"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">
                Hồ Sơ Khách Hàng Biker
              </h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-base text-slate-900">{selectedCustomer.name}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                    {selectedCustomer.tier === "vip" ? "👑 Biker VIP" : "⭐ Thân Thiết"}
                  </span>
                </div>
                <p className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-orange-600" />
                  <span>{selectedCustomer.phone}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-orange-600" />
                  <span>{selectedCustomer.email}</span>
                </p>
                <p className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                  <span>{selectedCustomer.address}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                  <span className="text-[10px] font-bold text-orange-700 block">Tổng đơn đã mua</span>
                  <span className="text-base font-black text-orange-950">{selectedCustomer.totalOrders} đơn</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-700 block">Tổng tiền chi tiêu</span>
                  <span className="text-base font-black text-emerald-950">{formatVND(selectedCustomer.totalSpent)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
