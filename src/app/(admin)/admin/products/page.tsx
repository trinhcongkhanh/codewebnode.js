"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Bike,
  ExternalLink,
  X,
  Check,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Product } from "@/types/product";
import {
  getStoredProducts,
  getCategories,
  upsertProduct,
  deleteProduct,
  subscribeToStoreUpdates,
} from "@/data/storeManager";
import { formatVND } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMounted, setIsMounted] = useState(false);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete Confirm Modal State
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formPrice, setFormPrice] = useState<number | "">("");
  const [formStock, setFormStock] = useState<number | "">("");
  const [formShelf, setFormShelf] = useState("Kệ A1");
  const [formCompartment, setFormCompartment] = useState("Ngăn số 1");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const categories = getCategories();

  const loadData = () => {
    setProducts(getStoredProducts());
  };

  useEffect(() => {
    loadData();
    setIsMounted(true);
    const unsubscribe = subscribeToStoreUpdates(() => loadData());
    return () => unsubscribe();
  }, []);

  if (!isMounted) return null;

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "all" && p.categoryId !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBrand) return false;
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormBrand("");
    setFormSku(`PRD-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormCategoryId(categories[0]?.id || "cat-phuong-thang");
    setFormPrice(350000);
    setFormStock(20);
    setFormShelf("Kệ A3");
    setFormCompartment("Ngăn số 2");
    setFormDescription("");
    setFormImageUrl(
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80"
    );
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormSku(p.sku);
    setFormCategoryId(p.categoryId);
    setFormPrice(p.price);
    setFormStock(p.stockQuantity);
    setFormShelf(p.shelf || "Kệ A1");
    setFormCompartment(p.compartment || "Ngăn 1");
    setFormDescription(p.description);
    setFormImageUrl(p.images[0] || "");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!formName.trim()) errs.name = "Vui lòng nhập tên phụ tùng";
    if (!formBrand.trim()) errs.brand = "Vui lòng nhập thương hiệu";
    if (!formSku.trim()) errs.sku = "Vui lòng nhập mã SKU";
    if (!formPrice || Number(formPrice) <= 0) errs.price = "Giá bán phải lớn hơn 0";
    if (formStock === "" || Number(formStock) < 0) errs.stock = "Số lượng tồn kho không được âm";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const catObj = categories.find((c) => c.id === formCategoryId);
    const categoryName = catObj ? catObj.name : "Phụ tùng khác";

    // Build slug from name
    const generatedSlug = formName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      slug: editingProduct ? editingProduct.slug : generatedSlug || `prod-${Date.now()}`,
      sku: formSku.trim(),
      name: formName.trim(),
      brand: formBrand.trim(),
      categoryId: formCategoryId,
      categoryName,
      description: formDescription.trim() || `Phụ tùng ${formName} chính hãng.`,
      price: Number(formPrice),
      images: [
        formImageUrl.trim() ||
          "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80",
      ],
      technicalSpecs: editingProduct ? editingProduct.technicalSpecs : { "Tiêu chuẩn": "Chính hãng OEM" },
      inStock: Number(formStock) > 0,
      stockQuantity: Number(formStock),
      shelf: formShelf.trim(),
      compartment: formCompartment.trim(),
      warehouseLocation: `${formShelf.trim()} — ${formCompartment.trim()}`,
      lowStockThreshold: 5,
      weightGrams: 500,
      fitments: editingProduct ? editingProduct.fitments : [],
      isFeatured: editingProduct ? editingProduct.isFeatured : false,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
    };

    upsertProduct(newProduct);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Sản Phẩm & Danh Mục
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Thêm mới, sửa đổi thông số, giá bán và vị trí kho thực tế của các dòng phụ tùng.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-orange-950/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Phụ Tùng Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, mã SKU, thương hiệu..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Danh mục:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-orange-500"
          >
            <option value="all">Tất cả ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Ảnh & Phụ Tùng</th>
                <th className="py-3 px-4">SKU / Hãng</th>
                <th className="py-3 px-4">Danh Mục</th>
                <th className="py-3 px-4">Giá Bán</th>
                <th className="py-3 px-4">Tồn Kho & Vị Trí</th>
                <th className="py-3 px-4">Dòng Xe Tương Thích</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Không tìm thấy phụ tùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="font-bold text-slate-900 hover:text-orange-600 line-clamp-1 flex items-center gap-1 group"
                          >
                            <span>{p.name}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-orange-600 shrink-0" />
                          </Link>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{p.description}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{p.sku}</span>
                      <span className="text-[11px] text-orange-600 font-semibold">{p.brand}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">{p.categoryName}</td>

                    <td className="py-3 px-4 font-black text-slate-900 text-sm">
                      {formatVND(p.price)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold ${
                            p.stockQuantity <= p.lowStockThreshold
                              ? "text-rose-600"
                              : "text-slate-900"
                          }`}
                        >
                          {p.stockQuantity} món
                        </span>
                        {p.stockQuantity <= p.lowStockThreshold && (
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-semibold">
                            Cảnh báo
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {p.warehouseLocation}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/products/fitment?product=${p.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold border border-orange-200 transition-colors"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>{p.fitments.length} dòng xe</span>
                      </Link>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProductId(p.id)}
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa phụ tùng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                {editingProduct ? "Cập Nhật Thông Tin Phụ Tùng" : "Thêm Mới Phụ Tùng Xe Máy"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tên phụ tùng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ví dụ: Bố thắng trước Brembo Sinter..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                  />
                  {formErrors.name && (
                    <p className="text-rose-500 text-[11px] mt-0.5">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hãng phụ tùng (Brembo, NGK, FCC...) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Brembo / NGK / Motul..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                  />
                  {formErrors.brand && (
                    <p className="text-rose-500 text-[11px] mt-0.5">{formErrors.brand}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mã SKU kho <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="BRM-BT-01"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Danh mục hệ thống</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Giá bán (VND) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value ? Number(e.target.value) : "")}
                    placeholder="450000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số lượng tồn kho <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value ? Number(e.target.value) : "")}
                    placeholder="25"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vị trí Kệ</label>
                  <input
                    type="text"
                    value={formShelf}
                    onChange={(e) => setFormShelf(e.target.value)}
                    placeholder="Kệ A3"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngăn chứa</label>
                  <input
                    type="text"
                    value={formCompartment}
                    onChange={(e) => setFormCompartment(e.target.value)}
                    placeholder="Ngăn số 2"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Đường dẫn ảnh sản phẩm (URL)
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mô tả kỹ thuật & công năng
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  placeholder="Mô tả chi tiết vật liệu, lực phanh, tuổi thọ khuyến nghị..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold shadow-md shadow-orange-950/20"
                >
                  {editingProduct ? "Lưu Thay Đổi" : "Tạo Mới Phụ Tùng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Xác Nhận Xóa Phụ Tùng?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Hành động này sẽ xóa sản phẩm khỏi kho và gỡ bỏ liên kết tương thích với các dòng xe.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="py-2.5 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
