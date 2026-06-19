import { z } from "zod";

export const Severity = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
} as const;
export type Severity = (typeof Severity)[keyof typeof Severity];

export const IssueCategory = {
  TECHNICAL: "TECHNICAL",
  ON_PAGE: "ON_PAGE",
  PERFORMANCE: "PERFORMANCE",
  CONTENT: "CONTENT",
  ACCESSIBILITY: "ACCESSIBILITY",
  IMAGES: "IMAGES",
  LINKS: "LINKS",
} as const;
export type IssueCategory = (typeof IssueCategory)[keyof typeof IssueCategory];

export type IssueDraft = {
  checkId: string;
  severity: Severity;
  category: IssueCategory;
  title: string;
  description: string;
  recommendation: string;
  whyItMatters: string;
  fixCode?: string;
  affectedUrl?: string;
  metadata?: Record<string, unknown>;
};

export const AuditStatus = {
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;
export type AuditStatus = (typeof AuditStatus)[keyof typeof AuditStatus];

export const IssueDraftSchema = z.object({
  checkId: z.string(),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  category: z.enum([
    "TECHNICAL",
    "ON_PAGE",
    "PERFORMANCE",
    "CONTENT",
    "ACCESSIBILITY",
    "IMAGES",
    "LINKS",
  ]),
  title: z.string().min(2),
  description: z.string().min(2),
  recommendation: z.string().min(2),
  whyItMatters: z.string().min(2),
  fixCode: z.string().optional(),
  affectedUrl: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});