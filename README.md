# SaaS SEO Audit

> Grow your SaaS with organic traffic.

Production-ready SaaS that runs a complete SEO audit on any website and returns an SEO score, technical & on-page checks, Core Web Vitals, AI recommendations, and a shareable report — all in under a minute.

This repo is the result of milestones 1–6 (scaffold → Prisma → Clerk → audit pipeline → scoring engine → AI recommendations). Stripe billing, competitor comparison, and Agency team/white-label features are deliberately deferred to milestone 10+.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React 19) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn-style components |
| DB | PostgreSQL (Neon recommended) via Prisma 7 + `@prisma/adapter-pg` |
| Auth | Clerk v7 |
| Crawler | undici + cheerio, robots-aware |
| Performance | Google PageSpeed Insights API |
| AI | OpenRouter — primary `google/gemini-2.5-flash`, fallback `deepseek/deepseek-chat` |
| Cache / Rate limit | Upstash Redis |
| Email (planned) | Resend |
| Deploy | Vercel |

---

## Quick start

```bash
git clone <repo>
cd saas-seo-audit
cp .env.example .env       # fill in values (see below)
npm install
npx prisma migrate dev     # requires DATABASE_URL
npm run dev
```

The app runs at <http://localhost:3000>. The home page lets you run a free audit immediately. With Clerk keys missing, the auth UI shows a "running without Clerk" banner and audit history will not persist (rate-limited local runs still work via `/api/audit` if you bypass the auth guard).

---

## Environment variables

Copy `.env.example` to `.env` and fill in the values you need.

| Variable | Required for | Notes |
|---|---|---|
| `DATABASE_URL` | Any persistence | Postgres connection string |
| `DIRECT_URL` | Prisma migrate | Used for non-pooled connections |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Sign-in | From Clerk dashboard |
| `CLERK_SECRET_KEY` | Sign-in | From Clerk dashboard |
| `CLERK_WEBHOOK_SECRET` | User sync | Svix secret from Clerk |
| `OPENROUTER_API_KEY` | AI recs | <https://openrouter.ai/keys> |
| `OPENROUTER_MODEL_PRIMARY` | AI recs | Default `google/gemini-2.5-flash` |
| `OPENROUTER_MODEL_FALLBACK` | AI recs | Default `deepseek/deepseek-chat` |
| `GOOGLE_PSI_API_KEY` | Performance | Google Cloud Console |
| `UPSTASH_REDIS_REST_URL` | Rate limit + AI cache | Upstash console |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limit + AI cache | Upstash console |
| `NEXT_PUBLIC_APP_URL` | OG, sitemap | Production URL |
| `CRON_SECRET` | Cleanup cron | Random string |

Any of these can be omitted at startup — the relevant feature degrades gracefully (no Clerk, no AI, no PSI, no rate limit).

---

## Project layout

```
prisma/                   Schema + migrations
public/                   Static assets
src/
  app/
    (marketing)/          Public pages (landing, pricing, features, faq)
    (auth)/               Clerk sign-in / sign-up
    (app)/                Authed app (dashboard, audit/new, history, settings)
    api/                  Route handlers (audit, history, export, clerk webhook)
    layout.tsx            Root layout: ClerkProvider + ThemeProvider
    globals.css           Tailwind v4 theme tokens (light + dark)
    sitemap.ts, robots.ts
  audit/                  Crawler, parser, checks, scoring, AI, exports
  components/             UI: shadcn primitives + audit/dashboard/marketing
  lib/                    env, db, auth, openrouter, redis, ratelimit, utils, grades
  server/
    services/             Business logic
    validators/           Zod schemas
  proxy.ts                Clerk middleware (Next 16 "proxy" replaces "middleware")
  generated/prisma/       Prisma client (gitignored)
```

---

## Scripts

```bash
npm run dev      # Turbopack dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

---

## How an audit runs

1. `POST /api/audit` validates the URL, normalizes it, checks SSRF (no localhost / private IPs), verifies quota, increments usage, and inserts a `RUNNING` audit row.
2. `after()` (Next 16 stable) schedules `finalizeAudit()` to run after the response is sent.
3. `finalizeAudit()` calls `runAudit()` in `src/audit/pipeline.ts`:
   - **Fetch** — undici with custom User-Agent, 20s timeout, 5MB body cap, 5-hop redirect cap.
   - **Parse** — cheerio extracts title, meta, headings, OG/Twitter, images, links.
   - **Tech** — fetches `/sitemap.xml` and `/robots.txt` in parallel.
   - **Performance** — Google PSI API for LCP/FCP/CLS/TTFB.
   - **Score** — five weighted categories (Technical 30, On-page 30, Performance 20, Content 15, Accessibility 5).
   - **AI** — every issue is rewritten by Gemini 2.5 Flash via OpenRouter, with DeepSeek fallback. Responses are Redis-cached for 7 days.
   - **Persist** — score, subscores, issues, raw HTML snapshot, performance JSON.
4. The client polls `GET /api/audit/[id]` until `status === COMPLETED`.

---

## Roadmap

| Milestone | Status |
|---|---|
| 1. Scaffold (Next 16, TS, Tailwind v4, shadcn primitives) | ✅ |
| 2. Prisma schema + Clerk wiring + User sync webhook | ✅ |
| 3. Marketing pages (landing, pricing, features, FAQ) | ✅ |
| 4. Audit pipeline (crawler + checks + scoring) | ✅ |
| 5. `POST /api/audit` + results page | ✅ |
| 6. AI recommendations (Gemini 2.5 Flash + DeepSeek fallback) | ✅ |
| 7. Dashboard + history + trend chart | ✅ (no trend chart yet) |
| 8. Performance detail + Lighthouse-on-demand toggle | Planned |
| 9. PDF + CSV exports | ✅ CSV, PDF pending |
| 10. Stripe checkout + webhook + portal + plan gates | Next |
| 11. Competitor comparison | Next |
| 12. Agency team seats + white-label PDF | Next |
| 13. Polish + dark-mode polish + accessibility audit | Next |
| 14. SEO for the SaaS itself (sitemaps, JSON-LD, OG) | Partial |
| 15. CI/CD + Vercel deploy | Next |

---

## Deploy to Vercel

1. Push to GitHub.
2. Vercel → New Project → import.
3. Build command: `prisma generate && next build` (already set in `package.json`).
4. Add every env var from `.env.example` to Project Settings.
5. Provision:
   - Neon Postgres → copy `DATABASE_URL` + `DIRECT_URL`.
   - Upstash Redis → copy REST URL + token.
   - Clerk → create production instance, add webhook endpoint subscribing to `user.*` events.
   - OpenRouter → API key.
   - Google Cloud → enable PageSpeed Insights API, create key.
6. Domain: `saasseoaudit.com`.
7. Run `npx prisma migrate deploy` once on the production DB (or include in build via a postinstall script).

---

## Notes on Next.js 16

`create-next-app@latest` installs Next.js 16, not 15. The patterns are nearly identical; the only material differences in this codebase are:

- **Middleware → Proxy**: `src/proxy.ts` replaces `middleware.ts`.
- **`after()`**: stable since 15.1.0, used for the audit pipeline so the response returns immediately while the heavy work continues.
- **`useUser()` must be inside `<ClerkProvider>`**: server components fetch the user and pass a boolean to client components instead.
- **Route handler context**: typed inline as `{ params: Promise<{ id: string }> }` (the `RouteContext` helper from the docs isn't exported in this version yet).
- **Async params**: always `await params` inside pages and handlers.

See `AGENTS.md` (generated by create-next-app) for the rule that points agents at the bundled docs.