"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Boxes,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Bike,
  Plus,
} from "lucide-react";
import {
  getStoredProducts,
  getStoredOrders,
  getStoredInventory,
  getCategories,
  subscribeToStoreUpdates,
} from "@/data/storeManager";
import { DashboardMetricCard } from "@/components/admin/DashboardMetricCard";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatVND, formatDate } from "@/lib/utils";
import { Product } from "@/types/product";
import { Order } from "@/types/order";
import { InventoryItem } from "@/types/inventory";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const loadData = () => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    setInventory(getStoredInventory());
  };

  useEffect(() => {
    loadData();
    setIsMounted(true);

    const unsubscribe = subscribeToStoreUpdates(() => {
      loadData();
    });

    return () => unsubscribe();
  }, []);

  if (!isMounted) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        Đang đồng bộ hóa dữ liệu điều hành...
      </div>
    );
  }

  const categories = getCategories();

  // Metrics derived from actual storage
  const totalProducts = products.length;
  const lowStockItems = inventory.filter(
    (i) => i.status === "low_stock" || i.status === "out_of_stock"
  );
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const packingOrders = orders.filter((o) => o.status === "packing");
  const shippingOrders = orders.filter((o) => o.status === "shipping");
  const completedOrders = orders.filter((o) => o.status === "completed");

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingReturns = orders.filter(
    (o) => o.returnRequest && o.returnRequest.status === "pending"
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Bảng Điều Hành Tổng Quan (Dashboard)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi tồn kho thực tế theo kệ hàng, trạng thái đơn hàng và các dòng xe tương thích.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Phụ Tùng Mới</span>
          </Link>
        </div>
      </div>

      {/* 4 Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardMetricCard
          title="Tổng Số Phụ Tùng"
          value={totalProducts}
          subtitle={`${categories.length} danh mục hệ thống`}
          icon={<Package className="w-5 h-5 text-blue-600" />}
          trend={{ value: "+2 tuần này", isPositive: true }}
        />

        <DashboardMetricCard
          title="Cảnh Báo Hết Hàng"
          value={lowStockItems.length}
          subtitle="Dưới ngưỡng an toàn"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          highlight={lowStockItems.length > 0}
        />

        <DashboardMetricCard
          title="Đơn Chờ Xác Nhận"
          value={pendingOrders.length}
          subtitle={`Tổng ${orders.length} đơn hàng trong kho`}
          icon={<Clock className="w-5 h-5 text-orange-600" />}
          highlight={pendingOrders.length > 0}
        />

        <DashboardMetricCard
          title="Doanh Thu Đơn Hàng"
          value={formatVND(totalRevenue)}
          subtitle="Các đơn thành công & đang giao"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          trend={{ value: "+18%", isPositive: true }}
        />
      </div>

      {/* Low Stock Alert Section (If any) */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                Cảnh Báo Tồn Kho Sắp Hết ({lowStockItems.length} món cần nhập gấp)
              </h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
            >
              <span>Xem chi tiết kho & kệ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-2xs flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                    {item.productName}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    SKU: {item.sku} • Vị trí: <strong>{item.warehouseLocation}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-rose-600 block">
                    Còn {item.quantity} cái
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Ngưỡng: {item.lowStockThreshold}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Management Overview & Quick Status Transition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Orders Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Đơn Hàng Gần Đây Cần Xử Lý
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật đơn hàng theo luồng thực tế
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>Xem tất cả ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Mã Đơn</th>
                  <th className="py-2.5 px-3">Khách Hàng</th>
                  <th className="py-2.5 px-3">Ngày Đặt</th>
                  <th className="py-2.5 px-3">Tổng Tiền</th>
                  <th className="py-2.5 px-3">Trạng Thái</th>
                  <th className="py-2.5 px-3 text-right">Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {order.orderCode}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold block">{order.customer.fullName}</span>
                      <span className="text-[11px] text-slate-400">{order.customer.phone}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-orange-600">
                      {formatVND(order.total)}
                    </td>
                    <td className="py-3 px-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs font-bold text-orange-600 hover:underline"
                      >
                        Xem →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Operational Status Distribution & Return Requests */}
        <div className="space-y-6">
          {/* Order Status Counts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Phân Bổ Trạng Thái Đơn
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-medium text-slate-600">Chờ xác nhận:</span>
                <span className="font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                  {pendingOrders.length}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-medium text-slate-600">Đang đóng gói tại kho:</span>
                <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  {packingOrders.length}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-medium text-slate-600">Đã bàn giao ĐVVC:</span>
                <span className="font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                  {shippingOrders.length}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-medium text-slate-600">Giao thành công:</span>
                <span className="font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {completedOrders.length}
                </span>
              </div>
            </div>
          </div>

          {/* Pending Return Requests (Customer purchased wrong parts) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-purple-600" />
                Yêu Cầu Đổi Trả ({pendingReturns.length})
              </h2>
            </div>
            {pendingReturns.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">
                Không có yêu cầu đổi trả nào đang chờ duyệt.
              </p>
            ) : (
              pendingReturns.map((o) => (
                <div
                  key={o.id}
                  className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-950 font-mono">
                      {o.orderCode}
                    </span>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      Chờ duyệt đổi
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium line-clamp-2">
                    Lý do: {o.returnRequest?.reason}
                  </p>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="inline-block text-xs font-bold text-purple-700 hover:underline pt-1"
                  >
                    Xem xét & xử lý đổi hàng →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
