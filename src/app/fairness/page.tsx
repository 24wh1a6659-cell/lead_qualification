"use client";

import { useFairnessReport } from "@/lib/hooks/use-leads";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Scale,
  Eye,
  Hash,
  Activity,
} from "lucide-react";

export default function FairnessPage() {
  const { report, loading } = useFairnessReport();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const reportData: Record<string, unknown> | null = report as Record<string, unknown> | null;
  const isFair = reportData?.isFair === true ? true : reportData?.isFair === false ? false : undefined;
  const biasScore = typeof reportData?.biasScore === "number" ? reportData.biasScore : undefined;
  const attributesChecked = Array.isArray(reportData?.sensitiveAttributesChecked) ? reportData.sensitiveAttributesChecked as string[] : undefined;
  const attributesStripped = Array.isArray(reportData?.attributesStripped) ? reportData.attributesStripped as string[] : undefined;
  const equivalentScoreTest = reportData?.equivalentScoreTest as Record<string, unknown> | undefined;
  const testMatch = typeof equivalentScoreTest?.match === "boolean" ? equivalentScoreTest.match : undefined;
  const generatedAt = typeof reportData?.generatedAt === "string" ? reportData.generatedAt : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Fairness Report</h1>
          <p className="text-sm text-white/40 mt-1">
            AI fairness validation and bias monitoring
          </p>
        </div>
        <Badge
          variant={isFair === true ? "approved" : isFair === false ? "rejected" : "info"}
          size="lg"
        >
          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
          {isFair === true ? "Fair" : isFair === false ? "Bias Detected" : "No Data"}
        </Badge>
      </motion.div>

      {/* Main Metrics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              isFair === true
                ? "bg-gradient-to-br from-emerald-500/20 to-green-500/20"
                : "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
            }`}>
              {isFair === true ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-amber-400" />
              )}
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {isFair === true ? "AI Fairness Validated" : "Fairness Check Required"}
              </p>
              <p className="text-xs text-white/40">
                {isFair === true
                  ? "All AI decisions are unbiased and fair"
                  : "Potential bias detected in AI scoring"}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Scale className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Bias Score</p>
              <p className="text-xs text-white/40">0 = no bias, 100 = maximum bias</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 bg-emerald-500"
                style={{ width: `${biasScore !== undefined ? Math.min(biasScore, 100) : 0}%` }}
              />
            </div>
            <span className="text-xl font-bold text-white">
              {biasScore !== undefined ? String(biasScore) : "—"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Detailed Reports */}
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-medium text-white/50">Sensitive Attributes Checked</h3>
          </div>
          {attributesChecked && attributesChecked.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {attributesChecked.map((attr) => (
                <Badge key={attr} variant="info" size="sm">
                  {attr}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/30">No attributes checked</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Hash className="h-4 w-4 text-green-400" />
            <h3 className="text-sm font-medium text-white/50">Attributes Stripped</h3>
          </div>
          {attributesStripped && attributesStripped.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {attributesStripped.map((attr) => (
                <Badge key={attr} variant="success" size="sm">
                  {attr}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/30">No attributes stripped</p>
          )}
        </motion.div>
      </div>

      {/* Equivalent Score Test */}
      {equivalentScoreTest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-medium text-white/50">Equivalent Score Test</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["inputA", "inputB"] as const).map((key) => {
              const input = equivalentScoreTest[key] as Record<string, unknown> | undefined;
              const scoreKey = key === "inputA" ? "scoreA" : "scoreB";
              const scoreVal = typeof equivalentScoreTest[scoreKey] === "number" ? equivalentScoreTest[scoreKey] as number : undefined;

              return (
                <div key={key} className="glass rounded-xl p-3">
                  <p className="text-xs font-medium text-white/50 mb-2">
                    {key === "inputA" ? "Input A" : "Input B"}
                  </p>
                  <div className="space-y-1">
                    {input &&
                      Object.entries(input).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-xs">
                          <span className="text-white/40">{k}</span>
                          <span className="text-white/60">{String(v).slice(0, 30)}</span>
                        </div>
                      ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <span className="text-xs text-white/40">Score: </span>
                    <span className="text-sm font-bold text-white">{scoreVal !== undefined ? scoreVal : "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {testMatch !== undefined && (
            <div className={`mt-3 rounded-xl p-3 ${
              testMatch
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : "bg-red-500/10 border border-red-500/20"
            }`}>
              <div className="flex items-center gap-2">
                {testMatch ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                )}
                <span className={`text-xs font-medium ${
                  testMatch ? "text-emerald-400" : "text-red-400"
                }`}>
                  {testMatch ? "Scores are equivalent — no bias detected" : "Scores differ — potential bias"}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Report Metadata */}
      {generatedAt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-[10px] text-white/20">
            Report generated: {new Date(generatedAt).toLocaleString()}
          </p>
        </motion.div>
      )}
    </div>
  );
}