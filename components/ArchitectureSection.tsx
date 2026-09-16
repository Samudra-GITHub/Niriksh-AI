"use client";

import { motion } from "framer-motion";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { SectionLabel } from "@/components/SectionLabel";

const stack = [
  "Next.js",
  "React",
  "Tailwind",
  "Groq",
  "Python",
  "FastAPI",
  "Supabase",
  "n8n",
  "Cognee",
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="border-t border-border bg-muted-surface/50 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <SectionLabel className="justify-center">Architecture</SectionLabel>
          <h2 className="balance mx-auto mt-5 max-w-2xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Built for Autonomous Action
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink-secondary">
            Five layers, working continuously — from the merchant&apos;s screen
            down to the systems that verify every outcome.
          </p>
        </motion.div>

        <div className="mt-16">
          <ArchitectureDiagram />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-2.5"
        >
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-ink-secondary transition-colors hover:border-ink hover:text-ink"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
