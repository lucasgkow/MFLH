import Link from "next/link";
import { requireMember } from "@/lib/auth";
import {
  getCheckinStats,
  getUpcomingClasses,
  getTodayRoutine
} from "@/lib/member-data";
import { checkIn } from "@/app/member/actions";
import { MembershipCard } from "@/components/member/MembershipCard";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MemberHome() {
  const { user, profile } = await requireMember();
  const [stats, classes, routine] = await Promise.all([
    getCheckinStats(),
    getUpcomingClasses(),
    getTodayRoutine()
  ]);
  const name = profile?.display_name || profile?.full_name || "Athlete";
  const nextClass = classes[0];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Welcome back</p>
        <h1 className="text-5xl uppercase leading-none">{name}</h1>
      </div>

      <MembershipCard
        memberId={user.id}
        name={name}
        status={(profile?.membership_status || "active").toUpperCase()}
      />

      <form action={checkIn}>
        <button className="btn-primary w-full">Check In Now</button>
      </form>

      <div>
        <p className="eyebrow mb-3">Attendance</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Week", stats.week],
            ["Month", stats.month],
            ["Year", stats.year],
            ["All time", stats.all]
          ].map(([label, val]) => (
            <div
              key={label as string}
              className="border border-concrete bg-concrete/40 p-5"
            >
              <p className="font-body text-xs uppercase tracking-[0.2em] text-bone/50">
                {label}
              </p>
              <p className="font-display text-5xl">{val}</p>
            </div>
          ))}
        </div>
        <Link
          href="/member/checkins"
          className="mt-3 inline-block font-body text-xs font-bold uppercase tracking-[0.2em] text-flame"
        >
          View all check-ins →
        </Link>
      </div>

      {nextClass && (
        <div>
          <p className="eyebrow mb-3">Next class</p>
          <Link
            href={`/member/schedule/${nextClass.id}`}
            className="block border border-concrete bg-[#0d0d0d] p-5 hover:border-flame"
          >
            <p className="font-display text-3xl uppercase">
              {nextClass.title}
            </p>
            <p className="font-body text-sm text-flame">
              {formatDateTime(nextClass.starts_at)}
            </p>
            <p className="mt-1 font-body text-xs uppercase tracking-widest text-bone/40">
              {nextClass.mine ? "You're registered" : "Tap to register"} ·{" "}
              {nextClass.registered}/{nextClass.capacity}
            </p>
          </Link>
        </div>
      )}

      <div>
        <p className="eyebrow mb-3">Today&apos;s routine</p>
        {routine ? (
          <Link
            href={`/member/routines/${routine.id}`}
            className="block border border-concrete bg-[#0d0d0d] p-5 hover:border-flame"
          >
            <p className="font-display text-3xl uppercase">
              {routine.title}
            </p>
            <p className="mt-2 line-clamp-3 whitespace-pre-line font-body text-sm text-bone/60">
              {routine.body}
            </p>
          </Link>
        ) : (
          <p className="border border-concrete bg-[#0d0d0d] p-5 font-body text-sm text-bone/50">
            No routine posted yet. Check back before class.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/member/benchmarks"
          className="border border-concrete p-5 text-center font-display text-2xl uppercase hover:border-flame"
        >
          Hyrox Board
        </Link>
        <Link
          href="/member/routines"
          className="border border-concrete p-5 text-center font-display text-2xl uppercase hover:border-flame"
        >
          Routines
        </Link>
      </div>
    </div>
  );
}
