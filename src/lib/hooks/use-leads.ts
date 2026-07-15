"use client";

import { useState, useEffect, useCallback } from "react";
import type { Lead, DashboardAnalytics, AuditEntry } from "@/lib/types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const json: ApiResponse<Lead[]> = await res.json();
      if (json.success && json.data) {
        setLeads(json.data);
      } else {
        setError(json.error || "Failed to fetch leads");
      }
    } catch {
      setError("Network error fetching leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const createLead = useCallback(async (input: Record<string, unknown>) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const json: ApiResponse<Lead> = await res.json();
    if (json.success && json.data) {
      setLeads((prev) => [json.data!, ...prev]);
    }
    return json;
  }, []);

  const approveLead = useCallback(async (id: string, approvedBy?: string) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", approvedBy: approvedBy || "Human User" }),
    });
    const json: ApiResponse<Lead> = await res.json();
    if (json.success && json.data) {
      setLeads((prev) => prev.map((l) => (l.id === id ? json.data! : l)));
    }
    return json;
  }, []);

  const rejectLead = useCallback(async (id: string, reason: string, rejectedBy?: string) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", rejectedBy: rejectedBy || "Human User", reason }),
    });
    const json: ApiResponse<Lead> = await res.json();
    if (json.success && json.data) {
      setLeads((prev) => prev.map((l) => (l.id === id ? json.data! : l)));
    }
    return json;
  }, []);

  const regenerateEmail = useCallback(async (id: string) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "regenerate-email" }),
    });
    const json: ApiResponse<Lead> = await res.json();
    if (json.success && json.data) {
      setLeads((prev) => prev.map((l) => (l.id === id ? json.data! : l)));
    }
    return json;
  }, []);

  return { leads, loading, error, refetch: fetchLeads, createLead, approveLead, rejectLead, regenerateEmail };
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        const json: ApiResponse<DashboardAnalytics> = await res.json();
        if (json.success && json.data) setAnalytics(json.data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return { analytics, loading };
}

export function useAuditLog() {
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/audit-log");
      const json: ApiResponse<AuditEntry[]> = await res.json();
      if (json.success && json.data) setAuditLog(json.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLog(); }, [fetchLog]);

  return { auditLog, loading, refetch: fetchLog };
}

export function useFairnessReport() {
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch("/api/fairness-report");
        const json: ApiResponse<Record<string, unknown>> = await res.json();
        if (json.success && json.data) setReport(json.data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  return { report, loading };
}