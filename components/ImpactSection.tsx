"use client";

import { motion } from "framer-motion";
import { ArrowDown, Building2, Store } from "lucide-react";
import { BenefitCard } from "@/components/BenefitCard";
import { SectionLabel } from "@/components/SectionLabel";
import { impactTimeline, merchantBenefits, paytmBenefits } from "@/lib/data";

export function ImpactSection() {
  return (
    <section id="impact" className="border-t border-border bg-muted-surface/50 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <SectionLabel className="justify-center">Impact</SectionLabel>
          <h2 className="balance mx-auto mt-5 max-w-2xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Impact That Matters
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-brand-yellow">
                <Store className="h-4 w-4" />
              </span>
              <h3 className="font-heading text-xl font-bold text-ink">For Merchants</h3>
            </div>
            <div className="mt-6 space-y-3">
              {merchantBenefits.map((b, i) => (
                <BenefitCard key={b.title} title={b.title} description={b.description} index={i} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-brand-yellow">
                <Building2 className="h-4 w-4" />
              </span>
              <h3 className="font-heading text-xl font-bold text-ink">For Paytm</h3>
            </div>
            <div className="mt-6 space-y-3">
              {paytmBenefits.map((b, i) => (
                <BenefitCard key={b.title} title={b.title} description={b.description} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom timeline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-24 max-w-2xl"
        >
          <div className="flex flex-col items-center">
            {impactTimeline.map((step, i) => (
              <div key={step.label} className="flex w-full flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                  className={
                    "w-full rounded-2xl border px-6 py-4 text-center " +
                    (i === impactTimeline.length - 1
                      ? "border-ink bg-ink"
                      : "border-border bg-white")
                  }
                >
                  <p
                    className={
                      "font-heading text-base font-bold sm:text-lg " +
                      (i === impactTimeline.length - 1 ? "text-brand-yellow" : "text-ink")
                    }
                  >
                    {step.label}
                  </p>
                  <p
                    className={
                      "mt-1 text-xs sm:text-sm " +
                      (i === impactTimeline.length - 1 ? "text-white/60" : "text-ink-secondary")
                    }
                  >
                    {step.description}
                  </p>
                </motion.div>
                {i < impactTimeline.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.15 + 0.1 }}
                    className="my-2"
                  >
                    <ArrowDown className="h-5 w-5 text-ink-secondary/50" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
