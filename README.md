<div align="center">

# ✦ OMNIKART | ATELIER ✦
### *Next-Generation Multi-Vendor Luxury E-Commerce Marketplace*

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.12-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<p align="center">
  <b>A bespoke, high-performance architectural commerce platform designed with editorial luxury aesthetics, multi-tenant vendor boutiques, role-based governance, and real-time MongoDB catalog synchronization.</b>
</p>

---

</div>

## ✧ Table of Contents
- [✦ Vision & Design Philosophy](#-vision--design-philosophy)
- [✦ System Architecture & Portals](#-system-architecture--portals)
  - [1. Customer Storefront](#1-customer-storefront)
  - [2. Vendor Atelier Suite](#2-vendor-atelier-suite)
  - [3. Admin Control Center](#3-admin-control-center)
- [✦ Technology Stack](#-technology-stack)
- [✦ Project Structure](#-project-structure)
- [✦ Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [✦ Environment Variables](#-environment-variables)
- [✦ Deployment Guide (Vercel + Cloud API)](#-deployment-guide-vercel--cloud-api)
- [✦ Performance Benchmarks](#-performance-benchmarks)
- [✦ License](#-license)

---

## ✦ Vision & Design Philosophy

**OmniKart / Atelier** bridges high-fashion editorial aesthetics with modern software architecture. Traditional marketplaces often look cluttered and generic; OmniKart adopts a minimalist, gallery-grade layout inspired by haute couture fashion ateliers and architectural design studios:

- **Warm Editorial Typography:** Carefully paired Serif display headlines (`Cormorant Garamond`, `Italiana`) with ultra-legible modern sans (`Inter`, `Manrope`) and monospace badge details.
- **Micro-Animations & Smooth Motion:** Hardware-accelerated CSS keyframe animations, responsive hover elevates, tactile feedback, and buttery smooth native scroll transitions.
- **Zero-Flicker State Architecture:** Derived query parameters and optimized Redux state caches prevent cascading renders and eliminate layout shifts.

---

## ✦ System Architecture & Portals

The application features three distinct, fully integrated role-based experiences:

```
                                  ┌───────────────────────────┐
                                  │   OmniKart Marketplace   │
                                  └─────────────┬─────────────┘
                                                │
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
┌──────────────────┐          ┌───────────────────┐          ┌───────────────────┐
│ Client Storefront│          │  Vendor Atelier   │          │   Admin Control   │
│  (End Customer)  │          │ (Tenant Boutiques)│          │  (Platform Owner) │
├──────────────────┤          ├───────────────────┤          ├───────────────────┤
│ • Editorial Hero │          │ • Revenue & Sales │          │ • Real-Time Stats │
│ • Catalog Search │          │ • Product Studio  │          │ • Catalog Audit   │
│ • Faceted Filter │          │ • Inventory Radar │          │ • Vendor Approvals│
│ • Quick View     │          │ • Order Dispatch  │          │ • Customer CRM    │
│ • Bag & Wishlist │          │ • Review Replies  │          │ • Banner & Brands │
│ • Multi-Step Pay │          │ • Store Profile   │          │ • Payment Ledger  │
└──────────────────┘          └───────────────────┘          └───────────────────┘
```

### 1. Customer Storefront
- **Dynamic Editorial Hero:** Smooth background zoom keyframes, verified curation tags, and quick-access categories.
- **Faceted Catalog Browser (`/shop`):** Real-time URL query param synchronization (`searchParams`), instant price range sliders, collection chips, multi-sorting (Price, Rating, Newest), and paginated slices.
- **Interactive Product Modal & View:** Instant Quick View dialog with image carousel, size/color variant chips, and stock badges.
- **Persistent Cart & Wishlist:** Redux-persisted cart drawer with automatic shipping threshold computation and coupon code application.
- **Secure Multi-Step Checkout:** Integrated with Stripe and Cash on Delivery, instant address selector, and tax calculations.
- **Client Account Hub:** Order tracking timeline (`Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`), order cancellation, and multiple address management.

### 2. Vendor Atelier Suite
- **Merchant Dashboard:** Real-time analytics on sales volume, fulfillment metrics, top-performing SKUs, and inventory alerts.
- **Product Creation Studio:** Multi-image upload with Multer and Cloudinary, customizable variants, attribute key-values (Material, Fit, Wash care).
- **Inventory Health Monitoring:** Dedicated views for **Low Stock** (threshold $\le 8$ units) and **Out of Stock** items with quick replenishment.
- **Fulfillment Operations:** Manage incoming orders, review line items, download consignment receipts, and update shipping progress.
- **Reputation & Client Reviews:** View customer ratings, read feedback, and post verified vendor replies.

### 3. Admin Control Center
- **Live System KPI Board:** Aggregated gross merchandise value (GMV), active customer counts, inventory valuation, and boutique stats.
- **Catalog Governance:** Approve, edit, tag, feature, or bulk-import products via formatted JSON.
- **Multi-Tenant Onboarding:** Review boutique registration requests, approve new sellers, or suspend non-compliant tenants.
- **CRM & Client Directory:** VIP tier classification, total lifetime spend, orders placed, and account status toggles.
- **Promotions Engine:** Hero banner rotator management (scheduled start/end dates, click analytics) and official Brand catalog.
- **Financial Gateway Oversight:** Stripe, UPI/Razorpay, and COD transaction ledger with export to CSV and refund processing.

---

## ✦ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Core** | React 19, Vite 8, React Router v7 |
| **Styling & Design** | Tailwind CSS v4, Custom Design Tokens, CSS Keyframes |
| **State Management** | Redux Toolkit (Slices for Auth, Cart, Wishlist, Products, Categories, Vendors, Orders) |
| **Icons & Visuals** | Lucide React, React Icons |
| **Backend Core** | Node.js (ES Modules), Express 5 |
| **Database & ODM** | MongoDB Atlas, Mongoose 9 |
| **Authentication** | JSON Web Tokens (JWT), HTTP-Only Cookies, Bcrypt.js |
| **Media & Storage** | Cloudinary CDN, Multer Multi-part form parser |
| **Payments** | Stripe API, Cash on Delivery workflow |
| **Security & Utilities** | Helmet, CORS, Dotenv, Nodemailer |
| **Deployment** | Vercel (Frontend SPA), Cloud PaaS / Docker (Backend API) |

---

## ✦ Project Structure

```bash
-E-Commerce-Platform-/
├── backend/                        # Node.js Express 5 API Server
│   ├── config/                     # Database & service configurations
│   ├── controllers/                # REST Controllers (Auth, Product, Store, Order, Admin, etc.)
│   ├── middleware/                 # Auth verification, role checks, upload handlers
│   ├── models/                     # Mongoose Schemas (User, Product, Store, Order, Review, Banner, Brand)
│   ├── routes/                     # API Route declarations
│   ├── scripts/                    # Database seeding and migration utilities
│   ├── server.js                   # Application entry point
│   └── package.json
├── frontend/                       # React 19 + Vite 8 Single Page Application
│   ├── public/                     # Static assets & favicon
│   ├── src/
│   │   ├── assets/                 # SVGs, brand assets, imagery
│   │   ├── components/             # Reusable UI components
│   │   │   ├── admin/              # Admin-specific navigation & widgets
│   │   │   ├── common/             # Modals, drawers, loaders, badges
│   │   │   ├── home/               # Homepage editorial sections (Hero, BestSellers, etc.)
│   │   │   ├── layout/             # Navbar, Footer, AnnouncementBar
│   │   │   ├── product/            # ProductCard, variant selectors
│   │   │   └── vendor/             # Vendor portal navigation & widgets
│   │   ├── context/                # ModalContext, ToastContext, ShopDataContext
│   │   ├── layouts/                # CustomerLayout, VendorLayout, AdminLayout
│   │   ├── pages/                  # Route views (Public, Customer, Vendor, Admin)
│   │   ├── redux/                  # Redux Toolkit store & feature slices
│   │   ├── routes/                 # AppRoutes declarative routing tree
│   │   ├── services/               # Axios API clients (adminApi, storeApi, productApi, etc.)
│   │   ├── utils/                  # Image resolvers, slugifiers, formatters
│   │   ├── App.jsx                 # Top-level application shell
│   │   ├── main.jsx                # React root mount
│   │   └── index.css               # Design system tokens & animations
│   ├── vite.config.js              # Vite bundler config with chunk optimization
│   ├── vercel.json                 # Frontend SPA routing configuration
│   └── package.json
├── package.json                    # Root monorepo orchestration
├── vercel.json                     # Monorepo Vercel deployment configuration
└── README.md
```

---

## ✦ Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance or free MongoDB Atlas URI

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install server dependencies
npm install

# Create environment configuration
cp .env.example .env   # (or configure your .env file)

# Start the development server
npm run dev
```

*The API server will run at `http://localhost:8081`.*

---

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd ../frontend

# Install client dependencies
npm install

# Start Vite development server
npm run dev
```

*The customer storefront will be accessible at `http://localhost:5173`.*

---

## ✦ Environment Variables

### Backend (`backend/.env`)
```env
PORT=8081
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Email Service (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8081/api
```

---

## ✦ Deployment Guide (Vercel + Cloud API)

### Deploying Frontend to Vercel

This repository includes pre-configured Vercel configuration files:
- **Root [`vercel.json`](vercel.json)**: Supports single-click monorepo deployment directly from repository root.
- **SPA Rewrites**: Redirects all requests to `/index.html` to eliminate 404 errors on deep linking and page refreshes.

#### Steps:
1. Import your repository into **[Vercel](https://vercel.com/)**.
2. **Project Settings**:
   - If Root Directory is left as default (`.`): Vercel will execute `npm run build` from root and output `frontend/dist`.
   - If you set **Root Directory** to `frontend`: Vercel will automatically detect Vite and output `dist`.
3. Add Environment Variable in Vercel Dashboard:
   - `VITE_API_URL` = `https://your-backend-domain.com/api`
4. Click **Deploy**.

---

## ✦ Performance Benchmarks

- **Production Build Time:** ~`340ms` using Vite 8 + Rolldown runtime optimization.
- **Code Quality:** `0 errors, 0 warnings` across all ESLint checks with React 19 compiler compliance.
- **Bundle Splitting:**
  - `vendor-react` (~85 kB gzipped) — React 19, React-DOM, React-Router-DOM
  - `vendor-icons` (~15 kB gzipped) — Lucide React, React Icons
  - `vendor-axios` (~18 kB gzipped) — HTTP networking layer
  - `vendor-redux` (~8 kB gzipped) — Redux Toolkit state store
  - Individual on-demand lazy routes (~2 to 12 kB per page)

---

## ✦ License

This project is licensed under the [ISC License](LICENSE).

<div align="center">

Crafted with care for modern luxury commerce.

</div>