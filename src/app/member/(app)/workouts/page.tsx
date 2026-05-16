import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { getMyWorkoutLogs } from "@/lib/member-data";
import { deleteWorkoutLog } from "@/app/member/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDay } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function WorkoutsPage() {
  await requireMember();
  const logs = await getMyWorkoutLogs();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Training Log</p>
          <h1 className="text-5xl uppercase leading-none">Workouts</h1>
        </div>
        <Link href="/member/workouts/new" className="btn-primary text-xl">
          + Log
        </Link>
      </div>

      <ul className="space-y-4">
        {logs.length ? (
          logs.map((l) => (
            <li
              key={l.id}
              className="border border-concrete bg-[#0d0d0d] p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-flame">
                    {formatDay(l.log_date)}
                  </p>
                  <p className="font-display text-3xl uppercase">
                    {l.title}
                  </p>
                </div>
                <DeleteButton id={l.id} action={deleteWorkoutLog} />
              </div>
              {l.workout_entries?.length > 0 && (
                <ul className="mt-3 space-y-1 font-body text-sm text-bone/70">
                  {l.workout_entries
                    .sort((a, b) => a.position - b.position)
                    .map((e) => (
                      <li key={e.id} className="flex justify-between">
                        <span>{e.exercise}</span>
                        <span className="text-bone/45">
                          {[
                            e.reps && `${e.reps} reps`,
                            e.weight_kg && `${e.weight_kg} kg`,
                            e.distance_m && `${e.distance_m} m`,
                            e.duration_sec && `${e.duration_sec} s`
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
              {l.notes && (
                <p className="mt-3 font-body text-sm italic text-bone/50">
                  {l.notes}
                </p>
              )}
            </li>
          ))
        ) : (
          <li className="border border-concrete bg-[#0d0d0d] p-8 text-center font-body text-bone/50">
            No workouts logged yet. Hit “+ Log” after your next session.
          </li>
        )}
      </ul>
    </div>
  );
}
