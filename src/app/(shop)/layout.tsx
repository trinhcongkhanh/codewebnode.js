import React, { Suspense } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { MarqueeBanner } from "@/components/common/MarqueeBanner";
import { FloatingWidgets } from "@/components/common/FloatingWidgets";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Suspense fallback={<header className="h-16 bg-white border-b border-slate-200" />}>
        <Header />
      </Suspense>
      <MarqueeBanner />
      <main className="flex-1 bg-slate-50">{children}</main>
      <Footer />
      <FloatingWidgets />
    </div>
  );
}
