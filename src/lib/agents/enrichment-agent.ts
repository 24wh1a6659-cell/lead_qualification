// ============================================================================
// LeadPilot AI – Enrichment Agent
// ============================================================================
// Enriches leads with company size, industry, funding, technology stack,
// hiring activity, job titles, buying signals, and competitor usage.

import type { EnrichmentData, LeadInput } from "../types";
import { addAuditEntry } from "../utils/audit-logger";

// Mock enrichment data sources (would connect to Clearbit, Hunter, Tavily, etc.)
const MOCK_COMPANY_DB: Record<string, Partial<EnrichmentData>> = {
  technova: {
    industry: "SaaS / Enterprise Software",
    companySize: "500-1000",
    employeeCount: 780,
    fundingStage: "Series C",
    totalFunding: 45000000,
    technologies: ["React", "Node.js", "AWS", "PostgreSQL", "Python", "Docker", "Kubernetes"],
    hiringActivity: [
      { role: "Software Engineer", count: 12, growth: 15 },
      { role: "Sales Development Rep", count: 8, growth: 40 },
      { role: "Customer Success", count: 5, growth: 25 },
    ],
    keyJobTitles: ["CTO", "VP of Sales", "Head of Product", "Sales Director"],
    buyingSignals: [
      "Hiring SDRs aggressively",
      "VP of Sales recently joined",
      "Attending Salesforce Dreamforce",
      "Searching for AI sales tools",
    ],
    competitorUsage: ["Salesforce", "HubSpot", "Outreach"],
    socialPresence: { linkedin: "linkedin.com/company/technova", twitter: "@technova" },
    location: { city: "San Francisco", country: "US" },
  },
  greenleaf: {
    industry: "Data Analytics / BI",
    companySize: "50-200",
    employeeCount: 120,
    fundingStage: "Seed",
    totalFunding: 2000000,
    technologies: ["Python", "R", "Tableau", "Snowflake", "Airflow"],
    hiringActivity: [
      { role: "Data Scientist", count: 3, growth: 10 },
      { role: "Sales Associate", count: 2, growth: 5 },
    ],
    keyJobTitles: ["VP of Sales", "Head of Data", "CEO"],
    buyingSignals: ["Evaluating CRM platforms", "Growing sales team"],
    competitorUsage: ["HubSpot"],
    socialPresence: { linkedin: "linkedin.com/company/greenleaf", twitter: "@greenleaf" },
    location: { city: "Austin", country: "US" },
  },
  swiftlogistics: {
    industry: "Logistics & Supply Chain",
    companySize: "1000-5000",
    employeeCount: 3200,
    fundingStage: "Series D",
    totalFunding: 120000000,
    technologies: ["Java", "Spring Boot", "Oracle", "Kafka", "SAP"],
    hiringActivity: [
      { role: "Logistics Coordinator", count: 15, growth: 8 },
      { role: "Software Engineer", count: 20, growth: 12 },
      { role: "Sales Director", count: 3, growth: 20 },
    ],
    keyJobTitles: ["Head of Operations", "VP of Sales", "CIO", "Digital Transformation Lead"],
    buyingSignals: [
      "RFP for sales automation platform",
      "Current Salesforce contract expiring",
      "Digital transformation initiative underway",
    ],
    competitorUsage: ["Salesforce", "Oracle CRM", "SAP Sales Cloud"],
    socialPresence: { linkedin: "linkedin.com/company/swiftlogistics", twitter: "@swiftlog" },
    location: { city: "Chicago", country: "US" },
  },
  quantumleap: {
    industry: "Artificial Intelligence / Machine Learning",
    companySize: "10-50",
    employeeCount: 28,
    fundingStage: "Pre-Seed",
    totalFunding: 500000,
    technologies: ["PyTorch", "TensorFlow", "Python", "GCP", "FastAPI"],
    hiringActivity: [
      { role: "ML Engineer", count: 5, growth: 50 },
      { role: "Founding Engineer", count: 2, growth: 100 },
    ],
    keyJobTitles: ["CEO", "CTO", "ML Lead"],
    buyingSignals: ["Building sales pipeline", "Seeking enterprise customers"],
    competitorUsage: [],
    socialPresence: { linkedin: "linkedin.com/company/quantumleap", twitter: "@quantumleap" },
    location: { city: "Berlin", country: "DE" },
  },
  atlas: {
    industry: "Manufacturing / Industrial",
    companySize: "10000+",
    employeeCount: 25000,
    fundingStage: "Public",
    totalFunding: 500000000,
    technologies: ["SAP", "IBM", "Java", "Cobol", "Mainframe"],
    hiringActivity: [
      { role: "Plant Manager", count: 5, growth: 2 },
      { role: "Supply Chain Analyst", count: 8, growth: 5 },
    ],
    keyJobTitles: ["Digital Transformation Lead", "VP of Supply Chain", "CIO"],
    buyingSignals: ["Legacy system modernization", "Exploring AI for operations"],
    competitorUsage: ["SAP CRM", "Oracle E-Business Suite"],
    socialPresence: { linkedin: "linkedin.com/company/atlasmfg", twitter: "@atlasmfg" },
    location: { city: "Detroit", country: "US" },
  },
};

function mockEnrich(input: LeadInput): EnrichmentData {
  const key = input.companyName.toLowerCase().replace(/[^a-z]/g, "");
  const base = MOCK_COMPANY_DB[key] || MOCK_COMPANY_DB.technova;
  const now = new Date().toISOString();

  return {
    companyName: input.companyName,
    website: input.website || `https://${input.companyName.toLowerCase().replace(/\s+/g, "")}.com`,
    industry: base.industry || input.industry || "Unknown",
    companySize: base.companySize || input.companySize || "Unknown",
    employeeCount: base.employeeCount || 0,
    fundingStage: base.fundingStage || "Unknown",
    totalFunding: base.totalFunding || 0,
    technologies: base.technologies || [],
    hiringActivity: base.hiringActivity || [],
    keyJobTitles: base.keyJobTitles || [],
    buyingSignals: base.buyingSignals || [],
    competitorUsage: base.competitorUsage || [],
    socialPresence: base.socialPresence || { linkedin: "", twitter: "" },
    location: base.location || { city: "Unknown", country: "Unknown" },
    confidence: 0.92,
    enrichedAt: now,
  };
}

export async function enrichLead(
  input: LeadInput,
  leadId: string
): Promise<EnrichmentData> {
  // Simulate API call delay
  await new Promise((r) => setTimeout(r, 300));

  const enrichment = mockEnrich(input);

  addAuditEntry(leadId, "enrichment_completed", "agent", {
    companyName: enrichment.companyName,
    industry: enrichment.industry,
    employeeCount: enrichment.employeeCount,
    technologies: enrichment.technologies,
    buyingSignals: enrichment.buyingSignals,
    confidence: enrichment.confidence,
  });

  return enrichment;
}

// Export for testing
export { MOCK_COMPANY_DB };