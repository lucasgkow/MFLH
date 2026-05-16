"use client";

import { useMemo, useState } from "react";
import type { EventRow } from "@/lib/types";
import { EventCard } from "@/components/EventCard";
import { EVENT_CATEGORIES } from "@/lib/constants";

export function EventsBrowser({
  upcoming,
  past
}: {
  upcoming: EventRow[];
  past: EventRow[];
}) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [category, setCategory] = useState<string>("All");

  const source = tab === "upcoming" ? upcoming : past;
  const filtered = useMemo(
    () =>
      category === "All"
        ? source
        : source.filter((e) => e.category === category),
    [source, category]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex border border-concrete">
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 font-display text-xl uppercase tracking-wide transition-colors ${
                tab === t
                  ? "bg-flame text-ink"
                  : "text-bone/60 hover:text-flame"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {["All", ...EVENT_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`border px-4 py-2 font-body text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              category === c
                ? "border-flame text-flame"
                : "border-concrete text-bone/50 hover:text-bone"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      ) : (
        <p className="mt-10 border border-concrete bg-[#0d0d0d] p-12 text-center font-body text-bone/50">
          No {tab} events
          {category !== "All" ? ` in ${category}` : ""} right now. Check back
          soon.
        </p>
      )}
    </div>
  );
}
