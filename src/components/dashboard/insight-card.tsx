"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, TrendingUp, Target, Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface InsightItem {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  text: string;
  subtext?: string;
}

const defaultInsights: InsightItem[] = [
  {
    icon: <Zap className="h-3.5 w-3.5" />,
    iconBg: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
    text: "8 high-quality leads detected",
    subtext: "Ready for sales engagement",
  },
  {
    icon: <TrendingUp className="h-3.5 w-3.5" />,
    iconBg: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
    text: "Healthcare industry trending",
    subtext: "43% increase in leads this week",
  },
  {
    icon: <Target className="h-3.5 w-3.5" />,
    iconBg: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    text: "Revenue forecast increased 14%",
    subtext: "vs. last month",
  },
  {
    icon: <Users className="h-3.5 w-3.5" />,
    iconBg: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
    text: "12 leads require follow-up today",
    subtext: "Priority actions needed",
  },
];

interface InsightCardProps {
  insights?: InsightItem[];
  className?: string;
}

export function InsightCard({ insights = defaultInsights, className }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn("glass rounded-2xl p-5", className)}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <Sparkles className="h-4 w-4 text-purple-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">AI Sales Insights</h3>
        <span className="ml-auto flex h-5 items-center rounded-full bg-purple-500/10 px-2 text-[10px] font-medium text-purple-400">
          Live
        </span>
      </div>

      <div className="space-y-2.5">
        {insights.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex items-start gap-3 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition-colors group"
          >
            <div className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
              item.iconBg
            )}>
              <span className={item.iconColor}>{item.icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white/80">{item.text}</p>
              {item.subtext && (
                <p className="text-[10px] text-white/40 mt-0.5">{item.subtext}</p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="shrink-0 rounded-md bg-white/5 px-2 py-1 text-[10px] font-medium text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
            >
              View
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}