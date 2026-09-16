"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function BusinessTier({
  name,
  tagline,
  capabilities,
  featured = false,
  index,
}: {
  name: string;
  tagline: string;
  capabilities: string[];
  featured?: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className={cn(
        "relative flex flex-col rounded-[28px] border p-7 sm:p-8",
        featured
          ? "border-ink bg-ink text-white shadow-[0_30px_60px_-24px_rgba(17,17,17,0.4)] lg:-translate-y-3"
          : "border-border bg-white text-ink"
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand-yellow px-3 py-1 text-[11px] font-bold text-ink">
          <Sparkles className="h-3 w-3" />
          Most capable
        </span>
      )}

      <p className={cn("label-caps", featured ? "text-brand-yellow" : "text-ink-secondary")}>
        {tagline}
      </p>
      <h3 className="mt-2 font-heading text-2xl font-extrabold tracking-tight">{name}</h3>

      <ul className="mt-7 space-y-3">
        {capabilities.map((cap) => (
          <li key={cap} className="flex items-start gap-2.5 text-sm">
            <Check
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                featured ? "text-brand-yellow" : "text-success"
              )}
            />
            <span className={featured ? "text-white/80" : "text-ink-secondary"}>{cap}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
