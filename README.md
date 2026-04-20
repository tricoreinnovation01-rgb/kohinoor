# Diya Art — Artist Portfolio (Next.js)

Production-style portfolio and shop: **Next.js App Router**, **Tailwind CSS v4**, **Framer Motion**, **GSAP** (+ ScrollTrigger), **Lenis** smooth scroll, **MongoDB** (Mongoose), **Cloudinary** uploads, **Stripe** checkout + webhooks, **JWT** admin auth (optional **Clerk** can replace the auth layer).

## Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Cloudinary account (for admin image uploads)
- Stripe account (test keys for development)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env.local` and fill in values:

   | Variable | Purpose |
   |----------|---------|
   | `NEXT_PUBLIC_APP_URL` | Site URL (e.g. `http://localhost:3000`) |
   | `MONGODB_URI` | MongoDB connection string |
   | `JWT_SECRET` | Long random string for signing admin JWT cookies |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary |
   | `CLOUDINARY_FOLDER` | Optional folder prefix for uploads |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` | Stripe |
   | `STRIPE_WEBHOOK_SECRET` | From Stripe Dashboard → Webhooks |
   | `OPENAI_API_KEY` | Optional — enables AI tag suggestions in admin |
   | `STITCH_API_KEY` | Optional — Google Stitch (server SDK); never commit real keys |

3. **Seed database** (admin user + sample artworks using Unsplash URLs)

   ```bash
   npm run seed
   ```

   Default admin (change after first login in production):

   - Email: `admin@diya.art`
   - Password: `admin123`

4. **Stripe webhook** (local testing)

   Use the Stripe CLI:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Put the signing secret into `STRIPE_WEBHOOK_SECRET`.

5. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

6. **Production build**

   ```bash
   npm run build
   npm start
   ```

## Project structure (high level)

- `src/app/` — App Router pages (`/`, `/portfolio`, `/work/[slug]`, `/shop`, `/about`, `/contact`, `/admin/*`)
- `src/app/api/` — REST handlers (artworks, checkout, upload, auth, webhooks, AI tags, etc.)
- `src/models/` — Mongoose models: `User`, `Artwork`, `Order`, `Customer`
- `src/components/` — UI: layout, home sections, portfolio, shop, admin forms
- `src/lib/` — DB, auth, Stripe, Cloudinary, recommendations
- `scripts/seed.ts` — Example seed data

## Features implemented

- **Motion**: Lenis smooth scrolling, GSAP hero text + scroll sections + parallax strip, Framer Motion page template + staggered grids, 3D tilt cards, cursor-follow aura
- **Shop**: Cart (localStorage), Stripe Checkout session API, webhook marks orders paid and artworks sold
- **AI**: Rule-based “You may also like” + `/api/recommendations/[id]`; optional OpenAI tagging via `/api/ai/tag-artwork`
- **Admin**: JWT cookie auth, CRUD artworks, Cloudinary upload, orders/customers lists
- **SEO**: `metadata`, `sitemap.ts`, `robots.ts`

## Clerk (optional)

This repo uses **JWT + httpOnly cookie** for admin. To use **Clerk** instead: install `@clerk/nextjs`, add middleware per Clerk docs, protect `/admin/*`, and replace `getAuthFromCookies()` checks in API routes with Clerk’s `auth()`.

## Notes

- Image domains allowed in `next.config.ts`: Cloudinary + Unsplash (for seed images).
- Without `MONGODB_URI`, public API routes return empty lists so the app still runs for UI-only demos.

## MongoDB troubleshooting

If you see **`connect ECONNREFUSED 127.0.0.1:27017`**, nothing is listening on the default MongoDB port — the app is fine; the database is not running (or the URI is wrong).

Pick one:

1. **Docker (quickest on Windows)** — from any terminal:

   ```bash
   docker run -d --name diya-mongo -p 27017:27017 mongo:7
   ```

   Keep `.env.local` as `MONGODB_URI=mongodb://127.0.0.1:27017/diya-art`, then run `npm run seed` and restart `npm run dev`.

2. **MongoDB Atlas (cloud, no local install)** — create a free cluster, get the connection string, and set `MONGODB_URI` in `.env.local` (replace `<password>` and usually add `?appName=diya-art`). Run `npm run seed` once your IP is allowed in Atlas network access.

3. **MongoDB Community Server on Windows** — install from MongoDB’s site, start the **MongoDB** Windows service, then use the same local URI as in (1).

After MongoDB is reachable, run **`npm run seed`** so the admin user exists, then sign in at `/admin/login`.

## Google Stitch MCP (Cursor)

- In the app: sign in to **Admin** → **Stitch MCP** (`/admin/stitch`) for setup steps and a copy-paste JSON snippet (no secrets stored in the repo).
- Template file: `docs/cursor-mcp-stitch.example.json`
- Use a **new** API key in Cursor’s MCP settings only; if a key was ever shared publicly, **rotate** it first.

**Export MCP JSON from `.env.local` (recommended):**

```bash
# .env.local
STITCH_API_KEY=your_key_here

npm run mcp:stitch-export
```

Copy the printed JSON into Cursor’s MCP config.
