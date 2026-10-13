import { NextRequest, NextResponse } from "next/server";

/**
 * Shipping Webhook Boundary (GHN / GHTK / Viettel Post)
 *
 * Security Notice:
 * Webhook callbacks from logistics carriers must validate authentication tokens
 * before updating package tracking and order milestones.
 * For local demonstration, this returns 501 Not Implemented.
 */
export async function POST(request: NextRequest) {
  const token = request.headers.get("x-shipping-token");

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: "Thiếu mã xác thực từ đối tác vận chuyển (Missing shipping carrier token)",
      },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Shipping webhook endpoint is architected for OpenNext AWS Lambda but requires carrier API token.",
    },
    { status: 501 }
  );
}
