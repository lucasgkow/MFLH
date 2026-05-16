// Labeled placeholder for genuinely missing photography. Every instance
// states what shot is needed so the gap is obvious in review.
export function Placeholder({
  label,
  className = ""
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center bg-zinc-900 p-6 text-center ${className}`}
    >
      <span className="font-body text-xs uppercase tracking-[0.2em] text-bone/40">
        [{label}]
      </span>
    </div>
  );
}
