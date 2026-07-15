// ============================================================================
// LeadPilot AI – Email Strategy Planner
// ============================================================================

import type { EnrichmentData, RevenuePrediction, EmailStrategy } from "../types";
import { addAuditEntry } from "../utils/audit-logger";

export async function planEmailStrategy(
  enrichment: EnrichmentData,
  revenuePrediction: RevenuePrediction,
  leadId: string
): Promise<EmailStrategy> {
  await new Promise((r) => setTimeout(r, 150));

  // Determine tone based on industry and deal size
  let tone: EmailStrategy["tone"];
  if (revenuePrediction.dealSize.expected > 100000) {
    tone = "consultative";
  } else if (enrichment.industry.toLowerCase().includes("saas") || enrichment.industry.toLowerCase().includes("tech")) {
    tone = "professional";
  } else if (revenuePrediction.urgency === "immediate" || revenuePrediction.urgency === "high") {
    tone = "direct";
  } else {
    tone = "friendly";
  }

  // Personalization points from enrichment data
  const personalizationPoints: string[] = [];
  if (enrichment.technologies.length > 0) {
    personalizationPoints.push(`Noticed your use of ${enrichment.technologies.slice(0, 3).join(", ")}`);
  }
  if (enrichment.hiringActivity.length > 0) {
    const topHire = enrichment.hiringActivity.sort((a, b) => b.count - a.count)[0];
    personalizationPoints.push(`Your team expansion in ${topHire.role} caught our attention`);
  }
  if (enrichment.buyingSignals.length > 0) {
    personalizationPoints.push(`We understand you're exploring ${enrichment.buyingSignals[0].toLowerCase()}`);
  }
  if (enrichment.competitorUsage.length > 0) {
    personalizationPoints.push(`We see you're using ${enrichment.competitorUsage[0]} – we offer a compelling alternative`);
  }
  if (enrichment.fundingStage !== "Unknown") {
    personalizationPoints.push(`Congratulations on your ${enrichment.fundingStage} funding round`);
  }

  // Value proposition
  const valueProposition = `LeadPilot AI helps ${enrichment.industry} companies like ${enrichment.companyName} automate lead intelligence, boost sales efficiency by 40%, and increase win rates through AI-powered insights.`;

  // Call to action
  let callToAction: string;
  if (revenuePrediction.urgency === "immediate") {
    callToAction = "Schedule a 15-minute demo this week";
  } else if (revenuePrediction.urgency === "high") {
    callToAction = "Book a personalized walkthrough";
  } else {
    callToAction = "Learn more about our platform";
  }

  // Best time to send
  const bestTimeToSend = "Tuesday 10:00 AM (recipient's timezone)";

  // Subject line options
  const subjectLineOptions = [
    `${enrichment.companyName} × LeadPilot: AI-powered sales intelligence`,
    `Personalized demo for ${enrichment.companyName}`,
    `Boost ${enrichment.companyName}'s sales efficiency with AI`,
    `How ${enrichment.industry} leaders are modernizing their sales process`,
    `${enrichment.companyName}: Turn leads into revenue faster`,
  ];

  const strategy: EmailStrategy = {
    tone,
    personalizationPoints,
    valueProposition,
    callToAction,
    bestTimeToSend,
    subjectLineOptions,
  };

  addAuditEntry(leadId, "email_strategy_planned", "agent", {
    tone,
    personalizationPoints: personalizationPoints.length,
    subjectLineOptions: subjectLineOptions.length,
  });

  return strategy;
}