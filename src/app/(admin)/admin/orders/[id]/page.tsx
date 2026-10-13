import React, { Suspense } from "react";
import { initialOrders } from "@/data/mockData";
import OrderDetailClient from "./OrderDetailClient";

export function generateStaticParams() {
  return initialOrders.map((o) => ({
    id: o.id,
  }));
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function OrderDetailLoader({ params }: PageProps) {
  const { id } = await params;
  return <OrderDetailClient orderId={id} />;
}

export default function AdminOrderDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 text-xs">
          Đang tải chi tiết đơn hàng...
        </div>
      }
    >
      <OrderDetailLoader params={params} />
    </Suspense>
  );
}
