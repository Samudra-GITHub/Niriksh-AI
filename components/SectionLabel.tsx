import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "label-caps inline-flex items-center gap-2",
        tone === "light" ? "text-ink-secondary" : "text-white/50",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "light" ? "bg-brand-yellow" : "bg-brand-yellow"
        )}
      />
      {children}
    </span>
  );
}
