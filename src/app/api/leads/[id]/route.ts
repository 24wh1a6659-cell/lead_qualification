"use server";

import { NextRequest, NextResponse } from "next/server";
import { getLead, updateLead, getAllLeads, getAllCrmRecords } from "@/lib/db/mock-db";
import { approveLead, rejectLead } from "@/lib/orchestrator";
import { addAuditEntry } from "@/lib/utils/audit-logger";
import { regenerateEmail } from "@/lib/agents/email-drafting-agent";
import type { ApiResponse, EmailDraft, EmailEdit, Lead } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = getLead(id);
    if (!lead) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>({ success: true, data: lead });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, approvedBy, rejectedBy, reason } = body;

    switch (action) {
      case "approve": {
        const lead = await approveLead(id, approvedBy || "Human User");
        if (!lead) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: "Lead not found" },
            { status: 404 }
          );
        }
        return NextResponse.json<ApiResponse>({
          success: true,
          data: lead,
          message: "Lead approved and CRM updated",
        });
      }

      case "reject": {
        const lead = await rejectLead(id, rejectedBy || "Human User", reason || "No reason provided");
        if (!lead) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: "Lead not found" },
            { status: 404 }
          );
        }
        return NextResponse.json<ApiResponse>({
          success: true,
          data: lead,
          message: "Lead rejected",
        });
      }

      case "regenerate-email": {
        const lead = getLead(id);
        if (!lead || !lead.enrichment || !lead.emailStrategy || !lead.emailDraft) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: "Lead not found or not ready for email regeneration" },
            { status: 400 }
          );
        }
        const newDraft = await regenerateEmail(
          lead.enrichment,
          lead.emailStrategy,
          id,
          lead.emailDraft
        );
        const updated = updateLead(id, { emailDraft: newDraft });
        return NextResponse.json<ApiResponse>({
          success: true,
          data: updated,
          message: "Email regenerated",
        });
      }

      case "edit-email": {
        const lead = getLead(id);
        if (!lead || !lead.emailDraft) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: "Lead not found or no email draft exists" },
            { status: 400 }
          );
        }
        const { subject: newSubject, body: newBody, editedBy: editor } = body;
        if (!newSubject || !newBody) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: "Subject and body are required" },
            { status: 400 }
          );
        }
        const edit: EmailEdit = {
          editedAt: new Date().toISOString(),
          editedBy: editor || "Human User",
          previousSubject: lead.emailDraft.subject,
          previousBody: lead.emailDraft.body,
          newSubject,
          newBody,
          reason: "Manual edit",
        };
        const newDraft: EmailDraft = {
          ...lead.emailDraft,
          subject: newSubject,
          body: newBody,
          version: lead.emailDraft.version + 1,
          edits: [...lead.emailDraft.edits, edit],
        };
        const updated = updateLead(id, { emailDraft: newDraft });
        addAuditEntry(id, "email_edited", "human", {
          editedBy: editor || "Human User",
          version: newDraft.version,
        });
        return NextResponse.json<ApiResponse>({
          success: true,
          data: updated,
          message: "Email draft updated",
        });
      }

      case "update": {
        const lead = getLead(id);
        if (!lead) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: "Lead not found" },
            { status: 404 }
          );
        }
        const { input, ...rest } = body;
        const updated = updateLead(id, { ...rest, input: input ? { ...lead.input, ...input } : lead.input });
        return NextResponse.json<ApiResponse>({
          success: true,
          data: updated,
          message: "Lead updated successfully",
        });
      }

      default:
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Unknown action" },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Operation failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = getLead(id);
    if (!lead) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }
    // Remove from in-memory store by marking as archived
    updateLead(id, { status: "archived" });
    addAuditEntry(id, "lead_created", "system", { action: "deleted", archivedAt: new Date().toISOString() });
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}