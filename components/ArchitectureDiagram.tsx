"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { architectureLayers } from "@/lib/data";

export function ArchitectureDiagram() {
  const [openId, setOpenId] = useState<string | null>(architectureLayers[1].id);

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="absolute left-6 top-4 bottom-4 w-px bg-border sm:left-8">
        <motion.div
          className="absolute left-0 top-0 w-px bg-gradient-to-b from-transparent via-brand-yellow to-transparent"
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          style={{ height: "18%" }}
        />
      </div>

      <ul className="space-y-4">
        {architectureLayers.map((layer, i) => {
          const isOpen = openId === layer.id;
          return (
            <motion.li
              key={layer.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative pl-16 sm:pl-20"
            >
              <span
                className={cn(
                  "absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background text-[11px] font-bold transition-colors sm:left-5",
                  isOpen ? "border-brand-yellow text-ink" : "border-border text-ink-secondary"
                )}
              >
                {i + 1}
              </span>

              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : layer.id)}
                onMouseEnter={() => setOpenId(layer.id)}
                aria-expanded={isOpen}
                className={cn(
                  "w-full rounded-[24px] border bg-white p-5 text-left transition-all duration-300 sm:p-6",
                  isOpen ? "border-ink shadow-[0_12px_40px_-16px_rgba(17,17,17,0.25)]" : "border-border hover:border-ink/30"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-heading text-lg font-bold text-ink sm:text-xl">
                    {layer.title}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-ink-secondary transition-transform duration-300",
                      isOpen && "rotate-180 text-brand-yellow"
                    )}
                  />
                </div>
                <p className="mt-1.5 text-sm text-ink-secondary">{layer.description}</p>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-ink-secondary">
                        {layer.detail}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {layer.badges.map((badge) => (
                          <span
                            key={badge}
                            className="rounded-full bg-muted-surface px-3 py-1.5 text-xs font-semibold text-ink"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
