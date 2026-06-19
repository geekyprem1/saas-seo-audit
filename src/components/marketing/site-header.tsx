import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { hasClerk } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Logo } from "@/components/marketing/logo";
import { UserMenu } from "@/components/marketing/user-menu";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const isSignedIn = Boolean(user);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)]/60 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-semibold tracking-tight">SaaS SEO Audit</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link
              href="/features"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              FAQ
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {hasClerk ? (
            isSignedIn ? (
              <UserMenu signedIn />
            ) : (
              <>
                <UserMenu signedIn={false} />
                <Button asChild size="sm">
                  <Link href="/audit/new">Start free audit</Link>
                </Button>
              </>
            )
          ) : (
            <Button asChild size="sm">
              <Link href="/audit/new">Start free audit</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}