import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <Logo size={32} />
              <span className="font-heading text-[17px] font-bold tracking-tight">
                Niriksh AI
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
              The autonomous AI operations teammate for Paytm merchants —
              detects, investigates, acts, and verifies, so merchants never
              have to find problems on their own.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="label-caps text-ink-secondary">Product</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href="/#problem" className="hover:text-brand-yellow">The Problem</Link></li>
                <li><Link href="/#architecture" className="hover:text-brand-yellow">Architecture</Link></li>
                <li><Link href="/investigation" className="hover:text-brand-yellow">Live Investigation</Link></li>
                <li><Link href="/dashboard" className="hover:text-brand-yellow">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <p className="label-caps text-ink-secondary">Hackathon</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-secondary">
                <li>Paytm Build for India AI</li>
                <li>Bengaluru Edition 2026</li>
                <li>Track 3 — Autonomous AI Teammates</li>
              </ul>
            </div>
            <div>
              <p className="label-caps text-ink-secondary">Team</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-secondary">
                <li>Samudra Kar</li>
                <li>Maithrayi M S</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 text-xs text-ink-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Niriksh AI. Built for Paytm Build for India AI Hackathon.</p>
          <p>All merchant data shown is illustrative demo data.</p>
        </div>
      </div>
    </footer>
  );
}
