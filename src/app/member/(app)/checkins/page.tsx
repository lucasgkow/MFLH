import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { getMyCheckins, getCheckinStats } from "@/lib/member-data";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CheckinsPage() {
  await requireMember();
  const [checkins, stats] = await Promise.all([
    getMyCheckins(),
    getCheckinStats()
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/member"
        className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/50 hover:text-flame"
      >
        ← Home
      </Link>
      <div>
        <p className="eyebrow">Attendance</p>
        <h1 className="text-5xl uppercase leading-none">
          {stats.all} Check-ins
        </h1>
      </div>

      <ul className="divide-y divide-concrete border border-concrete">
        {checkins.length ? (
          checkins.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between px-4 py-4"
            >
              <div>
                <p className="font-display text-xl uppercase">
                  {c.classes?.title || "Open Gym"}
                </p>
                <p className="font-body text-xs text-bone/50">
                  {formatDateTime(c.checked_in_at)}
                </p>
              </div>
              <span className="border border-concrete px-3 py-1 font-body text-[10px] font-bold uppercase tracking-widest text-bone/60">
                {c.source}
              </span>
            </li>
          ))
        ) : (
          <li className="px-4 py-10 text-center font-body text-sm text-bone/40">
            No check-ins yet. Tap “Check In Now” on your home screen when you
            get to the gym.
          </li>
        )}
      </ul>
    </div>
  );
}
