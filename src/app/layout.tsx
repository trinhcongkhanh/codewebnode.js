import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/providers";
import { ToastContainer } from "@/components/common/ToastContainer";
import { AuthModal } from "@/components/common/AuthModal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MotoParts Pro — Phụ Tùng Xe Máy & Tra Cứu Theo Dòng Xe",
    template: "%s | MotoParts Pro",
  },
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "MotoParts Pro",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <StoreProvider>
          {children}
          <ToastContainer />
          <AuthModal />
        </StoreProvider>
      </body>
    </html>
  );
}
