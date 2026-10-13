"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, PhoneCall, MessageCircle, X } from "lucide-react";

export function FloatingWidgets() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }

      if (currentScroll > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside aria-label="Hỗ trợ và điều hướng nhanh" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Chat Popup if toggled */}
      {chatOpen && (
        <div className="pointer-events-auto bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 w-80 mb-2 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                MP
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Tư Vấn Kỹ Thuật Xe</h4>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Đang trực tuyến (Sẵn sàng hỗ trợ)
                </p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p>
              Chào bạn! Bạn cần tư vấn lắp bố thắng, nhông sên dĩa hay bộ nồi cho dòng xe nào ạ?
            </p>
          </div>

          <div className="mt-3.5 space-y-2">
            <a
              href="tel:19008888"
              className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-orange-950/20"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Gọi Tổng Đài 1900 8888</span>
            </a>
            <button
              onClick={() => {
                alert("Đang kết nối đến chuyên viên tư vấn phụ tùng...");
                setChatOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Chat Zalo Với Kỹ Thuật Viên</span>
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons Stack */}
      <div className="flex flex-col gap-2.5 pointer-events-auto">
        {/* Hotline Ringing Button */}
        <a
          href="tel:19008888"
          className="group relative w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-600/30 hover:scale-110 active:scale-95 transition-all"
          title="Gọi Hotline tư vấn 1900 8888"
        >
          <PhoneCall className="w-5 h-5 animate-ring" />
          <span className="absolute right-14 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            Hotline: 1900 8888
          </span>
        </a>

        {/* Live Chat Toggle Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="group relative w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border border-slate-700 hover:border-orange-500"
          title="Tư vấn trực tuyến"
        >
          <MessageCircle className="w-5 h-5 text-orange-400" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
        </button>

        {/* Scroll To Top Button with Circular Progress */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="group relative w-12 h-12 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all border border-slate-200 animate-in zoom-in-75 duration-200"
            title="Lên đầu trang"
          >
            {/* Circular Progress SVG */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 p-0.5" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-orange-600 transition-all duration-150"
                strokeDasharray={`${scrollProgress}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform text-slate-700" />
          </button>
        )}
      </div>
    </aside>
  );
}
