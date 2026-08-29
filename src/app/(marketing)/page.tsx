import Link from "next/link";
import {
  Palette,
  Rocket,
  PenLine,
  Search,
  Megaphone,
  CalendarDays,
  BookMarked,
  FileText,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PLAN } from "@/lib/plan";

const MODULES = [
  {
    icon: Palette,
    name: "Brand Kit",
    desc: "Voice, offer, ICP, competitors, CTA, banned words. Every generation reads it.",
  },
  {
    icon: Rocket,
    name: "Campaign Studio",
    desc: "One goal + one offer in. Positioning, 7-day calendar, platform posts, ads, landing outline, emails, UTMs out.",
  },
  {
    icon: PenLine,
    name: "Content Engine",
    desc: "Hooks, posts, threads, captions. Repurpose one long asset into 15 shorts.",
  },
  {
    icon: Search,
    name: "SEO Briefs",
    desc: "Keyword to brief, cluster builder, on-page draft score. No paid API tax.",
  },
  {
    icon: Megaphone,
    name: "Ads Workshop",
    desc: "8 angles from one offer, with compliance hints for Meta and Google.",
  },
  {
    icon: CalendarDays,
    name: "Planner",
    desc: "Calendar and statuses. Export CSV straight into Buffer or Late.",
  },
  {
    icon: BookMarked,
    name: "Library",
    desc: "Your saved winners plus 50 prompt recipes that actually convert.",
  },
  {
    icon: FileText,
    name: "Weekly Report Lite",
    desc: "Paste your numbers, get a one-page client report PDF.",
  },
];

const INCLUDED = [
  `${PLAN.included.brands} brands`,
  "1 owner + 1 teammate",
  `${PLAN.included.runsPerMonth} AI runs / month`,
  "All 8 modules",
  "CSV export for Buffer / Late",
  "Client report PDFs",
];

const FAQS = [
  {
    q: "Is $9 the real price?",
    a: "Yes. $9/month or $79/year. No usage surprises — you get 200 AI runs a month, and if you need more, +200 runs is $5. That's it.",
  },
  {
    q: "What's an AI run?",
    a: "One generation: a campaign section, a batch of hooks, an SEO brief, a report summary. A full campaign kit uses a handful of runs. 200/month covers a serious solo workload.",
  },
  {
    q: "Can I use my own API key?",
    a: "Yes — BYOK for OpenAI, Anthropic, Gemini, or Groq is free. Your key is stored encrypted and your runs bill to your own account.",
  },
  {
    q: "Does NINE post to my social accounts?",
    a: "No, and that's deliberate. Native publishing is what makes other tools cost $99/month. NINE writes everything and exports a CSV that Buffer or Late ingest in one click.",
  },
  {
    q: "How do I cancel?",
    a: "In the Stripe billing portal, self-serve, any time. No email, no phone call, no retention flow.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,--theme(--color-primary/12%),transparent)]"
        />
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
          <Badge variant="outline" className="mb-6 gap-2 font-mono">
            <span className="text-primary">$9/mo</span> or $79/yr · cancel anytime
          </Badge>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            A full marketing workbench.{" "}
            <span className="text-primary">Nine dollars.</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground">
            Brand voice, campaign kits, ads, SEO briefs, and client reports —
            without a $99/mo AI tax.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">Start 7-day trial</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/#pricing">See what $9 buys</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            For solopreneurs, coaches, local businesses, creators, and
            freelancers with 1–8 clients.
          </p>
        </div>
      </section>

      {/* ── Modules ──────────────────────────────────────── */}
      <section id="modules" className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Eight modules. One brand brain.
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Set up your Brand Kit once. Every module writes in your voice, for
            your offer, to your audience — not generic AI slop.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m) => (
              <Card key={m.name} className="bg-card/60">
                <CardContent className="space-y-2 pt-1">
                  <m.icon className="size-5 text-primary" aria-hidden />
                  <h3 className="font-medium">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section id="pricing" className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            One plan. No tiers to decode.
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            The $9 plan is the whole product. Add-ons exist only if you outgrow
            it.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-5">
            <Card className="border-primary/40 lg:col-span-3">
              <CardContent className="pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-5xl font-bold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                  <Badge variant="secondary" className="ml-2 font-mono">
                    or $79/year — 2+ months free
                  </Badge>
                </div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 shrink-0 text-primary" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full sm:w-auto" size="lg" asChild>
                  <Link href="/signup">Start 7-day trial</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/60 lg:col-span-2">
              <CardContent className="pt-1">
                <h3 className="font-medium">If you outgrow it</h3>
                <ul className="mt-4 space-y-4 text-sm">
                  <li className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">+200 AI runs</span>
                    <span className="font-mono">$5</span>
                  </li>
                  <li className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">+5 extra brands</span>
                    <span className="font-mono">$5</span>
                  </li>
                  <li className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      Bring your own API key
                      <span className="block text-xs">
                        OpenAI · Anthropic · Gemini · Groq
                      </span>
                    </span>
                    <span className="font-mono text-primary">$0</span>
                  </li>
                </ul>
                <p className="mt-6 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  No native social posting, no email sending, no CRM. That&apos;s
                  the stuff that makes other tools cost 10x. NINE writes; your
                  free scheduler posts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Straight answers
          </h2>
          <dl className="mt-8 space-y-8">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt className="font-medium">{f.q}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <section className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            Nine dollars. Whole workbench.
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Set up a brand, generate a campaign, copy a week of posts. If it
            doesn&apos;t earn its $9, cancel in two clicks.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/signup">Start 7-day trial</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
