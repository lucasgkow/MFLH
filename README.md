# MFLH Collective

Production website for **MFLH Collective** (Move Fast Lift Heavy) — a Hyrox-focused hybrid performance gym in Bohemia, NY, owned by Christian Harris (4× CrossFit Games qualifier, Hyrox pioneer).

Dark, bold, editorial. Built like a high-end streetwear brand collided with an elite performance facility.

## Stack

- **Next.js 14** (App Router, server components, server actions)
- **Supabase** — Postgres, Auth, Edge Functions
- **Tailwind CSS** — custom dark design system
- **Stripe** — schema + UI ready, **payments NOT wired** (see TODO below)
- **Netlify** — deploy target

## Design system

| Token | Value |
|---|---|
| Background (`ink`) | `#080808` |
| Text (`bone`) | `#F2F0EB` |
| Accent (`flame`) | `#FF4D00` |
| Concrete | `#2A2A2A` |
| Display font | Bebas Neue |
| Body font | DM Sans |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

The site renders **without Supabase configured** — dynamic sections (events, merch, FAQs) show graceful empty states until the backend is connected.

## Environment variables

See `.env.example`. Set these in Netlify → Site settings → Environment variables for production.

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (RLS-protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only.** Admin portal + form inserts. Never expose. |
| `NEXT_PUBLIC_SITE_URL` | Public URL for metadata |
| `STRIPE_SECRET_KEY` | TODO — Stripe not wired |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | TODO — Stripe not wired |

## Supabase setup

1. Create a new Supabase project.
2. Run the schema migration in the SQL editor:
   - `supabase/migrations/0001_init.sql` — tables, indexes, RLS policies
3. Run the seed data:
   - `supabase/seed.sql` — Run Club events, Father's Day event, 3 products, FAQs, site settings
4. Create the single admin user (Chris Harris) in **Authentication → Users → Add user** (email + password). There is no public sign-up.
5. (Optional) Deploy edge functions:
   ```bash
   supabase functions deploy send-registration-email
   supabase functions deploy create-checkout-session
   ```

### RLS model

- **Public read:** `events`, `products`, `faqs`, `site_settings`
- **Public insert only:** `registrations`, `contact_submissions`, `event_registrations` (no read-back)
- **Admin:** all reads/writes go through the service-role key server-side, which bypasses RLS. Admin routes are gated by Supabase Auth via `src/middleware.ts` + `requireAdmin()`.

## Routes

**Public:** `/` · `/about` · `/training` · `/schedule` · `/events` · `/events/[slug]` · `/get-started` · `/shop` · `/shop/[slug]` · `/contact`

**Admin** (`/admin`, auth-gated): `/admin/login` · `/admin` (dashboard) · `/admin/registrations` · `/admin/contact` · `/admin/events` (+ `/new`, `/[id]`) · `/admin/events/registrations` · `/admin/shop` (+ `/new`, `/[id]`) · `/admin/faqs` · `/admin/settings`

There is intentionally **no pricing page** — the owner handles pricing conversations personally via the Get Started form.

## Photos

Real facility photography lives in `public/photos/` (renamed from the source `Photos/` folder). Missing shots (Chris Harris portrait/competition, coach headshots, product photos) render as clearly labeled placeholders — search the codebase for `MISSING:` / `PHOTO:` to find every one.

## TODO: Stripe

Payments are **not implemented**. The data model and UI are ready:

- `products.stripe_price_id` column exists (currently null)
- `orders` table exists (Stripe-ready, display-only in admin)
- Cart works end-to-end client-side; the **Checkout** button is disabled with "coming soon"
- `supabase/functions/create-checkout-session/` is scaffolded and returns `501` until configured

To wire it up: set `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, populate `stripe_price_id` per product, implement the checkout session edge function, and connect the cart Checkout button.

## TODO: Email (SMTP)

`supabase/functions/send-registration-email/` is scaffolded but does **not** send real email until an SMTP/provider is configured (Resend/Postmark/SendGrid). It no-ops safely until then; registration inserts still succeed.

## Deploy (Netlify)

1. Connect the repo to Netlify.
2. `netlify.toml` is preconfigured (`npm run build`, `@netlify/plugin-nextjs`).
3. Add all environment variables in the Netlify dashboard.
4. Deploy.
