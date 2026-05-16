import Link from "next/link";
import { requireMember } from "@/lib/auth";
import {
  getCheckinStats,
  getUpcomingClasses,
  getTodayRoutine,
  getLeaderboard
} from "@/lib/member-data";
import { checkIn } from "@/app/member/actions";
import { MembershipCard } from "@/components/member/MembershipCard";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MemberHome() {
  const { user, profile } = await requireMember();
  const [stats, classes, routine, board] = await Promise.all([
    getCheckinStats(),
    getUpcomingClasses(),
    getTodayRoutine(),
    getLeaderboard()
  ]);
  const myRank = board.find((r) => r.id === user.id);
  const name =
    profile?.first_name ||
    profile?.display_name ||
    profile?.full_name ||
    "Athlete";
  const nextClass = classes[0];

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Welcome back</p>
        <h1 className="text-7xl uppercase leading-[0.8]">
          {name}
          <span className="text-flame">.</span>
        </h1>
      </header>

      <MembershipCard
        memberId={user.id}
        name={profile?.full_name || name}
        status={(profile?.membership_status || "active").toUpperCase()}
      />

      <form action={checkIn}>
        <button className="btn-primary w-full">Check In Now</button>
      </form>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <p className="eyebrow">Attendance</p>
          <Link
            href="/member/checkins"
            className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-flame hover:underline"
          >
            History →
          </Link>
        </div>
        <div className="grid grid-cols-4 divide-x divide-concrete border border-concrete">
          {[
            ["Wk", stats.week],
            ["Mo", stats.month],
            ["Yr", stats.year],
            ["All", stats.all]
          ].map(([label, val]) => (
            <div key={label as string} className="p-4 text-center">
              <p className="stat-num text-flame">{val}</p>
              <p className="mt-1 font-body text-[10px] uppercase tracking-[0.2em] text-bone/40">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {myRank && (
        <Link
          href="/member/leaderboard"
          className="card-link flex items-center justify-between p-6"
        >
          <div>
            <p className="eyebrow">MFLH Rank</p>
            <p className="font-display text-5xl uppercase leading-none">
              #{myRank.rank}
              <span className="ml-2 text-xl text-bone/40">
                / {board.length}
              </span>
            </p>
          </div>
          <p className="font-display text-5xl text-flame">
            {myRank.points}
            <span className="ml-1 text-sm uppercase tracking-widest text-bone/40">
              pts
            </span>
          </p>
        </Link>
      )}

      {nextClass && (
        <section>
          <p className="eyebrow mb-3">Next class</p>
          <Link
            href={`/member/schedule/${nextClass.id}`}
            className="card-link block p-6"
          >
            <p className="font-body text-sm text-flame">
              {formatDateTime(nextClass.starts_at)}
            </p>
            <p className="mt-1 font-display text-4xl uppercase leading-none">
              {nextClass.title}
            </p>
            <p className="mt-3 font-body text-xs uppercase tracking-[0.2em] text-bone/40">
              {nextClass.mine ? "You're in" : "Tap to register"} ·{" "}
              {nextClass.registered}/{nextClass.capacity}
            </p>
          </Link>
        </section>
      )}

      <section>
        <p className="eyebrow mb-3">Today&apos;s routine</p>
        {routine ? (
          <Link
            href={`/member/routines/${routine.id}`}
            className="card-link block p-6"
          >
            <p className="font-display text-4xl uppercase leading-none">
              {routine.title}
            </p>
            <p className="mt-3 line-clamp-3 whitespace-pre-line font-body text-sm text-bone/55">
              {routine.body}
            </p>
          </Link>
        ) : (
          <p className="card p-6 font-body text-sm text-bone/50">
            No routine posted yet. Check back before class.
          </p>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3">
        {[
          ["/member/benchmarks", "Hyrox"],
          ["/member/routines", "Routines"],
          ["/member/checkins", "History"],
          ["/member/workouts", "Train"]
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="card-link flex items-center justify-center p-6 font-display text-3xl uppercase"
          >
            {label}
          </Link>
        ))}
      </section>
    </div>
  );
}
