"use client";

import { motion } from "framer-motion";

export function BenefitCard({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-border bg-white p-5 transition-colors hover:border-ink/25"
    >
      <span className="label-caps text-brand-yellow">{String(index + 1).padStart(2, "0")}</span>
      <p className="mt-2 font-heading text-base font-bold text-ink">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{description}</p>
    </motion.div>
  );
}
