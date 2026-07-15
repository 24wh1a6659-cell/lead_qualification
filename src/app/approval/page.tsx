"use client";

import { useState } from "react";
import { useLeads } from "@/lib/hooks/use-leads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Mail,
  Globe,
  Users as UsersIcon,
  TrendingUp,
  Target,
  Sparkles,
  FileText,
  Send,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import type { Lead } from "@/lib/types";

export default function ApprovalPage() {
  const { leads, loading, approveLead, rejectLead, regenerateEmail } = useLeads();
  const [rejectionModal, setRejectionModal] = useState<{ lead: Lead; open: boolean } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingLeads = leads.filter((l) => l.status === "awaiting_approval");
  const approvedLeads = leads.filter((l) => l.approval.approved === true);
  const rejectedLeads = leads.filter((l) => l.approval.approved === false);

  const handleApprove = async (id: string) => {
    await approveLead(id, "Human User");
  };

  const handleReject = async (lead: Lead) => {
    if (!rejectionReason.trim()) return;
    await rejectLead(lead.id, rejectionReason, "Human User");
    setRejectionModal(null);
    setRejectionReason("");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
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
          <h1 className="text-2xl font-bold text-white">Approval Queue</h1>
          <p className="text-sm text-white/40 mt-1">
            Review and approve AI-generated lead assessments and email drafts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" size="lg">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {pendingLeads.length} pending
          </Badge>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingLeads.length}</p>
              <p className="text-xs text-white/40">Pending Review</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20">
              <ThumbsUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{approvedLeads.length}</p>
              <p className="text-xs text-white/40">Approved</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20">
              <ThumbsDown className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{rejectedLeads.length}</p>
              <p className="text-xs text-white/40">Rejected</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pending Leads */}
      <div className="space-y-4">
        {pendingLeads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <CheckCircle2 className="h-12 w-12 text-emerald-400/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white/60 mb-2">All caught up!</h3>
            <p className="text-sm text-white/40">No leads pending approval right now.</p>
          </motion.div>
        ) : (
          pendingLeads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5"
            >
              {/* Lead Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <Building2 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{lead.input.companyName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-white/40">{lead.enrichment?.industry}</span>
                      {lead.icpScore && (
                        <>
                          <span className="text-white/20">·</span>
                          <span className="text-xs font-mono text-white/40">
                            Score: {lead.icpScore.overall}/100
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant="hot" size="lg">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Hot Lead
                </Badge>
              </div>

              {/* AI Summary */}
              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                <div className="glass rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs font-medium text-white/50">ICP Assessment</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {lead.icpScore?.reasoning || "No assessment available."}
                  </p>
                </div>
                <div className="glass rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs font-medium text-white/50">Revenue Projection</span>
                  </div>
                  {lead.revenuePrediction ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-emerald-400">
                        ${lead.revenuePrediction.expectedRevenue.toLocaleString()} expected
                      </p>
                      <p className="text-xs text-white/40">
                        {lead.revenuePrediction.closeProbability}% close probability · {lead.revenuePrediction.timeToClose}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-white/30">No projection available.</p>
                  )}
                </div>
              </div>

              {/* Email Draft Preview */}
              {lead.emailDraft && (
                <div className="glass rounded-xl p-4 mb-4 border border-blue-500/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-white/70">AI-Generated Email Draft</span>
                    </div>
                    <Badge variant="info" size="sm">v{lead.emailDraft.version}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/40">Subject:</span>
                      <span className="text-xs text-white/80">{lead.emailDraft.subject}</span>
                    </div>
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">
                        {lead.emailDraft.body.length > 300
                          ? lead.emailDraft.body.slice(0, 300) + "..."
                          : lead.emailDraft.body}
                      </p>
                    </div>
                  </div>
                  {/* Personalization Points */}
                  {lead.emailStrategy && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {lead.emailStrategy.personalizationPoints.slice(0, 3).map((point, i) => (
                        <Badge key={i} variant="outline" size="sm">
                          {point}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => regenerateEmail(lead.id)}
                  className="gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectionModal({ lead, open: true })}
                  className="gap-1.5 text-red-400 hover:text-red-300 border-red-500/20 hover:bg-red-500/10"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(lead.id)}
                  className="gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve & Send to CRM
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Rejection Modal */}
      <AnimatePresence>
        {rejectionModal && rejectionModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setRejectionModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Reject Lead</h2>
                  <p className="text-xs text-white/40">{rejectionModal.lead.input.companyName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-white/50 mb-1 block">Reason for rejection *</label>
                  <textarea
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all duration-200 min-h-[100px] resize-none"
                    placeholder="Explain why this lead should be rejected..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => { setRejectionModal(null); setRejectionReason(""); }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleReject(rejectionModal.lead)}
                    disabled={!rejectionReason.trim()}
                    className="flex-1 gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Lead
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}