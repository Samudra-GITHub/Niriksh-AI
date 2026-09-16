"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { MemoryIncident } from "@/lib/demoData";

export function MemoryInsightCard({ incident }: { incident: MemoryIncident }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-4 rounded-2xl border border-brand-yellow/40 bg-brand-yellow/[0.06] p-5"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-yellow" />
        <p className="label-caps text-brand-yellow">Memory Insight</p>
      </div>
      <p className="mt-2 text-sm text-white/80">{incident.notes}</p>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/40">
        Retrieved from merchant history
      </p>
    </motion.div>
  );
}
