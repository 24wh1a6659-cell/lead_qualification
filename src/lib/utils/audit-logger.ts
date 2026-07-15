// ============================================================================
// LeadPilot AI – Audit Logger
// ============================================================================

import { v4 as uuidv4 } from "uuid";
import type { AuditEntry, AuditAction } from "../types";

// In-memory audit store (would be a database in production)
const auditStore: AuditEntry[] = [];

export function addAuditEntry(
  leadId: string,
  action: AuditAction,
  actor: AuditEntry["actor"],
  details: Record<string, unknown> = {},
  previousState?: Record<string, unknown>,
  newState?: Record<string, unknown>
): AuditEntry {
  const entry: AuditEntry = {
    id: uuidv4(),
    leadId,
    action,
    timestamp: new Date().toISOString(),
    actor,
    details,
    previousState,
    newState,
  };
  auditStore.push(entry);
  return entry;
}

export function getAuditLog(
  leadId?: string,
  limit = 100,
  offset = 0
): AuditEntry[] {
  let filtered = auditStore;
  if (leadId) {
    filtered = filtered.filter((e) => e.leadId === leadId);
  }
  return filtered
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(offset, offset + limit);
}

export function getFullAuditLog(): AuditEntry[] {
  return [...auditStore].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function clearAuditLog(): void {
  auditStore.length = 0;
}