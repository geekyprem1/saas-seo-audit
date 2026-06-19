import type { ParsedPage } from "@/audit/parse";
import type { IssueDraft } from "@/audit/issues/types";
import { checkOnPage } from "./onpage";
import { checkImages } from "./images";
import { checkLinks } from "./links";
import { checkContent, analyzeContent } from "./content";
import { checkAccessibility } from "./mobile";
import { checkPerformance, type PerformanceResult } from "./performance";
import type { TechnicalContext } from "./technical";

export type CheckInputs = {
  page: ParsedPage;
  technical: TechnicalContext;
  performance: PerformanceResult;
};

export type CheckOutputs = {
  issues: IssueDraft[];
  metrics: {
    content: ReturnType<typeof analyzeContent>;
  };
};

export function runAllChecks(inputs: CheckInputs): CheckOutputs {
  const issues: IssueDraft[] = [
    ...checkOnPage(inputs.page),
    ...checkImages(inputs.page),
    ...checkLinks(inputs.page),
    ...checkContent(inputs.page),
    ...checkAccessibility(inputs.page),
    ...checkPerformance(inputs.performance),
  ];
  return {
    issues,
    metrics: {
      content: analyzeContent(inputs.page),
    },
  };
}