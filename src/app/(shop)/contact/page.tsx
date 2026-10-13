"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

export default function ContactPage() {
  const { addToast } = useToastStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      addToast("Vui lòng điền đầy đủ họ tên, số điện thoại và nội dung cần hỗ trợ!", "error");
      return;
    }

    setIsSent(true);
    addToast("Yêu cầu tư vấn của bạn đã được gửi thành công! Kỹ thuật viên sẽ gọi lại trong 15 phút.", "success");
    setName("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Liên Hệ & Tư Vấn Kỹ Thuật
        </h1>
        <p className="text-sm text-slate-500">
          Cần tư vấn thông số phụ tùng, kiểm tra đời xe hoặc tra cứu tình trạng đơn hàng? Đội ngũ MotoParts Pro luôn sẵn sàng giải đáp 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Hotline Đặt Hàng & Kỹ Thuật</h3>
            <p className="text-xs text-slate-500">Tư vấn chọn đời xe chuẩn zin và giải đáp thắc mắc lắp ráp</p>
            <p className="text-lg font-black text-orange-600">1900 8888 (Miễn phí)</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Hệ Thống Trụ Sở & Kho Hàng</h3>
            <div className="text-xs text-slate-600 space-y-2">
              <p>
                <strong>Kho Miền Nam:</strong> Số 128 Đường Điện Biên Phủ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh
              </p>
              <p>
                <strong>Kho Miền Bắc:</strong> Số 45 Phố Trần Khát Chân, Quận Hai Bà Trưng, Hà Nội
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Giờ Mở Cửa & Trực Chat</h3>
            <p className="text-xs text-slate-600">Thứ 2 — Thứ 7: 08:00 đến 21:00</p>
            <p className="text-xs text-slate-600">Chủ Nhật: 08:30 đến 18:00</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-black text-slate-900">Gửi Tin Nhắn Cho Đội Kỹ Thuật</h2>
          </div>

          {isSent && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Yêu cầu đã được ghi nhận. Kỹ thuật viên sẽ liên hệ lại với bạn trong thời gian sớm nhất!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên của bạn *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Tuấn Biker"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số điện thoại liên hệ *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0912 345 678"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nội dung hoặc dòng xe cần tư vấn phụ tùng *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ví dụ: Tôi muốn hỏi bộ bố thắng Brembo trước sau cho xe SH 150i ABS 2022 có sẵn hàng không?..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-950/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Yêu Cầu Hỗ Trợ Ngay</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
