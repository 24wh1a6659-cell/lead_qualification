// ============================================================================
// LeadPilot AI – API: GET /api/analytics/dashboard
// ============================================================================

import { NextResponse } from "next/server";
import { computeDashboardAnalytics } from "@/lib/utils/analytics";
import type { ApiResponse } from "@/lib/types";

export async function GET() {
  try {
    const analytics = computeDashboardAnalytics();
    return NextResponse.json<ApiResponse>({ success: true, data: analytics });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to compute analytics" },
      { status: 500 }
    );
  }
}