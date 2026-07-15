"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Bell, Search, ChevronDown, Sparkles, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const greetings = ["Good Morning", "Good Afternoon", "Good Evening"];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return greetings[0];
  if (hour < 17) return greetings[1];
  return greetings[2];
}

function getCurrentDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function DashboardHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const greeting = getGreeting();
  const date = getCurrentDate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-white"
        >
          {greeting}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-white/40 mt-1"
        >
          {date}
        </motion.p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Search leads, companies..."
            className="w-64 pl-9 bg-white/5 border-white/10 text-sm placeholder:text-white/30"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/30 font-mono">
            ⌘K
          </kbd>
        </motion.div>

        {/* Notifications */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl glass hover:bg-white/10 transition-colors"
        >
          <Bell className="h-4 w-4 text-white/60" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[8px] font-bold text-white">
            3
          </span>
        </motion.button>

        {/* Workspace Selector */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden sm:flex items-center gap-2 rounded-xl glass px-3 py-2 hover:bg-white/10 transition-colors"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-white/70">Main Workspace</span>
          <ChevronDown className="h-3.5 w-3.5 text-white/30" />
        </motion.button>

        {/* Profile Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 cursor-pointer"
        >
          <span className="text-xs font-bold text-white">RS</span>
        </motion.div>
      </div>
    </motion.div>
  );
}