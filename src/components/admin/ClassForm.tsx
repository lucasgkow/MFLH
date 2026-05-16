import { saveClass } from "@/app/admin/actions";
import type { GymClass } from "@/lib/types";

export function ClassForm({ gymClass }: { gymClass?: GymClass }) {
  // datetime-local wants "YYYY-MM-DDTHH:mm" in local time
  const dtLocal = gymClass
    ? new Date(
        new Date(gymClass.starts_at).getTime() -
          new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16)
    : "";

  return (
    <form action={saveClass} className="grid max-w-2xl gap-5">
      {gymClass && <input type="hidden" name="id" value={gymClass.id} />}
      <div>
        <label className="field-label" htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={gymClass?.title}
          className="field-input"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="class_type">
            Type
          </label>
          <input
            id="class_type"
            name="class_type"
            defaultValue={gymClass?.class_type ?? ""}
            placeholder="Hyrox / Strength / Conditioning"
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="coach_name">
            Coach
          </label>
          <input
            id="coach_name"
            name="coach_name"
            defaultValue={gymClass?.coach_name ?? ""}
            className="field-input"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="field-label" htmlFor="starts_at">
            Starts *
          </label>
          <input
            id="starts_at"
            name="starts_at"
            type="datetime-local"
            required
            defaultValue={dtLocal}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="duration_min">
            Duration (min)
          </label>
          <input
            id="duration_min"
            name="duration_min"
            type="number"
            defaultValue={gymClass?.duration_min ?? 60}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="capacity">
            Capacity
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            defaultValue={gymClass?.capacity ?? 20}
            className="field-input"
          />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          name="location"
          defaultValue={gymClass?.location ?? "MFLH Collective"}
          className="field-input"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={gymClass?.description ?? ""}
          className="field-input"
        />
      </div>
      <button className="btn-primary w-fit">
        {gymClass ? "Save Changes" : "Create Class"}
      </button>
    </form>
  );
}
