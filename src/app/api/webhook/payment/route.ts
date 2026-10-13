import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/webhook/payment
 *
 * Webhook endpoint for payment gateway callbacks (MoMo, ZaloPay, VNPay…).
 * TODO: Verify HMAC signature before processing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Verify HMAC signature with process.env.PAYMENT_WEBHOOK_SECRET
    // const signature = request.headers.get("x-webhook-signature");
    // const isValid = verifySignature(body, signature, process.env.PAYMENT_WEBHOOK_SECRET!);
    // if (!isValid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    console.log("[webhook/payment] Received payload:", body);

    // TODO: Update order payment status in database
    // await updateOrderPaymentStatus(body.orderId, body.status);

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
