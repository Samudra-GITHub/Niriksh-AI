"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { investigationTimeline } from "@/lib/data";

export function Timeline({ activeIndex = 3 }: { activeIndex?: number }) {
  const progressPercent =
    (activeIndex / (investigationTimeline.length - 1)) * 100;

  return (
    <div className="relative pl-8">
      <div className="absolute left-[11px] top-1 h-[calc(100%-8px)] w-px bg-white/10" />
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: `${progressPercent}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="absolute left-[11px] top-1 w-px bg-brand-yellow"
      />

      <ul className="space-y-8">
        {investigationTimeline.map((step, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
              className="relative"
            >
              <span
                className={cn(
                  "absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold",
                  done && "border-brand-yellow bg-brand-yellow text-ink",
                  active && "border-brand-yellow bg-ink text-brand-yellow",
                  !done && !active && "border-white/15 bg-ink text-white/30"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                {active && (
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-brand-yellow"
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </span>
              <p
                className={cn(
                  "text-sm font-semibold",
                  done || active ? "text-white" : "text-white/40"
                )}
              >
                {step.label}
              </p>
              <p className="mt-0.5 text-xs text-white/40">{step.detail}</p>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
