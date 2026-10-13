import { NextRequest, NextResponse } from "next/server";
import { getStoredOrders, createOrder } from "@/services/orderService";

/**
 * GET /api/orders
 * Returns the full order list (admin use).
 */
export async function GET() {
  const orders = getStoredOrders();
  return NextResponse.json({ success: true, count: orders.length, data: orders });
}

/**
 * POST /api/orders
 * Creates a new order.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = createOrder(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Dữ liệu đơn hàng không hợp lệ." },
      { status: 400 }
    );
  }
}
