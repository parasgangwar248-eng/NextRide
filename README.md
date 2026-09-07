# NextRide

> **"Your next ride, on time, every time"**

NextRide is a reliable shared-mobility network engineered for rural and semi-urban communities, focused on predictable routes, dependable departures, and simple mobile booking.

![NextRide Brand Reference](./public/nextride-logo.jpg)

---

## 🚀 Key Highlights & Brand Identity

- **Official Brand Name**: `NextRide`
- **Official Tagline**: `"Your next ride, on time, every time"`
- **Brand Colors**:
  - Primary Brand Blue: `#1258D4` (derived directly from the official logo)
  - Supporting Surfaces: Pure White `#FFFFFF` and Slate Neutrals (`#F8FAFC`, `#0F172A`)
  - Harmonized Semantics: Success (`#16A34A`), Warning (`#D97706`), Error (`#DC2626`)
- **Bilingual Interface**: Seamless switching between English and Hindi (हिन्दी) with high-legibility typography for local rural commuters.
- **Portals**:
  - 🚌 **Passenger Experience**: Mobile-first, friendly, route discovery, departure countdowns, simple 1-click seat booking, digital ticket pass with authentic 4-digit OTP.
  - 🚦 **Driver Operations**: Fast, high-contrast, large touch controls, station progression, passenger manifest, OTP verification keypad, delay logging.
  - 📊 **Fleet & Dispatch Admin**: Real-time fleet KPI dashboard, live trip dispatch board, community routes management, and Supabase synchronization status.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + NextRide Custom Design System tokens
- **Icons**: Lucide React + Official NextRide Brand Asset
- **Backend**: Supabase (PostgreSQL, Realtime Subscriptions, Row Level Security)
- **Deployment**: Vercel ready (`vercel.json`)

---

## 📦 Getting Started Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🗄️ Supabase Backend Integration

NextRide includes a complete PostgreSQL schema with sample rural transit routes, trips, bookings, and RLS policies.

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
4. Copy your project credentials into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. *Note: NextRide includes an intelligent offline/local fallback adapter, so all features (booking, driver OTP verification, dispatch) work immediately out of the box even before connecting your Supabase keys.*

---

## 🌐 Deploying to Vercel

The project is pre-configured with `vercel.json` for single-page application routing.

### Option 1: Via Vercel CLI
```bash
npx vercel
```

### Option 2: Via GitHub & Vercel Dashboard
1. Push this repository to your GitHub account (`git push origin main`).
2. Visit [vercel.com/new](https://vercel.com/new) and import your `nextride` repository.
3. In **Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Click **Deploy**.

---

## 📋 Brand Compliance Checklist

- [x] Product Name: Exactly **NextRide**
- [x] Official Tagline: **"Your next ride, on time, every time"**
- [x] Supplied Logo: Integrated without distortion or recoloring
- [x] Centralized Design Tokens: Defined in `/src/design-system/tokens.ts`
- [x] High-contrast, clean UI matching the logo's electric royal blue (`#1258D4`)
- [x] Bilingual readability (English & Hindi)
- [x] Unified look and feel across Passenger, Driver, and Admin portals
