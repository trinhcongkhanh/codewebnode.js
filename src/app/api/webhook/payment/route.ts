import { NextRequest, NextResponse } from "next/server";

/**
 * Payment Webhook Boundary (VietQR / MoMo / ZaloPay)
 *
 * Security Notice:
 * In production AWS Lambda execution, this endpoint must verify HMAC-SHA256 signatures
 * using environment secrets before processing any order status mutation.
 * For local demonstration without verified payment providers, this returns 501 Not Implemented.
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-provider-signature");

  if (!signature) {
    return NextResponse.json(
      {
        success: false,
        error: "Thiếu chữ ký xác thực từ cổng thanh toán đối tác (Missing signature)",
      },
      { status: 401 }
    );
  }

  // Not Implemented placeholder until live merchant credentials are provided
  return NextResponse.json(
    {
      success: false,
      message: "Payment webhook endpoint is configured but awaiting live merchant secret keys.",
    },
    { status: 501 }
  );
}
