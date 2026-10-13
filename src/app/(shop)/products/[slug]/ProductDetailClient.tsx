"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Bike,
  Package,
  Layers,
  Heart,
  Star,
  Share2,
  Check,
  MessageSquare,
} from "lucide-react";
import { Product } from "@/types/product";
import { formatVND } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useFitmentStore } from "@/store/useFitmentStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToastStore } from "@/store/useToastStore";

interface ProductDetailClientProps {
  product: Product;
}

interface UserReview {
  id: string;
  author: string;
  bike: string;
  rating: number;
  date: string;
  comment: string;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "fitment" | "reviews">("specs");

  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();
  const { getSelectedVehicleInfo, checkCompatibility } = useFitmentStore();

  // Reviews state with sample default reviews
  const [reviews, setReviews] = useState<UserReview[]>([
    {
      id: "rev-1",
      author: "Trần Anh Khoa",
      bike: "Honda SH 150i (2022)",
      rating: 5,
      date: "12/10/2026",
      comment: "Phụ tùng chính hãng chất lượng cao, lắp vào xe chạy êm ru, đúng chuẩn kích thước chân ốc không cần chế cháo gì cả.",
    },
    {
      id: "rev-2",
      author: "Nguyễn Hải Đăng",
      bike: "Yamaha Exciter 155",
      rating: 5,
      date: "08/10/2026",
      comment: "Giao hàng nhanh, đóng gói xịn xò 3 lớp chống sốc. Nhân viên kỹ thuật gọi điện xác nhận dòng xe trước khi gửi rất chu đáo.",
    },
  ]);

  // Review Form state
  const [newAuthor, setNewAuthor] = useState("");
  const [newBike, setNewBike] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    useCartStore.persist.rehydrate();
    useFitmentStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    setIsMounted(true);
  }, []);

  const selectedVehicle = isMounted ? getSelectedVehicleInfo() : null;
  const compatibility = isMounted
    ? checkCompatibility(product)
    : { isCompatible: true, verified: false };
  const isFavorited = isMounted ? isInWishlist(product.id) : false;

  const handleQuantityChange = (delta: number) => {
    const nextQty = quantity + delta;
    if (nextQty >= 1 && nextQty <= product.stockQuantity) {
      setQuantity(nextQty);
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product, quantity);
    setIsAdded(true);
    addToast(`Đã thêm ${quantity}x "${product.name}" vào giỏ hàng!`, "success");
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    addItem(product, quantity);
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    const added = toggleItem(product);
    if (added) {
      addToast(`Đã thêm "${product.name}" vào danh sách yêu thích!`, "info");
    } else {
      addToast(`Đã bỏ "${product.name}" khỏi danh sách yêu thích!`, "info");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      addToast("Đã sao chép liên kết sản phẩm!", "info");
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) {
      addToast("Vui lòng điền họ tên và nội dung đánh giá", "error");
      return;
    }

    const review: UserReview = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      bike: newBike.trim() || "Biker đam mê xe",
      rating: newRating,
      date: "Vừa xong",
      comment: newComment.trim(),
    };

    setReviews([review, ...reviews]);
    setNewAuthor("");
    setNewBike("");
    setNewComment("");
    addToast("Cảm ơn bạn đã gửi đánh giá cho sản phẩm!", "success");
  };

  return (
    <div className="space-y-8">
      {/* Top Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Gallery Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.originalPrice && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                  Tiết kiệm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img
                        ? "border-orange-600 ring-2 ring-orange-500/20"
                        : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand & SKU & Share/Wishlist bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Mã SKU: <strong className="text-slate-800">{product.sku}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-2 rounded-xl border transition-all ${
                      isFavorited
                        ? "bg-rose-50 border-rose-200 text-rose-600"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-rose-600"
                    }`}
                    title={isFavorited ? "Bỏ yêu thích" : "Lưu vào yêu thích"}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-600" : ""}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-orange-600 transition-colors"
                    title="Chia sẻ liên kết"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating header */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-black">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>4.9 / 5.0</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">{reviews.length} lượt đánh giá từ biker</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-600 font-semibold">100% Chính hãng</span>
              </div>

              {/* Vehicle Compatibility Banner */}
              <div className="p-3.5 rounded-2xl border transition-all duration-200">
                {selectedVehicle ? (
                  compatibility.isCompatible ? (
                    <div className="flex items-start gap-3 bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-emerald-800">
                          Cam kết 100% gắn vừa zin: {selectedVehicle.modelName} ({selectedVehicle.year})
                        </p>
                        <p className="text-emerald-700 mt-0.5">
                          {compatibility.notes || "Phụ tùng chuẩn kích thước chân ốc, không cần chế cháo hay độ thêm pát."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 bg-rose-50/80 border border-rose-200 p-3.5 rounded-xl text-xs text-rose-900">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-rose-800">
                          Cảnh báo: Không tương thích với {selectedVehicle.modelName} ({selectedVehicle.year})
                        </p>
                        <p className="text-rose-700 mt-0.5">
                          Phụ tùng này có thông số kỹ thuật khác biệt. Vui lòng kiểm tra lại bảng danh sách tương thích bên dưới để tránh mua nhầm.
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Bike className="w-4 h-4 text-orange-600 shrink-0" />
                      <span>Bạn chưa chọn dòng xe? Kiểm tra ngay để đảm bảo lắp vừa:</span>
                    </div>
                    <button
                      onClick={() => router.push("/products")}
                      className="text-orange-600 font-bold hover:underline shrink-0"
                    >
                      Chọn xe ngay →
                    </button>
                  </div>
                )}
              </div>

              {/* Price section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-baseline gap-4">
                <span className="text-2xl sm:text-3xl font-black text-orange-600">
                  {formatVND(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-600 ml-auto">
                  {product.inStock ? `Còn ${product.stockQuantity} món trong kho` : "Tạm hết hàng"}
                </span>
              </div>

              {/* Short Technical Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Controls & Purchase CTAs */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Số lượng:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 text-slate-600 hover:text-orange-600 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockQuantity}
                    className="p-2 text-slate-600 hover:text-orange-600 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  (Tối đa {product.stockQuantity} sản phẩm)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : product.inStock
                      ? "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdded ? "Đã Thêm Vào Giỏ Hàng!" : "Thêm Vào Giỏ Hàng"}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-950/20"
                >
                  <Zap className="w-4 h-4" />
                  <span>Mua Ngay — Giao Hỏa Tốc</span>
                </button>
              </div>

              {/* Confidence assurance icons */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Bảo hành chính hãng 12T</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Kiểm tra hàng rồi thanh toán</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-orange-600" />
                  <span>Đổi mới nếu không vừa xe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specifications | Compatibility List | Customer Reviews */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
          {[
            { id: "specs", label: "Thông Số Kỹ Thuật" },
            { id: "fitment", label: `Dòng Xe Tương Thích (${product.fitments.length})` },
            { id: "reviews", label: `Đánh Giá Từ Biker (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-orange-600 text-orange-600 bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {/* TAB 1: Specs */}
          {activeTab === "specs" && (
            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Bảng Thông Số Kỹ Thuật Chi Tiết
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(product.technicalSpecs).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between"
                  >
                    <span className="text-slate-500 font-semibold">{key}:</span>
                    <span className="text-slate-900 font-bold text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Fitments */}
          {activeTab === "fitment" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Danh Sách Dòng Xe Được Hãng Chứng Nhận Tương Thích
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {product.fitments.map((fit) => (
                  <div key={fit.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                        <Bike className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{fit.modelName}</h4>
                        <p className="text-[11px] text-slate-500">
                          Đời xe: {fit.yearFrom} — {fit.yearTo ? fit.yearTo : "Hiện tại"}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                      ✓ Chuẩn Zin 100%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-8">
              {/* Form submit review */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                  Viết Đánh Giá Về Phụ Tùng Này
                </h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Họ và tên của bạn
                      </label>
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="Ví dụ: Hoàng Long"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Dòng xe bạn đang đi
                      </label>
                      <input
                        type="text"
                        value={newBike}
                        onChange={(e) => setNewBike(e.target.value)}
                        placeholder="Ví dụ: Honda Vario 160"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Đánh giá chất lượng
                      </label>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5/5 Tuyệt vời)</option>
                        <option value={4}>⭐⭐⭐⭐ (4/5 Tốt)</option>
                        <option value={3}>⭐⭐⭐ (3/5 Bình thường)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nhận xét chi tiết sau khi lắp ráp & chạy thử
                    </label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      placeholder="Chia sẻ cảm nhận về độ êm, độ bám phanh, chất lượng hoàn thiện..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    Gửi Đánh Giá Ngay
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{r.author}</span>
                        <span className="text-[11px] text-orange-600 font-semibold">• {r.bike}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{r.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailClient;
