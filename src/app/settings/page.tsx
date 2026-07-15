"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Key,
  Webhook,
  Users,
  Palette,
  Save,
  Zap,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Mail,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-white/40 mt-1">
            Configure your LeadPilot AI platform
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-medium text-white/50">General</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/50 mb-1 block">Platform Name</label>
              <Input defaultValue="LeadPilot AI" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1 block">Default Currency</label>
              <Input defaultValue="USD ($)" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1 block">Timezone</label>
              <Input defaultValue="UTC" />
            </div>
          </div>
        </motion.div>

        {/* AI Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-medium text-white/50">AI Configuration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/50 mb-1 block">OpenRouter API Key</label>
              <div className="relative">
                <Input type="password" defaultValue="sk-••••••••••••••••" />
                <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1 block">Default AI Model</label>
              <Input defaultValue="gpt-4o-mini" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1 block">Confidence Threshold</label>
              <Input defaultValue="70%" />
            </div>
          </div>
        </motion.div>

        {/* Integration Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Webhook className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-medium text-white/50">Integrations</h3>
          </div>
          <div className="space-y-4">
            <div className="glass rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                  <Database className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Salesforce</p>
                  <p className="text-[10px] text-white/30">CRM Integration</p>
                </div>
              </div>
              <Badge variant="approved" size="sm">Connected</Badge>
            </div>
            <div className="glass rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">
                  <Mail className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-white/80">HubSpot</p>
                  <p className="text-[10px] text-white/30">CRM Integration</p>
                </div>
              </div>
              <Badge variant="pending" size="sm">Not Connected</Badge>
            </div>
            <div className="glass rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
                  <Mail className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Outreach.io</p>
                  <p className="text-[10px] text-white/30">Email Sequence</p>
                </div>
              </div>
              <Badge variant="pending" size="sm">Not Connected</Badge>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-medium text-white/50">Notifications</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "New lead created", desc: "When a new lead enters the pipeline" },
              { label: "Hot lead detected", desc: "When a lead scores 70+ on ICP" },
              { label: "Approval needed", desc: "When a hot lead needs human review" },
              { label: "Email draft ready", desc: "When AI generates an email draft" },
              { label: "Weekly digest", desc: "Weekly summary of pipeline activity" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/80">{item.label}</p>
                  <p className="text-[10px] text-white/30">{item.desc}</p>
                </div>
                <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="h-5 w-9 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-500 peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-medium text-white/50">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="glass rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Two-Factor Authentication</p>
                <p className="text-[10px] text-white/30">Add an extra layer of security</p>
              </div>
              <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="h-5 w-9 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-500 peer-checked:after:translate-x-full" />
              </label>
            </div>
            <div className="glass rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Audit Logging</p>
                <p className="text-[10px] text-white/30">Track all system actions</p>
              </div>
              <Badge variant="approved" size="sm">Enabled</Badge>
            </div>
            <div className="glass rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Session Timeout</p>
                <p className="text-[10px] text-white/30">Auto-logout after inactivity</p>
              </div>
              <Input className="w-20 text-center" defaultValue="30m" />
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-medium text-white/50">Data Management</h3>
          </div>
          <div className="space-y-3">
            <div className="glass rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Database Status</span>
                <Badge variant="approved" size="sm">Healthy</Badge>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/30">
                <Database className="h-3 w-3" />
                In-memory storage · 5 leads stored
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
              Re-seed Sample Data
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}