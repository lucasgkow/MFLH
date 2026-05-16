import { saveProgram } from "@/app/admin/actions";
import type { Program } from "@/lib/types";

export function ProgramForm({ program }: { program?: Program }) {
  return (
    <form action={saveProgram} className="grid max-w-2xl gap-5">
      {program && <input type="hidden" name="id" value={program.id} />}
      <div>
        <label className="field-label" htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={program?.title}
          className="field-input"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="slug">
            Slug (auto if blank)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={program?.slug ?? ""}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="weeks">
            Weeks
          </label>
          <input
            id="weeks"
            name="weeks"
            type="number"
            min={1}
            defaultValue={program?.weeks ?? 4}
            className="field-input"
          />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={program?.description ?? ""}
          className="field-input"
        />
      </div>
      <label className="flex items-center gap-3 font-body text-sm text-bone/80">
        <input
          type="checkbox"
          name="published"
          defaultChecked={program?.published ?? true}
          className="h-4 w-4 accent-flame"
        />
        Published (visible to members)
      </label>
      <button className="btn-primary w-fit">
        {program ? "Save Changes" : "Create Program"}
      </button>
    </form>
  );
}
