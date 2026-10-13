import React from "react";
import Link from "next/link";
import { Bike, ShieldCheck, Award, Users, CheckCircle2, ArrowRight, Wrench, Sparkles } from "lucide-react";

export const metadata = {
  title: "Về Chúng Tôi — MotoParts Pro",
  description: "Hệ thống cung cấp phụ tùng xe máy chính hãng số 1 Việt Nam. Uy tín, chất lượng kỹ thuật cao.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tiên phong số hóa phụ tùng chuẩn kỹ thuật</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Nơi Biker Gửi Trọn Niềm Tin Cho Mọi Chuyến Đi
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            MotoParts Pro ra đời với sứ mệnh mang lại sự an tâm tuyệt đối cho cộng đồng yêu xe máy tại Việt Nam. Chúng tôi giải quyết triệt để vấn đề phụ tùng giả, sai đời xe và giá cả thiếu minh bạch bằng công nghệ tra cứu tương thích xe chuẩn xác 100%.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-950/30 transition-all"
            >
              <span>Khám Phá Phụ Tùng Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-colors"
            >
              Liên Hệ Đội Kỹ Thuật
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { number: "100%", label: "Chính Hãng Phân Phối", sub: "Bảo hành 1 đổi 1" },
          { number: "15.000+", label: "Biker Tin Tưởng Mua Sắm", sub: "Toàn quốc 63 tỉnh thành" },
          { number: "1.200+", label: "Mã Phụ Tùng Sẵn Kho", sub: "Brembo, NGK, DID, Motul" },
          { number: "99.8%", label: "Lắp Vừa Khít Zin Xe", sub: "Dữ liệu tra cứu chuẩn xác" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 transition-colors"
          >
            <div className="text-3xl sm:text-4xl font-black text-orange-600">{stat.number}</div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">{stat.label}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900">3 Giá Trị Cốt Lõi Của Chúng Tôi</h2>
          <p className="text-xs text-slate-500">
            Mọi sản phẩm gửi đến tay khách hàng đều được kiểm tra kỹ thuật nghiêm ngặt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Cam Kết Xuất Xứ Minh Bạch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nhập khẩu trực tiếp từ các nhà phân phối chính thức của Brembo (Ý), NGK (Nhật), DID (Nhật), Motul (Pháp), FCC (Nhật). Đền tiền 200% nếu phát hiện hàng giả, hàng nhái.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Hỗ Trợ Kỹ Thuật Chuyên Sâu</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Đội ngũ tư vấn viên đều là thợ máy hoặc thợ độ xe có trên 5 năm kinh nghiệm. Tư vấn đúng thông số, canh chỉnh đúng lực siết, không vẽ bệnh thừa thãi.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Bảo Hành Lắp Vừa 7 Ngày</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Khách hàng đặt hàng được kiểm tra hàng trước khi thanh toán. Đổi mới hoặc hoàn tiền ngay trong 7 ngày nếu không vừa xe hoặc không ưng ý theo đúng quy chuẩn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
