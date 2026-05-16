import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { WorkoutLogForm } from "@/components/member/WorkoutLogForm";

export const dynamic = "force-dynamic";

export default async function NewWorkoutPage() {
  await requireMember();
  return (
    <div className="space-y-6">
      <Link
        href="/member/workouts"
        className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/50 hover:text-flame"
      >
        ← Workouts
      </Link>
      <h1 className="text-5xl uppercase leading-none">Log Workout</h1>
      <WorkoutLogForm />
    </div>
  );
}
