import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-mono text-lg font-bold tracking-tight">
            NINE<span className="text-primary">.</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/#modules">Modules</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/#pricing">Pricing</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Start 7-day trial</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            <span className="font-mono font-bold text-foreground">NINE</span> —
            the $9 marketing OS.
          </p>
          <nav className="flex gap-4">
            {/* Legal pages ship in Phase 6 */}
            <Link href="/legal/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <a href="mailto:support@nine.tools" className="hover:text-foreground">
              Support
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
