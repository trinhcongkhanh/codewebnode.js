# MotoParts Pro — E-Commerce Phụ Tùng Xe Máy (Next.js App Router)

Dự án website thương mại điện tử chuyên cung cấp phụ tùng xe máy chính hãng, hỗ trợ tra cứu tương thích kỹ thuật theo Dòng xe (Vehicle Fitment: Hãng xe, Model, Năm sản xuất), giỏ hàng, đặt hàng và trang quản trị Admin.

---

## 🏗️ Cấu Trúc Dự Án Chuẩn Next.js (App Router Architecture)

Dự án được xây dựng và tổ chức theo tiêu chuẩn của **Next.js 16 (App Router)** với cấu trúc phân tầng rõ ràng, tách biệt logic giao diện, nghiệp vụ và trạng thái:

```text
codewebnode.js/
├── public/                     # Static assets (icons, hình ảnh công khai)
├── src/
│   ├── app/                    # Next.js App Router (Routing layer)
│   │   ├── layout.tsx          # Root Layout (Fonts, StoreProvider, HTML shell)
│   │   ├── globals.css         # TailwindCSS v4 theme & utility styles
│   │   ├── loading.tsx         # Root Suspense fallback loading
│   │   ├── error.tsx           # Root Error Boundary
│   │   ├── not-found.tsx       # Trang 404 tùy biến
│   │   │
│   │   ├── (shop)/             # Route Group: Giao diện Storefront khách hàng
│   │   │   ├── layout.tsx      # Shop Layout (Header + Navigation + Footer)
│   │   │   ├── loading.tsx     # Skeleton loading cho storefront
│   │   │   ├── error.tsx       # Error boundary cho shop
│   │   │   ├── page.tsx        # Trang chủ: Hero, Bộ lọc xe, Danh mục, Hot Deals
│   │   │   ├── cart/           # Trang giỏ hàng (/cart)
│   │   │   ├── checkout/       # Trang thanh toán & đặt hàng (/checkout)
│   │   │   └── products/       # Danh mục sản phẩm & chi tiết
│   │   │       ├── page.tsx    # Danh sách sản phẩm kèm lọc & tìm kiếm (/products)
│   │   │       ├── loading.tsx
│   │   │       └── [slug]/     # Trang chi tiết sản phẩm (/products/[slug])
│   │   │           ├── page.tsx                 # Server Component (generateMetadata, generateStaticParams)
│   │   │           ├── loading.tsx              # Skeleton chi tiết sản phẩm
│   │   │           └── ProductDetailClient.tsx  # Client Component tương tác (chọn ảnh, số lượng, thêm giỏ)
│   │   │
│   │   ├── (admin)/            # Route Group: Trang quản trị nội bộ
│   │   │   └── admin/
│   │   │       ├── layout.tsx  # Admin Layout (AdminSidebar + AdminHeader)
│   │   │       ├── page.tsx    # Dashboard thống kê doanh thu, đơn hàng
│   │   │       ├── loading.tsx # Loading state cho admin
│   │   │       ├── error.tsx   # Error state cho admin
│   │   │       ├── inventory/  # Quản lý kho, vị trí kệ & tồn kho
│   │   │       ├── orders/     # Danh sách & chi tiết xử lý đơn hàng
│   │   │       │   └── [id]/   # Chi tiết đơn hàng (/admin/orders/[id])
│   │   │       └── products/   # CRUD sản phẩm & cấu hình tương thích xe (Fitment)
│   │   │           └── fitment/# Gán phụ tùng theo Hãng xe/Model/Năm
│   │   │
│   │   └── api/                # Next.js Route Handlers (Backend REST APIs)
│   │       ├── cart/           # POST: Xác thực tồn kho trước khi thêm giỏ
│   │       ├── orders/         # GET/POST: Lấy danh sách & tạo đơn hàng mới
│   │       │   └── [id]/       # GET/PATCH: Chi tiết đơn & cập nhật trạng thái
│   │       ├── products/search/# GET: Tìm kiếm toàn văn & lọc fitment nâng cao
│   │       └── webhook/        # Xử lý webhook thanh toán & vận chuyển
│   │           ├── payment/
│   │           └── shipping/
│   │
│   ├── components/             # Reusable UI Components
│   │   ├── storefront/         # Components dành riêng cho Storefront (CategoryGrid, CrossSellList)
│   │   ├── admin/              # Components dành cho Admin (Sidebar, Header, MetricCard, Badges)
│   │   └── common/             # Components dùng chung (Header, Footer, CartDrawer, FitmentSelector, ProductCard, SearchSuggestions)
│   │
│   ├── services/               # Data & Business Logic Layer (Clean Architecture)
│   │   ├── productService.ts   # Nghiệp vụ sản phẩm, fitment xe, danh mục, kho bãi
│   │   ├── orderService.ts     # Nghiệp vụ quản lý vòng đời đơn hàng, đổi trả
│   │   └── index.ts
│   │
│   ├── store/                  # Client State Management (Zustand + LocalStorage Sync)
│   │   ├── useCartStore.ts     # State giỏ hàng (thêm/sửa/xóa, tổng tiền, mở drawer)
│   │   ├── useFitmentStore.ts  # State thông tin xe người dùng chọn để lọc phụ tùng
│   │   └── index.ts
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useMounted.ts       # Hook tránh hydration mismatch an toàn trong Next.js SSR
│   │   ├── useStoreData.ts     # Hook lắng nghe dữ liệu reactive theo thời gian thực
│   │   └── index.ts
│   │
│   ├── providers/              # React Context / State Providers
│   │   ├── StoreProvider.tsx   # Tự động đồng bộ và rehydrate Zustand store
│   │   └── index.ts
│   │
│   ├── types/                  # TypeScript Data Models & Contracts
│   │   ├── product.ts          # Type: Product, VehicleManufacturer, VehicleModel, Fitment
│   │   ├── order.ts            # Type: Order, OrderStatus, TimelineItem, ReturnRequest
│   │   ├── inventory.ts        # Type: InventoryItem, InventoryUpdatePayload
│   │   └── index.ts
│   │
│   ├── constants/              # App Constants & Storage Keys
│   │   └── index.ts
│   │
│   ├── lib/                    # Shared Helpers & SDK Clients
│   │   ├── utils.ts            # formatVND, cn helper (clsx + tailwind-merge)
│   │   ├── aws-clients.ts      # Cấu hình kết nối AWS SDK (S3, DynamoDB, SES)
│   │   └── index.ts
│   │
│   ├── data/                   # Dữ liệu mẫu khởi tạo
│   │   └── mockData.ts         # Danh sách dòng xe, phụ tùng, đơn hàng mẫu
│   │
│   └── proxy.ts                # Next.js 16 Proxy (thay thế middleware cũ): bảo vệ Admin & gắn Security Headers
│
├── next.config.ts              # Cấu hình Next.js (Turbopack, cacheComponents, images remotePatterns)
├── tsconfig.json               # Cấu hình TypeScript & path aliases (@/* -> ./src/*)
├── package.json                # Dependencies & npm scripts
└── eslint.config.mjs           # Cấu hình ESLint 9 với Next.js TypeScript rules
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Cài đặt thư viện:
```bash
npm install
```

### 2. Chạy môi trường phát triển (Development):
```bash
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

### 3. Build & kiểm tra cho môi trường Production:
```bash
npm run build
npm run start
```

### 4. Kiểm tra mã nguồn (Linting):
```bash
npm run lint
```

---

## ✨ Điểm Nổi Bật Của Kiến Trúc Next.js Này

1. **Tuân thủ chuẩn App Router**: Sử dụng Route Groups `(shop)` và `(admin)` giúp tách biệt hoàn toàn layout của trang bán hàng và trang quản trị mà không ảnh hưởng URL.
2. **Server Components & Client Components cân bằng**:
   - Các trang dữ liệu nặng được render từ Server (`generateMetadata`, `generateStaticParams`).
   - Tương tác phía người dùng (Cart Drawer, Fitment Picker) được cô lập vào các Client Components (`'use client'`).
3. **Phân tầng Service Layer**: Logic xử lý dữ liệu và nghiệp vụ tách biệt hoàn toàn khỏi components, gom tại `src/services/`.
4. **Chuẩn hóa Next.js 16**: Sử dụng `proxy.ts` (chuẩn mới thay thế `middleware.ts`), tương thích hoàn toàn với Turbopack và `cacheComponents`.
5. **SEO & UX tối ưu**: Có sẵn `loading.tsx` (Skeleton), `error.tsx` (Error Boundary), `not-found.tsx` (Trang 404) ở mọi cấp độ route.
