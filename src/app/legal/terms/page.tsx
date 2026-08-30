export const metadata = { title: "Terms of Service" };

// Full legal copy ships in Phase 6. Placeholder so nothing 404s.
export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        NINE is $9/month or $79/year, cancel anytime through the Stripe billing
        portal. You own everything you generate. Full terms are being finalized
        and will be published before public launch.
      </p>
    </div>
  );
}
