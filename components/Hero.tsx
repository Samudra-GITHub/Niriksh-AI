"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, PlayCircle, Sparkles } from "lucide-react";
import { MerchantDashboard } from "@/components/MerchantDashboard";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10%] h-[560px] w-[560px] rounded-full bg-brand-yellow/25 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[420px] w-[420px] rounded-full bg-success/10 blur-[130px]"
      />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-6 pb-20 pt-14 md:px-10 md:pt-20 lg:grid-cols-2 lg:gap-10 lg:pb-32">
        {/* Left */}
        <div>
          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="mt-6 font-heading text-[56px] font-extrabold leading-[0.98] tracking-tight text-ink sm:text-[72px] lg:text-[76px]"
          >
            Niriksh AI
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-xl text-xl font-semibold leading-snug text-ink sm:text-2xl"
          >
            The Autonomous AI Operations Teammate for Paytm Merchants
          </motion.p>

          <motion.p
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
            className="mt-5 max-w-lg text-base leading-relaxed text-ink-secondary sm:text-lg"
          >
            Don&apos;t wait for merchants to discover problems.
            <br />
            Let AI detect, investigate, act, and verify them first.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={4}
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              <span className="absolute inset-0 -translate-x-full bg-brand-yellow/20 transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative">Launch Dashboard</span>
              <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/investigation"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:border-ink active:scale-95"
            >
              <PlayCircle className="h-4 w-4" />
              View Investigation
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            custom={5}
            variants={fadeUp}
            className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-6"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted-surface px-3 py-1.5 label-caps text-ink-secondary">
              <Sparkles className="h-3 w-3 text-brand-yellow" />
              Track 3 — Autonomous AI Teammates
            </span>
            <span className="text-sm text-ink-secondary">
              Samudra Kar · Maithrayi M S
            </span>
          </motion.div>
        </div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[440px]">
            <MerchantDashboard variant="floating" />

            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 1 },
                x: { duration: 0.6, delay: 1 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
              }}
              className="absolute -left-6 -top-12 hidden rounded-2xl border border-border bg-white px-4 py-3 shadow-xl sm:block"
            >
              <p className="label-caps text-ink-secondary">Root cause</p>
              <p className="mt-1 text-[13px] font-semibold text-ink">Payment gateway disruption</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: -10 }}
              animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 1.3 },
                x: { duration: 0.6, delay: 1.3 },
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.3 },
              }}
              className="absolute -right-4 -bottom-6 hidden rounded-2xl border border-border bg-white px-4 py-3 shadow-xl sm:block"
            >
              <p className="label-caps text-success">Verified</p>
              <p className="mt-1 text-[13px] font-semibold text-ink">₹41,200 recovered</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
