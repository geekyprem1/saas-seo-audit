# SaaS SEO Audit — Live Deploy Guide (Hindi)

> GitHub repo: <https://github.com/geekyprem1/saas-seo-audit>
> Domain: `saasseoaudit.com`
> Last updated: 2026-06-19

Ye step-by-step guide hai jisse aap apna SaaS SEO Audit app live deploy kar sakte ho. Har step me exact commands aur screenshots ki references di hai. Total time: **45-60 minutes**.

---

## Table of Contents

1. [GitHub ready karna](#step-1-github-ready-karna)
2. [Postgres (Neon) setup](#step-2-postgres-neon-setup)
3. [Upstash Redis setup](#step-3-upstash-redis-setup)
4. [Clerk auth setup](#step-4-clerk-auth-setup)
5. [OpenRouter AI setup](#step-5-openrouter-ai-setup)
6. [Google PageSpeed API setup](#step-6-google-pagespeed-api-setup)
7. [Vercel deploy](#step-7-vercel-deploy)
8. [Domain connect karna](#step-8-domain-connect-karna)
9. [Production verify](#step-9-production-verify)
10. [Troubleshooting](#step-10-troubleshooting)

---

## Prerequisites

Aapke paas yeh hona chahiye:

- [x] Windows 10/11 with PowerShell
- [x] Node.js 18+ installed (`node --version`)
- [x] Git installed (`git --version`)
- [x] GitHub account (free)
- [x] Credit card (Vercel free tier ke liye zaroorat nahi, but verification ke liye)

---

## Step 1: GitHub ready karna

Code already push ho chuka hai: <https://github.com/geekyprem1/saas-seo-audit>

Verify karo:

```powershell
git log --oneline -3
```

Expected output:

```
de022bc chore: clean up duplicate .DS_Store in .gitignore
c5ea1a4 feat: SaaS SEO Audit MVP - ...
91a041a Initial commit from Create Next App
```

Agar repo private hai to apne Vercel account ko access dena hoga (next step me hota hai).

---

## Step 2: Postgres (Neon) setup

Neon serverless Postgres use karenge — free tier me 0.5 GB milta hai jo ke MVP ke liye kaafi hai.

1. Browser me jao: <https://console.neon.tech>
2. **Sign up** with GitHub
3. **Create a project**:
   - Name: `saas-seo-audit`
   - Region: closest to your users (e.g., AWS US East)
   - Postgres version: 16 (default)
4. Project create hone ke baad **Connection Details** open karo
5. **Pooled connection** string copy karo — yeh hogi `DATABASE_URL`:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/saasseoaudit?sslmode=require
   ```
6. **Direct connection** bhi copy karo — yeh hogi `DIRECT_URL`:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/saasseoaudit?sslmode=require
   ```
   > Note: Dono URLs almost same honge, sirf hostname me `-pooler` ya direct difference hoga.

**Verification:** Neon dashboard me **SQL Editor** open karo aur `SELECT 1;` run karo. "1" return aana chahiye.

---

## Step 3: Upstash Redis setup

Redis use karenge rate limiting + AI response caching ke liye.

1. Browser me jao: <https://console.upstash.com>
2. **Sign up** with GitHub
3. **Create Database**:
   - Name: `saas-seo-audit`
   - Type: Regional
   - Region: same as Neon (e.g., US-East-1)
   - TLS: enabled (default)
4. Database create hone ke baad detail page open hogi
5. **REST API** section me se copy karo:
   - `UPSTASH_REDIS_REST_URL` — `https://xxx.upstash.io` format me
   - `UPSTASH_REDIS_REST_TOKEN` — long alphanumeric string

**Verification:** Upstash console me **Data Browser** tab open karo. Empty hona chahiye (abhi koi key nahi hai).

---

## Step 4: Clerk auth setup

Clerk se sign-in/sign-up flow handle hoga.

1. Browser me jao: <https://dashboard.clerk.com>
2. **Sign up** with GitHub
3. **Create Application**:
   - Name: `SaaS SEO Audit`
   - Sign-in options: **Email**, **Google**, **GitHub** (recommended)
4. Application create hone ke baad **API Keys** page khulega
5. Copy karo:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — `pk_test_...` se start hota hai
   - `CLERK_SECRET_KEY` — `sk_test_...` se start hota hai

### Webhook setup (user sync ke liye)

1. Clerk dashboard me **Webhooks** section me jao
2. **Add Endpoint** click karo
3. Configure karo:
   - **Endpoint URL**: abhi ke liye `https://placeholder.com/api/clerk/webhook` daal do — deploy ke baad update karenge
   - **Subscribe to events**: `user.created`, `user.updated`, `user.deleted`
4. **Create** karo
5. **Signing Secret** copy karo — yeh hai `CLERK_WEBHOOK_SECRET` (`whsec_...`)

**Important:** Production me switch karna mat bhoolna:
- Clerk dashboard me **Configure → Production** toggle ON karo
- Production ke liye naye API keys generate honge (`pk_live_...` aur `sk_live_...`)
- Inhe Vercel me Production environment me daalna hai

---

## Step 5: OpenRouter AI setup

AI recommendations ke liye Gemini 2.5 Flash use karenge (with DeepSeek fallback).

1. Browser me jao: <https://openrouter.ai/keys>
2. **Sign up** with Google/GitHub/Email
3. **Create Key**:
   - Name: `saas-seo-audit-prod`
   - Credit limit: $10 (testing ke liye kaafi)
4. API key copy karo — `sk-or-v1-...` format me. Yeh hai `OPENROUTER_API_KEY`

### Credits add karo

1. <https://openrouter.ai/credits> me jao
2. $5-10 add karo (Stripe se pay)
3. Ye credits API calls ke liye use honge

**Verification:** OpenRouter dashboard me **Activity** tab me test request dikh sakti hai.

---

## Step 6: Google PageSpeed API setup

Performance metrics (LCP, FCP, CLS, TTFB) ke liye Google PSI use karenge.

1. Browser me jao: <https://console.cloud.google.com>
2. **Create Project**:
   - Name: `saas-seo-audit`
   - Billing account: free trial ($300 credit) ya existing
3. Project select karke **APIs & Services → Library** me jao
4. Search: **PageSpeed Insights API** → click karo → **Enable**
5. **APIs & Services → Credentials** me jao
6. **Create Credentials → API Key**:
   - Restrict key: select karke sirf "PageSpeed Insights API" allow karo
7. API key copy karo — `AIza...` format me. Yeh hai `GOOGLE_PSI_API_KEY`

**Verification:** Browser me test karo:
```
https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&key=YOUR_KEY
```
JSON response aana chahiye.

---

## Step 7: Vercel deploy

Vercel pe Next.js apps ka best support hai. Free tier me 100 GB bandwidth/month milta hai.

### 7.1 Account banana

1. Browser me jao: <https://vercel.com/signup>
2. **Sign up with GitHub**
3. Vercel ko GitHub repos access authorize karo

### 7.2 Project import

1. Vercel dashboard: <https://vercel.com/new>
2. **Import** `geekyprem1/saas-seo-audit`
3. **Framework Preset**: Next.js (auto-detect)
4. **Root Directory**: `./` (default)
5. **Build Command**: `next build` (default, no change)
6. **Install Command**: `npm install` (default)
7. **Output Directory**: `.next` (default)

### 7.3 Environment Variables add karo

**Project Settings → Environment Variables** me yeh sab add karo. Har variable ke liye environment select karo (Production, Preview, Development):

| Variable | Value | Environment |
|---|---|---|
| `DATABASE_URL` | Neon pooled URL | All |
| `DIRECT_URL` | Neon direct URL | All |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` (production) | Production only |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` | Preview + Development |
| `CLERK_SECRET_KEY` | `sk_live_...` | Production only |
| `CLERK_SECRET_KEY` | `sk_test_...` | Preview + Development |
| `CLERK_WEBHOOK_SECRET` | `whsec_...` | All |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | All |
| `OPENROUTER_MODEL_PRIMARY` | `google/gemini-2.5-flash` | All |
| `OPENROUTER_MODEL_FALLBACK` | `deepseek/deepseek-chat` | All |
| `GOOGLE_PSI_API_KEY` | `AIza...` | All |
| `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | All |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash token | All |
| `NEXT_PUBLIC_APP_URL` | `https://saasseoaudit.com` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://*-username.vercel.app` (Preview) | Preview |
| `LOG_LEVEL` | `info` | All |
| `CRON_SECRET` | koi random string (e.g., `x7f9k2m8n4q1p3r`) | All |

> **Tip:** Preview deployments ke liye Clerk test keys use karo. Production me switch karte waqt "Apply to Production" mark karo.

### 7.4 First Deploy

1. **Deploy** button click karo
2. Build log dekhte raho (3-5 min lagega)
3. Deploy complete hone par Vercel ek preview URL dega: `https://saas-seo-audit-xxx.vercel.app`

### 7.5 Database migrate

Pehli deploy ke baad database tables create karne hain:

```powershell
cd C:\saas-seo-audit
npx vercel login           # first time only
npx vercel link            # link to your project
npx vercel env pull .env.production
npx prisma migrate deploy  # create tables in production DB
```

Expected output:
```
3 migrations found in prisma/migrations
Applying migration 20250619_init
✓ Migration applied successfully
```

---

## Step 8: Domain connect karna

Custom domain `saasseoaudit.com` Vercel se connect karenge.

### 8.1 Domain Vercel me add karo

1. Vercel project → **Settings → Domains**
2. `saasseoaudit.com` type karo → **Add**
3. `www.saasseoaudit.com` bhi add karo
4. Vercel DNS records dikhayega:
   ```
   A     @       76.76.21.21
   CNAME www     cname.vercel-dns.com
   ```

### 8.2 DNS records update karo (registrar me)

Apne domain registrar (Namecheap, Cloudflare, GoDaddy, etc.) me:

1. **A Record**:
   - Host: `@`
   - Value: `76.76.21.21`
   - TTL: Automatic
2. **CNAME Record**:
   - Host: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: Automatic

### 8.3 SSL verify karo

- 5-30 min wait karo
- Vercel **Domains** page me status **Valid** hona chahiye
- Browser me `https://saasseoaudit.com` khol ke SSL lock icon check karo

### 8.4 Clerk webhook URL update

Ab production URL ready hai:

1. Clerk dashboard → **Webhooks** → apna endpoint
2. **Endpoint URL** change karo: `https://saasseoaudit.com/api/clerk/webhook`
3. Save karo

### 8.5 Environment me production URL set karo

Vercel → **Settings → Environment Variables** → `NEXT_PUBLIC_APP_URL` (Production):
- Value: `https://saasseoaudit.com`
- Save karo
- **Redeploy** karo (Deployments → Latest → ⋯ → Redeploy)

---

## Step 9: Production verify

Smoke test karte hain sab kuch kaam kar raha hai ya nahi.

### 9.1 Basic checks

```powershell
# Home page
curl -I https://saasseoaudit.com
# Expected: HTTP/2 200

# Sitemap
curl https://saasseoaudit.com/sitemap.xml

# Robots
curl https://saasseoaudit.com/robots.txt
```

### 9.2 Browser flow test

1. **Open** <https://saasseoaudit.com>
2. **Sign up** click karo → Clerk modal khulna chahiye
3. Google ya Email se sign up karo
4. Redirect hoke `/dashboard` pe jaana chahiye
5. **Run audit** on `https://example.com`:
   - Audit form me URL paste karo
   - "Run free audit" click karo
   - 30-60 sec wait karo
   - Results page aana chahiye with score, breakdown, issues
6. **AI recommendations** dikhne chahiye har issue ke saath
7. **CSV export** download test karo
8. **History** page pe audit dikhna chahiye

### 9.3 Logs check karo

Vercel dashboard → **Project → Logs** me real-time logs dekho. Errors hone par yahin dikhenge.

### 9.4 Lighthouse score (bonus)

Chrome DevTools → Lighthouse → Run audit:
- Performance: 90+ (target)
- Accessibility: 90+
- SEO: 95+
- Best Practices: 90+

---

## Step 10: Troubleshooting

### Build fail: "DATABASE_URL is not set"

**Fix:** Vercel me `DATABASE_URL` add karo. **Deployments → Redeploy**.

### Clerk webhook 401 (signature invalid)

**Fix:** Clerk dashboard me webhook signing secret re-copy karo. Vercel me `CLERK_WEBHOOK_SECRET` update karo. Redeploy.

### Audit fails: "Failed to fetch site"

**Possible causes:**
- OpenRouter key invalid → recheck `OPENROUTER_API_KEY`
- PSI key missing → `GOOGLE_PSI_API_KEY` add karo
- Target site SSRF-blocked → local testing me `localhost` blocked hai, public URL use karo
- Upstash down → Redis optional hai, audit without cache chalega

### Prisma error: "relation does not exist"

**Fix:** `npx prisma migrate deploy` run karo production DB pe.

### Sign-in fails with "Invalid publishable key"

**Fix:** Clerk dashboard me production instance pe switch karo. Vercel me **Production** env me `pk_live_...` daalo.

### Domain not resolving

- DNS propagation 24-48 hours lag sakta hai
- Check: <https://dnschecker.org> pe `saasseoaudit.com` check karo
- Vercel me domain status dekho

### Build slow (>5 min)

- Vercel free tier me 45s build time limit hai pehle, but Next.js typically fits
- Check build log for warnings

---

## Post-launch checklist

- [ ] Sentry setup: <https://sentry.io> → Next.js project → DSN env me add karo
- [ ] Vercel Analytics enable: Project → **Analytics** tab → Enable
- [ ] Vercel Speed Insights: Project → **Speed Insights** → Enable
- [ ] Upstash Redis monitoring: <https://console.upstash.com> → Metrics
- [ ] Neon monitoring: <https://console.neon.tech> → Monitoring
- [ ] OpenRouter usage track: <https://openrouter.ai/activity>
- [ ] Google Cloud quota: PSI API has free 25k requests/day

---

## Next steps (milestones 10+)

- [ ] **Stripe checkout** — billing flow add karo
- [ ] **Competitor comparison** — 3 sites tak compare
- [ ] **PDF export** — `@react-pdf/renderer` se branded reports
- [ ] **Agency team seats** — up to 10 seats per workspace
- [ ] **White-label** — custom logo/colors on PDF
- [ ] **Email notifications** — Resend se audit complete pe email
- [ ] **Cron jobs** — daily audit cleanup, weekly summary email
- [ ] **Blog** — `src/app/blog/` for SEO content marketing

---

## Useful Links

- **Vercel Dashboard**: <https://vercel.com/dashboard>
- **Neon Console**: <https://console.neon.tech>
- **Upstash Console**: <https://console.upstash.com>
- **Clerk Dashboard**: <https://dashboard.clerk.com>
- **OpenRouter**: <https://openrouter.ai>
- **Google Cloud**: <https://console.cloud.google.com>
- **GitHub Repo**: <https://github.com/geekyprem1/saas-seo-audit>

---

## Quick reference: common commands

```powershell
# Local development
cd C:\saas-seo-audit
npm run dev

# Production build (local test)
npm run build
npm run start

# Database
npx prisma migrate dev       # local migration
npx prisma migrate deploy    # production migration
npx prisma studio            # GUI DB browser

# Linting
npm run lint

# Git
git add -A
git commit -m "your message"
git push
```

---

**Best of luck bhai!** 🚀

Koi bhi step atak jaye to mujhse poocho — main har service setup me help kar sakta hoon.