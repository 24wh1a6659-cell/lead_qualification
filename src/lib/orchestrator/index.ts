// ============================================================================
// LeadPilot AI – Orchestrator / Workflow Engine
// ============================================================================
// Implements the full pipeline: Enrich → Score → Classify → Route → Draft → Approve → CRM

import type { Lead, LeadInput, RoutingDecision } from "../types";
import { enrichLead } from "../agents/enrichment-agent";
import { detectBuyingSignals } from "../agents/buying-signal-agent";
import { scoreICP } from "../agents/icp-scoring-agent";
import { validateFairness } from "../agents/fairness-agent";
import { detectPromptInjection } from "../agents/prompt-injection-agent";
import { predictRevenue } from "../agents/revenue-agent";
import { planEmailStrategy } from "../agents/email-strategy-agent";
import { draftEmail } from "../agents/email-drafting-agent";
import { createLead, getLead, updateLead, createCrmRecord } from "../db/mock-db";
import { addAuditEntry } from "../utils/audit-logger";

export async function processLead(input: LeadInput): Promise<Lead> {
  // Step 1: Create lead record
  const lead = createLead(input);
  const leadId = lead.id;

  try {
    // Step 2: Update status to enriching
    await updateLead(leadId, { status: "enriching" });

    // Step 3: Enrichment Agent
    const enrichment = await enrichLead(input, leadId);
    await updateLead(leadId, { enrichment });
    addAuditEntry(leadId, "enrichment_completed", "agent", {
      companyName: enrichment.companyName,
      industry: enrichment.industry,
    });

    // Step 4: Buying Signal Detection
    const signalResult = await detectBuyingSignals(enrichment, leadId);
    await updateLead(leadId, { buyingSignals: signalResult.signals });

    // Step 5: ICP Scoring
    await updateLead(leadId, { status: "scoring" });
    const icpScore = await scoreICP(input, enrichment, signalResult.score, leadId);
    await updateLead(leadId, { icpScore, classification: icpScore.classification });

    // Step 6: Fairness Validation
    const fairnessReport = await validateFairness(input, icpScore, leadId);
    await updateLead(leadId, { fairnessReport });

    // Step 7: Prompt Injection Detection
    const injectionResult = await detectPromptInjection(
      input as unknown as Record<string, unknown>,
      leadId
    );
    await updateLead(leadId, { promptInjection: injectionResult });

    // Step 8: Revenue Prediction
    const revenuePrediction = await predictRevenue(
      enrichment,
      icpScore,
      signalResult.score,
      leadId
    );
    await updateLead(leadId, { revenuePrediction });

    // Step 9: Classification & Routing
    await updateLead(leadId, { status: "classified" });
    let routing: RoutingDecision;

    switch (icpScore.classification) {
      case "Hot":
        routing = {
          route: "approval",
          reason: `Hot lead scored ${icpScore.overall}/100. Requires human approval before proceeding.`,
          routedAt: new Date().toISOString(),
        };
        break;
      case "Nurture":
        routing = {
          route: "nurture_sequence",
          reason: `Nurture lead scored ${icpScore.overall}/100. Adding to automated nurture sequence.`,
          routedAt: new Date().toISOString(),
        };
        break;
      case "Disqualify":
        routing = {
          route: "archive",
          reason: `Disqualified lead scored ${icpScore.overall}/100. ${icpScore.reasoning}`,
          routedAt: new Date().toISOString(),
        };
        break;
    }

    await updateLead(leadId, { routing });

    // Step 10: Email Strategy & Drafting (for Hot leads)
    if (icpScore.classification === "Hot") {
      await updateLead(leadId, { status: "drafting" });
      const emailStrategy = await planEmailStrategy(enrichment, revenuePrediction, leadId);
      const emailDraft = await draftEmail(enrichment, emailStrategy, leadId);
      await updateLead(leadId, {
        emailStrategy,
        emailDraft,
        status: "awaiting_approval",
      });
      addAuditEntry(leadId, "approval_requested", "system", {
        classification: "Hot",
        requiresHumanApproval: true,
      });
    } else if (icpScore.classification === "Nurture") {
      // Auto-nurture: generate strategy but no email draft needed
      const emailStrategy = await planEmailStrategy(enrichment, revenuePrediction, leadId);
      await updateLead(leadId, {
        emailStrategy,
        status: "approved", // Auto-approved for nurture
      });
    } else {
      // Disqualified: archive
      await updateLead(leadId, { status: "archived" });
      addAuditEntry(leadId, "lead_approved", "system", {
        action: "archived",
        classification: "Disqualify",
        reason: routing.reason,
      });
    }

    return (await getLead(leadId)) as Lead;
  } catch (error) {
    console.error(`Pipeline error for lead ${leadId}:`, error);
    await updateLead(leadId, { status: "pending" });
    addAuditEntry(leadId, "lead_created", "system", {
      error: String(error),
      status: "failed",
    });
    return (await getLead(leadId)) as Lead;
  }
}

export async function approveLead(leadId: string, approvedBy: string): Promise<Lead | undefined> {
  const lead = getLead(leadId);
  if (!lead) return undefined;

  await updateLead(leadId, {
    approval: {
      approved: true,
      approvedBy,
      approvedAt: new Date().toISOString(),
      rejectionReason: null,
    },
    status: "approved",
  });

  addAuditEntry(leadId, "lead_approved", "human", {
    approvedBy,
    action: "approved",
  });

  // Update CRM
  const updatedLead = getLead(leadId);
  if (updatedLead) {
    const crmRecord = createCrmRecord(updatedLead);
    await updateLead(leadId, {
      crmUpdate: {
        updated: true,
        updatedAt: new Date().toISOString(),
        crmId: crmRecord.id,
      },
      status: "crm_updated",
    });
    addAuditEntry(leadId, "crm_updated", "system", {
      crmId: crmRecord.id,
      dealValue: crmRecord.dealValue,
    });
  }

  return getLead(leadId);
}

export async function rejectLead(
  leadId: string,
  rejectedBy: string,
  reason: string
): Promise<Lead | undefined> {
  const lead = getLead(leadId);
  if (!lead) return undefined;

  await updateLead(leadId, {
    approval: {
      approved: false,
      approvedBy: rejectedBy,
      approvedAt: new Date().toISOString(),
      rejectionReason: reason,
    },
    status: "rejected",
  });

  addAuditEntry(leadId, "lead_rejected", "human", {
    rejectedBy,
    reason,
    action: "rejected",
  });

  return getLead(leadId);
}