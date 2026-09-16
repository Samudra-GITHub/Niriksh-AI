"use client";

import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkflowCard({
  icon: Icon,
  label,
  index,
  isLast = false,
  dark = false,
}: {
  icon: LucideIcon;
  label: string;
  index: number;
  isLast?: boolean;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-1 items-center gap-2 sm:gap-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.15 }}
        className={cn(
          "flex flex-1 flex-col items-center gap-2 rounded-2xl border px-3 py-5 text-center sm:px-4",
          dark
            ? "border-white/10 bg-white/[0.03]"
            : "border-border bg-white"
        )}
      >
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            dark ? "bg-brand-yellow/15 text-brand-yellow" : "bg-ink text-brand-yellow"
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className={cn("text-xs font-bold sm:text-sm", dark ? "text-white" : "text-ink")}>
          {label}
        </span>
      </motion.div>

      {!isLast && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.1 }}
        >
          <ArrowRight
            className={cn(
              "hidden h-4 w-4 shrink-0 sm:block",
              dark ? "text-white/25" : "text-ink-secondary/50"
            )}
          />
        </motion.div>
      )}
    </div>
  );
}
