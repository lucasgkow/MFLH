"use client";

import { useState } from "react";
import { CONTACT_SUBJECTS } from "@/lib/constants";

export function ContactForm() {
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

    const res = await fetch("/api/contact", {
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
          Message Sent.
        </p>
        <p className="mt-3 font-body text-bone/70">
          We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cname" className="field-label">
            Name *
          </label>
          <input id="cname" name="name" required className="field-input" />
        </div>
        <div>
          <label htmlFor="cemail" className="field-label">
            Email *
          </label>
          <input
            id="cemail"
            name="email"
            type="email"
            required
            className="field-input"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cphone" className="field-label">
            Phone
          </label>
          <input id="cphone" name="phone" className="field-input" />
        </div>
        <div>
          <label htmlFor="subject" className="field-label">
            Subject
          </label>
          <select id="subject" name="subject" className="field-input">
            <option value="">Select a subject</option>
            {CONTACT_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="cmessage" className="field-label">
          Message *
        </label>
        <textarea
          id="cmessage"
          name="message"
          rows={5}
          required
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
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
