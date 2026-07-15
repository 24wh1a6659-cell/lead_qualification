"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  X,
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Users,
  MessageSquare,
  Send,
  Flame,
  ChevronRight,
} from "lucide-react";

const suggestions = [
  { icon: <Flame className="h-3.5 w-3.5" />, text: "Show hot leads" },
  { icon: <Zap className="h-3.5 w-3.5" />, text: "Generate follow-up" },
  { icon: <TrendingUp className="h-3.5 w-3.5" />, text: "Summarize pipeline" },
  { icon: <Target className="h-3.5 w-3.5" />, text: "Predict revenue" },
  { icon: <Users className="h-3.5 w-3.5" />, text: "Find best prospects" },
];

export function AICopilotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && <AICopilotPanel onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-shadow"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Bot className="h-6 w-6 text-white" />
        )}
      </motion.button>
    </>
  );
}

function AICopilotPanel({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>([
    { role: "ai", text: "Hello! I'm your AI Sales Copilot. How can I help you today?" },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "I've analyzed your pipeline. You have 8 hot leads ready for engagement. Would you like me to generate personalized outreach emails for them?",
        },
      ]);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 z-40 flex h-full w-80 flex-col border-l border-white/10 bg-black/90 backdrop-blur-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <Bot className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Copilot</h3>
            <p className="text-[10px] text-white/30">Powered by LeadPilot AI</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "ai" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                  <Bot className="h-3 w-3 text-blue-400" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                  msg.role === "ai"
                    ? "bg-white/10 text-white/80"
                    : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white"
                )}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Suggestions */}
      <div className="px-4 py-2 border-t border-white/10">
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setMessages((prev) => [...prev, { role: "user", text: s.text }]);
                setTimeout(() => {
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: "ai",
                      text: `I'll analyze your ${s.text.toLowerCase()} data. Here's what I found...`,
                    },
                  ]);
                }, 800);
              }}
              className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors"
            >
              {s.icon}
              {s.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask AI Copilot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="text-sm"
          />
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}