import { NextRequest, NextResponse } from "next/server";
import { initialProducts } from "@/data/mockData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity } = body;

    const product = initialProducts.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Phụ tùng không tồn tại" },
        { status: 404 }
      );
    }

    if (quantity > product.stockQuantity) {
      return NextResponse.json(
        {
          success: false,
          error: `Số lượng yêu cầu (${quantity}) vượt quá tồn kho thực tế (${product.stockQuantity})`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kiểm tra tồn kho thành công",
      item: {
        product,
        quantity,
        lineTotal: product.price * quantity,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Dữ liệu yêu cầu không hợp lệ" },
      { status: 400 }
    );
  }
}
