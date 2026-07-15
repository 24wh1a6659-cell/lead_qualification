// ============================================================================
// LeadPilot AI – Analytics Engine
// ============================================================================

import type { DashboardAnalytics, Lead } from "../types";
import { getAllLeads } from "../db/mock-db";
import { getFullAuditLog } from "./audit-logger";

export function computeDashboardAnalytics(): DashboardAnalytics {
  const leads = getAllLeads();
  const auditLog = getFullAuditLog();

  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.classification === "Hot").length;
  const nurtureLeads = leads.filter((l) => l.classification === "Nurture").length;
  const disqualifiedLeads = leads.filter((l) => l.classification === "Disqualify").length;
  const pendingApproval = leads.filter((l) => l.status === "awaiting_approval").length;
  const approved = leads.filter((l) => l.approval.approved === true).length;
  const rejected = leads.filter((l) => l.approval.approved === false).length;

  const totalApprovalDecisions = approved + rejected;
  const approvalRate = totalApprovalDecisions > 0
    ? Math.round((approved / totalApprovalDecisions) * 100)
    : 0;

  const totalRevenuePotential = leads.reduce(
    (sum, l) => sum + (l.revenuePrediction?.expectedRevenue || 0),
    0
  );

  // SQL conversion rate: leads that moved to CRM
  const crmUpdated = leads.filter((l) => l.crmUpdate.updated).length;
  const sqlConversionRate = totalLeads > 0
    ? Math.round((crmUpdated / totalLeads) * 100)
    : 0;

  // Response rate (mock: based on approved leads)
  const responseRate = approved > 0
    ? Math.min(Math.round((approved / totalLeads) * 100) + 15, 100)
    : 0;

  // Time saved: each lead processed saves ~5 minutes of manual work
  const timeSavedMinutes = totalLeads * 5;

  // Lead distribution
  const leadDistribution = [
    { classification: "Hot", count: hotLeads },
    { classification: "Nurture", count: nurtureLeads },
    { classification: "Disqualify", count: disqualifiedLeads },
  ];

  // Processing timeline (last 7 days)
  const timelineMap = new Map<string, number>();
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    timelineMap.set(key, 0);
  }
  leads.forEach((l) => {
    const date = l.createdAt.split("T")[0];
    if (timelineMap.has(date)) {
      timelineMap.set(date, (timelineMap.get(date) || 0) + 1);
    }
  });
  const processingTimeline = Array.from(timelineMap.entries()).map(
    ([date, count]) => ({ date, count })
  );

  return {
    totalLeads,
    hotLeads,
    nurtureLeads,
    disqualifiedLeads,
    pendingApproval,
    approved,
    rejected,
    sqlConversionRate,
    responseRate,
    approvalRate,
    totalRevenuePotential,
    timeSavedMinutes,
    leadDistribution,
    processingTimeline,
    recentActivity: auditLog.slice(0, 10),
  };
}