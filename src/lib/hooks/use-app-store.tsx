"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Lead, DashboardAnalytics, AuditEntry } from "@/lib/types";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface AppState {
  leads: Lead[];
  analytics: DashboardAnalytics | null;
  auditLog: AuditEntry[];
  loading: boolean;
  error: string | null;
  refreshTrigger: number;
}

interface AppContextType extends AppState {
  refreshLeads: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  refreshAuditLog: () => Promise<void>;
  refreshAll: () => Promise<void>;
  createLead: (input: Record<string, unknown>) => Promise<ApiResponse<Lead>>;
  approveLead: (id: string, approvedBy?: string) => Promise<ApiResponse<Lead>>;
  rejectLead: (id: string, reason: string, rejectedBy?: string) => Promise<ApiResponse<Lead>>;
  regenerateEmail: (id: string) => Promise<ApiResponse<Lead>>;
  updateLead: (id: string, data: Record<string, unknown>) => Promise<ApiResponse<Lead>>;
  deleteLead: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/leads");
      const json: ApiResponse<Lead[]> = await res.json();
      if (json.success && json.data) {
        setLeads(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch leads:", e);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics");
      const json: ApiResponse<DashboardAnalytics> = await res.json();
      if (json.success && json.data) {
        setAnalytics(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch analytics:", e);
    }
  }, []);

  const fetchAuditLog = useCallback(async () => {
    try {
      const res = await fetch("/api/audit-log");
      const json: ApiResponse<AuditEntry[]> = await res.json();
      if (json.success && json.data) {
        setAuditLog(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch audit log:", e);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchLeads(), fetchAnalytics(), fetchAuditLog()]);
    setLoading(false);
    setRefreshTrigger((prev) => prev + 1);
  }, [fetchLeads, fetchAnalytics, fetchAuditLog]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const createLead = useCallback(async (input: Record<string, unknown>) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const json: ApiResponse<Lead> = await res.json();
    if (json.success) {
      await refreshAll();
    }
    return json;
  }, [refreshAll]);

  const approveLead = useCallback(async (id: string, approvedBy?: string) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", approvedBy: approvedBy || "Human User" }),
    });
    const json: ApiResponse<Lead> = await res.json();
    if (json.success) {
      await refreshAll();
    }
    return json;
  }, [refreshAll]);

  const rejectLead = useCallback(async (id: string, reason: string, rejectedBy?: string) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", rejectedBy: rejectedBy || "Human User", reason }),
    });
    const json: ApiResponse<Lead> = await res.json();
    if (json.success) {
      await refreshAll();
    }
    return json;
  }, [refreshAll]);

  const regenerateEmail = useCallback(async (id: string) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "regenerate-email" }),
    });
    const json: ApiResponse<Lead> = await res.json();
    if (json.success) {
      await refreshAll();
    }
    return json;
  }, [refreshAll]);

  const updateLead = useCallback(async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", ...data }),
    });
    const json: ApiResponse<Lead> = await res.json();
    if (json.success) {
      await refreshAll();
    }
    return json;
  }, [refreshAll]);

  const deleteLead = useCallback(async (id: string) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "DELETE",
    });
    const json: ApiResponse<unknown> = await res.json();
    if (json.success) {
      await refreshAll();
      return true;
    }
    return false;
  }, [refreshAll]);

  const value: AppContextType = {
    leads,
    analytics,
    auditLog,
    loading,
    error,
    refreshTrigger,
    refreshLeads: fetchLeads,
    refreshAnalytics: fetchAnalytics,
    refreshAuditLog: fetchAuditLog,
    refreshAll,
    createLead,
    approveLead,
    rejectLead,
    regenerateEmail,
    updateLead,
    deleteLead,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}