import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMember } from "@/lib/auth";
import { getRoutine } from "@/lib/member-data";
import { formatDay } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RoutineDetailPage({
  params
}: {
  params: { id: string };
}) {
  await requireMember();
  const routine = await getRoutine(params.id);
  if (!routine) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/member/routines"
        className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/50 hover:text-flame"
      >
        ← Routines
      </Link>
      <div>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-flame">
          {formatDay(routine.routine_date)}
          {routine.class_type ? ` · ${routine.class_type}` : ""}
        </p>
        <h1 className="text-5xl uppercase leading-none">{routine.title}</h1>
      </div>
      <pre className="whitespace-pre-wrap border border-concrete bg-[#0d0d0d] p-5 font-body text-bone/85">
        {routine.body}
      </pre>
      <Link href="/member/workouts/new" className="btn-primary w-full">
        Log This Workout
      </Link>
    </div>
  );
}
