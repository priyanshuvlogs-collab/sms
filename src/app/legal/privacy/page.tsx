export const metadata = { title: "Privacy Policy" };

// Full legal copy ships in Phase 6. Placeholder so nothing 404s.
export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Short version: your brand data is used only to generate your content.
        BYOK API keys are encrypted at rest and never logged. We don&apos;t
        sell data. The full policy is being finalized and will be published
        before public launch.
      </p>
    </div>
  );
}
