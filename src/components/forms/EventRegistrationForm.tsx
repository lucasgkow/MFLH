"use client";

import { useState } from "react";

export function EventRegistrationForm({ eventId }: { eventId: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      event_id: eventId,
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone")
    };

    const res = await fetch("/api/event-registrations", {
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
      <div className="border border-flame bg-[#0d0d0d] p-8 text-center">
        <p className="font-display text-3xl uppercase text-flame">
          You&apos;re Registered.
        </p>
        <p className="mt-2 font-body text-bone/70">See you there.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 border border-concrete bg-[#0d0d0d] p-7"
    >
      <p className="font-display text-3xl uppercase">Register</p>
      <div>
        <label htmlFor="ename" className="field-label">
          Name *
        </label>
        <input id="ename" name="name" required className="field-input" />
      </div>
      <div>
        <label htmlFor="eemail" className="field-label">
          Email *
        </label>
        <input
          id="eemail"
          name="email"
          type="email"
          required
          className="field-input"
        />
      </div>
      <div>
        <label htmlFor="ephone" className="field-label">
          Phone
        </label>
        <input id="ephone" name="phone" className="field-input" />
      </div>

      {status === "error" && (
        <p className="font-body text-sm text-flame">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary disabled:opacity-50"
      >
        {status === "sending" ? "Registering…" : "Register"}
      </button>
    </form>
  );
}
