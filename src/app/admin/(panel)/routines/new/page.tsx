import { RoutineForm } from "@/components/admin/RoutineForm";

export default function NewRoutinePage() {
  return (
    <div>
      <h1 className="text-5xl uppercase">New Routine</h1>
      <div className="mt-8">
        <RoutineForm />
      </div>
    </div>
  );
}
