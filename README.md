# ⚽ FlightsBook — FIFA World Cup 2026 Hospitality Platform

A fast, multilingual web platform for browsing **FIFA World Cup 2026** matches and
booking **hospitality & travel packages** (accommodation + premium matchday
hospitality — not bare tickets). Built with **Next.js 14 (App Router)**,
**TypeScript** and **Tailwind CSS**, with direct **Stripe** checkout configured
entirely through environment variables, and a full **admin console** to manage
everything end‑to‑end.

> The tournament runs **June 11 – July 19, 2026** across **16 host cities** in the
> **USA, Mexico and Canada** — 48 teams, 104 matches. The seeded data reflects the
> real schedule (opening match at Estadio Azteca, final at MetLife Stadium, etc.)
> and realistic official‑style hospitality price tiers.

---

## ✨ Features

- **4 languages** with full localization: English 🇬🇧, Russian 🇷🇺, Spanish 🇪🇸,
  Arabic 🇸🇦 (**RTL** support out of the box).
- **World‑Cup‑themed design** — pitch greens, gold and royal gradients, responsive
  and mobile‑first.
- **Real fixtures & venues** for World Cup 2026 (browsable, filterable by stage).
- **Powerful search & filters** on matches and packages — free‑text search, world
  **region** (West / Central / East / Multi‑city), **date range**, max price and
  sorting, with a live result count.
- **Hospitality packages** with localized names, summaries and inclusions,
  **accommodation details** (hotel, board basis, check‑in/out, nights, stars) and
  linked matches/stages.
- **Direct secure checkout** via Stripe — keys provided through env vars. Falls
  back to a **demo mode** (orders recorded, no charge) when no keys are set, so the
  site works immediately.
- **Admin console** at `/admin` — manage matches, packages, orders and site
  settings; everything is editable and reflected on the live site instantly.

---

## 🚀 Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your values
npm run dev                  # http://localhost:3000
```

Build & run in production:

```bash
npm run build
npm run start
```

The site redirects `/` → `/en`. Switch languages from the header.
The admin console lives at **`/admin`** (default login **`admin` / `122122`**).
You can change the username & password any time from **Admin → Settings**.

---

## 🔑 Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public base URL (used for Stripe redirects). |
| `STRIPE_SECRET_KEY` | Stripe secret key. **If empty → demo mode.** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the `/api/webhook` endpoint. |
| `PAYMENT_CURRENCY` | Checkout currency (e.g. `usd`). |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin login credentials. |
| `ADMIN_SESSION_SECRET` | Long random string to sign admin sessions. |

### Enabling live payments

1. Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. Create a webhook in the Stripe dashboard pointing to
   `https://YOUR_DOMAIN/api/webhook` for the `checkout.session.completed` event,
   and put its signing secret in `STRIPE_WEBHOOK_SECRET`.
3. Customers are redirected to Stripe Checkout; on success they return to
   `/{locale}/success?ref=...` and the order is marked **paid** by the webhook.

---

## 🗂️ Project structure

```
data/                      # JSON data store (matches, packages, settings, orders)
src/
  app/
    [locale]/              # Localized public site (home, matches, packages, checkout…)
    admin/                 # Admin console (dashboard, matches, packages, orders, settings)
    api/                   # checkout + Stripe webhook route handlers
  components/              # UI components (cards, header, footer, lists, admin shell)
  i18n/                    # Locale config + message dictionaries (en/ru/es/ar)
  lib/                     # store (data access), auth, stripe, formatting helpers
  middleware.ts            # Locale routing + dir/lang detection
```

## 🛠️ How the admin works

- Visit `/admin`, sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
- **Matches** — add/edit/delete fixtures (teams, flags, venue, date, stage).
- **Packages** — full CRUD incl. localized name/summary/inclusions per language,
  price, hotel stars, nights, popular flag and linked match.
- **Orders** — see every booking and update its status (pending/paid/demo/cancelled).
- **Settings** — brand, contact details, currency, home stats and localized
  tagline/hero copy.

Data is persisted to JSON files in `data/`. For multi‑instance or serverless
hosting, point `src/lib/store.ts` at a database — the access layer is isolated.

---

## ⚖️ Disclaimer

FlightsBook is an independent travel & hospitality demo project and is **not
affiliated with or endorsed by FIFA**. Team names, fixtures and pricing tiers are
used for demonstration purposes based on publicly announced World Cup 2026
information.
