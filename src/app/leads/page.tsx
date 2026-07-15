"use client";

import { useState } from "react";
import { useLeads } from "@/lib/hooks/use-leads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Plus,
  Building2,
  Globe,
  Mail,
  Phone,
  TrendingUp,
  Target,
  Sparkles,
  X,
  ChevronDown,
  Eye,
  ExternalLink,
} from "lucide-react";
import type { Lead } from "@/lib/types";

const STATUS_FILTERS = ["all", "pending", "enriching", "scoring", "classified", "awaiting_approval", "approved", "rejected", "archived", "crm_updated"];
const CLASSIFICATION_FILTERS = ["all", "Hot", "Nurture", "Disqualify"];

export default function LeadsPage() {
  const { leads, loading, createLead } = useLeads();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classificationFilter, setClassificationFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchQuery === "" ||
      lead.input.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.input.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.enrichment?.industry?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesClassification =
      classificationFilter === "all" || lead.classification === classificationFilter;

    return matchesSearch && matchesStatus && matchesClassification;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
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
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-sm text-white/40 mt-1">
            Manage and monitor all your leads in one place
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Lead
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
              placeholder="Search by company, email, or industry..."
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
            Filters
            <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 pt-3 border-t border-white/10 mt-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Status</label>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_FILTERS.map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          statusFilter === status
                            ? "bg-white/15 text-white"
                            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                        }`}
                      >
                        {status === "all" ? "All" : status.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Classification</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CLASSIFICATION_FILTERS.map((cls) => (
                      <button
                        key={cls}
                        onClick={() => setClassificationFilter(cls)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          classificationFilter === cls
                            ? "bg-white/15 text-white"
                            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                        }`}
                      >
                        {cls === "all" ? "All" : cls}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">
          Showing <span className="text-white/80 font-medium">{filteredLeads.length}</span> of{" "}
          <span className="text-white/80 font-medium">{leads.length}</span> leads
        </p>
        <Badge variant="info" size="sm">
          {leads.filter((l) => l.classification === "Hot").length} hot
        </Badge>
      </div>

      {/* Lead Cards */}
      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <Users className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white/60 mb-2">No leads found</h3>
            <p className="text-sm text-white/40 mb-4">
              {leads.length === 0
                ? "Get started by adding your first lead."
                : "Try adjusting your search or filters."}
            </p>
            {leads.length === 0 && (
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Lead
              </Button>
            )}
          </motion.div>
        ) : (
          filteredLeads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setSelectedLead(lead)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <Building2 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white">{lead.input.companyName}</h3>
                      {lead.classification && (
                        <Badge
                          variant={
                            lead.classification === "Hot"
                              ? "hot"
                              : lead.classification === "Nurture"
                                ? "nurture"
                                : "disqualify"
                          }
                          size="sm"
                        >
                          {lead.classification}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {lead.enrichment?.industry && (
                        <span className="text-xs text-white/40">{lead.enrichment.industry}</span>
                      )}
                      {lead.icpScore && (
                        <span className="text-xs font-mono text-white/40">
                          Score: {lead.icpScore.overall}/100
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      lead.status === "approved" || lead.status === "crm_updated"
                        ? "approved"
                        : lead.status === "rejected" || lead.status === "archived"
                          ? "rejected"
                          : lead.status === "awaiting_approval"
                            ? "warning"
                            : "pending"
                    }
                    size="sm"
                  >
                    {lead.status.replace(/_/g, " ")}
                  </Badge>
                  <ExternalLink className="h-4 w-4 text-white/30" />
                </div>
              </div>

              {/* Quick Info Row */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                {lead.input.email && (
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Mail className="h-3 w-3" />
                    {lead.input.email}
                  </div>
                )}
                {lead.input.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Phone className="h-3 w-3" />
                    {lead.input.phone}
                  </div>
                )}
                {lead.input.website && (
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Globe className="h-3 w-3" />
                    {lead.input.website}
                  </div>
                )}
                {lead.enrichment?.employeeCount && (
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Users className="h-3 w-3" />
                    {lead.enrichment.employeeCount} employees
                  </div>
                )}
                {lead.revenuePrediction && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400/80">
                    <TrendingUp className="h-3 w-3" />
                    ${lead.revenuePrediction.expectedRevenue.toLocaleString()}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Lead Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateLeadModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={async (data) => {
              await createLead(data);
              setShowCreateModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateLeadModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    industry: "",
    companySize: "",
    jobTitle: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return;
    setSubmitting(true);
    await onSubmit(formData);
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass rounded-2xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Add New Lead</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-white/50 mb-1 block">Company Name *</label>
            <Input
              placeholder="e.g. Acme Corp"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-white/50 mb-1 block">Website</label>
              <Input
                placeholder="https://..."
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1 block">Industry</label>
              <Input
                placeholder="e.g. SaaS"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-white/50 mb-1 block">Company Size</label>
              <Input
                placeholder="e.g. 50-200"
                value={formData.companySize}
                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1 block">Job Title</label>
              <Input
                placeholder="e.g. CTO"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-white/50 mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="email@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1 block">Phone</label>
              <Input
                placeholder="+1 555-0123"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-white/50 mb-1 block">Notes</label>
            <textarea
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 min-h-[80px] resize-none"
              placeholder="Any additional information..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !formData.companyName.trim()} className="flex-1 gap-2">
              <Sparkles className="h-4 w-4" />
              {submitting ? "Processing..." : "Add & Enrich"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function LeadDetailModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Building2 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{lead.input.companyName}</h2>
              <p className="text-xs text-white/40">ID: {lead.id.slice(0, 8)}...</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Basic Info */}
          <div className="glass rounded-xl p-4">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Basic Info</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-white/40">Status</span>
                <Badge
                  variant={
                    lead.status === "approved" || lead.status === "crm_updated"
                      ? "approved"
                      : lead.status === "rejected"
                        ? "rejected"
                        : "pending"
                  }
                  size="sm"
                >
                  {lead.status.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-white/40">Classification</span>
                {lead.classification ? (
                  <Badge
                    variant={lead.classification === "Hot" ? "hot" : lead.classification === "Nurture" ? "nurture" : "disqualify"}
                    size="sm"
                  >
                    {lead.classification}
                  </Badge>
                ) : (
                  <span className="text-xs text-white/30">—</span>
                )}
              </div>
              {lead.input.email && (
                <div className="flex justify-between">
                  <span className="text-xs text-white/40">Email</span>
                  <span className="text-xs text-white/60">{lead.input.email}</span>
                </div>
              )}
              {lead.input.website && (
                <div className="flex justify-between">
                  <span className="text-xs text-white/40">Website</span>
                  <span className="text-xs text-white/60">{lead.input.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* ICP Score */}
          {lead.icpScore && (
            <div className="glass rounded-xl p-4">
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">ICP Score</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{lead.icpScore.overall}/100</p>
                  <p className="text-xs text-white/40">{lead.icpScore.confidence}% confidence</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {lead.icpScore.factors.slice(0, 3).map((f) => (
                  <div key={f.name} className="flex items-center justify-between">
                    <span className="text-xs text-white/50">{f.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${f.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-white/60">{f.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Revenue Prediction */}
          {lead.revenuePrediction && (
            <div className="glass rounded-xl p-4">
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Revenue Prediction</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-400">
                    ${lead.revenuePrediction.expectedRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-white/40">Expected revenue</p>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Close Probability</span>
                  <span className="text-white/60">{lead.revenuePrediction.closeProbability}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Urgency</span>
                  <Badge variant={lead.revenuePrediction.urgency === "high" ? "warning" : "default"} size="sm">
                    {lead.revenuePrediction.urgency}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Best Channel</span>
                  <span className="text-white/60 capitalize">{lead.revenuePrediction.bestChannel}</span>
                </div>
              </div>
            </div>
          )}

          {/* Enrichment Data */}
          {lead.enrichment && (
            <div className="glass rounded-xl p-4">
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Enrichment</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-white/40">Industry</span>
                  <span className="text-xs text-white/60">{lead.enrichment.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-white/40">Company Size</span>
                  <span className="text-xs text-white/60">{lead.enrichment.companySize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-white/40">Employees</span>
                  <span className="text-xs text-white/60">{lead.enrichment.employeeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-white/40">Location</span>
                  <span className="text-xs text-white/60">{lead.enrichment.location.city}, {lead.enrichment.location.country}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {lead.enrichment.technologies.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="outline" size="sm">{tech}</Badge>
                  ))}
                  {lead.enrichment.technologies.length > 4 && (
                    <Badge variant="outline" size="sm">+{lead.enrichment.technologies.length - 4}</Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Buying Signals */}
          {lead.buyingSignals.length > 0 && (
            <div className="glass rounded-xl p-4 sm:col-span-2">
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Buying Signals</h3>
              <div className="flex flex-wrap gap-2">
                {lead.buyingSignals.map((signal, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-2.5 py-1.5"
                  >
                    <Sparkles className="h-3 w-3 text-amber-400" />
                    <span className="text-xs text-amber-300">{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}