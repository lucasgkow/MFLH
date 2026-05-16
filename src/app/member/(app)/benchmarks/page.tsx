import { requireMember } from "@/lib/auth";
import { getBenchmarks, getMyBenchmarkResults } from "@/lib/member-data";
import { recordBenchmark } from "@/app/member/actions";
import { secsToClock, formatDay } from "@/lib/format";

export const dynamic = "force-dynamic";

function metricLabel(m: string) {
  return m === "time" ? "Seconds" : m === "reps" ? "Reps" : "Kg";
}
function fmt(metric: string, v: number) {
  return metric === "time" ? secsToClock(v) : String(v);
}

export default async function BenchmarksPage() {
  await requireMember();
  const [benchmarks, results] = await Promise.all([
    getBenchmarks(),
    getMyBenchmarkResults()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Hyrox</p>
        <h1 className="text-5xl uppercase leading-none">Benchmarks</h1>
        <p className="mt-2 font-body text-sm text-bone/55">
          Track every station. Beat your numbers.
        </p>
      </div>

      <div className="space-y-4">
        {benchmarks.map((b) => {
          const mine = results
            .filter((r) => r.benchmark_id === b.id)
            .sort((a, c) => +new Date(c.recorded_on) - +new Date(a.recorded_on));
          const best =
            mine.length === 0
              ? null
              : b.metric === "time"
                ? Math.min(...mine.map((r) => r.value))
                : Math.max(...mine.map((r) => r.value));

          return (
            <details
              key={b.id}
              className="group border border-concrete bg-[#0d0d0d]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between p-5">
                <div>
                  <p className="font-display text-2xl uppercase">
                    {b.name}
                  </p>
                  <p className="font-body text-xs uppercase tracking-widest text-bone/40">
                    {mine.length} logged
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl text-flame">
                    {best != null ? fmt(b.metric, best) : "—"}
                  </p>
                  <p className="font-body text-[10px] uppercase tracking-widest text-bone/40">
                    Best
                  </p>
                </div>
              </summary>

              <div className="space-y-4 border-t border-concrete p-5">
                <form
                  action={recordBenchmark}
                  className="grid grid-cols-2 gap-3"
                >
                  <input type="hidden" name="benchmark_id" value={b.id} />
                  <div>
                    <label className="field-label">
                      {metricLabel(b.metric)} *
                    </label>
                    <input
                      name="value"
                      type="number"
                      step="0.01"
                      required
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label className="field-label">Date</label>
                    <input
                      name="recorded_on"
                      type="date"
                      defaultValue={new Date()
                        .toISOString()
                        .slice(0, 10)}
                      className="field-input"
                    />
                  </div>
                  <input
                    name="notes"
                    placeholder="Notes (optional)"
                    className="field-input col-span-2"
                  />
                  <button className="btn-primary col-span-2 text-xl">
                    Save Result
                  </button>
                </form>

                {mine.length > 0 && (
                  <ul className="divide-y divide-concrete border border-concrete">
                    {mine.map((r) => (
                      <li
                        key={r.id}
                        className="flex items-center justify-between px-4 py-3 font-body text-sm"
                      >
                        <span className="text-bone/50">
                          {formatDay(r.recorded_on)}
                        </span>
                        <span className="font-display text-xl">
                          {fmt(b.metric, r.value)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
