import React, { Suspense } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<header className="h-16 bg-white border-b border-slate-200" />}>
        <Header />
      </Suspense>
      <main className="flex-1 bg-slate-50">{children}</main>
      <Footer />
    </div>
  );
}
