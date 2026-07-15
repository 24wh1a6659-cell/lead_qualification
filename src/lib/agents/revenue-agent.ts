// ============================================================================
// LeadPilot AI – Revenue Prediction Agent
// ============================================================================
// Predicts deal size, close probability, expected revenue, urgency, and best channel.

import type { EnrichmentData, ICPScore, RevenuePrediction } from "../types";
import { addAuditEntry } from "../utils/audit-logger";

export async function predictRevenue(
  enrichment: EnrichmentData,
  icpScore: ICPScore,
  signalScore: number,
  leadId: string
): Promise<RevenuePrediction> {
  await new Promise((r) => setTimeout(r, 200));

  // Base deal size on company size and funding
  let baseDealSize: number;
  if (enrichment.employeeCount > 5000) baseDealSize = 150000;
  else if (enrichment.employeeCount > 1000) baseDealSize = 80000;
  else if (enrichment.employeeCount > 200) baseDealSize = 45000;
  else if (enrichment.employeeCount > 50) baseDealSize = 25000;
  else baseDealSize = 15000;

  // Adjust for funding
  if (enrichment.totalFunding > 50000000) baseDealSize *= 1.5;
  else if (enrichment.totalFunding > 10000000) baseDealSize *= 1.3;
  else if (enrichment.totalFunding > 2000000) baseDealSize *= 1.1;

  // Adjust for industry
  const premiumIndustries = ["SaaS", "Enterprise Software", "AI", "FinTech", "HealthTech"];
  if (premiumIndustries.some((i) => enrichment.industry.toLowerCase().includes(i.toLowerCase()))) {
    baseDealSize *= 1.2;
  }

  const minDeal = Math.round(baseDealSize * 0.7);
  const maxDeal = Math.round(baseDealSize * 1.3);
  const expectedDeal = Math.round(baseDealSize);

  // Close probability based on ICP score
  const closeProbability = Math.round(icpScore.overall * 0.7 + signalScore * 0.3);

  // Expected revenue
  const expectedRevenue = Math.round(expectedDeal * (closeProbability / 100));

  // Urgency
  let urgency: RevenuePrediction["urgency"];
  if (icpScore.classification === "Hot" && signalScore > 60) urgency = "immediate";
  else if (icpScore.classification === "Hot") urgency = "high";
  else if (icpScore.classification === "Nurture") urgency = "medium";
  else urgency = "low";

  // Best channel
  let bestChannel: RevenuePrediction["bestChannel"];
  const techStack = enrichment.technologies.map((t) => t.toLowerCase());
  if (enrichment.industry.toLowerCase().includes("saas") || enrichment.industry.toLowerCase().includes("tech")) {
    bestChannel = "email";
  } else if (techStack.some((t) => t.includes("react") || t.includes("node"))) {
    bestChannel = "linkedin";
  } else if (enrichment.employeeCount > 5000) {
    bestChannel = "phone";
  } else {
    bestChannel = "email";
  }

  // Time to close
  let timeToClose: string;
  if (urgency === "immediate") timeToClose = "7-14 days";
  else if (urgency === "high") timeToClose = "14-30 days";
  else if (urgency === "medium") timeToClose = "30-60 days";
  else timeToClose = "60-90 days";

  const prediction: RevenuePrediction = {
    dealSize: { min: minDeal, max: maxDeal, expected: expectedDeal, currency: "USD" },
    closeProbability,
    expectedRevenue,
    urgency,
    bestChannel,
    timeToClose,
    confidence: Math.round(0.7 + (icpScore.overall / 100) * 0.25),
    reasoning: `Based on ${enrichment.companySize} company with ${enrichment.fundingStage} funding in ${enrichment.industry}. ICP score ${icpScore.overall}/100 with signal strength ${signalScore}/100.`,
  };

  addAuditEntry(leadId, "revenue_predicted", "agent", {
    expectedDeal: expectedDeal,
    closeProbability,
    expectedRevenue,
    urgency,
    bestChannel,
  });

  return prediction;
}