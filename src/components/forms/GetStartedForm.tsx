"use client";

import { useState } from "react";
import { GOAL_OPTIONS } from "@/lib/constants";

export function GetStartedForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setStatus("done");
      e.currentTarget.reset();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-flame bg-[#0d0d0d] p-10 text-center">
        <p className="font-display text-4xl uppercase text-flame">
          You&apos;re In.
        </p>
        <p className="mt-3 font-body text-bone/70">
          We got your inquiry. A coach will reach out shortly. Now go warm up.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">
            Name *
          </label>
          <input id="name" name="name" required className="field-input" />
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="field-input"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="field-label">
            Phone
          </label>
          <input id="phone" name="phone" className="field-input" />
        </div>
        <div>
          <label htmlFor="goal" className="field-label">
            Primary Goal
          </label>
          <select id="goal" name="goal" className="field-input">
            <option value="">Select a goal</option>
            {GOAL_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="referral_source" className="field-label">
          How did you hear about us?
        </label>
        <input
          id="referral_source"
          name="referral_source"
          className="field-input"
        />
      </div>
      <div>
        <label htmlFor="message" className="field-label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="field-input"
        />
      </div>

      {status === "error" && (
        <p className="font-body text-sm text-flame">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Start Training"}
      </button>
    </form>
  );
}
