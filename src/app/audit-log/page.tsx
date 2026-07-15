"use client";

import { useAuditLog } from "@/lib/hooks/use-leads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FileText,
  Search,
  Activity,
  RefreshCw,
  Clock,
  Filter,
  ChevronDown,
  User,
  Bot,
  Monitor,
} from "lucide-react";

const ACTION_FILTERS = [
  "all",
  "lead_created",
  "enrichment_completed",
  "icp_scored",
  "lead_approved",
  "lead_rejected",
  "email_drafted",
  "crm_updated",
];

export default function AuditLogPage() {
  const { auditLog, loading, refetch } = useAuditLog();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.leadId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === "all" || entry.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 rounded-2xl" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Log</h1>
          <p className="text-sm text-white/40 mt-1">
            Complete trace of all system actions and decisions
          </p>
        </div>
        <Button variant="outline" onClick={refetch} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search by action, actor, or lead ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Actions
            <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10 mt-3">
              {ACTION_FILTERS.map((action) => (
                <button
                  key={action}
                  onClick={() => setActionFilter(action)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    actionFilter === action
                      ? "bg-white/15 text-white"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                  }`}
                >
                  {action === "all" ? "All" : action.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">
          <span className="text-white/80 font-medium">{filteredLog.length}</span> events
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        {filteredLog.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white/60 mb-2">No audit entries</h3>
            <p className="text-sm text-white/40">System activity will appear here.</p>
          </motion.div>
        ) : (
          filteredLog.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="glass rounded-xl p-3 flex items-start gap-3"
            >
              {/* Timeline Indicator */}
              <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  entry.actor === "system" || entry.actor === "agent"
                    ? "bg-blue-500/20"
                    : entry.action.includes("approved")
                      ? "bg-emerald-500/20"
                      : entry.action.includes("rejected")
                        ? "bg-red-500/20"
                        : "bg-white/5"
                }`}>
                  {entry.actor === "system" || entry.actor === "agent" ? (
                    <Bot className="h-4 w-4 text-blue-400" />
                  ) : (
                    <User className="h-4 w-4 text-white/60" />
                  )}
                </div>
                {i < filteredLog.length - 1 && (
                  <div className="w-px flex-1 bg-white/5 mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/80 capitalize">
                      {entry.action.replace(/_/g, " ")}
                    </span>
                    <Badge
                      variant={
                        entry.actor === "system" || entry.actor === "agent"
                          ? "info"
                          : "default"
                      }
                      size="sm"
                    >
                      {entry.actor}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-white/30 whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-white/30 font-mono">
                    Lead: {entry.leadId.slice(0, 8)}...
                  </span>
                </div>
                {entry.details && Object.keys(entry.details).length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {Object.entries(entry.details).slice(0, 3).map(([key, value]) => (
                      <Badge key={key} variant="outline" size="sm">
                        {key}: {String(value).slice(0, 30)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}