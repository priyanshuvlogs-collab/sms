# NINE — The $9 marketing OS

A brand-aware AI marketing workbench for solopreneurs, coaches, local
businesses, creators, and freelancers with 1–8 clients.

**$9/month or $79/year.** 3 brands, 1 owner + 1 teammate, 200 AI runs/month,
all modules. No fake-cheap bait.

## Modules

| Module | What it does | Phase |
| --- | --- | --- |
| Brand Kit | Voice, offer, ICP, competitors, CTA, banned words — read by every generation | 2 |
| Campaign Studio (hero) | 1 goal + 1 offer → positioning, 7-day calendar, posts, ads, landing outline, emails, Shorts titles, UTMs | 3 |
| Content Engine | Hooks, posts, threads, captions; 1 long asset → 15 shorts | 4 |
| SEO Briefs | Keyword → brief, cluster builder, on-page draft score | 5 |
| Ads Workshop | 8 angles from one offer + compliance hints | 5 |
| Planner | Calendar + statuses, CSV export for Buffer/Late | 4 |
| Library | Saved winners + 50 prompt recipes | 4 |
| Weekly Report Lite | Paste numbers → 1-page client report PDF | 5 |

## Stack

- Next.js App Router + TypeScript + Tailwind 4 + shadcn/ui
- Supabase — Auth, Postgres, Storage, RLS on every table
- Stripe Checkout + Customer Portal + webhooks
- Vercel AI SDK — cheapest capable default model, quality fallback
- Resend (transactional only), Inngest/cron, PostHog, Sentry, Vercel

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase keys at minimum
pnpm dev
```

### Database

Apply the migration to your Supabase project:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

`supabase/migrations/00001_init.sql` creates the full v1 schema:
`profiles`, `workspaces`, `members`, `brands`, `campaigns`, `content_items`,
`library_items`, `ai_runs`, `usage_events`, `usage_months`, `reports`,
`byok_keys` — with RLS enabled on every table, a signup trigger that
provisions a workspace, and a `consume_run()` function that gates and counts
quota in one round trip.

## Unit economics (the whole point)

Vendor-paid AI per active user must stay **under $1.50/month**:

- 200 runs/month × ~$0.006/run on the cheap default model ≈ $1.20
- Hard caps: `max_tokens` 2,048 per run, 12,000 input chars (`src/lib/plan.ts`)
- Quota gate (`consume_run`) runs **before** every model call
- BYOK (free add-on) moves heavy users onto their own bill

## Anti-abuse

- Disposable-email domains blocked at signup
- Cloudflare Turnstile captcha on signup (enabled when keys are set)
- Rate limits on generate endpoints (Phase 2, with the first generator)
- Admin view: cost per user, margin, abuse flags (Phase 6)

## NOT_IN_V1

Cut deliberately to protect the $9 margin:

- Email sending (reports are PDFs you download and forward)
- CRM, SMS, funnels
- Native social publishing (Planner exports CSV for Buffer/Late)
- Paid SEO APIs (optional user-paid BYO SerpApi later)
- Image/video generation

## Build order

- [x] **Phase 0** — app shell, landing, auth, schema
- [ ] **Phase 1** — Stripe $9 / $79 + add-ons
- [ ] **Phase 2** — Brand Kit + quota gate + BYOK
- [ ] **Phase 3** — Campaign Studio (ship this first)
- [ ] **Phase 4** — Content Engine + Planner + Library
- [ ] **Phase 5** — SEO + Ads + Reports PDF
- [ ] **Phase 6** — onboarding (<90s), legal pages, admin costs, launch copy

**DONE means:** a stranger can pay $9, create a brand, generate a full
campaign, copy a week of posts, export a client report, and cancel in Stripe.
