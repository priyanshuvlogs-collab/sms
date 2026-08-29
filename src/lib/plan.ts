/**
 * NINE pricing — non-negotiable. Single source of truth.
 *
 * Unit-economics guardrails live next to the prices on purpose:
 * vendor-paid AI per active user must stay under $1.50/month.
 * 200 runs × ~$0.006/run on the default cheap model ≈ $1.20. Do not
 * raise MAX_OUTPUT_TOKENS or the run quota without redoing this math.
 */

export const PLAN = {
  priceMonthlyUsd: 9,
  priceYearlyUsd: 79,
  trialDays: 7,
  included: {
    brands: 3,
    seats: 2, // 1 owner + 1 teammate
    runsPerMonth: 200,
  },
  addons: {
    extraRuns: { runs: 200, priceUsd: 5 },
    extraBrands: { brands: 5, priceUsd: 5 },
    byok: { priceUsd: 0, providers: ["openai", "anthropic", "gemini", "groq"] },
  },
} as const;

/** Hard caps enforced before and on every model call. */
export const RUN_LIMITS = {
  maxInputChars: 12_000,
  maxOutputTokens: 2_048,
  /** Target vendor cost ceiling per active user per month, USD. */
  vendorCostCeilingUsd: 1.5,
} as const;

export const MODULES = [
  { slug: "brands", name: "Brand Kit", phase: 2 },
  { slug: "campaigns", name: "Campaign Studio", phase: 3 },
  { slug: "content", name: "Content Engine", phase: 4 },
  { slug: "seo", name: "SEO Briefs", phase: 5 },
  { slug: "ads", name: "Ads Workshop", phase: 5 },
  { slug: "planner", name: "Planner", phase: 4 },
  { slug: "library", name: "Library", phase: 4 },
  { slug: "reports", name: "Weekly Report Lite", phase: 5 },
] as const;

/**
 * NOT_IN_V1 — cut to protect the $9 margin. Do not build:
 *  - email sending (reports are PDFs the user downloads/forwards)
 *  - CRM, SMS, funnels
 *  - native social publishing (Planner exports CSV for Buffer/Late)
 *  - paid SEO APIs (BYO SerpApi is a later, user-paid option)
 *  - image/video generation
 */
export const NOT_IN_V1 = [
  "email_sending",
  "crm",
  "sms",
  "funnels",
  "native_social_publishing",
  "paid_seo_apis",
  "image_generation",
] as const;
