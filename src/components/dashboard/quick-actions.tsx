"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Plus, Upload, Zap, FileText, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconGradient: string;
  href?: string;
  onClick?: () => void;
}

const actions: QuickAction[] = [
  {
    label: "Add Lead",
    description: "Create a new lead",
    icon: <Plus className="h-4 w-4" />,
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconGradient: "from-blue-500/20 to-indigo-500/20",
    href: "/leads",
  },
  {
    label: "Import CSV",
    description: "Bulk import leads",
    icon: <Upload className="h-4 w-4" />,
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconGradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    label: "Run Analysis",
    description: "AI-powered lead scoring",
    icon: <Zap className="h-4 w-4" />,
    gradient: "from-purple-500/10 to-pink-500/10",
    iconGradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    label: "Generate Email",
    description: "AI outreach draft",
    icon: <FileText className="h-4 w-4" />,
    gradient: "from-amber-500/10 to-orange-500/10",
    iconGradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    label: "Export Report",
    description: "Download pipeline report",
    icon: <Download className="h-4 w-4" />,
    gradient: "from-cyan-500/10 to-blue-500/10",
    iconGradient: "from-cyan-500/20 to-blue-500/20",
  },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass rounded-2xl p-5"
    >
      <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all duration-200",
              "group border border-transparent hover:border-white/10",
              action.gradient
            )}
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-200 group-hover:scale-110",
              action.iconGradient
            )}>
              <span className="text-white/80">{action.icon}</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white/80">{action.label}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}