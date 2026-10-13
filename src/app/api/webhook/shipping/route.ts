import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/webhook/shipping
 *
 * Webhook endpoint for shipping carrier callbacks (GHN, GHTK, Viettel Post…).
 * Called when shipment status changes (e.g. picked up, in transit, delivered).
 * TODO: Verify carrier token before processing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Verify carrier secret token from request headers
    // const token = request.headers.get("x-ghn-token") ?? request.headers.get("x-ghtk-token");
    // if (token !== process.env.SHIPPING_WEBHOOK_TOKEN) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    console.log("[webhook/shipping] Received payload:", body);

    // TODO: Update order shipping status and tracking code
    // await updateOrderStatus(body.order_code, mapCarrierStatus(body.status));

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
