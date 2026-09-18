"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  QrCode,
  RefreshCcw,
  Signal,
  UserMinus,
  Wifi,
  XCircle,
} from "lucide-react";
import { SectionLabel } from "@/components/SectionLabel";
import { problemCauses } from "@/lib/data";

// Recharts pulls in a meaningful chunk of JS — load it only once this
// section is actually rendered, instead of in the landing page's initial
// bundle. The skeleton below matches RevenueChart's default height so
// nothing shifts once it loads.
const RevenueChart = dynamic(
  () => import("@/components/RevenueChart").then((m) => m.RevenueChart),
  {
    ssr: false,
    loading: () => <div className="h-[280px] w-full animate-pulse rounded-2xl bg-muted-surface/60" />,
  }
);

const causeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "payment-failure": XCircle,
  "refund-spike": RefreshCcw,
  "upi-disruption": Wifi,
  "qr-issue": QrCode,
  "customer-dropoff": UserMinus,
  "network-delay": Signal,
};

export function ProblemSection() {
  return (
    <section id="problem" className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>The Problem</SectionLabel>
          <h2 className="balance mt-5 max-w-3xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Paytm merchants can lose revenue without knowing what caused it.
          </h2>
        </motion.div>

        <div className="relative mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
          {/* Left: chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="rounded-[28px] border border-border bg-white p-6 sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="label-caps text-ink-secondary">14-Day Revenue</p>
                <p className="mt-1 font-heading text-2xl font-extrabold text-ink">₹3.58L today</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1.5 text-xs font-semibold text-warning">
                <ArrowDownRight className="h-3.5 w-3.5" />
                24% vs. last week
              </span>
            </div>
            <div className="mt-6">
              <RevenueChart accentColor="#F59E0B" />
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3">
              <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
              <p className="text-[13px] text-ink">
                Decline began Day 9 — sustained across five consecutive days.
              </p>
            </div>
          </motion.div>

          {/* Right: causes */}
          <div className="lg:pl-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3"
            >
              <h3 className="font-heading text-2xl font-bold text-ink">
                &ldquo;Why did revenue drop?&rdquo;
              </h3>
            </motion.div>
            <p className="mt-2 max-w-md text-sm text-ink-secondary">
              Six plausible causes, spanning payments, operations, and customer
              behavior — a merchant would have to investigate each manually.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {problemCauses.map((cause, i) => {
                const Icon = causeIcons[cause.id];
                return (
                  <motion.div
                    key={cause.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-white p-4 transition-colors hover:border-warning/40"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted-surface text-ink-secondary transition-colors group-hover:bg-warning/10 group-hover:text-warning">
                        <Icon className="h-4 w-4" />
                      </span>
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                      >
                        <ArrowRight className="h-4 w-4 text-warning/60" />
                      </motion.span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-ink">{cause.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                      {cause.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-20 max-w-3xl text-center"
        >
          <p className="balance mx-auto font-heading text-2xl font-bold leading-snug text-ink sm:text-3xl">
            Merchants shouldn&apos;t investigate operations manually.
            <br className="hidden sm:block" /> AI should investigate for them.
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
