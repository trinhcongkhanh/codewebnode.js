import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MotoParts Pro — Phụ Tùng Xe Máy & Tra Cứu Theo Dòng Xe",
  description:
    "Hệ thống cung cấp phụ tùng xe máy chính hãng tại Việt Nam. Tra cứu tương thích chính xác theo Hãng xe, Dòng xe và Đời xe. Giao hàng toàn quốc.",
  keywords: [
    "phụ tùng xe máy",
    "bố thắng brembo",
    "bugi ngk",
    "nhớt motul 300v",
    "phụ tùng sh",
    "nhông sên dĩa did",
    "phuộc yss",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
