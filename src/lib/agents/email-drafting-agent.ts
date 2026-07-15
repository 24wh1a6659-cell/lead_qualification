// ============================================================================
// LeadPilot AI – Personalized Email Drafting Agent
// ============================================================================
// Generates highly personalized first-touch emails grounded only in verified
// enrichment data. Does NOT hallucinate facts.

import { v4 as uuidv4 } from "uuid";
import type { EnrichmentData, EmailStrategy, EmailDraft } from "../types";
import { addAuditEntry } from "../utils/audit-logger";

export async function draftEmail(
  enrichment: EnrichmentData,
  strategy: EmailStrategy,
  leadId: string
): Promise<EmailDraft> {
  await new Promise((r) => setTimeout(r, 300));

  const groundedIn: string[] = [
    `Company: ${enrichment.companyName}`,
    `Industry: ${enrichment.industry}`,
    `Company size: ${enrichment.companySize}`,
  ];

  if (enrichment.technologies.length > 0) {
    groundedIn.push(`Tech stack: ${enrichment.technologies.slice(0, 3).join(", ")}`);
  }
  if (enrichment.hiringActivity.length > 0) {
    groundedIn.push(`Hiring: ${enrichment.hiringActivity[0].role} (${enrichment.hiringActivity[0].count} openings)`);
  }
  if (enrichment.buyingSignals.length > 0) {
    groundedIn.push(`Buying signal: ${enrichment.buyingSignals[0]}`);
  }
  if (enrichment.competitorUsage.length > 0) {
    groundedIn.push(`Competitor usage: ${enrichment.competitorUsage[0]}`);
  }
  if (enrichment.fundingStage !== "Unknown") {
    groundedIn.push(`Funding: ${enrichment.fundingStage}`);
  }
  if (enrichment.location.city !== "Unknown") {
    groundedIn.push(`Location: ${enrichment.location.city}, ${enrichment.location.country}`);
  }
  if (enrichment.keyJobTitles.length > 0) {
    groundedIn.push(`Key roles: ${enrichment.keyJobTitles.slice(0, 2).join(", ")}`);
  }

  // Build email body from verified data only
  const greeting = `Hi there,`;

  const intro = `I noticed ${enrichment.companyName} is making waves in the ${enrichment.industry} space.`;

  const personalization = buildPersonalizationParagraph(enrichment, strategy);

  const valueProp = `\n\n${strategy.valueProposition}`;

  const callToAction = `\n\nWould you be open to a brief conversation to explore how we might help ${enrichment.companyName} achieve even better results? ${strategy.callToAction}.`;

  const closing = `\n\nLooking forward to connecting!\n\nBest regards,\nThe LeadPilot AI Team`;

  const body = `${greeting}\n\n${intro}${personalization}${valueProp}${callToAction}${closing}`;

  const draft: EmailDraft = {
    id: uuidv4(),
    version: 1,
    subject: strategy.subjectLineOptions[0],
    body,
    strategy,
    generatedAt: new Date().toISOString(),
    groundedIn,
    edits: [],
  };

  addAuditEntry(leadId, "email_drafted", "agent", {
    subject: draft.subject,
    version: draft.version,
    groundedInPoints: groundedIn.length,
  });

  return draft;
}

function buildPersonalizationParagraph(
  enrichment: EnrichmentData,
  strategy: EmailStrategy
): string {
  const parts: string[] = [];

  if (enrichment.technologies.length > 0) {
    const techs = enrichment.technologies.slice(0, 3);
    parts.push(`I see you're working with ${techs.join(", ")}`);
  }

  if (enrichment.hiringActivity.length > 0) {
    const topHire = enrichment.hiringActivity.sort((a, b) => b.count - a.count)[0];
    parts.push(`I noticed your team is expanding, particularly in ${topHire.role}`);
  }

  if (enrichment.competitorUsage.length > 0) {
    parts.push(`I understand you're currently using ${enrichment.competitorUsage[0]}`);
  }

  if (enrichment.buyingSignals.length > 0) {
    parts.push(`I also saw that you're ${enrichment.buyingSignals[0].toLowerCase()}`);
  }

  if (parts.length === 0) {
    parts.push(`I've been following ${enrichment.companyName}'s growth trajectory`);
  }

  return `\n\n${parts.join(". ")}.`;
}

export async function regenerateEmail(
  enrichment: EnrichmentData,
  strategy: EmailStrategy,
  leadId: string,
  previousDraft: EmailDraft
): Promise<EmailDraft> {
  // Rotate subject line
  const currentIndex = strategy.subjectLineOptions.indexOf(previousDraft.subject);
  const nextSubject = strategy.subjectLineOptions[(currentIndex + 1) % strategy.subjectLineOptions.length];

  const draft = await draftEmail(enrichment, strategy, leadId);
  draft.subject = nextSubject;

  addAuditEntry(leadId, "email_regenerated", "agent", {
    previousSubject: previousDraft.subject,
    newSubject: nextSubject,
    previousVersion: previousDraft.version,
    newVersion: previousDraft.version + 1,
  });

  return draft;
}