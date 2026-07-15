"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  gradient?: string;
  className?: string;
  delay?: number;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  gradient = "from-blue-500/20 to-purple-500/20",
  className,
  delay = 0,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className={cn(
        "glass rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/50">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-white/40">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          `bg-gradient-to-br ${gradient}`
        )}>
          <div className="text-white/80">{icon}</div>
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend === "up" ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          ) : trend === "down" ? (
            <TrendingDown className="h-3.5 w-3.5 text-red-400" />
          ) : null}
          <span className={cn(
            "text-xs font-medium",
            trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-white/40"
          )}>
            {trendValue}
          </span>
        </div>
      )}
    </motion.div>
  );
}