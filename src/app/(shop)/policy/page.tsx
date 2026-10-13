import React from "react";
import Link from "next/link";
import { ShieldCheck, RotateCcw, Truck, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Chính Sách & Quy Định — MotoParts Pro",
  description: "Chính sách bảo hành, đổi trả trong 7 ngày, vận chuyển toàn quốc và cam kết chất lượng của MotoParts Pro.",
};

export default function PolicyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Chính Sách Bảo Hành & Đổi Trả
        </h1>
        <p className="text-sm text-slate-500">
          Minh bạch — Nhanh chóng — Bảo vệ tối đa quyền lợi của Biker
        </p>
      </div>

      {/* 4 Policy Sections */}
      <div className="space-y-8">
        {/* 1. Warranty Policy */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">1. Chính Sách Bảo Hành Chính Hãng</h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              Tất cả các sản phẩm phụ tùng tại MotoParts Pro (Brembo, NGK, DID, Motul, FCC, YSS) đều được bảo hành chính hãng theo tiêu chuẩn của nhà sản xuất:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Bố thắng & Phanh đĩa:</strong> Bảo hành 12 tháng lỗi nứt vỡ má phanh hoặc tách lớp hợp kim.</li>
              <li><strong>Bugi Iridium NGK:</strong> Bảo hành 6 tháng hoặc 10.000km đối với lỗi đánh lửa không đều hoặc mất lửa.</li>
              <li><strong>Nhông Sên Dĩa DID:</strong> Bảo hành 6 tháng đối với lỗi đứt mắt sên, nhông nhảy bước do gia công kỹ thuật.</li>
              <li><strong>Phuộc nhún YSS / RCB:</strong> Bảo hành chính hãng 12 - 24 tháng đối với hiện tượng xì dầu ty phanh.</li>
            </ul>
          </div>
        </div>

        {/* 2. Return Policy */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">2. Chính Sách Đổi Trả Trong 7 Ngày</h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              Nhằm giải tỏa hoàn toàn nỗi lo mua phụ tùng qua mạng không vừa xe, chúng tôi hỗ trợ đổi hàng trong 7 ngày kể từ ngày nhận hàng với điều kiện:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Sản phẩm còn nguyên bao bì, tem mác niêm phong của hãng</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Chưa có dấu hiệu lắp đặt làm trầy xước ren ốc hoặc dính dầu mỡ</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Khách hàng cung cấp mã đơn hàng hoặc số điện thoại khi mua</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Hỗ trợ đổi sang phụ tùng đúng đời xe khác miễn phí tiền công tư vấn</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Shipping Policy */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">3. Chính Sách Giao Hàng & Đồng Kiểm</h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              - <strong>Đồng kiểm khi nhận:</strong> Quý khách được quyền mở hộp kiểm tra đúng mã sản phẩm, đúng số lượng trước khi thanh toán cho shipper.
            </p>
            <p>
              - <strong>Thời gian giao hàng:</strong> Nội thành TP.HCM & Hà Nội nhận hàng trong 24h. Các tỉnh thành khác từ 2 — 3 ngày làm việc.
            </p>
            <p>
              - <strong>Miễn phí vận chuyển:</strong> Áp dụng cho đơn hàng từ 200.000đ khi nhập mã voucher <strong>FREESHIP</strong> tại bước thanh toán.
            </p>
          </div>
        </div>
      </div>

      {/* Support CTA */}
      <div className="text-center pt-4">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors"
        >
          <span>Cần hỗ trợ đổi trả hoặc bảo hành? Liên hệ chúng tôi</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
