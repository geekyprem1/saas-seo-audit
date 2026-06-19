import type { IssueDraft } from "@/audit/issues/types";

export function issuesToCsv(issues: IssueDraft[]): string {
  const headers = [
    "severity",
    "category",
    "title",
    "description",
    "recommendation",
    "why_it_matters",
    "fix_code",
    "affected_url",
  ];
  const rows = issues.map((issue) => [
    issue.severity,
    issue.category,
    issue.title,
    issue.description,
    issue.recommendation,
    issue.whyItMatters,
    issue.fixCode ?? "",
    issue.affectedUrl ?? "",
  ]);
  return [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}