// ============================================================================
// LeadPilot AI – Buying Signal Detection Agent
// ============================================================================

import type { EnrichmentData } from "../types";
import { addAuditEntry } from "../utils/audit-logger";

export interface SignalResult {
  signals: string[];
  signalStrength: "weak" | "moderate" | "strong";
  score: number; // 0-100
  confidence: number;
}

export async function detectBuyingSignals(
  enrichment: EnrichmentData,
  leadId: string
): Promise<SignalResult> {
  await new Promise((r) => setTimeout(r, 200));

  const signals: string[] = [];
  let score = 0;

  // Hiring activity signal
  const salesHires = enrichment.hiringActivity.filter((h) =>
    h.role.toLowerCase().includes("sales") || h.role.toLowerCase().includes("sdr")
  );
  if (salesHires.length > 0) {
    const totalGrowth = salesHires.reduce((s, h) => s + h.growth, 0);
    if (totalGrowth > 30) {
      signals.push("Aggressive sales team expansion detected");
      score += 25;
    } else if (totalGrowth > 10) {
      signals.push("Moderate sales team growth");
      score += 15;
    }
  }

  // Competitor usage signal
  if (enrichment.competitorUsage.length > 0) {
    if (enrichment.competitorUsage.includes("Salesforce")) {
      signals.push("Currently using Salesforce – potential replacement opportunity");
      score += 20;
    }
    if (enrichment.competitorUsage.includes("HubSpot")) {
      signals.push("Currently using HubSpot – potential upgrade opportunity");
      score += 15;
    }
    if (enrichment.competitorUsage.length >= 3) {
      signals.push("Multiple CRM platforms in use – consolidation opportunity");
      score += 10;
    }
  }

  // Funding signal
  if (enrichment.totalFunding > 10000000) {
    signals.push("Well-funded company with budget for new tools");
    score += 15;
  }

  // Company size signal
  if (enrichment.employeeCount > 500) {
    signals.push("Enterprise-scale company with complex sales needs");
    score += 10;
  }

  // Tech stack signal
  const modernTech = ["React", "Node.js", "Python", "AWS", "GCP", "Kubernetes", "Docker"];
  const matchCount = enrichment.technologies.filter((t) =>
    modernTech.some((mt) => t.toLowerCase().includes(mt.toLowerCase()))
  ).length;
  if (matchCount >= 3) {
    signals.push("Modern technology stack – likely to adopt AI tools");
    score += 10;
  }

  // Industry-specific signals
  const highValueIndustries = ["SaaS", "Enterprise Software", "AI", "FinTech", "HealthTech"];
  if (highValueIndustries.some((i) => enrichment.industry.toLowerCase().includes(i.toLowerCase()))) {
    signals.push("High-value industry target");
    score += 10;
  }

  // Location signal
  if (enrichment.location.country === "US" || enrichment.location.country === "GB" || enrichment.location.country === "DE") {
    signals.push("Located in strong sales market");
    score += 5;
  }

  // Job title of contact
  if (enrichment.keyJobTitles.some((t) => t.includes("CTO") || t.includes("VP") || t.includes("Director"))) {
    signals.push("Executive-level contact with purchasing authority");
    score += 15;
  }

  const signalStrength = score >= 70 ? "strong" : score >= 35 ? "moderate" : "weak";

  const result: SignalResult = {
    signals,
    signalStrength,
    score: Math.min(score, 100),
    confidence: 0.85 + Math.random() * 0.1,
  };

  addAuditEntry(leadId, "buying_signal_detected", "agent", {
    signalCount: signals.length,
    signalStrength: result.signalStrength,
    score: result.score,
  });

  return result;
}