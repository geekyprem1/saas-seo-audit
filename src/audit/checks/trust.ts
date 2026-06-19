import type { ParsedPage } from "@/audit/parse";
import type { IssueDraft } from "@/audit/issues/types";

export type TrustMetrics = {
  hasTestimonials: boolean;
  hasLogos: boolean;
  hasCaseStudies: boolean;
  hasFounderInfo: boolean;
  hasSecurityBadges: boolean;
  hasPricing: boolean;
  hasFaq: boolean;
  hasContact: boolean;
  hasPrivacyPolicy: boolean;
  hasTermsOfService: boolean;
};

export function analyzeTrust(page: ParsedPage): TrustMetrics {
  const $ = page.$;
  const text = page.text.toLowerCase();
  const html = page.html.toLowerCase();

  // 1. Testimonials
  let hasTestimonials = text.includes("testimonial") || text.includes("what people say") || 
                        text.includes("reviews") || text.includes("customer review") ||
                        $("blockquote").length > 0;

  // 2. Customer Logos
  let hasLogos = text.includes("trusted by") || text.includes("backed by") || 
                 text.includes("our customers") || html.includes("logo-grid") ||
                 html.includes("partner-logo");

  // 3. Case Studies
  let hasCaseStudies = text.includes("case study") || text.includes("case studies") ||
                       text.includes("customer story") || text.includes("customer success");

  // 4. Founder Info
  let hasFounderInfo = text.includes("founder") || text.includes("about the founder") ||
                       text.includes("co-founder") || text.includes("my name is") ||
                       text.includes("about us") || text.includes("our team");

  // 5. Security Badges
  let hasSecurityBadges = text.includes("soc2") || text.includes("soc 2") || 
                          text.includes("gdpr") || text.includes("compliance") ||
                          text.includes("secure") || text.includes("encryption") ||
                          text.includes("pci compliant");

  // 6. Pricing Section / Page
  let hasPricing = text.includes("pricing") || text.includes("plan") || 
                   text.includes("subscription") || text.includes("cancel anytime") ||
                   html.includes("pricing-table") || html.includes("pricing-card");

  // 7. FAQ Section / Page
  let hasFaq = text.includes("faq") || text.includes("frequently asked questions") ||
               $("details").length > 0;

  // 8. Contact Info / Page
  let hasContact = text.includes("contact") || text.includes("support@") ||
                   text.includes("help@") || html.includes("mailto:") ||
                   text.includes("contact us");

  // 9. Privacy Policy
  let hasPrivacyPolicy = false;
  // 10. Terms of Service
  let hasTermsOfService = false;

  $("a").each((_, el) => {
    const linkText = $(el).text().trim().toLowerCase();
    const href = $(el).attr("href") ?? "";
    if (linkText.includes("privacy") || href.includes("privacy")) {
      hasPrivacyPolicy = true;
    }
    if (linkText.includes("terms") || href.includes("terms") || linkText.includes("tos")) {
      hasTermsOfService = true;
    }
  });

  return {
    hasTestimonials,
    hasLogos,
    hasCaseStudies,
    hasFounderInfo,
    hasSecurityBadges,
    hasPricing,
    hasFaq,
    hasContact,
    hasPrivacyPolicy,
    hasTermsOfService,
  };
}

export function checkTrust(page: ParsedPage): IssueDraft[] {
  const issues: IssueDraft[] = [];
  const metrics = analyzeTrust(page);

  // Testimonials
  if (!metrics.hasTestimonials) {
    issues.push({
      checkId: "trust.testimonials.missing",
      severity: "HIGH",
      category: "TRUST",
      title: "No customer testimonials found",
      description: "We couldn't detect testimonials, quotes, or user reviews on your landing page.",
      businessImpact: "Higher visitor skepticism and bounce rates. Users hesitate to buy without seeing proof of others succeeding.",
      seoImpact: "Decreased conversion metrics from paid and organic landing traffic.",
      recommendation: "Embed 3-5 quote testimonials from real clients, showing their name, avatar, and company.",
      difficulty: "LOW",
      whyItMatters: "Social proof is the most effective way to address visitor skepticism and build immediate credibility.",
    });
  }

  // Customer Logos
  if (!metrics.hasLogos && page.wordCount > 300) {
    issues.push({
      checkId: "trust.logos.missing",
      severity: "MEDIUM",
      category: "TRUST",
      title: "Missing 'Trusted By' customer logos",
      description: "No partner or customer logo grids were found on the page.",
      businessImpact: "Lacks immediate authority. Company logos borrow trust from established brands and prove real-world usage.",
      seoImpact: "None directly, but lowers conversion rate optimization parameters.",
      recommendation: "Add a logo bar representing companies that use your tool (or brands your founders worked at previously).",
      difficulty: "LOW",
      whyItMatters: "Logos act as visual shortcuts that instantly signal authority and industry adoption.",
    });
  }

  // Founder Info
  if (!metrics.hasFounderInfo) {
    issues.push({
      checkId: "trust.founder.missing",
      severity: "MEDIUM",
      category: "TRUST",
      title: "Founder information not visible",
      description: "The landing page does not mention the founder(s), team background, or a personal bio.",
      businessImpact: "The product feels like a faceless corporation, making it harder for indie hackers or startup buyers to connect.",
      seoImpact: "Hurts Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) criteria.",
      recommendation: "Include a short 'Meet the Founder' section or insert a brief text card/photo showing who is behind the product.",
      difficulty: "MEDIUM",
      whyItMatters: "Founders' faces and stories humanize a SaaS, fostering deep empathy and brand loyalty.",
    });
  }

  // FAQ Section
  if (!metrics.hasFaq) {
    issues.push({
      checkId: "trust.faq.missing",
      severity: "MEDIUM",
      category: "TRUST",
      title: "Missing FAQ section",
      description: "We couldn't find a FAQ (Frequently Asked Questions) section or accordion on the page.",
      businessImpact: "Unanswered objections remain in the user's mind, causing them to bounce instead of signing up.",
      seoImpact: "Missed opportunity to gain search visibility via FAQ schema markup.",
      recommendation: "Add an accordion-style FAQ section with 5-6 common objections regarding pricing, security, or implementation.",
      difficulty: "LOW",
      whyItMatters: "FAQ sections directly address lingering objections and friction points right when the buyer is ready to decide.",
    });
  }

  // Contact Page/Info
  if (!metrics.hasContact) {
    issues.push({
      checkId: "trust.contact.missing",
      severity: "MEDIUM",
      category: "TRUST",
      title: "No clear contact information found",
      description: "We couldn't find a support email, contact form, or 'Contact us' link.",
      businessImpact: "Buyers fear that support will be unreachable if they encounter bugs or billing issues.",
      seoImpact: "Lowers site trustworthiness signals evaluated by quality assessors.",
      recommendation: "Add a support email or contact link in the footer (e.g., support@yourdomain.com).",
      difficulty: "LOW",
      whyItMatters: "Providing clear support contacts shows you are real, accessible, and accountable.",
    });
  }

  // Policies (Privacy & Terms)
  if (!metrics.hasPrivacyPolicy || !metrics.hasTermsOfService) {
    issues.push({
      checkId: "trust.policies.missing",
      severity: "HIGH",
      category: "TRUST",
      title: "Privacy Policy or Terms of Service missing",
      description: "We could not locate links to your Privacy Policy or Terms of Service in the footer.",
      businessImpact: "SaaS buyers (especially enterprise/B2B clients) will immediately reject software without legal policies.",
      seoImpact: "Search crawlers look for standard legal headers/footers to determine domain authority and safety.",
      recommendation: "Create basic terms and privacy pages, and link to them in your landing page footer.",
      difficulty: "LOW",
      whyItMatters: "Privacy and legal pages are standard requirements for compliance and signal that you protect customer data.",
    });
  }

  return issues;
}
