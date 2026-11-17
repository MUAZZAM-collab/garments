# VELOURA Privé — Haute Lingerie, Silk Loungewear & Bridal Atelier (MERN Stack)

![VELOURA Privé Banner](https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1600)

> **VELOURA Privé** is a production-ready, luxury-feel e-commerce platform for a premier Pakistani intimate apparel and silk loungewear brand. Designed to meet and exceed the aesthetic and technical quality of luxury Pakistani fashion houses like *Losha, Sapphire, and Khaadi* — minimal, feminine, discreet, and high-trust.

---

## 💎 Key Highlights & Architecture

- **Aesthetic Design Language**: Warm Ivory (`#F7F2EE`), Dusty Rose (`#B76E79`), Deep Berry (`#7B3F4C`), Near-black Charcoal (`#1C1A19`), and Privé VIP Gold (`#C9A961`). Cormorant Garamond display serif typography paired with clean Inter sans.
- **Discreet Packaging Guarantee**: 100% plain, unbranded opaque packaging with zero lingerie descriptions on courier waybills.
- **Pakistan-Specific Commerce**:
  - Cash on Delivery (COD) as primary payment method with telephone confirmation queue.
  - JazzCash, Easypaisa, and Direct Bank Transfer (Meezan / HBL).
  - City selector covering all 35+ Pakistani metropolitan hubs with specific delivery fee rules (Free nationwide shipping over PKR 3,500).
  - Mobile phone format validation (`03XX XXXXXXX` / `+92`).
- **Privé Society VIP Loyalty Program**:
  - Tiers: **Silver** (PKR 0+) → **Rose Gold** (PKR 25,000+) → **Black Card** (PKR 60,000+).
  - Perks: 24h early drop access, complimentary free shipping forever, WhatsApp female styling concierge, birthday privileges.
  - Interactive VIP dashboard with tier progress bar, points counter, and unlocked perks.
- **Interactive Fit & Sizing Studio**:
  - Smart Bra Size Finder (underbust + overbust calculator in inches and cm).
  - Sister size recommendations and full sizing chart from 30A to 42DD.
- **Admin Atelier Panel (`/admin`)**:
  - Recharts monthly revenue and city distribution charts.
  - Variant-level inventory management (Size × Color × Stock × SKU) with low-stock warnings.
  - Order fulfillment workflow (Pending → Confirmed → Packed → Shipped → Delivered) with TCS Tracking Number assignment.
  - Patron VIP tier promotion & review moderation.
  - Dynamic homepage hero banner management and bulk CSV product export.

---

## 🛠 Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Zustand (cart, wishlist, auth), TanStack React Query, Framer Motion, Recharts, Canvas Confetti, Lucide Icons |
| **Backend** | Node.js, Express, MongoDB + Mongoose, JWT (Access + Refresh tokens in httpOnly cookies), Multer, Cloudinary, Helmet, CORS, Express-Rate-Limit, Nodemailer, MongoMemoryServer |
| **Deployment** | MongoDB Atlas / Railway / Render (Server) + Vercel (Client) |

---

## 🔐 Demo Credentials

Use these credentials to experience both customer and atelier administrator privileges immediately:

### 1. Atelier Admin Account
- **URL**: `http://localhost:5173/admin` or via Sign In
- **Email**: `admin@veloura.pk`
- **Password**: `Admin@123456`
- **Role**: `admin` (Full dashboard analytics, order status updater, product CRUD, customer tier upgrades)

### 2. VIP Rose Gold Customer Account
- **URL**: `http://localhost:5173/login`
- **Email**: `sara@veloura.pk`
- **Password**: `Customer@123456`
- **Tier**: `Rose Gold VIP` (1,850 Points, lifetime spend PKR 34,200, Clifton Karachi address pre-filled)

### 3. Active Privilege Promo Codes
- `VELOURA10` — 10% Off on orders over PKR 3,000 (Public)
- `VIPPRIVILEGE` — 20% Off for Rose Gold & Black Card VIP members
- `FIRSTORDER` — Flat PKR 500 Off on orders over PKR 4,000

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js v18+ and npm v9+
- (Optional) MongoDB Atlas URI. *If omitted, VELOURA automatically boots an embedded in-memory database and auto-seeds all products on startup with zero configuration required.*

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/veloura-prive.git
cd veloura-prive

# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Environment Variables

Both applications include ready `.env.example` templates.

#### Backend (`server/.env`)
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database (leave blank to auto-use embedded zero-config database)
MONGODB_URI=

# JWT Secrets
JWT_ACCESS_SECRET=veloura_access_secret_key_luxury_lingerie_2024_secure
JWT_REFRESH_SECRET=veloura_refresh_secret_key_luxury_lingerie_2024_secure
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Optional Cloudinary (editorial fallbacks provided if blank)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

#### Frontend (`client/.env`)
```env
VITE_API_URL=/api
VITE_BRAND_NAME="VELOURA Privé"
VITE_BRAND_PHONE="+92 300 1234567"
VITE_BRAND_EMAIL="concierge@veloura.pk"
VITE_WHATSAPP_NUMBER="923001234567"
```

### 3. Seed Database (Optional Manual Seed)
The database auto-seeds on first server startup, but you can also re-seed anytime:
```bash
npm run seed --prefix server
```

### 4. Run Development Servers
Run both client and server concurrently with one command from root:
```bash
npm run dev
```

- **Storefront Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001/api`
- **Admin Panel**: `http://localhost:5173/admin`

---

## 🌐 Production Deployment

### 1. Backend on Render / Railway
1. Push your repository to GitHub.
2. In Render or Railway, create a new **Web Service** pointing to `/server`.
3. Set Build Command: `npm install`
4. Set Start Command: `node src/index.js`
5. Configure Environment Variables in the platform dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas cluster connection string.
   - `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`: Random secure strings.
   - `CLIENT_URL`: Your Vercel frontend URL (e.g. `https://veloura.vercel.app`).
   - `PORT`: `5001` (or let Render assign `$PORT`).

### 2. Frontend on Vercel
1. In Vercel, import the repository and select `/client` as the Root Directory.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - `VITE_API_URL`: Your deployed backend API URL (e.g. `https://veloura-api.onrender.com/api`).

---

## 📁 Project Structure

```
/garments
├── server/
│   ├── src/
│   │   ├── config/          # Database & Cloudinary configurations
│   │   ├── controllers/     # Auth, Products, Orders, Categories, Coupons, Reviews, Admin
│   │   ├── middleware/      # JWT Protect, AdminOnly, Multer, ErrorHandler
│   │   ├── models/          # User, Product, Category, Order, Coupon, Review, Banner
│   │   ├── routes/          # Express route definitions
│   │   ├── utils/           # Nodemailer email templates, token generators
│   │   ├── seed.js          # 12 luxury products, 7 categories, demo users seed script
│   │   └── index.js         # Express app entry point
│   ├── .env.example
│   └── package.json
├── client/
│   ├── public/              # Favicon, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/       # Admin sidebar layout and metrics cards
│   │   │   ├── cart/        # Slide-out Cart Drawer with shipping progress bar
│   │   │   ├── common/      # Navbar, Footer, AnnouncementBar, TrustBadges, Modals
│   │   │   ├── product/     # ProductCard with hover image reveal, QuickAddModal
│   │   │   └── ui/          # Luxury Button, Input, Modal, Accordion, Badge, Skeleton
│   │   ├── lib/             # Utilities, formatters, 35+ Pakistani cities list
│   │   ├── pages/           # Storefront pages (Home, Shop, PDP, Cart, Checkout, VIP, etc.)
│   │   │   └── admin/       # Dashboard, Products, Orders, Customers, Categories, Coupons
│   │   ├── services/        # Axios client with interceptors
│   │   ├── store/           # Zustand stores (useAuthStore, useCartStore, useWishlistStore)
│   │   ├── App.jsx          # Route configuration with protected route guards
│   │   └── main.jsx
│   ├── tailwind.config.js   # Ivory, Rose, Berry, Charcoal, and VIP Gold theme tokens
│   ├── vite.config.js       # Proxy configuration and alias resolution
│   ├── .env.example
│   └── package.json
├── README.md
└── package.json             # Root monorepo runner
```

---

## 🔒 Confidentiality & Discreet Packaging Standard

All VELOURA Privé parcels are shipped according to the **Discreet Delivery Protocol**:
- Outer packages are completely plain, unbranded opaque satchels.
- The courier label reads only generic terms ("Apparel") with zero mentions of lingerie or intimate wear.
- Confidential female concierge available for discreet telephone confirmations across 120+ Pakistani cities.
