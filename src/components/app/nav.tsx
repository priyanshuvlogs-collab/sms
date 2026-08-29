"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Palette,
  Rocket,
  PenLine,
  Search,
  Megaphone,
  CalendarDays,
  BookMarked,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/brands", label: "Brand Kit", icon: Palette },
  { href: "/campaigns", label: "Campaigns", icon: Rocket },
  { href: "/content", label: "Content", icon: PenLine },
  { href: "/seo", label: "SEO Briefs", icon: Search },
  { href: "/ads", label: "Ads", icon: Megaphone },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/library", label: "Library", icon: BookMarked },
  { href: "/reports", label: "Reports", icon: FileText },
] as const;

const MOBILE_ITEMS = NAV_ITEMS.filter((i) =>
  ["/home", "/campaigns", "/content", "/planner", "/library"].includes(i.href)
);

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border/60 bg-sidebar md:flex">
      <div className="flex h-14 items-center px-5">
        <Link href="/home" className="font-mono text-lg font-bold tracking-tight">
          NINE<span className="text-primary">.</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              isActive(pathname, item.href) &&
                "bg-accent font-medium text-foreground"
            )}
          >
            <item.icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        ))}
        <div className="flex-1" />
        <Link
          href="/settings"
          className={cn(
            "mb-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            isActive(pathname, "/settings") &&
              "bg-accent font-medium text-foreground"
          )}
        >
          <Settings className="size-4" aria-hidden />
          Settings
        </Link>
      </nav>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
      {MOBILE_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground",
            isActive(pathname, item.href) && "text-primary"
          )}
        >
          <item.icon className="size-5" aria-hidden />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
