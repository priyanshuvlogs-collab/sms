import { redirect } from "next/navigation";
import { SideNav, BottomNav } from "@/components/app/nav";
import { Button } from "@/components/ui/button";
import { getWorkspaceContext } from "@/lib/workspace";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getWorkspaceContext();
  if (!ctx) redirect("/login");

  return (
    <div className="min-h-dvh">
      <SideNav />
      <div className="flex min-h-dvh flex-col pb-16 md:pb-0 md:pl-56">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur sm:px-6">
          <span className="truncate text-sm text-muted-foreground">
            {ctx.workspace.name}
          </span>
          <form action="/auth/signout" method="post">
            <Button variant="ghost" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
