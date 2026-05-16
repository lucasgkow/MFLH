import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { getUpcomingClasses } from "@/lib/member-data";
import { registerForClass, cancelRegistration } from "@/app/member/actions";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  await requireMember();
  const classes = await getUpcomingClasses();

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Schedule</p>
        <h1 className="text-5xl uppercase leading-none">Classes</h1>
      </div>

      {classes.length === 0 && (
        <p className="border border-concrete bg-[#0d0d0d] p-8 text-center font-body text-bone/50">
          No upcoming classes posted yet.
        </p>
      )}

      <ul className="space-y-4">
        {classes.map((c) => {
          const full = c.registered >= c.capacity && !c.mine;
          return (
            <li
              key={c.id}
              className="border border-concrete bg-[#0d0d0d] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <Link href={`/member/schedule/${c.id}`} className="flex-1">
                  <p className="font-display text-3xl uppercase">
                    {c.title}
                  </p>
                  <p className="font-body text-sm text-flame">
                    {formatDateTime(c.starts_at)}
                  </p>
                  <p className="mt-1 font-body text-xs uppercase tracking-widest text-bone/40">
                    {c.class_type} · {c.coach_name} · {c.registered}/
                    {c.capacity}
                  </p>
                </Link>
              </div>
              <div className="mt-4">
                {c.mine ? (
                  <form action={cancelRegistration.bind(null, c.id)}>
                    <button className="btn-outline w-full text-xl">
                      Cancel Registration
                    </button>
                  </form>
                ) : full ? (
                  <button
                    disabled
                    className="btn-outline w-full cursor-not-allowed text-xl opacity-40"
                  >
                    Class Full
                  </button>
                ) : (
                  <form action={registerForClass.bind(null, c.id)}>
                    <button className="btn-primary w-full text-xl">
                      Register
                    </button>
                  </form>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
