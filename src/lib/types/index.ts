import { z } from "zod";

// ─── Lead Input ──────────────────────────────────────────────────────────────

export const LeadInputSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().optional().or(z.literal("")),
  industry: z.string().optional().or(z.literal("")),
  companySize: z.string().optional().or(z.literal("")),
  jobTitle: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  formSource: z.string().optional().or(z.literal("")),
  rawSubmission: z.string().optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof LeadInputSchema>;

// ─── Enrichment Data ─────────────────────────────────────────────────────────

export interface EnrichmentData {
  companyName: string;
  website: string;
  industry: string;
  companySize: string;
  employeeCount: number;
  fundingStage: string;
  totalFunding: number;
  technologies: string[];
  hiringActivity: { role: string; count: number; growth: number }[];
  keyJobTitles: string[];
  buyingSignals: string[];
  competitorUsage: string[];
  socialPresence: { linkedin: string; twitter: string };
  location: { city: string; country: string };
  confidence: number;
  enrichedAt: string;
}

// ─── ICP Score ───────────────────────────────────────────────────────────────

export interface ICPFactor {
  name: string;
  score: number;
  weight: number;
  evidence: string;
}

export interface ICPScore {
  overall: number;
  confidence: number;
  factors: ICPFactor[];
  classification: "Hot" | "Nurture" | "Disqualify";
  reasoning: string;
  scoredAt: string;
}

// ─── Fairness Report ─────────────────────────────────────────────────────────

export interface FairnessReport {
  sensitiveAttributesChecked: string[];
  attributesStripped: string[];
  isFair: boolean;
  equivalentScoreTest: {
    inputA: Record<string, unknown>;
    inputB: Record<string, unknown>;
    scoreA: number;
    scoreB: number;
    match: boolean;
  };
  biasScore: number;
  generatedAt: string;
}

// ─── Prompt Injection Result ─────────────────────────────────────────────────

export interface PromptInjectionResult {
  isInjection: boolean;
  confidence: number;
  detectedPattern: string | null;
  sanitizedInput: string;
  riskLevel: "none" | "low" | "medium" | "high" | "critical";
}

// ─── Revenue Prediction ──────────────────────────────────────────────────────

export interface RevenuePrediction {
  dealSize: { min: number; max: number; expected: number; currency: string };
  closeProbability: number;
  expectedRevenue: number;
  urgency: "low" | "medium" | "high" | "immediate";
  bestChannel: "email" | "phone" | "linkedin" | "in-person" | "video";
  timeToClose: string;
  confidence: number;
  reasoning: string;
}

// ─── Email Strategy ──────────────────────────────────────────────────────────

export interface EmailStrategy {
  tone: "professional" | "friendly" | "consultative" | "direct";
  personalizationPoints: string[];
  valueProposition: string;
  callToAction: string;
  bestTimeToSend: string;
  subjectLineOptions: string[];
}

// ─── Email Draft ─────────────────────────────────────────────────────────────

export interface EmailDraft {
  id: string;
  version: number;
  subject: string;
  body: string;
  strategy: EmailStrategy;
  generatedAt: string;
  groundedIn: string[];
  edits: EmailEdit[];
}

export interface EmailEdit {
  editedAt: string;
  editedBy: string;
  previousSubject: string;
  previousBody: string;
  newSubject: string;
  newBody: string;
  reason: string;
}

// ─── Lead Status & Routing ──────────────────────────────────────────────────

export type LeadStatus =
  | "pending"
  | "enriching"
  | "scoring"
  | "classified"
  | "drafting"
  | "awaiting_approval"
  | "approved"
  | "rejected"
  | "archived"
  | "crm_updated"
  | "email_sent";

export type LeadClassification = "Hot" | "Nurture" | "Disqualify";

export interface RoutingDecision {
  route: "approval" | "nurture_sequence" | "archive";
  reason: string;
  routedAt: string;
}

// ─── Audit Log ───────────────────────────────────────────────────────────────

export type AuditAction =
  | "lead_created"
  | "enrichment_completed"
  | "buying_signal_detected"
  | "icp_scored"
  | "fairness_validated"
  | "prompt_injection_checked"
  | "revenue_predicted"
  | "email_strategy_planned"
  | "email_drafted"
  | "email_edited"
  | "email_regenerated"
  | "approval_requested"
  | "lead_approved"
  | "lead_rejected"
  | "crm_updated"
  | "email_sent"
  | "meeting_booked"
  | "follow_up_generated"
  | "feedback_recorded"
  | "rescored"
  | "coaching_recommended";

export interface AuditEntry {
  id: string;
  leadId: string;
  action: AuditAction;
  timestamp: string;
  actor: "system" | "human" | "agent";
  details: Record<string, unknown>;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
}

// ─── Complete Lead ───────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  input: LeadInput;
  enrichment: EnrichmentData | null;
  buyingSignals: string[];
  icpScore: ICPScore | null;
  fairnessReport: FairnessReport | null;
  promptInjection: PromptInjectionResult | null;
  revenuePrediction: RevenuePrediction | null;
  emailStrategy: EmailStrategy | null;
  emailDraft: EmailDraft | null;
  status: LeadStatus;
  classification: LeadClassification | null;
  routing: RoutingDecision | null;
  approval: {
    approved: boolean | null;
    approvedBy: string | null;
    approvedAt: string | null;
    rejectionReason: string | null;
  };
  crmUpdate: {
    updated: boolean;
    updatedAt: string | null;
    crmId: string | null;
  };
  auditLog: AuditEntry[];
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard Analytics ─────────────────────────────────────────────────────

export interface DashboardAnalytics {
  totalLeads: number;
  hotLeads: number;
  nurtureLeads: number;
  disqualifiedLeads: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
  sqlConversionRate: number;
  responseRate: number;
  approvalRate: number;
  totalRevenuePotential: number;
  timeSavedMinutes: number;
  leadDistribution: { classification: string; count: number }[];
  processingTimeline: { date: string; count: number }[];
  recentActivity: AuditEntry[];
}

// ─── Mock CRM Data ───────────────────────────────────────────────────────────

export interface CrmRecord {
  id: string;
  leadId: string;
  companyName: string;
  contactEmail: string;
  status: string;
  dealValue: number;
  probability: number;
  expectedRevenue: number;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
