"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  History,
  CreditCard,
  Settings,
  LifeBuoy,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Logo } from "@/components/marketing/logo";
import { AppUserMenu } from "@/components/dashboard/user-menu";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/audit/new", label: "New audit", icon: Search },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/settings/billing", label: "Billing", icon: CreditCard },
];

export function AppShell({
  children,
  isSignedIn,
  clerkEnabled,
}: {
  children: React.ReactNode;
  isSignedIn: boolean;
  clerkEnabled: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-[var(--background)] md:flex md:flex-col print:hidden">
        <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-6">
          <Logo />
          <span className="font-semibold tracking-tight">SaaS SEO Audit</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[var(--border)] p-4">
          <Link
            href="/faq"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
          >
            <LifeBuoy className="size-4" />
            Help & FAQ
          </Link>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/80 px-4 backdrop-blur sm:px-6 print:hidden">
          <div className="md:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <span className="font-semibold">SaaS SEO Audit</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {clerkEnabled ? <AppUserMenu signedIn={isSignedIn} /> : null}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0 print:m-0">{children}</main>
      </div>
    </div>
  );
}