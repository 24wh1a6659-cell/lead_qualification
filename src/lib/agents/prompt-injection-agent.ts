// ============================================================================
// LeadPilot AI – Prompt Injection Detection Agent
// ============================================================================
// Detects and neutralizes prompt injection attempts in lead form submissions.

import type { PromptInjectionResult } from "../types";
import { addAuditEntry } from "../utils/audit-logger";

// Known prompt injection patterns
const INJECTION_PATTERNS = [
  { pattern: /ignore\s+(previous|all|prior)\s+instructions/i, risk: "high" },
  { pattern: /forget\s+(previous|all|prior)\s+(instructions|prompts)/i, risk: "high" },
  { pattern: /disregard\s+(previous|all|prior)/i, risk: "high" },
  { pattern: /you\s+are\s+(now|a)\s+(chat)?gpt/i, risk: "medium" },
  { pattern: /act\s+as\s+(if\s+you\s+are|a)/i, risk: "medium" },
  { pattern: /system\s+prompt/i, risk: "high" },
  { pattern: /new\s+instructions/i, risk: "medium" },
  { pattern: /override\s+(instructions|prompt|system)/i, risk: "high" },
  { pattern: /you\s+must\s+(now|ignore)/i, risk: "medium" },
  { pattern: /do\s+not\s+(follow|obey|adhere)/i, risk: "high" },
  { pattern: /score\s+this\s+(as\s+)?(highest|lowest|max)/i, risk: "high" },
  { pattern: /actually\s+score/i, risk: "medium" },
  { pattern: /pretend/i, risk: "low" },
  { pattern: /hypothetical/i, risk: "low" },
  { pattern: /simulate/i, risk: "low" },
  { pattern: /role\s+play/i, risk: "medium" },
  { pattern: /you\s+are\s+an?\s+ai/i, risk: "low" },
  { pattern: /this\s+is\s+(a\s+)?test/i, risk: "low" },
  { pattern: /for\s+(testing|demo)\s+purposes/i, risk: "low" },
  { pattern: /<\/?system>/i, risk: "critical" },
  { pattern: /<|im_start|im_end>/i, risk: "critical" },
  { pattern: /[\s\S]*>[\s\S]*system[\s\S]*<[\s\S]*/i, risk: "critical" },
  { pattern: /###\s*instructions?/i, risk: "medium" },
  { pattern: /---\s*START/i, risk: "medium" },
  { pattern: /---\s*END/i, risk: "medium" },
];

export async function detectPromptInjection(
  input: Record<string, unknown>,
  leadId: string
): Promise<PromptInjectionResult> {
  await new Promise((r) => setTimeout(r, 150));

  const textFields = Object.values(input)
    .filter((v): v is string => typeof v === "string")
    .join(" ");

  let highestRisk: "none" | "low" | "medium" | "high" | "critical" = "none";
  let detectedPattern: string | null = null;
  let isInjection = false;

  const riskLevels: Record<string, number> = { none: 0, low: 1, medium: 2, high: 3, critical: 4 };

  for (const { pattern, risk } of INJECTION_PATTERNS) {
    if (pattern.test(textFields)) {
      isInjection = true;
      if (riskLevels[risk] > riskLevels[highestRisk]) {
        highestRisk = risk as typeof highestRisk;
        detectedPattern = pattern.source;
      }
    }
  }

  // Sanitize: strip known injection patterns
  let sanitized = textFields;
  for (const { pattern } of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[REDACTED]");
  }

  const riskConfidence = (risk: string): number => {
    switch (risk) {
      case "critical": return 0.99;
      case "high": return 0.92;
      case "medium": return 0.75;
      default: return 0.55;
    }
  };
  const confidence = isInjection ? riskConfidence(highestRisk) : 0.05;
  const confidencePercent = Math.round(confidence * 100);

  const result: PromptInjectionResult = {
    isInjection,
    confidence: Math.round(confidence * 100),
    detectedPattern,
    sanitizedInput: sanitized,
    riskLevel: highestRisk,
  };

  addAuditEntry(leadId, "prompt_injection_checked", "agent", {
    isInjection: result.isInjection,
    riskLevel: result.riskLevel,
    detectedPattern: result.detectedPattern,
    confidence: result.confidence,
  });

  return result;
}