"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Check, RotateCcw, Search } from "lucide-react";
import { Logo } from "@/components/Logo";
import { merchant } from "@/lib/demoData";
import { resetDemoData } from "@/lib/api";
import { cn } from "@/lib/utils";

export function DashboardHeader({
  name = merchant.name,
  category = merchant.category,
  onReset,
}: {
  name?: string;
  category?: string;
  onReset?: () => void;
}) {
  const [resetting, setResetting] = useState(false);
  const [justReset, setJustReset] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      await resetDemoData();
      onReset?.();
      setJustReset(true);
      setTimeout(() => setJustReset(false), 2000);
    } catch {
      // Backend unreachable — nothing to reset server-side; quietly no-op
      // rather than showing an alarming error for a dev/demo convenience.
    } finally {
      setResetting(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={30} />
          <div className="leading-none">
            <p className="font-heading text-[15px] font-bold text-ink">Niriksh AI</p>
            <p className="label-caps mt-0.5 text-ink-secondary">Merchant Dashboard</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-sm font-semibold text-ink">{name}</span>
          <span className="text-xs text-ink-secondary">· {category}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            title="Demo Mode: reset merchant memory, investigation history, and workflow state"
            aria-label="Reset demo data"
            className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold text-ink-secondary transition-all hover:border-ink hover:text-ink active:scale-95 disabled:cursor-wait disabled:opacity-60 md:inline-flex"
          >
            {justReset ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <RotateCcw className={cn("h-3 w-3", resetting && "animate-spin")} />
            )}
            {justReset ? "Demo data reset" : "Illustrative Demo Data"}
          </button>
          <Link
            href="/investigation"
            className="hidden items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink-secondary transition-colors hover:border-ink hover:text-ink lg:inline-flex"
          >
            <Search className="h-3.5 w-3.5" />
            Live Investigation
          </Link>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-secondary transition-all hover:border-ink hover:text-ink active:scale-95"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-warning" />
          </button>
          <div
            className="h-10 w-10 rounded-full bg-ink"
            role="img"
            aria-label={`${name} avatar`}
          />
        </div>
      </div>
    </header>
  );
}
