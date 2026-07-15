"use client";

import { useAnalytics, useLeads } from "@/lib/hooks/use-leads";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { InsightCard } from "@/components/dashboard/insight-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { LeadDistributionChart } from "@/components/dashboard/lead-distribution-chart";
import { TimelineChart } from "@/components/dashboard/timeline-chart";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Users,
  Flame,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Activity,
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  FileText,
  Bot,
  ArrowUpRight,
  BarChart3,
  Globe,
  Mail,
  Phone,
  Building2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

// Demo sparkline data for metric cards
const generateSparkline = (base: number, variance: number, points: number = 12) =>
  Array.from({ length: points }, (_, i) => ({
    value: base + Math.sin(i * 0.8) * variance + Math.random() * variance * 0.5,
  }));

const sparklines = {
  leads: generateSparkline(180, 30),
  hot: generateSparkline(25, 8),
  pending: generateSparkline(12, 4),
  revenue: generateSparkline(120000, 20000),
};

export default function DashboardPage() {
  const { analytics, loading } = useAnalytics();
  const { leads } = useLeads();

  const recentLeads = leads.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const totalLeads = analytics?.totalLeads || 0;
  const hotLeads = analytics?.hotLeads || 0;
  const pendingApproval = analytics?.pendingApproval || 0;
  const totalRevenue = analytics?.totalRevenuePotential || 0;
  const approvalRate = analytics?.approvalRate || 0;
  const rejected = analytics?.rejected || 0;
  const conversionRate = analytics?.sqlConversionRate || 0;
  const timeSaved = analytics?.timeSavedMinutes || 0;

  return (
    <div className="space-y-6">
      {/* Premium Header with Greeting */}
      <DashboardHeader />

      {/* AI Insights Card */}
      <InsightCard />

      {/* Metric Cards with Sparklines */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Leads"
          value={totalLeads}
          subtitle="All leads in pipeline"
          icon={<Users className="h-4 w-4" />}
          iconGradient="from-blue-500/20 to-indigo-500/20"
          trend="up"
          trendValue="18% this week"
          sparklineData={sparklines.leads}
          delay={0}
        />
        <MetricCard
          title="Hot Leads"
          value={hotLeads}
          subtitle="Ready for sales"
          icon={<Flame className="h-4 w-4" />}
          iconGradient="from-red-500/20 to-rose-500/20"
          trend="up"
          trendValue="34% vs last week"
          sparklineData={sparklines.hot}
          delay={1}
        />
        <MetricCard
          title="Pending Approval"
          value={pendingApproval}
          subtitle="Awaiting review"
          icon={<Clock className="h-4 w-4" />}
          iconGradient="from-amber-500/20 to-orange-500/20"
          trend={pendingApproval > 0 ? "up" : "neutral"}
          trendValue={pendingApproval > 0 ? `${pendingApproval} pending` : "All clear"}
          sparklineData={sparklines.pending}
          delay={2}
        />
        <MetricCard
          title="Revenue Potential"
          value={totalRevenue}
          prefix="$"
          decimals={0}
          subtitle="Estimated pipeline value"
          icon={<DollarSign className="h-4 w-4" />}
          iconGradient="from-emerald-500/20 to-teal-500/20"
          trend="up"
          trendValue="14% vs last month"
          sparklineData={sparklines.revenue}
          delay={3}
        />
        <MetricCard
          title="Approval Rate"
          value={approvalRate}
          suffix="%"
          subtitle={`${analytics?.approved || 0} approved`}
          icon={<CheckCircle2 className="h-4 w-4" />}
          iconGradient="from-green-500/20 to-emerald-500/20"
          trend={approvalRate >= 50 ? "up" : "down"}
          trendValue={`${approvalRate}% rate`}
          delay={4}
        />
        <MetricCard
          title="Rejected"
          value={rejected}
          subtitle="Leads rejected"
          icon={<XCircle className="h-4 w-4" />}
          iconGradient="from-red-500/20 to-pink-500/20"
          trend={rejected > 0 ? "down" : "neutral"}
          trendValue={rejected > 0 ? `${rejected} rejected` : "None rejected"}
          delay={5}
        />
        <MetricCard
          title="Conversion Rate"
          value={conversionRate}
          suffix="%"
          subtitle="SQL conversion"
          icon={<TrendingUp className="h-4 w-4" />}
          iconGradient="from-violet-500/20 to-purple-500/20"
          trend={conversionRate >= 50 ? "up" : "down"}
          trendValue={`${conversionRate}% rate`}
          delay={6}
        />
        <MetricCard
          title="Time Saved"
          value={timeSaved}
          suffix="m"
          subtitle="Manual effort avoided"
          icon={<Activity className="h-4 w-4" />}
          iconGradient="from-cyan-500/20 to-blue-500/20"
          trend="up"
          trendValue={`${timeSaved}m saved`}
          delay={7}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Analytics Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TimelineChart data={analytics?.processingTimeline || []} />
        <LeadDistributionChart data={analytics?.leadDistribution || []} />
      </div>

      {/* Activity Feed + Recent Leads */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass rounded-2xl p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Activity Feed</h3>
            </div>
            <Badge variant="info" size="sm">
              {analytics?.recentActivity?.length || 0} events
            </Badge>
          </div>
          <div className="space-y-1">
            {(analytics?.recentActivity || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-white/30">
                <FileText className="h-8 w-8 mb-2" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              (analytics?.recentActivity || []).slice(0, 6).map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 hover:bg-white/10 transition-colors group"
                >
                  {/* Icon */}
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    entry.action.includes("approved") || entry.action.includes("completed")
                      ? "bg-emerald-500/20"
                      : entry.action.includes("rejected")
                        ? "bg-red-500/20"
                        : entry.action.includes("created")
                          ? "bg-blue-500/20"
                          : "bg-white/5"
                  )}>
                    {entry.action.includes("approved") || entry.action.includes("completed") ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : entry.action.includes("rejected") ? (
                      <XCircle className="h-4 w-4 text-red-400" />
                    ) : entry.action.includes("created") ? (
                      <Plus className="h-4 w-4 text-blue-400" />
                    ) : (
                      <Activity className="h-4 w-4 text-white/40" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white/80">
                        {entry.action.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-white/30">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {entry.details && typeof entry.details.companyName === "string" && (
                      <p className="text-[10px] text-white/40 mt-0.5">
                        {entry.details.companyName}
                      </p>
                    )}
                  </div>

                  {/* Actor Badge */}
                  <Badge
                    variant={
                      entry.actor === "system" || entry.actor === "agent"
                        ? "info"
                        : "default"
                    }
                    size="sm"
                  >
                    {entry.actor === "agent" ? "AI" : entry.actor}
                  </Badge>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* AI Insights Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-4"
        >
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">AI Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs font-medium text-purple-400">Lead Quality</span>
                </div>
                <p className="text-xs text-white/60">
                  {hotLeads > 0
                    ? `${hotLeads} hot lead${hotLeads > 1 ? "s" : ""} identified. Focus on these high-intent prospect${hotLeads > 1 ? "s" : ""} first.`
                    : "No hot leads yet. Consider adjusting ICP criteria."}
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs font-medium text-blue-400">Pipeline Health</span>
                </div>
                <p className="text-xs text-white/60">
                  {totalLeads > 0
                    ? `${totalLeads} leads · $${totalRevenue.toLocaleString()} est. revenue · ${approvalRate}% approval`
                    : "Pipeline is empty. Add leads to get started."}
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">Efficiency</span>
                </div>
                <p className="text-xs text-white/60">
                  AI saved ~{timeSaved} minutes. Each lead processed in seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Pipeline Overview</h3>
            <div className="space-y-2">
              {[
                { label: "Hot", value: hotLeads, color: "bg-red-500", pct: totalLeads > 0 ? (hotLeads / totalLeads) * 100 : 0 },
                { label: "Nurture", value: analytics?.nurtureLeads || 0, color: "bg-amber-500", pct: totalLeads > 0 ? ((analytics?.nurtureLeads || 0) / totalLeads) * 100 : 0 },
                { label: "Disqualified", value: analytics?.disqualifiedLeads || 0, color: "bg-gray-500", pct: totalLeads > 0 ? ((analytics?.disqualifiedLeads || 0) / totalLeads) * 100 : 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-white/50">{item.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                      style={{ width: `${Math.min(item.pct, 100)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-medium text-white/70">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Leads Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Recent Leads</h3>
          </div>
          <Link
            href="/leads"
            className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-3 text-xs font-medium text-white/40 uppercase tracking-wider">Company</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-white/40 uppercase tracking-wider">Contact</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-white/40 uppercase tracking-wider">Industry</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-white/40 uppercase tracking-wider">Score</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-white/40 uppercase tracking-wider">Classification</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-white/30">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="h-8 w-8 text-white/20" />
                      <p className="text-sm">No leads yet. Create your first lead to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                          <Building2 className="h-3.5 w-3.5 text-blue-400" />
                        </div>
                        <span className="font-medium text-white/80">{lead.input.companyName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        {lead.input.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="hidden lg:inline">{lead.input.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-white/50 text-xs">
                      {lead.enrichment?.industry || lead.input.industry || "—"}
                    </td>
                    <td className="py-3 px-3">
                      {lead.icpScore ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-12 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{ width: `${lead.icpScore.overall}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-white/60">{lead.icpScore.overall}</span>
                        </div>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          lead.status === "approved" || lead.status === "crm_updated"
                            ? "approved"
                            : lead.status === "rejected"
                              ? "rejected"
                              : lead.status === "awaiting_approval"
                                ? "warning"
                                : "pending"
                        }
                        size="sm"
                      >
                        {lead.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      {lead.classification ? (
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
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}