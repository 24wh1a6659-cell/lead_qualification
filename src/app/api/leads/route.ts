// ============================================================================
// LeadPilot AI – API: POST /api/leads, GET /api/leads
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { LeadInputSchema } from "@/lib/types";
import { processLead } from "@/lib/orchestrator";
import { getAllLeads } from "@/lib/db/mock-db";
import type { ApiResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LeadInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.issues.map((e: { message: string }) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const lead = await processLead(parsed.data);

    return NextResponse.json<ApiResponse>(
      { success: true, data: lead, message: "Lead processed successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to process lead" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = getAllLeads();
    return NextResponse.json<ApiResponse>(
      { success: true, data: leads }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}