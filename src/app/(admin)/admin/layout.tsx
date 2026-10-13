import React, { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100/70">
      <Suspense fallback={<aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0" />}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={<header className="h-16 bg-white border-b border-slate-200" />}>
          <AdminHeader />
        </Suspense>
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
