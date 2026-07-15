"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  gradient?: string;
  iconGradient?: string;
  sparklineData?: { value: number }[];
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  gradient = "from-blue-500/10 to-indigo-500/10",
  iconGradient = "from-blue-500/20 to-indigo-500/20",
  sparklineData,
  prefix = "",
  suffix = "",
  decimals = 0,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "glass rounded-2xl p-5 transition-all duration-300",
        "hover:shadow-lg hover:shadow-blue-500/5",
        "relative overflow-hidden group"
      )}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider">{title}</p>
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            `bg-gradient-to-br ${iconGradient}`
          )}>
            <div className="text-white/80">{icon}</div>
          </div>
        </div>

        <div className="flex items-end gap-2 mb-1">
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
            className="text-2xl font-bold text-white tabular-nums"
          />
          {trend && (
            <div className={cn(
              "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
              trend === "up" ? "text-emerald-400 bg-emerald-500/10" :
              trend === "down" ? "text-red-400 bg-red-500/10" :
              "text-white/40 bg-white/5"
            )}>
              {trend === "up" ? <TrendingUp className="h-2.5 w-2.5" /> :
               trend === "down" ? <TrendingDown className="h-2.5 w-2.5" /> :
               <Minus className="h-2.5 w-2.5" />}
              {trendValue}
            </div>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>
        )}

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="absolute bottom-0 right-0 h-16 w-24 opacity-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`sparkline-${title.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={trend === "down" ? "#ef4444" : "#3b82f6"} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={trend === "down" ? "#ef4444" : "#3b82f6"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={trend === "down" ? "#ef4444" : "#3b82f6"}
                  strokeWidth={1.5}
                  fill={`url(#sparkline-${title.replace(/\s/g, "")})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}