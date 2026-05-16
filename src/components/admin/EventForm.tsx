import { saveEvent } from "@/app/admin/actions";
import { EVENT_CATEGORIES } from "@/lib/constants";
import type { EventRow } from "@/lib/types";

export function EventForm({ event }: { event?: EventRow }) {
  return (
    <form action={saveEvent} className="grid max-w-2xl gap-5">
      {event && <input type="hidden" name="id" value={event.id} />}
      <div>
        <label className="field-label" htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={event?.title}
          className="field-input"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="slug">
          Slug (auto-generated if blank)
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={event?.slug}
          className="field-input"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="field-label" htmlFor="event_date">
            Date *
          </label>
          <input
            id="event_date"
            name="event_date"
            type="date"
            required
            defaultValue={event?.event_date}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="event_time">
            Time
          </label>
          <input
            id="event_time"
            name="event_time"
            type="time"
            defaultValue={event?.event_time ?? ""}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={event?.category}
            className="field-input"
          >
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          name="location"
          defaultValue={event?.location ?? ""}
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
          rows={5}
          defaultValue={event?.description ?? ""}
          className="field-input"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="max_capacity">
            Max Capacity
          </label>
          <input
            id="max_capacity"
            name="max_capacity"
            type="number"
            defaultValue={event?.max_capacity ?? ""}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="featured_image_url">
            Featured Image URL
          </label>
          <input
            id="featured_image_url"
            name="featured_image_url"
            defaultValue={event?.featured_image_url ?? ""}
            className="field-input"
          />
        </div>
      </div>
      <label className="flex items-center gap-3 font-body text-sm text-bone/80">
        <input
          type="checkbox"
          name="registration_open"
          defaultChecked={event?.registration_open ?? true}
          className="h-4 w-4 accent-flame"
        />
        Registration open
      </label>
      <button className="btn-primary w-fit">
        {event ? "Save Changes" : "Create Event"}
      </button>
    </form>
  );
}
