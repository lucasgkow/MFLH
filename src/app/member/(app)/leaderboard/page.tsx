import { requireMember } from "@/lib/auth";
import { getLeaderboard } from "@/lib/member-data";
import { MemberHeading } from "@/components/member/MemberHeading";
import { SCORING } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const { user } = await requireMember();
  const rows = await getLeaderboard();
  const me = rows.find((r) => r.id === user.id);

  return (
    <div className="space-y-6">
      <MemberHeading eyebrow="The Board" title="Ranks" />

      <p className="card p-4 font-body text-xs uppercase tracking-[0.15em] text-bone/45">
        MFLH score = check-in ×{SCORING.checkin} · workout ×
        {SCORING.workout} · benchmark ×{SCORING.benchmark} · class attended
        ×{SCORING.classAttended}
      </p>

      {me && (
        <div className="border border-flame bg-flame/10 p-5">
          <p className="eyebrow">Your standing</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="font-display text-5xl uppercase">
              #{me.rank}
              <span className="ml-3 text-2xl text-bone/50">
                of {rows.length}
              </span>
            </p>
            <p className="font-display text-5xl text-flame">
              {me.points}
              <span className="ml-2 text-base uppercase tracking-widest text-bone/40">
                pts
              </span>
            </p>
          </div>
        </div>
      )}

      <ol className="space-y-2">
        {rows.length ? (
          rows.map((r) => {
            const mine = r.id === user.id;
            return (
              <li
                key={r.id}
                className={`flex items-center gap-4 border p-4 ${
                  mine
                    ? "border-flame bg-flame/10"
                    : "border-concrete bg-[#0d0d0d]"
                }`}
              >
                <span
                  className={`w-8 shrink-0 text-center font-display text-3xl ${
                    r.rank <= 3 ? "text-flame" : "text-bone/40"
                  }`}
                >
                  {r.rank}
                </span>
                {r.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.avatar_url}
                    alt=""
                    className="h-10 w-10 object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center bg-concrete font-display text-sm uppercase">
                    {r.display_name.slice(0, 2)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-2xl uppercase leading-none">
                    {r.display_name}
                    {mine && (
                      <span className="ml-2 text-sm text-flame">you</span>
                    )}
                  </p>
                  <p className="mt-1 font-body text-[11px] uppercase tracking-[0.15em] text-bone/40">
                    {r.checkins} chk · {r.workouts} wod · {r.benchmarks}{" "}
                    bench
                  </p>
                </div>
                <span className="font-display text-3xl text-flame">
                  {r.points}
                </span>
              </li>
            );
          })
        ) : (
          <li className="card p-10 text-center font-body text-bone/50">
            No ranked athletes yet. Check in and log work to climb.
          </li>
        )}
      </ol>
    </div>
  );
}
