// ============================================================================
// LeadPilot AI – API: GET /api/fairness-report
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getLead, getAllLeads } from "@/lib/db/mock-db";
import type { ApiResponse, FairnessReport } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const leadId = request.nextUrl.searchParams.get("leadId");
    if (leadId) {
      const lead = getLead(leadId);
      if (!lead) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Lead not found" },
          { status: 404 }
        );
      }
      return NextResponse.json<ApiResponse>({
        success: true,
        data: lead.fairnessReport || { error: "No fairness report generated" },
      });
    }

    // Return all fairness reports
    const leads = getAllLeads();
    const reports = leads
      .filter((l) => l.fairnessReport)
      .map((l) => ({
        leadId: l.id,
        companyName: l.enrichment?.companyName || l.input.companyName,
        report: l.fairnessReport,
      }));

    return NextResponse.json<ApiResponse>({ success: true, data: reports });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch fairness report" },
      { status: 500 }
    );
  }
}