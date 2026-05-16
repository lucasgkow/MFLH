import { notFound } from "next/navigation";
import { adminGetRoutine } from "@/lib/admin-data";
import { RoutineForm } from "@/components/admin/RoutineForm";

export const dynamic = "force-dynamic";

export default async function EditRoutinePage({
  params
}: {
  params: { id: string };
}) {
  const routine = await adminGetRoutine(params.id);
  if (!routine) notFound();

  return (
    <div>
      <h1 className="text-5xl uppercase">Edit Routine</h1>
      <p className="mt-2 font-body text-sm text-bone/50">{routine.title}</p>
      <div className="mt-8">
        <RoutineForm routine={routine} />
      </div>
    </div>
  );
}
