"use server";
// ============================================================================
// LeadPilot AI – API: GET /api/audit-log
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getFullAuditLog, getAuditLog } from "@/lib/utils/audit-logger";
import type { ApiResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const leadId = request.nextUrl.searchParams.get("leadId");
    const logs = leadId ? getAuditLog(leadId) : getFullAuditLog();
    return NextResponse.json<ApiResponse>({ success: true, data: logs });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch audit log" },
      { status: 500 }
    );
  }
}