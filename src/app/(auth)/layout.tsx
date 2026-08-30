import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-14 items-center px-6">
        <Link href="/" className="font-mono text-lg font-bold tracking-tight">
          NINE<span className="text-primary">.</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-20">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
