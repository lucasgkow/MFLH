import { saveRoutine } from "@/app/admin/actions";
import type { Routine } from "@/lib/types";

export function RoutineForm({ routine }: { routine?: Routine }) {
  return (
    <form action={saveRoutine} className="grid max-w-2xl gap-5">
      {routine && <input type="hidden" name="id" value={routine.id} />}
      <div>
        <label className="field-label" htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={routine?.title}
          className="field-input"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="routine_date">
            Date *
          </label>
          <input
            id="routine_date"
            name="routine_date"
            type="date"
            required
            defaultValue={
              routine?.routine_date ??
              new Date().toISOString().slice(0, 10)
            }
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="class_type">
            Class Type
          </label>
          <input
            id="class_type"
            name="class_type"
            defaultValue={routine?.class_type ?? ""}
            className="field-input"
          />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="body">
          Workout *
        </label>
        <textarea
          id="body"
          name="body"
          rows={12}
          required
          defaultValue={routine?.body}
          placeholder={"A) Strength\\n  Back Squat 5x5\\n\\nB) For Time\\n  ..."}
          className="field-input font-mono"
        />
      </div>
      <label className="flex items-center gap-3 font-body text-sm text-bone/80">
        <input
          type="checkbox"
          name="published"
          defaultChecked={routine?.published ?? true}
          className="h-4 w-4 accent-flame"
        />
        Published (visible to members)
      </label>
      <button className="btn-primary w-fit">
        {routine ? "Save Changes" : "Post Routine"}
      </button>
    </form>
  );
}
