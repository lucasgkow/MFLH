import { notFound } from "next/navigation";
import { adminGetProgram } from "@/lib/admin-data";
import {
  saveProgramWorkout,
  deleteProgramWorkout
} from "@/app/admin/actions";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function EditProgramPage({
  params
}: {
  params: { id: string };
}) {
  const data = await adminGetProgram(params.id);
  if (!data) notFound();
  const { program, workouts } = data;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl uppercase">Edit Program</h1>
        <p className="mt-2 font-body text-sm text-bone/50">
          {program.title}
        </p>
        <div className="mt-8">
          <ProgramForm program={program} />
        </div>
      </div>

      <div>
        <h2 className="text-3xl uppercase">Add Workout</h2>
        <form
          action={saveProgramWorkout}
          className="mt-4 grid max-w-2xl gap-4 border border-concrete bg-[#0d0d0d] p-6"
        >
          <input type="hidden" name="program_id" value={program.id} />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="field-label">Week</label>
              <input
                name="week"
                type="number"
                min={1}
                defaultValue={1}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Day</label>
              <input
                name="day"
                type="number"
                min={1}
                defaultValue={1}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Order</label>
              <input
                name="position"
                type="number"
                defaultValue={0}
                className="field-input"
              />
            </div>
          </div>
          <div>
            <label className="field-label">Title</label>
            <input name="title" required className="field-input" />
          </div>
          <div>
            <label className="field-label">Workout</label>
            <textarea
              name="body"
              rows={5}
              required
              className="field-input font-mono"
            />
          </div>
          <button className="btn-primary w-fit">Add Workout</button>
        </form>
      </div>

      <div>
        <h2 className="text-3xl uppercase">
          Workouts ({workouts.length})
        </h2>
        <div className="mt-4 space-y-3">
          {workouts.length ? (
            workouts.map((w) => (
              <div
                key={w.id}
                className="border border-concrete bg-[#0d0d0d] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-flame">
                      Week {w.week} · Day {w.day}
                    </p>
                    <p className="font-display text-2xl uppercase">
                      {w.title}
                    </p>
                  </div>
                  <DeleteButton
                    id={w.id}
                    action={deleteProgramWorkout}
                  />
                </div>
                <pre className="mt-3 whitespace-pre-wrap font-body text-sm text-bone/70">
                  {w.body}
                </pre>
              </div>
            ))
          ) : (
            <p className="border border-concrete bg-[#0d0d0d] p-8 text-center font-body text-bone/50">
              No workouts in this program yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
