"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DashboardCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={cn(
        "rounded-2xl border border-border bg-white p-5 shadow-[0_1px_2px_rgba(17,17,17,0.03)] transition-shadow duration-300 hover:shadow-[0_20px_45px_-24px_rgba(17,17,17,0.3)] sm:p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
