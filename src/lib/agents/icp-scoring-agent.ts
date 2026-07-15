// ============================================================================
// LeadPilot AI – ICP Scoring Agent
// ============================================================================
// Produces explainable lead scores with confidence percentages and evidence.
// Classifies leads as Hot, Nurture, or Disqualify with cited reasoning.
// IMPORTANT: Ignores sensitive attributes (names, gender, nationality, age, ethnicity).

import type { EnrichmentData, ICPScore, ICPFactor, LeadInput } from "../types";
import { addAuditEntry } from "../utils/audit-logger";

// Sensitive attributes that must be IGNORED during scoring
const SENSITIVE_ATTRIBUTES = [
  "firstName", "lastName", "gender", "nationality", "age", "ageRange",
  "ethnicity", "race", "religion", "sexualOrientation", "disability",
  "maritalStatus", "politicalAffiliation",
];

export async function scoreICP(
  input: LeadInput,
  enrichment: EnrichmentData,
  signalScore: number,
  leadId: string
): Promise<ICPScore> {
  await new Promise((r) => setTimeout(r, 200));

  // Verify no sensitive attributes are used
  const inputKeys = Object.keys(input);
  const sensitiveFound = inputKeys.filter((k) =>
    SENSITIVE_ATTRIBUTES.includes(k.toLowerCase())
  );
  if (sensitiveFound.length > 0) {
    console.warn(`Sensitive attributes detected in input: ${sensitiveFound.join(", ")}. They will be ignored.`);
  }

  const factors: ICPFactor[] = [];

  // Factor 1: Industry Fit (weight: 0.25)
  const idealIndustries = [
    "saas", "enterprise software", "ai", "artificial intelligence",
    "fintech", "healthtech", "data analytics", "cloud computing",
    "cybersecurity", "martech",
  ];
  const industryMatch = idealIndustries.some((i) =>
    enrichment.industry.toLowerCase().includes(i)
  );
  const industryScore = industryMatch ? 85 : enrichment.industry === "Unknown" ? 40 : 55;
  factors.push({
    name: "Industry Fit",
    score: industryScore,
    weight: 0.25,
    evidence: industryMatch
      ? `Company in ${enrichment.industry} – aligns with target ICP industries`
      : `Company in ${enrichment.industry} – not a primary ICP target`,
  });

  // Factor 2: Company Size Fit (weight: 0.20)
  const sizeScore =
    enrichment.employeeCount >= 200 && enrichment.employeeCount <= 5000
      ? 90
      : enrichment.employeeCount >= 50 && enrichment.employeeCount <= 200
        ? 70
        : enrichment.employeeCount > 5000
          ? 60
          : enrichment.employeeCount < 50
            ? 40
            : 50;
  factors.push({
    name: "Company Size Fit",
    score: sizeScore,
    weight: 0.20,
    evidence: `${enrichment.companySize} (${enrichment.employeeCount} employees) – ${
      sizeScore >= 80 ? "ideal" : sizeScore >= 60 ? "acceptable" : "below threshold"
    } for ICP`,
  });

  // Factor 3: Funding & Financial Health (weight: 0.15)
  const fundingScore =
    enrichment.totalFunding > 50000000
      ? 90
      : enrichment.totalFunding > 10000000
        ? 80
        : enrichment.totalFunding > 2000000
          ? 65
          : enrichment.totalFunding > 0
            ? 50
            : 30;
  factors.push({
    name: "Funding & Financial Health",
    score: fundingScore,
    weight: 0.15,
    evidence: `${enrichment.fundingStage} with $${(enrichment.totalFunding / 1000000).toFixed(1)}M total funding`,
  });

  // Factor 3: Technology & Innovation (weight: 0.15)
  const modernTech = ["React", "Node.js", "Python", "AWS", "GCP", "Kubernetes", "Docker", "PyTorch", "TensorFlow", "Kafka"];
  const techMatch = enrichment.technologies.filter((t) =>
    modernTech.some((mt) => t.toLowerCase().includes(mt.toLowerCase()))
  ).length;
  const techScore = Math.min(techMatch * 15, 100);
  factors.push({
    name: "Technology & Innovation",
    score: techScore,
    weight: 0.15,
    evidence: `${techMatch}/${modernTech.length} modern tech indicators found: ${enrichment.technologies.slice(0, 4).join(", ")}${enrichment.technologies.length > 4 ? "..." : ""}`,
  });

  // Factor 4: Buying Signals & Intent (weight: 0.15)
  const buyingScore = signalScore;
  factors.push({
    name: "Buying Signals & Intent",
    score: buyingScore,
    weight: 0.15,
    evidence: `${enrichment.buyingSignals.length} buying signals detected. Signal strength: ${buyingScore >= 70 ? "strong" : buyingScore >= 35 ? "moderate" : "weak"}. Signals: ${enrichment.buyingSignals.slice(0, 2).join("; ")}`,
  });

  // Factor 5: Hiring & Growth (weight: 0.10)
  const totalHires = enrichment.hiringActivity.reduce((s, h) => s + h.count, 0);
  const avgGrowth = enrichment.hiringActivity.length > 0
    ? enrichment.hiringActivity.reduce((s, h) => s + h.growth, 0) / enrichment.hiringActivity.length
    : 0;
  const growthScore = totalHires > 10 ? 90 : totalHires > 5 ? 75 : totalHires > 2 ? 60 : 40;
  factors.push({
    name: "Hiring & Growth Trajectory",
    score: growthScore,
    weight: 0.10,
    evidence: `${totalHires} active hires across ${enrichment.hiringActivity.length} roles with ${avgGrowth.toFixed(0)}% average growth rate`,
  });

  // Calculate weighted score
  const overall = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0)
  );

  // Determine classification
  let classification: "Hot" | "Nurture" | "Disqualify";
  let reasoning: string;

  if (overall >= 70) {
    classification = "Hot";
    reasoning = `Lead scores ${overall}/100. Strong alignment across multiple ICP dimensions including ${
      factors.filter((f) => f.score >= 70).map((f) => f.name).join(", ")
    }. Recommended for immediate sales engagement.`;
  } else if (overall >= 45) {
    classification = "Nurture";
    reasoning = `Lead scores ${overall}/100. Moderate ICP alignment. Shows potential but requires further nurturing. Key strengths: ${
      factors.filter((f) => f.score >= 60).map((f) => f.name).join(", ") || "none significant"
    }. Areas for improvement: ${
      factors.filter((f) => f.score < 50).map((f) => f.name).join(", ") || "none"
    }.`;
  } else {
    classification = "Disqualify";
    reasoning = `Lead scores ${overall}/100. Poor ICP alignment. ${
      factors.filter((f) => f.score < 40).map((f) => `${f.name} (${f.score}/100)`).join("; ")
    }. Not recommended for pursuit at this time.`;
  }

  const confidence = 0.75 + (overall / 100) * 0.2;

  const score: ICPScore = {
    overall,
    confidence: Math.round(confidence * 100),
    factors,
    classification,
    reasoning,
    scoredAt: new Date().toISOString(),
  };

  addAuditEntry(leadId, "icp_scored", "agent", {
    overall: score.overall,
    classification: score.classification,
    confidence: score.confidence,
    factorCount: factors.length,
  });

  return score;
}

export { SENSITIVE_ATTRIBUTES };