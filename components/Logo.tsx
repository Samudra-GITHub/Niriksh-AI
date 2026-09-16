import { cn } from "@/lib/utils";

// "Niriksh" (निरीक्षण) means inspection / observation — the mark reads as a
// radar sweep locking onto a signal, standing in for detect → investigate → verify.
export function Logo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-ink", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.64}
        height={size * 0.64}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="#F5C542"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeDasharray="30 26.6"
          transform="rotate(-90 12 12)"
        />
        <circle cx="12" cy="12" r="2.75" fill="#F5C542" />
      </svg>
    </span>
  );
}
