import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/services/orderService";
import type { OrderStatus } from "@/types/order";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/orders/[id]
 * Returns a single order by ID or order code.
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) {
    return NextResponse.json({ success: false, error: "Đơn hàng không tồn tại." }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: order });
}

/**
 * PATCH /api/orders/[id]
 * Updates the status of an order.
 * Body: { status: OrderStatus; note?: string }
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { status, note } = body as { status: OrderStatus; note?: string };

    const validStatuses: OrderStatus[] = ["pending", "packing", "shipping", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Trạng thái không hợp lệ." }, { status: 400 });
    }

    updateOrderStatus(id, status, note);
    const updated = getOrderById(id);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }
}
