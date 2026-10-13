import React from "react";
import { Clock, Package, Truck, CheckCircle2, XCircle } from "lucide-react";
import { OrderStatus } from "@/types/order";
import { getOrderStatusLabel, getOrderStatusBadgeClass } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const label = getOrderStatusLabel(status);
  const badgeClass = getOrderStatusBadgeClass(status);

  const getIcon = () => {
    switch (status) {
      case "pending":
        return <Clock className="w-3.5 h-3.5" />;
      case "packing":
        return <Package className="w-3.5 h-3.5" />;
      case "shipping":
        return <Truck className="w-3.5 h-3.5" />;
      case "completed":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "cancelled":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}
    >
      {getIcon()}
      <span>{label}</span>
    </span>
  );
}
