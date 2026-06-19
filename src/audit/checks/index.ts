import type { ParsedPage } from "@/audit/parse";
import type { IssueDraft } from "@/audit/issues/types";
import { checkOnPage } from "./onpage";
import { checkImages } from "./images";
import { checkLinks } from "./links";
import { checkContent, analyzeContent } from "./content";
import { checkAccessibility } from "./mobile";
import { checkPerformance, type PerformanceResult } from "./performance";
import type { TechnicalContext } from "./technical";

// Import new CRO check engines
import { checkConversion, analyzeConversion } from "./conversion";
import { checkMessaging, analyzeMessaging } from "./messaging";
import { checkTrust, analyzeTrust } from "./trust";
import { checkOffer, analyzeOffer } from "./offer";

export type CheckInputs = {
  page: ParsedPage;
  technical: TechnicalContext;
  performance: PerformanceResult;
};

export type CheckOutputs = {
  issues: IssueDraft[];
  metrics: {
    content: ReturnType<typeof analyzeContent>;
    conversion: ReturnType<typeof analyzeConversion>;
    messaging: ReturnType<typeof analyzeMessaging>;
    trust: ReturnType<typeof analyzeTrust>;
    offer: ReturnType<typeof analyzeOffer>;
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
    ...checkConversion(inputs.page),
    ...checkMessaging(inputs.page),
    ...checkTrust(inputs.page),
    ...checkOffer(inputs.page),
  ];
  return {
    issues,
    metrics: {
      content: analyzeContent(inputs.page),
      conversion: analyzeConversion(inputs.page),
      messaging: analyzeMessaging(inputs.page),
      trust: analyzeTrust(inputs.page),
      offer: analyzeOffer(inputs.page),
    },
  };
}