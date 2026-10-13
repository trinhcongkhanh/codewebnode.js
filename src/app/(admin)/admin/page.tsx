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
  TicketPercent,
  Users,
  Settings,
  Sparkles,
  CheckCircle2,
  DollarSign,
  BarChart3,
} from "lucide-react";
import {
  getStoredProducts,
  getStoredOrders,
  getStoredInventory,
  getCategories,
  updateOrderStatus,
  subscribeToStoreUpdates,
} from "@/services";
import { DashboardMetricCard } from "@/components/admin/DashboardMetricCard";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatVND, formatDate } from "@/lib/utils";
import { Product } from "@/types/product";
import { Order } from "@/types/order";
import { InventoryItem } from "@/types/inventory";
import { useToastStore } from "@/store/useToastStore";

export default function AdminDashboardPage() {
  const { addToast } = useToastStore();
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

  const handleQuickConfirmOrder = (orderId: string, orderCode: string) => {
    updateOrderStatus(orderId, "packing");
    addToast(`Đã duyệt đơn ${orderCode} và chuyển sang đóng gói tại kho!`, "success");
  };

  // Mock 7-day revenue dataset
  const weeklyData = [
    { day: "T2", amount: 1250000, height: "45%" },
    { day: "T3", amount: 1890000, height: "65%" },
    { day: "T4", amount: 1420000, height: "50%" },
    { day: "T5", amount: 2350000, height: "80%" },
    { day: "T6", amount: 3100000, height: "95%" },
    { day: "T7", amount: 2800000, height: "90%" },
    { day: "CN", amount: 2100000, height: "70%" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Bảng Điều Hành Tổng Quan (Executive Dashboard)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Trung tâm kiểm soát hàng tồn kho, luồng đơn hàng và thông số vận hành phụ tùng xe máy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-orange-950/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Phụ Tùng Mới</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Thêm Phụ Tùng", icon: <Package className="w-4 h-4 text-blue-500" />, href: "/admin/products" },
          { label: "Tương Thích Xe", icon: <Bike className="w-4 h-4 text-orange-500" />, href: "/admin/products/fitment" },
          { label: "Kiểm Kê Kho Kệ", icon: <Boxes className="w-4 h-4 text-emerald-500" />, href: "/admin/inventory" },
          { label: "Xử Lý Đơn Hàng", icon: <ShoppingBag className="w-4 h-4 text-purple-500" />, href: "/admin/orders" },
          { label: "Mã Khuyến Mãi", icon: <TicketPercent className="w-4 h-4 text-amber-500" />, href: "/admin/coupons" },
          { label: "Cài Đặt VietQR", icon: <Settings className="w-4 h-4 text-slate-600" />, href: "/admin/settings" },
        ].map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
              {action.icon}
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-orange-600 truncate w-full">
              {action.label}
            </span>
          </Link>
        ))}
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

      {/* Revenue Performance & Order Status Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-600" />
                Biểu Đồ Doanh Thu 7 Ngày Gần Nhất
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hiệu suất bán hàng đạt đỉnh vào cuối tuần khi nhu cầu bảo dưỡng xe tăng cao
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Tăng 22.4% so với tuần trước
            </span>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklyData.map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatVND(col.amount)}
                </div>
                <div className="w-full bg-slate-100 rounded-t-xl h-full flex items-end overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-orange-600 to-amber-500 rounded-t-xl group-hover:brightness-110 transition-all duration-500"
                    style={{ height: col.height }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Funnel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
            Quy Trình Xử Lý Đơn Hàng
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Chờ xác nhận:
              </span>
              <span className="font-black text-amber-700 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                {pendingOrders.length}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-blue-600" />
                Đang đóng gói tại kho:
              </span>
              <span className="font-black text-blue-700 bg-blue-200/60 px-2.5 py-0.5 rounded-full">
                {packingOrders.length}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
              <span className="font-bold text-purple-900 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                Đã bàn giao ĐVVC:
              </span>
              <span className="font-black text-purple-700 bg-purple-200/60 px-2.5 py-0.5 rounded-full">
                {shippingOrders.length}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Giao thành công:
              </span>
              <span className="font-black text-emerald-700 bg-emerald-200/60 px-2.5 py-0.5 rounded-full">
                {completedOrders.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert Radar */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-black text-amber-950 uppercase tracking-wide">
                Cảnh Báo Tồn Kho Dưới Ngưỡng An Toàn ({lowStockItems.length} món cần nhập gấp)
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
                className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs flex items-center justify-between"
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
                  <span className="text-xs font-black text-rose-600 block">
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

      {/* Recent Orders Live Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Đơn Hàng Gần Đây Cần Xử Lý
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cập nhật trực tiếp và chuyển đổi trạng thái đơn
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Xem tất cả ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Mã Đơn</th>
                <th className="py-2.5 px-3">Khách Hàng</th>
                <th className="py-2.5 px-3">Ngày Đặt</th>
                <th className="py-2.5 px-3">Tổng Tiền</th>
                <th className="py-2.5 px-3">Trạng Thái</th>
                <th className="py-2.5 px-3 text-right">Thao Tác Nhanh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {order.orderCode}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold block">{order.customer.fullName}</span>
                    <span className="text-[11px] text-slate-400">{order.customer.phone}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 px-3 font-black text-orange-600">
                    {formatVND(order.total)}
                  </td>
                  <td className="py-3 px-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleQuickConfirmOrder(order.id, order.orderCode)}
                          className="px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-[11px]"
                        >
                          Duyệt Đơn
                        </button>
                      )}
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs font-bold text-orange-600 hover:underline"
                      >
                        Chi tiết →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
