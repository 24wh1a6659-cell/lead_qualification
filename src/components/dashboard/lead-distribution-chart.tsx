"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface LeadDistributionChartProps {
  data: { classification: string; count: number }[];
}

const COLORS = {
  Hot: "#ef4444",
  Nurture: "#f59e0b",
  Disqualify: "#6b7280",
};

export function LeadDistributionChart({ data }: LeadDistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-2xl p-5"
    >
      <h3 className="text-sm font-medium text-white/50 mb-4">Lead Distribution</h3>
      <div className="flex items-center gap-4">
        <div className="h-32 w-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={4}
                dataKey="count"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.classification}
                    fill={COLORS[entry.classification as keyof typeof COLORS] || "#6b7280"}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  backdropFilter: "blur(12px)",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.classification} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[item.classification as keyof typeof COLORS] || "#6b7280" }}
                />
                <span className="text-xs text-white/60">{item.classification}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{item.count}</span>
                <span className="text-xs text-white/40">
                  ({total > 0 ? Math.round((item.count / total) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}