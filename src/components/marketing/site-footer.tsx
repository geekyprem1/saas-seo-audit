import Link from "next/link";
import { Logo } from "@/components/marketing/logo";

const SECTIONS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)]/60 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-semibold tracking-tight">
                SaaS SEO Audit
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-[var(--muted-foreground)]">
              Grow your SaaS with organic traffic. Get a complete SEO audit in
              seconds.
            </p>
          </div>
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold">{section.title}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted-foreground)] md:flex-row">
          <p>© {new Date().getFullYear()} SaaS SEO Audit. All rights reserved.</p>
          <p>Made for SaaS founders who refuse to depend on paid ads.</p>
        </div>
      </div>
    </footer>
  );
}