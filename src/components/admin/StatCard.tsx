export function StatCard({
  label,
  value
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="border border-concrete bg-[#0d0d0d] p-6">
      <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/50">
        {label}
      </p>
      <p className="mt-3 font-display text-6xl text-flame">{value}</p>
    </div>
  );
}
