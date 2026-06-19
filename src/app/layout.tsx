import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SafeClerkProvider } from "@/components/shared/safe-clerk-provider";
import { ThemeProvider } from "@/components/shared/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "SaaS SEO Audit — Grow Your SaaS with Organic Traffic",
    template: "%s — SaaS SEO Audit",
  },
  description:
    "Run a complete SEO audit in 30 seconds. Technical, on-page, performance, content, and accessibility checks with AI-powered recommendations.",
  applicationName: "SaaS SEO Audit",
  keywords: [
    "SEO audit",
    "SaaS SEO",
    "website audit",
    "technical SEO",
    "AI SEO recommendations",
  ],
  authors: [{ name: "SaaS SEO Audit" }],
  openGraph: {
    title: "SaaS SEO Audit — Grow Your SaaS with Organic Traffic",
    description:
      "Run a complete SEO audit in 30 seconds with AI-powered recommendations.",
    type: "website",
    url: "/",
    siteName: "SaaS SEO Audit",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS SEO Audit",
    description:
      "Run a complete SEO audit in 30 seconds with AI-powered recommendations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SafeClerkProvider>{children}</SafeClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}