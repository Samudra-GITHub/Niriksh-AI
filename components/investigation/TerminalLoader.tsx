"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TerminalSquare } from "lucide-react";

const STEPS = [
  "Connecting to merchant signals...",
  "Analyzing transactions...",
  "Checking payment logs...",
  "Reviewing refund activity...",
  "Reasoning with Sarvam AI...",
];

const COMPLETE_LINE = "Investigation complete.";
const STEP_INTERVAL_MS = 420;
const COMPLETE_HOLD_MS = 400;

/**
 * A terminal-style sequence that steps through STEPS on a timer, then
 * holds on the last line until `done` flips true (the real fetch has
 * resolved — see app/investigation/page.tsx), before showing
 * COMPLETE_LINE briefly and calling `onFinished`.
 */
export function TerminalLoader({
  done,
  onFinished,
}: {
  done: boolean;
  onFinished: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const firedRef = useRef(false);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    if (stepIndex >= STEPS.length - 1) return;
    const timer = setTimeout(() => setStepIndex((i) => i + 1), STEP_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  useEffect(() => {
    if (!done || stepIndex < STEPS.length - 1) return;

    const holdTimer = setTimeout(() => {
      setShowComplete(true);
    }, STEP_INTERVAL_MS);

    return () => clearTimeout(holdTimer);
  }, [done, stepIndex]);

  useEffect(() => {
    if (!showComplete || firedRef.current) return;
    const finishTimer = setTimeout(() => {
      firedRef.current = true;
      onFinishedRef.current();
    }, COMPLETE_HOLD_MS);
    return () => clearTimeout(finishTimer);
  }, [showComplete]);

  const visibleLines = STEPS.slice(0, stepIndex + 1);

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-black/40 p-6 font-mono text-sm">
      <div className="mb-3 flex items-center gap-2 text-white/40">
        <TerminalSquare className="h-3.5 w-3.5" />
        <span className="text-xs">niriksh-investigation</span>
      </div>
      <div className="flex flex-col gap-2">
        {visibleLines.map((line) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-success"
          >
            <span className="text-white/30">$</span> {line}
          </motion.p>
        ))}
        <AnimatePresence>
          {showComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-semibold text-brand-yellow"
            >
              <span className="text-white/30">$</span> {COMPLETE_LINE}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
