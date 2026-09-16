"use client";

import { motion } from "framer-motion";
import { BusinessTier } from "@/components/BusinessTier";
import { SectionLabel } from "@/components/SectionLabel";
import { businessTiers } from "@/lib/data";

export function BusinessModelSection() {
  return (
    <section id="business" className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <SectionLabel className="justify-center">Business Model</SectionLabel>
          <h2 className="balance mx-auto mt-5 max-w-3xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Designed to Scale Across the Paytm Merchant Ecosystem
          </h2>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-7">
          {businessTiers.map((tier, i) => (
            <BusinessTier
              key={tier.name}
              name={tier.name}
              tagline={tier.tagline}
              capabilities={tier.capabilities}
              featured={tier.featured}
              index={i}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="balance mx-auto mt-24 max-w-3xl text-center font-heading text-2xl font-bold leading-snug text-ink sm:text-3xl"
        >
          Niriksh transforms Paytm from a payment platform into an{" "}
          <span className="text-ink-secondary">AI-powered operations teammate</span> for
          every merchant.
        </motion.p>
      </div>
    </section>
  );
}
