/**
 * Generate DEPLOY.pdf from a styled HTML version of DEPLOY.md content.
 * Run with: node scripts/generate-pdf.js
 */
const puppeteer = require("puppeteer");
const fs = require("node:fs");
const path = require("node:path");

const html = `<!doctype html>
<html lang="hi">
<head>
<meta charset="utf-8" />
<title>SaaS SEO Audit - Live Deploy Guide</title>
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
  }
  :root {
    --brand: #4f46e5;
    --brand-soft: #eef2ff;
    --ink: #0f172a;
    --ink-soft: #475569;
    --line: #e2e8f0;
    --code-bg: #0f172a;
    --code-fg: #e2e8f0;
  }
  * { box-sizing: border-box; }
  html, body { padding: 0; margin: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    color: var(--ink);
    line-height: 1.55;
    font-size: 11pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .cover {
    background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
    color: white;
    padding: 50px 40px;
    border-radius: 14px;
    margin-bottom: 28px;
  }
  .cover .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 9pt;
    font-weight: 600;
    opacity: 0.85;
  }
  .cover h1 {
    font-size: 32pt;
    margin: 14px 0 8px;
    font-weight: 800;
    line-height: 1.1;
  }
  .cover .sub {
    font-size: 13pt;
    opacity: 0.92;
    margin-bottom: 18px;
  }
  .cover .meta {
    font-size: 9.5pt;
    opacity: 0.85;
    border-top: 1px solid rgba(255,255,255,0.3);
    padding-top: 12px;
    margin-top: 18px;
  }
  h1 {
    font-size: 22pt;
    font-weight: 800;
    color: var(--brand);
    border-bottom: 2px solid var(--brand-soft);
    padding-bottom: 6px;
    margin-top: 28px;
    page-break-after: avoid;
  }
  h2 {
    font-size: 16pt;
    font-weight: 700;
    color: var(--ink);
    margin-top: 26px;
    page-break-after: avoid;
    border-left: 4px solid var(--brand);
    padding-left: 10px;
  }
  h3 {
    font-size: 13pt;
    font-weight: 600;
    color: var(--ink);
    margin-top: 18px;
    page-break-after: avoid;
  }
  h4 {
    font-size: 11.5pt;
    font-weight: 600;
    color: var(--ink-soft);
    margin-top: 14px;
  }
  p, ul, ol { margin: 8px 0; }
  ul, ol { padding-left: 22px; }
  li { margin: 4px 0; }
  a { color: var(--brand); text-decoration: none; border-bottom: 1px solid transparent; }
  code {
    font-family: "SF Mono", Menlo, Consolas, "Courier New", monospace;
    font-size: 9.5pt;
    background: #f1f5f9;
    padding: 1px 5px;
    border-radius: 4px;
    color: #be185d;
  }
  pre {
    background: var(--code-bg);
    color: var(--code-fg);
    padding: 12px 14px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 9pt;
    line-height: 1.5;
    margin: 12px 0;
    page-break-inside: avoid;
  }
  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    font-size: 9pt;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 10pt;
    page-break-inside: avoid;
  }
  th, td {
    border: 1px solid var(--line);
    padding: 7px 10px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background: var(--brand-soft);
    color: var(--ink);
    font-weight: 700;
  }
  tr:nth-child(even) td { background: #f8fafc; }
  blockquote {
    border-left: 4px solid var(--brand);
    padding: 8px 14px;
    background: var(--brand-soft);
    margin: 14px 0;
    border-radius: 0 6px 6px 0;
    color: var(--ink-soft);
  }
  hr {
    border: none;
    border-top: 1px dashed var(--line);
    margin: 22px 0;
  }
  .toc {
    background: #f8fafc;
    padding: 16px 20px;
    border-radius: 10px;
    margin-bottom: 24px;
    page-break-inside: avoid;
  }
  .toc h2 { margin-top: 0; border-left: none; padding-left: 0; font-size: 13pt; }
  .toc ol { columns: 2; column-gap: 32px; padding-left: 20px; }
  .callout {
    border: 1px solid var(--line);
    border-left: 4px solid #f59e0b;
    padding: 10px 14px;
    border-radius: 0 8px 8px 0;
    background: #fffbeb;
    margin: 14px 0;
    page-break-inside: avoid;
  }
  .callout strong { color: #92400e; }
  .checklist { list-style: none; padding-left: 0; }
  .checklist li::before {
    content: "☐ ";
    color: var(--brand);
    font-weight: 700;
    margin-right: 4px;
  }
  .footer {
    margin-top: 32px;
    padding-top: 14px;
    border-top: 1px solid var(--line);
    color: var(--ink-soft);
    font-size: 9pt;
    text-align: center;
  }
</style>
</head>
<body>

<div class="cover">
  <div class="eyebrow">Production Deployment Guide</div>
  <h1>SaaS SEO Audit</h1>
  <div class="sub">Live deploy kaise karein — step-by-step Hindi guide</div>
  <div class="meta">
    Repository: github.com/geekyprem1/saas-seo-audit<br/>
    Domain: saasseoaudit.com · Stack: Next.js 16 · Prisma 7 · Clerk · OpenRouter<br/>
    Estimated time: 45–60 minutes
  </div>
</div>

<div class="toc">
<h2>Contents</h2>
<ol>
  <li>GitHub ready karna</li>
  <li>Postgres (Neon) setup</li>
  <li>Upstash Redis setup</li>
  <li>Clerk auth setup</li>
  <li>OpenRouter AI setup</li>
  <li>Google PageSpeed API setup</li>
  <li>Vercel deploy</li>
  <li>Domain connect karna</li>
  <li>Production verify</li>
  <li>Troubleshooting</li>
</ol>
</div>

<h1>Prerequisites</h1>
<p>Aapke paas yeh hona chahiye:</p>
<ul>
  <li>Windows 10/11 with PowerShell</li>
  <li>Node.js 18+ installed (<code>node --version</code>)</li>
  <li>Git installed (<code>git --version</code>)</li>
  <li>GitHub account (free)</li>
  <li>Credit card (Vercel verification ke liye, free tier available)</li>
</ul>

<h1>Step 1: GitHub ready karna</h1>
<p>Code already push ho chuka hai: <strong>github.com/geekyprem1/saas-seo-audit</strong></p>
<p>Verify karo:</p>
<pre><code>git log --oneline -3</code></pre>
<p>Expected output:</p>
<pre><code>de022bc chore: clean up duplicate .DS_Store in .gitignore
c5ea1a4 feat: SaaS SEO Audit MVP - ...
91a041a Initial commit from Create Next App</code></pre>

<h1>Step 2: Postgres (Neon) setup</h1>
<p>Neon serverless Postgres — free tier 0.5 GB, MVP ke liye kaafi.</p>
<ol>
  <li>Browser me jao: <strong>console.neon.tech</strong></li>
  <li><strong>Sign up</strong> with GitHub</li>
  <li><strong>Create project</strong> — name: <code>saas-seo-audit</code>, region closest to users</li>
  <li>Connection details open karo</li>
  <li><strong>Pooled URL</strong> copy karo → <code>DATABASE_URL</code></li>
  <li><strong>Direct URL</strong> bhi copy karo → <code>DIRECT_URL</code></li>
</ol>

<div class="callout"><strong>Tip:</strong> Dono URLs almost same hote hain, sirf hostname me <code>-pooler</code> difference hota hai.</div>

<h1>Step 3: Upstash Redis setup</h1>
<p>Rate limiting + AI response cache ke liye.</p>
<ol>
  <li><strong>console.upstash.com</strong> → Sign up with GitHub</li>
  <li><strong>Create Database</strong> → name: <code>saas-seo-audit</code>, same region as Neon, TLS enabled</li>
  <li><strong>REST API</strong> section me se copy karo:
    <ul>
      <li><code>UPSTASH_REDIS_REST_URL</code> — <code>https://xxx.upstash.io</code></li>
      <li><code>UPSTASH_REDIS_REST_TOKEN</code> — long alphanumeric</li>
    </ul>
  </li>
</ol>

<h1>Step 4: Clerk auth setup</h1>
<ol>
  <li><strong>dashboard.clerk.com</strong> → Sign up with GitHub</li>
  <li><strong>Create Application</strong>:
    <ul>
      <li>Name: <code>SaaS SEO Audit</code></li>
      <li>Sign-in options: Email, Google, GitHub</li>
    </ul>
  </li>
  <li><strong>API Keys</strong> se copy karo:
    <ul>
      <li><code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> (<code>pk_test_...</code>)</li>
      <li><code>CLERK_SECRET_KEY</code> (<code>sk_test_...</code>)</li>
    </ul>
  </li>
</ol>

<h3>Webhook setup (user sync ke liye)</h3>
<ol>
  <li>Clerk dashboard → <strong>Webhooks → Add Endpoint</strong></li>
  <li>URL: <code>https://placeholder.com/api/clerk/webhook</code> (baad me update karenge)</li>
  <li>Events: <code>user.created</code>, <code>user.updated</code>, <code>user.deleted</code></li>
  <li><strong>Signing Secret</strong> copy karo → <code>CLERK_WEBHOOK_SECRET</code></li>
</ol>

<div class="callout"><strong>Important:</strong> Production me switch karna mat bhoolna — Clerk dashboard me <em>Configure → Production</em> toggle ON karo. Naye live keys (<code>pk_live_...</code>, <code>sk_live_...</code>) generate honge.</div>

<h1>Step 5: OpenRouter AI setup</h1>
<p>Gemini 2.5 Flash primary, DeepSeek fallback.</p>
<ol>
  <li><strong>openrouter.ai/keys</strong> → Sign up</li>
  <li><strong>Create Key</strong> → name: <code>saas-seo-audit-prod</code>, $10 limit</li>
  <li>API key copy karo (<code>sk-or-v1-...</code>) → <code>OPENROUTER_API_KEY</code></li>
  <li><strong>openrouter.ai/credits</strong> me $5-10 add karo</li>
</ol>

<h1>Step 6: Google PageSpeed API setup</h1>
<ol>
  <li><strong>console.cloud.google.com</strong> → Create project: <code>saas-seo-audit</code></li>
  <li><strong>APIs &amp; Services → Library</strong> → search "PageSpeed Insights API" → <strong>Enable</strong></li>
  <li><strong>Credentials → Create API Key</strong>, sirf PSI API restrict karo</li>
  <li>Copy (<code>AIza...</code>) → <code>GOOGLE_PSI_API_KEY</code></li>
</ol>

<p>Test URL:</p>
<pre><code>https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&amp;key=YOUR_KEY</code></pre>

<h1>Step 7: Vercel deploy</h1>
<p>Free tier me 100 GB bandwidth/month.</p>

<h3>7.1 Account aur import</h3>
<ol>
  <li><strong>vercel.com/signup</strong> → Sign up with GitHub</li>
  <li><strong>vercel.com/new</strong> → Import <code>geekyprem1/saas-seo-audit</code></li>
  <li>Framework: Next.js (auto-detect)</li>
  <li>Build/Install/Output defaults rakho</li>
</ol>

<h3>7.2 Environment Variables</h3>
<p><strong>Project Settings → Environment Variables</strong> me add karo:</p>

<table>
  <thead>
    <tr><th>Variable</th><th>Value</th><th>Env</th></tr>
  </thead>
  <tbody>
    <tr><td><code>DATABASE_URL</code></td><td>Neon pooled URL</td><td>All</td></tr>
    <tr><td><code>DIRECT_URL</code></td><td>Neon direct URL</td><td>All</td></tr>
    <tr><td><code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code></td><td><code>pk_live_...</code></td><td>Production</td></tr>
    <tr><td><code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code></td><td><code>pk_test_...</code></td><td>Preview + Dev</td></tr>
    <tr><td><code>CLERK_SECRET_KEY</code></td><td><code>sk_live_...</code></td><td>Production</td></tr>
    <tr><td><code>CLERK_SECRET_KEY</code></td><td><code>sk_test_...</code></td><td>Preview + Dev</td></tr>
    <tr><td><code>CLERK_WEBHOOK_SECRET</code></td><td><code>whsec_...</code></td><td>All</td></tr>
    <tr><td><code>OPENROUTER_API_KEY</code></td><td><code>sk-or-v1-...</code></td><td>All</td></tr>
    <tr><td><code>OPENROUTER_MODEL_PRIMARY</code></td><td><code>google/gemini-2.5-flash</code></td><td>All</td></tr>
    <tr><td><code>OPENROUTER_MODEL_FALLBACK</code></td><td><code>deepseek/deepseek-chat</code></td><td>All</td></tr>
    <tr><td><code>GOOGLE_PSI_API_KEY</code></td><td><code>AIza...</code></td><td>All</td></tr>
    <tr><td><code>UPSTASH_REDIS_REST_URL</code></td><td><code>https://...upstash.io</code></td><td>All</td></tr>
    <tr><td><code>UPSTASH_REDIS_REST_TOKEN</code></td><td>token</td><td>All</td></tr>
    <tr><td><code>NEXT_PUBLIC_APP_URL</code></td><td><code>https://saasseoaudit.com</code></td><td>Production</td></tr>
    <tr><td><code>LOG_LEVEL</code></td><td><code>info</code></td><td>All</td></tr>
    <tr><td><code>CRON_SECRET</code></td><td>random string</td><td>All</td></tr>
  </tbody>
</table>

<h3>7.3 First Deploy</h3>
<p><strong>Deploy</strong> button click karo. 3-5 min lagega. Preview URL milega.</p>

<h3>7.4 Database migrate</h3>
<p>Pehli deploy ke baad tables create karne hain:</p>
<pre><code>cd C:\saas-seo-audit
npx vercel login
npx vercel link
npx vercel env pull .env.production
npx prisma migrate deploy</code></pre>

<h1>Step 8: Domain connect karna</h1>
<h3>8.1 Vercel me add karo</h3>
<ol>
  <li>Project → <strong>Settings → Domains</strong></li>
  <li><code>saasseoaudit.com</code> type karo → <strong>Add</strong></li>
  <li><code>www.saasseoaudit.com</code> bhi add karo</li>
</ol>

<h3>8.2 DNS records</h3>
<p>Registrar (Namecheap / Cloudflare / GoDaddy) me:</p>
<table>
  <thead><tr><th>Type</th><th>Host</th><th>Value</th><th>TTL</th></tr></thead>
  <tbody>
    <tr><td>A</td><td><code>@</code></td><td><code>76.76.21.21</code></td><td>Auto</td></tr>
    <tr><td>CNAME</td><td><code>www</code></td><td><code>cname.vercel-dns.com</code></td><td>Auto</td></tr>
  </tbody>
</table>

<h3>8.3 SSL verify</h3>
<p>5-30 min wait karo. Vercel me status <strong>Valid</strong> hona chahiye. Browser me lock icon check karo.</p>

<h3>8.4 Clerk webhook URL update</h3>
<ol>
  <li>Clerk dashboard → <strong>Webhooks</strong> → endpoint</li>
  <li>URL: <code>https://saasseoaudit.com/api/clerk/webhook</code></li>
</ol>

<h3>8.5 Production URL set karo</h3>
<p>Vercel me <code>NEXT_PUBLIC_APP_URL</code> update karo → <code>https://saasseoaudit.com</code> → <strong>Redeploy</strong>.</p>

<h1>Step 9: Production verify</h1>

<h3>9.1 Basic checks</h3>
<pre><code>curl -I https://saasseoaudit.com
curl https://saasseoaudit.com/sitemap.xml
curl https://saasseoaudit.com/robots.txt</code></pre>

<h3>9.2 Browser flow</h3>
<ol>
  <li><strong>saasseoaudit.com</strong> open karo</li>
  <li><strong>Sign up</strong> → Clerk modal khulna chahiye</li>
  <li>Google ya Email se sign up karo</li>
  <li>Redirect hoke <code>/dashboard</code> pe jaana chahiye</li>
  <li><strong>Run audit</strong> on <code>https://example.com</code> (30-60 sec)</li>
  <li>Results page: score, breakdown, issues dikhne chahiye</li>
  <li>AI recommendations har issue ke saath</li>
  <li><strong>CSV export</strong> download</li>
  <li><strong>History</strong> page me audit dikhna chahiye</li>
</ol>

<h3>9.3 Lighthouse score (bonus)</h3>
<p>Chrome DevTools → Lighthouse → Run:</p>
<ul>
  <li>Performance: 90+</li>
  <li>Accessibility: 90+</li>
  <li>SEO: 95+</li>
  <li>Best Practices: 90+</li>
</ul>

<h1>Step 10: Troubleshooting</h1>

<h3>Build fail: "DATABASE_URL is not set"</h3>
<p>Vercel me <code>DATABASE_URL</code> add karo → <strong>Redeploy</strong>.</p>

<h3>Clerk webhook 401</h3>
<p>Signing secret re-copy karo. Vercel me <code>CLERK_WEBHOOK_SECRET</code> update karo.</p>

<h3>Audit fails: "Failed to fetch site"</h3>
<ul>
  <li>OpenRouter key invalid → recheck</li>
  <li>PSI key missing → add karo</li>
  <li>Target site SSRF-blocked → public URL use karo</li>
  <li>Upstash down → Redis optional hai</li>
</ul>

<h3>Prisma: "relation does not exist"</h3>
<p><code>npx prisma migrate deploy</code> run karo production pe.</p>

<h3>Domain not resolving</h3>
<p>DNS 24-48 hours. Check: <strong>dnschecker.org</strong>. Vercel me status dekho.</p>

<h1>Post-launch checklist</h1>
<ul class="checklist">
  <li>Sentry setup (sentry.io) — error tracking</li>
  <li>Vercel Analytics enable</li>
  <li>Vercel Speed Insights enable</li>
  <li>Upstash monitoring check</li>
  <li>Neon monitoring check</li>
  <li>OpenRouter usage track (activity tab)</li>
  <li>Google Cloud quota monitor</li>
</ul>

<h1>Next milestones (10+)</h1>
<ul>
  <li><strong>Stripe checkout</strong> — billing flow add karo</li>
  <li><strong>Competitor comparison</strong> — 3 sites tak compare</li>
  <li><strong>PDF export</strong> — <code>@react-pdf/renderer</code> se branded reports</li>
  <li><strong>Agency team seats</strong> — up to 10 seats per workspace</li>
  <li><strong>White-label</strong> — custom logo/colors on PDF</li>
  <li><strong>Email notifications</strong> — Resend se audit complete pe email</li>
  <li><strong>Cron jobs</strong> — daily cleanup, weekly summary email</li>
  <li><strong>Blog</strong> — <code>src/app/blog/</code> for SEO content marketing</li>
</ul>

<h1>Quick reference: common commands</h1>
<pre><code># Local development
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
git push</code></pre>

<div class="footer">
  Generated for <strong>github.com/geekyprem1/saas-seo-audit</strong> · Best of luck bhai 🚀<br/>
  Koi step atke to mujhse poocho — har service setup me help kar sakta hoon.
</div>

</body>
</html>`;

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const out = path.resolve(__dirname, "..", "DEPLOY.pdf");
    await page.pdf({
      path: out,
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    const stat = fs.statSync(out);
    console.log(`\n✓ PDF generated: ${out}`);
    console.log(`  Size: ${(stat.size / 1024).toFixed(1)} KB`);
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});