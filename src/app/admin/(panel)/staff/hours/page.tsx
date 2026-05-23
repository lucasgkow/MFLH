import Link from "next/link";
import { cookies } from "next/headers";
import { getHoursReport } from "@/lib/staff-data";
import { verifyReportPin, lockReport } from "@/app/admin/staff-actions";
import { REPORT_COOKIE, reportPinIsDefault } from "@/lib/staff-report";
import { formatHours, decimalHours, formatDateTime, money } from "@/lib/format";

export const dynamic = "force-dynamic";

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function HoursReportPage({
  searchParams
}: {
  searchParams: { from?: string; to?: string; bad?: string };
}) {
  const unlocked = cookies().get(REPORT_COOKIE)?.value === "1";

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-sm py-10">
        <h1 className="text-5xl uppercase">Hours</h1>
        <p className="mt-3 font-body text-sm text-bone/50">
          Enter the manager PIN to view hours and payroll.
        </p>
        {searchParams.bad && (
          <p className="mt-4 border border-red-500/40 bg-red-500/10 px-4 py-2 font-body text-sm text-red-300">
            Incorrect PIN.
          </p>
        )}
        <form action={verifyReportPin} className="mt-6 grid gap-4">
          <input
            name="pin"
            type="password"
            inputMode="numeric"
            autoFocus
            placeholder="Manager PIN"
            className="field-input text-center text-2xl tracking-[0.4em]"
          />
          <button className="btn-primary">Unlock</button>
        </form>
        {reportPinIsDefault() && (
          <p className="mt-6 border border-concrete bg-[#0d0d0d] p-4 font-body text-xs text-bone/50">
            Using the default PIN <span className="text-flame">0000</span>. Set{" "}
            <code>STAFF_REPORT_PIN</code> in your environment to change it.
          </p>
        )}
        <Link
          href="/admin/staff"
          className="mt-6 block font-body text-xs uppercase tracking-widest text-bone/40 hover:text-flame"
        >
          ← Back to Clock
        </Link>
      </div>
    );
  }

  const today = new Date();
  const twoWeeksAgo = new Date(today.getTime() - 13 * 864e5);
  const from = searchParams.from || isoDay(twoWeeksAgo);
  const to = searchParams.to || isoDay(today);
  const report = await getHoursReport(`${from}T00:00:00`, `${to}T23:59:59`);

  const grandHours = report.reduce((a, r) => a + r.totalMs, 0);
  const grandPay = report.reduce(
    (a, r) =>
      a +
      (r.staff.hourly_rate != null
        ? decimalHours(r.totalMs) * r.staff.hourly_rate
        : 0),
    0
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-5xl uppercase">Hours & Payroll</h1>
        <form action={lockReport}>
          <button className="font-body text-xs font-bold uppercase tracking-widest text-bone/50 hover:text-flame">
            Lock
          </button>
        </form>
      </div>

      <form method="get" className="mb-8 flex flex-wrap items-end gap-4">
        <div>
          <label className="field-label" htmlFor="from">
            From
          </label>
          <input
            id="from"
            name="from"
            type="date"
            defaultValue={from}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="to">
            To
          </label>
          <input
            id="to"
            name="to"
            type="date"
            defaultValue={to}
            className="field-input"
          />
        </div>
        <button className="btn-outline !px-6 !py-3 !text-base">Apply</button>
      </form>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="stat-tile">
          <p className="font-body text-[11px] uppercase tracking-widest text-bone/40">
            Total Hours
          </p>
          <p className="stat-num mt-2">{formatHours(grandHours)}</p>
        </div>
        <div className="stat-tile">
          <p className="font-body text-[11px] uppercase tracking-widest text-bone/40">
            Est. Payroll
          </p>
          <p className="stat-num mt-2">{money(grandPay)}</p>
        </div>
        <div className="stat-tile">
          <p className="font-body text-[11px] uppercase tracking-widest text-bone/40">
            Staff With Hours
          </p>
          <p className="stat-num mt-2">{report.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {report.map((r) => (
          <details
            key={r.staff.id}
            className="border border-concrete bg-[#0d0d0d]"
          >
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-5 py-4">
              <span className="font-display text-2xl uppercase">
                {r.staff.full_name}
              </span>
              <span className="flex items-center gap-6 font-body text-sm">
                <span className="tabular-nums text-bone/80">
                  {formatHours(r.totalMs)}
                </span>
                {r.staff.hourly_rate != null && (
                  <span className="tabular-nums text-flame">
                    {money(decimalHours(r.totalMs) * r.staff.hourly_rate)}
                  </span>
                )}
                {r.openMs > 0 && (
                  <span className="font-body text-[11px] uppercase tracking-widest text-flame">
                    On now
                  </span>
                )}
              </span>
            </summary>
            <div className="divide-y divide-concrete border-t border-concrete">
              {r.entries.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 font-body text-sm"
                >
                  <span className="text-bone/70">
                    {formatDateTime(e.clock_in)}
                  </span>
                  <span className="text-bone/40">→</span>
                  <span className="text-bone/70">
                    {e.clock_out ? (
                      formatDateTime(e.clock_out)
                    ) : (
                      <span className="text-flame">still on the clock</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </details>
        ))}
        {report.length === 0 && (
          <p className="border border-concrete bg-[#0d0d0d] p-12 text-center font-body text-bone/50">
            No clock-ins in this range.
          </p>
        )}
      </div>
    </div>
  );
}
