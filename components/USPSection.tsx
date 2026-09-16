"use client";

import { motion } from "framer-motion";
import {
  Bot,
  CheckCheck,
  Eye,
  Lightbulb,
  Search,
  User,
  Zap,
} from "lucide-react";
import { SectionLabel } from "@/components/SectionLabel";
import { WorkflowCard } from "@/components/WorkflowCard";

const workflowSteps = [
  { label: "Detect", icon: Eye },
  { label: "Investigate", icon: Search },
  { label: "Reason", icon: Lightbulb },
  { label: "Act", icon: Zap },
  { label: "Verify", icon: CheckCheck },
];

export function USPSection() {
  return (
    <section id="usp" className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <SectionLabel className="justify-center">The Difference</SectionLabel>
          <h2 className="balance mx-auto mt-5 max-w-2xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            From AI Assistant &rarr; AI Teammate
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: AI Assistant */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="rounded-[28px] border border-border bg-muted-surface/50 p-6 sm:p-8"
          >
            <p className="label-caps text-ink-secondary">AI Assistant</p>
            <p className="mt-1 font-heading text-xl font-bold text-ink">The old way</p>

            <div className="mt-7 space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="ml-auto flex max-w-[80%] items-start gap-2"
              >
                <div className="rounded-2xl rounded-tr-sm bg-ink px-4 py-2.5 text-sm text-white">
                  Why did my revenue drop this week?
                </div>
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                  <User className="h-3.5 w-3.5" />
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="flex max-w-[85%] items-start gap-2"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-ink-secondary ring-1 ring-border">
                  <Bot className="h-3.5 w-3.5" />
                </span>
                <div className="rounded-2xl rounded-tl-sm border border-border bg-white px-4 py-2.5 text-sm text-ink-secondary">
                  Revenue appears lower than your weekly average. This could be
                  due to payments, refunds, or customer activity — you may
                  want to check your transaction logs.
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex items-center gap-2 pl-9"
              >
                <span className="label-caps rounded-full bg-white px-3 py-1.5 text-ink-secondary ring-1 ring-border">
                  Done
                </span>
                <span className="text-xs text-ink-secondary">
                  — merchant left to investigate alone.
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Niriksh AI */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[28px] border border-ink bg-ink p-6 sm:p-8"
          >
            <p className="label-caps text-brand-yellow">Niriksh AI</p>
            <p className="mt-1 font-heading text-xl font-bold text-white">The autonomous way</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              {workflowSteps.map((step, i) => (
                <WorkflowCard
                  key={step.label}
                  icon={step.icon}
                  label={step.label}
                  index={i}
                  isLast={i === workflowSteps.length - 1}
                  dark
                />
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-success/25 bg-success/[0.08] p-4">
              <p className="text-sm text-white/70">
                Revenue investigated, root cause identified, and a{" "}
                <span className="font-semibold text-success">recovery
                workflow approved</span> — no merchant prompt required.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="balance mx-auto mt-24 max-w-4xl text-center font-heading text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl"
        >
          Existing AI assistants answer questions.
          <br />
          <span className="text-ink-secondary">Niriksh completes work.</span>
        </motion.p>
      </div>
    </section>
  );
}
