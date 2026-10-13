"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  QrCode,
  Wallet,
  Truck,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  Bike,
  PackageCheck,
  Info,
  Copy,
  Check,
  PackageSearch,
  LayoutDashboard,
  Ticket,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { createOrder } from "@/services";
import { formatVND } from "@/lib/utils";
import { Order, PaymentMethod, ShippingCarrier } from "@/types/order";
import { Confetti } from "@/components/common/Confetti";

export default function CheckoutPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { addToast } = useToastStore();
  const {
    items,
    getSubtotal,
    getTotalItems,
    clearCart,
    appliedCoupon,
    getDiscountAmount,
  } = useCartStore();

  // Customer Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Hồ Chí Minh");
  const [district, setDistrict] = useState("Quận 1");
  const [ward, setWard] = useState("Phường Bến Nghé");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Carrier & Payment State
  const [carrier, setCarrier] = useState<ShippingCarrier>("ghn");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qr_transfer");

  // Submission & Success state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Đang khởi tạo cổng thanh toán an toàn...
      </div>
    );
  }

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const discountAmount = getDiscountAmount();

  // Weight-based shipping simulation for motorcycle parts
  const isFreeShip = subtotal >= 1000000 || appliedCoupon?.code === "FREESHIP";
  const shippingRates: Record<ShippingCarrier, number> = {
    ghn: isFreeShip ? 0 : 35000,
    ghtk: isFreeShip ? 0 : 32000,
    viettel_post: isFreeShip ? 0 : 38000,
  };
  const shippingFee = shippingRates[carrier];
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    addToast(`Đã sao chép ${fieldName}!`, "info");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Vui lòng nhập họ và tên";
    if (!phone.trim()) {
      errs.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(phone.replace(/\s+/g, ""))) {
      errs.phone = "Số điện thoại không hợp lệ (10-11 số)";
    }
    if (!address.trim()) errs.address = "Vui lòng nhập số nhà, tên đường";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (items.length === 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        sku: i.product.sku,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0],
        brand: i.product.brand,
      }));

      const newOrder = createOrder({
        customer: {
          fullName,
          phone,
          email,
          address,
          city,
          district,
          ward,
          notes,
        },
        items: orderItems,
        subtotal,
        shippingFee,
        total: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        status: "pending",
        carrier,
        trackingCode: `${carrier.toUpperCase()}${Math.floor(10000000 + Math.random() * 90000000)}VN`,
        timeline: [
          {
            status: "pending",
            timestamp: new Date().toISOString(),
            title: "Đơn hàng đã được đặt thành công",
            description: `Khách hàng đặt qua hình thức: ${
              paymentMethod === "qr_transfer"
                ? "Chuyển khoản QR ngân hàng VietQR"
                : paymentMethod === "momo"
                ? "Ví MoMo"
                : paymentMethod === "zalopay"
                ? "Ví ZaloPay"
                : "Thanh toán khi nhận hàng COD"
            }`,
          },
        ],
      });

      clearCart();
      setIsSubmitting(false);
      setCreatedOrder(newOrder);
      addToast("Đặt hàng thành công!", "success");
    }, 600);
  };

  // SUCCESS VIEW
  if (createdOrder) {
    const qrUrl = `https://img.vietqr.io/image/MB-0909123456-compact2.png?amount=${createdOrder.total}&addInfo=${createdOrder.orderCode}&accountName=CTY%20CP%20MOTOPARTS%20PRO`;

    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <Confetti />
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-900/10">
            <PackageCheck className="w-9 h-9" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đặt Hàng Thành Công
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cảm Ơn Bạn Đã Tin Chọn MotoParts Pro!
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-xs text-slate-500">Mã đơn hàng:</span>
              <strong className="text-orange-600 font-mono text-base font-black">
                {createdOrder.orderCode}
              </strong>
              <button
                onClick={() => handleCopy(createdOrder.orderCode, "mã đơn hàng")}
                className="p-1 text-slate-400 hover:text-slate-700"
                title="Sao chép"
              >
                {copiedField === "mã đơn hàng" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* If VietQR payment: Show interactive QR Code */}
          {createdOrder.paymentMethod === "qr_transfer" && (
            <div className="bg-slate-950 text-white rounded-2xl p-6 text-left border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <QrCode className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-white">
                  Quét Mã VietQR Để Hoàn Tất Thanh Toán
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-5 flex justify-center">
                  <div className="bg-white p-2.5 rounded-2xl shadow-lg border border-slate-700 inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrUrl}
                      alt="VietQR Payment Code"
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                </div>

                <div className="sm:col-span-7 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Ngân hàng:</span>
                    <span className="font-bold text-white">MB Bank (Quân Đội)</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Số tài khoản:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-orange-400">0909 123 456</span>
                      <button
                        onClick={() => handleCopy("0909123456", "số tài khoản")}
                        className="text-slate-400 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Chủ tài khoản:</span>
                    <span className="font-bold text-white uppercase">CTY CP MOTOPARTS PRO</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Số tiền:</span>
                    <span className="font-mono font-black text-orange-400 text-sm">
                      {formatVND(createdOrder.total)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-400">Nội dung CK:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-emerald-400">
                        {createdOrder.orderCode}
                      </span>
                      <button
                        onClick={() => handleCopy(createdOrder.orderCode, "nội dung")}
                        className="text-slate-400 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Details summary */}
          <div className="border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3 bg-slate-50">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Khách hàng nhận:</span>
              <span className="font-bold text-slate-900">
                {createdOrder.customer.fullName} ({createdOrder.customer.phone})
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Địa chỉ giao:</span>
              <span className="font-medium text-slate-900 text-right max-w-sm">
                {createdOrder.customer.address}, {createdOrder.customer.ward},{" "}
                {createdOrder.customer.district}, {createdOrder.customer.city}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Đơn vị vận chuyển:</span>
              <span className="font-bold text-slate-900 uppercase">
                {createdOrder.carrier} — Mã vận đơn: {createdOrder.trackingCode}
              </span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-bold">
              <span>Tổng thanh toán:</span>
              <span className="text-orange-600 text-base font-black">
                {formatVND(createdOrder.total)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/track-order?code=${createdOrder.orderCode}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-950/20"
            >
              <PackageSearch className="w-4 h-4" />
              <span>Tra Cứu Lộ Trình Đơn Hàng</span>
            </Link>

            <Link
              href={`/admin/orders/${createdOrder.id}`}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Xem Trong Quản Trị Admin</span>
            </Link>

            <Link
              href="/products"
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART CHECK
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-slate-500 mt-1">
          Vui lòng thêm phụ tùng vào giỏ trước khi tiến hành thanh toán.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-block px-5 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl"
        >
          Khám phá phụ tùng ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-orange-600" />
          Thanh Toán & Đặt Hàng
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Vui lòng điền thông tin người nhận và lựa chọn phương thức giao nhận phù hợp.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Customer & Carrier & Payment (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">
                1
              </span>
              Thông Tin Người Nhận Hàng
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên người nhận <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Biker"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.fullName ? "border-rose-500 bg-rose-50/30" : "border-slate-300"
                  } focus:outline-none focus:border-orange-500`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-500 mt-0.5">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại liên hệ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0908 123 456"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.phone ? "border-rose-500 bg-rose-50/30" : "border-slate-300"
                  } focus:outline-none focus:border-orange-500`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-rose-500 mt-0.5">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email nhận hóa đơn & cập nhật lộ trình (Tùy chọn)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="biker@example.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tỉnh / Thành phố
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">TP. Hà Nội</option>
                  <option value="Đà Nẵng">TP. Đà Nẵng</option>
                  <option value="Bình Dương">Bình Dương</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                  <option value="Cần Thơ">TP. Cần Thơ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quận / Huyện
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Quận / Huyện"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phường / Xã
                </label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="Phường / Xã"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ chi tiết (Số nhà, tên đường) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ví dụ: 124/8 Đường Nguyễn Trãi"
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  errors.address ? "border-rose-500 bg-rose-50/30" : "border-slate-300"
                } focus:outline-none focus:border-orange-500`}
              />
              {errors.address && (
                <p className="text-[11px] text-rose-500 mt-0.5">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi chú cho nhân viên soạn hàng / shipper
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước 15 phút..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Step 2: Shipping Carrier Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">
                2
              </span>
              Chọn Đơn Vị Vận Chuyển
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "ghn", name: "GHN Express", desc: "Giao 1-2 ngày", fee: shippingRates.ghn },
                { id: "ghtk", name: "GHTK Tiết Kiệm", desc: "Giao 2-3 ngày", fee: shippingRates.ghtk },
                {
                  id: "viettel_post",
                  name: "Viettel Post",
                  desc: "Mạng lưới rộng khắp",
                  fee: shippingRates.viettel_post,
                },
              ].map((c) => (
                <label
                  key={c.id}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    carrier === c.id
                      ? "border-orange-500 bg-orange-50/40 ring-1 ring-orange-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      name="carrier"
                      checked={carrier === c.id}
                      onChange={() => setCarrier(c.id as ShippingCarrier)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-xs font-bold text-slate-900">{c.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-5">{c.desc}</p>
                  <p className="text-xs font-black text-orange-600 pl-5 mt-1">
                    {c.fee === 0 ? "Freeship" : formatVND(c.fee)}
                  </p>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: Payment Method Options */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">
                3
              </span>
              Phương Thức Thanh Toán
            </h2>

            <div className="space-y-3">
              {/* QR Bank Transfer */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === "qr_transfer"
                    ? "border-orange-500 bg-orange-50/40 ring-1 ring-orange-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "qr_transfer"}
                  onChange={() => setPaymentMethod("qr_transfer")}
                  className="mt-1 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Chuyển Khoản QR Ngân Hàng (VietQR)
                    </span>
                    <span className="text-[10px] font-black bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                      Khuyên Dùng
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hệ thống sẽ tạo mã QR tự động kèm đúng số tiền và cú pháp sau khi bấm xác nhận.
                  </p>
                </div>
              </label>

              {/* MoMo */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === "momo"
                    ? "border-orange-500 bg-orange-50/40 ring-1 ring-orange-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "momo"}
                  onChange={() => setPaymentMethod("momo")}
                  className="mt-1 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-pink-600" />
                    <span className="text-xs font-bold text-slate-900">Ví Điện Tử MoMo</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Quét mã thanh toán qua ví MoMo.
                  </p>
                </div>
              </label>

              {/* Cash On Delivery */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-orange-500 bg-orange-50/40 ring-1 ring-orange-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Thanh Toán Khi Nhận Hàng (COD)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Kiểm tra đúng phụ tùng, đúng mã xe rồi mới thanh toán tiền mặt cho shipper.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 sticky top-20">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Chi Tiết Đơn Hàng</span>
            <span className="text-xs font-normal text-slate-500">{totalItems} món</span>
          </h2>

          {/* Items list preview */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-slate-100">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="pt-2 first:pt-0 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{product.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {quantity} x {formatVND(product.price)}
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-900 shrink-0">
                  {formatVND(product.price * quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Applied Coupon Info if any */}
          {appliedCoupon && (
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-orange-600" />
                <span className="font-bold text-orange-950">Mã: {appliedCoupon.code}</span>
              </div>
              <span className="text-emerald-600 font-bold">-{formatVND(discountAmount)}</span>
            </div>
          )}

          {/* Financial calculation */}
          <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính phụ tùng:</span>
              <span className="font-semibold text-slate-900">{formatVND(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Giảm giá ưu đãi:</span>
                <span>-{formatVND(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển ({carrier.toUpperCase()}):</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold">Miễn phí</span>
                ) : (
                  formatVND(shippingFee)
                )}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold">
              <span className="text-slate-900">Tổng thanh toán:</span>
              <span className="text-xl font-black text-orange-600">{formatVND(finalTotal)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:bg-slate-300 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Đang Xử Lý Đơn Hàng...</span>
            ) : (
              <>
                <span>Xác Nhận Đặt Hàng Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            Nhấn đặt hàng đồng nghĩa bạn xác nhận thông tin phụ tùng đã chọn phù hợp với xe của bạn.
          </p>
        </div>
      </form>
    </div>
  );
}
