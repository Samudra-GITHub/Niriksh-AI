"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Logo } from "@/components/Logo";
import { merchant } from "@/lib/demoData";

export function DashboardHeader({
  name = merchant.name,
  category = merchant.category,
}: {
  name?: string;
  category?: string;
}) {
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
          <span className="hidden rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold text-ink-secondary md:inline-flex">
            Illustrative Demo Data
          </span>
          <Link
            href="/investigation"
            className="hidden items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink-secondary transition-colors hover:border-ink hover:text-ink lg:inline-flex"
          >
            <Search className="h-3.5 w-3.5" />
            Live Investigation
          </Link>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-secondary transition-colors hover:border-ink hover:text-ink"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-warning" />
          </button>
          <div className="h-10 w-10 rounded-full bg-ink" />
        </div>
      </div>
    </header>
  );
}
