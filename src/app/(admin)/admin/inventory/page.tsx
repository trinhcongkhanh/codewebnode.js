"use client";

import React, { useState, useEffect } from "react";
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit2,
  Package,
  Layers,
  X,
  Check,
} from "lucide-react";
import { InventoryItem, InventoryUpdatePayload } from "@/types/inventory";
import {
  getStoredInventory,
  updateInventory,
  subscribeToStoreUpdates,
} from "@/services";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isMounted, setIsMounted] = useState(false);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formQuantity, setFormQuantity] = useState<number>(0);
  const [formShelf, setFormShelf] = useState("");
  const [formCompartment, setFormCompartment] = useState("");
  const [formThreshold, setFormThreshold] = useState<number>(5);

  const loadData = () => {
    setInventory(getStoredInventory());
  };

  useEffect(() => {
    loadData();
    setIsMounted(true);
    const unsubscribe = subscribeToStoreUpdates(() => loadData());
    return () => unsubscribe();
  }, []);

  if (!isMounted) return null;

  const lowStockCount = inventory.filter(
    (i) => i.status === "low_stock" || i.status === "out_of_stock"
  ).length;

  const filteredInventory = inventory.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.productName.toLowerCase().includes(q);
      const matchSku = item.sku.toLowerCase().includes(q);
      const matchLocation = item.warehouseLocation.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchLocation) return false;
    }
    return true;
  });

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormQuantity(item.quantity);
    setFormShelf(item.shelf);
    setFormCompartment(item.compartment);
    setFormThreshold(item.lowStockThreshold);
  };

  const handleSaveInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateInventory({
      productId: editingItem.productId,
      quantity: Number(formQuantity),
      shelf: formShelf.trim() || "Kệ A1",
      compartment: formCompartment.trim() || "Ngăn 1",
      lowStockThreshold: Number(formThreshold),
    });

    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-orange-600" />
            Quản Lý Tồn Kho & Vị Trí Kệ Lưu Kho
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi chính xác vị trí thực tế trong kho (Kệ, Ngăn) giúp nhân viên nhặt hàng nhanh chóng và cảnh báo cạn kiệt.
          </p>
        </div>

        {/* Low Stock Counter Pill */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-xs font-bold text-amber-900 self-start sm:self-auto">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>{lowStockCount} sản phẩm dưới ngưỡng an toàn</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã SKU, tên phụ tùng, vị trí Kệ..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-orange-500"
          >
            <option value="all">Tất cả ({inventory.length})</option>
            <option value="in_stock">Đủ hàng trong kho</option>
            <option value="low_stock">Sắp hết hàng (Báo đỏ)</option>
            <option value="out_of_stock">Đã hết hàng (0)</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Mã SKU</th>
                <th className="py-3 px-4">Tên Phụ Tùng</th>
                <th className="py-3 px-4">Vị Trí Lưu Kho Thực Tế</th>
                <th className="py-3 px-4">Số Lượng Tồn</th>
                <th className="py-3 px-4">Ngưỡng Báo Động</th>
                <th className="py-3 px-4">Trạng Thái Kho</th>
                <th className="py-3 px-4 text-right">Cập Nhật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Không tìm thấy phụ tùng nào khớp điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.sku}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block max-w-xs truncate">
                        {item.productName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Hãng: {item.brand} • {item.categoryName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 font-medium text-slate-800">
                        <Package className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.warehouseLocation}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-sm font-black ${
                          item.status === "out_of_stock"
                            ? "text-rose-600"
                            : item.status === "low_stock"
                            ? "text-amber-600"
                            : "text-slate-900"
                        }`}
                      >
                        {item.quantity} cái
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-500">
                      ≤ {item.lowStockThreshold} cái
                    </td>

                    <td className="py-3.5 px-4">
                      {item.status === "in_stock" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đủ Hàng
                        </span>
                      )}
                      {item.status === "low_stock" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Sắp Hết Hàng
                        </span>
                      )}
                      {item.status === "out_of_stock" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" /> Hết Hàng
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-slate-200 transition-colors font-semibold"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Sửa Kệ / Kho</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT INVENTORY & SHELF LOCATION MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Cập Nhật Tồn Kho & Vị Trí Kệ
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900 truncate">{editingItem.productName}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">SKU: {editingItem.sku}</p>
            </div>

            <form onSubmit={handleSaveInventory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Số lượng tồn kho thực tế
                </label>
                <input
                  type="number"
                  value={formQuantity}
                  onChange={(e) => setFormQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500 font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Vị trí Kệ (Ví dụ: Kệ A3)
                  </label>
                  <input
                    type="text"
                    value={formShelf}
                    onChange={(e) => setFormShelf(e.target.value)}
                    placeholder="Kệ A3"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ngăn chứa (Ví dụ: Ngăn số 2)
                  </label>
                  <input
                    type="text"
                    value={formCompartment}
                    onChange={(e) => setFormCompartment(e.target.value)}
                    placeholder="Ngăn số 2"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ngưỡng cảnh báo hết hàng (Threshold)
                </label>
                <input
                  type="number"
                  value={formThreshold}
                  onChange={(e) => setFormThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Hệ thống sẽ tự động bật cảnh báo đỏ khi số lượng tồn kho giảm xuống bằng hoặc dưới ngưỡng này.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold shadow-md shadow-orange-950/20"
                >
                  Lưu Thông Tin Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
