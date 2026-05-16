"use client";

import { useState } from "react";
import { saveWorkoutLog } from "@/app/member/actions";

type Entry = {
  exercise: string;
  reps: string;
  weight_kg: string;
  distance_m: string;
  duration_sec: string;
};

const blank: Entry = {
  exercise: "",
  reps: "",
  weight_kg: "",
  distance_m: "",
  duration_sec: ""
};

export function WorkoutLogForm() {
  const [entries, setEntries] = useState<Entry[]>([{ ...blank }]);

  function update(i: number, key: keyof Entry, val: string) {
    setEntries((prev) =>
      prev.map((e, idx) => (idx === i ? { ...e, [key]: val } : e))
    );
  }

  return (
    <form action={saveWorkoutLog} className="space-y-5">
      <input
        type="hidden"
        name="entries"
        value={JSON.stringify(entries.filter((e) => e.exercise.trim()))}
      />
      <div>
        <label className="field-label" htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="e.g. Built Different"
          className="field-input"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="log_date">
          Date
        </label>
        <input
          id="log_date"
          name="log_date"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="field-input"
        />
      </div>

      <div className="space-y-4">
        <p className="eyebrow">Movements</p>
        {entries.map((e, i) => (
          <div
            key={i}
            className="space-y-2 border border-concrete bg-[#0d0d0d] p-4"
          >
            <input
              value={e.exercise}
              onChange={(ev) => update(i, "exercise", ev.target.value)}
              placeholder="Exercise"
              className="field-input"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={e.reps}
                onChange={(ev) => update(i, "reps", ev.target.value)}
                placeholder="Reps"
                inputMode="numeric"
                className="field-input"
              />
              <input
                value={e.weight_kg}
                onChange={(ev) => update(i, "weight_kg", ev.target.value)}
                placeholder="Weight (kg)"
                inputMode="decimal"
                className="field-input"
              />
              <input
                value={e.distance_m}
                onChange={(ev) => update(i, "distance_m", ev.target.value)}
                placeholder="Distance (m)"
                inputMode="decimal"
                className="field-input"
              />
              <input
                value={e.duration_sec}
                onChange={(ev) => update(i, "duration_sec", ev.target.value)}
                placeholder="Time (sec)"
                inputMode="numeric"
                className="field-input"
              />
            </div>
            {entries.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setEntries((p) => p.filter((_, idx) => idx !== i))
                }
                className="font-body text-xs uppercase tracking-widest text-bone/40 hover:text-flame"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setEntries((p) => [...p, { ...blank }])}
          className="btn-outline w-full text-xl"
        >
          + Add Movement
        </button>
      </div>

      <div>
        <label className="field-label" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="field-input"
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Save Workout
      </button>
    </form>
  );
}
