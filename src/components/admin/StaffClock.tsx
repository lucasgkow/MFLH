"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clockToggle } from "@/app/admin/staff-actions";

type RosterEntry = {
  id: string;
  full_name: string;
  role: string;
  openSince: string | null;
};

function elapsed(sinceISO: string, now: number) {
  const ms = now - new Date(sinceISO).getTime();
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

export function StaffClock({ roster }: { roster: RosterEntry[] }) {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const [active, setActive] = useState<RosterEntry | null>(null);
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 4000);
    return () => clearTimeout(t);
  }, [flash]);

  function open(entry: RosterEntry) {
    setActive(entry);
    setPin("");
  }

  function close() {
    setActive(null);
    setPin("");
  }

  function press(d: string) {
    setPin((p) => (p.length >= 6 ? p : p + d));
  }

  async function submit() {
    if (!active || pin.length < 4 || busy) return;
    setBusy(true);
    const res = await clockToggle(active.id, pin);
    setBusy(false);
    if (res.ok) {
      setFlash({
        ok: true,
        text: `${res.name} clocked ${res.action === "in" ? "in" : "out"}.`
      });
      close();
      router.refresh();
    } else {
      setFlash({ ok: false, text: res.error || "Try again." });
      setPin("");
    }
  }

  const clockedIn = roster.filter((r) => r.openSince);
  const time = new Date(now).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Staff Time Clock</p>
          <p className="font-display text-7xl leading-none">{time}</p>
        </div>
        <p className="font-body text-sm text-bone/50">
          {clockedIn.length} on the clock
        </p>
      </div>

      {flash && (
        <p
          className={`mt-6 border px-5 py-3 font-body text-sm ${
            flash.ok
              ? "border-flame/40 bg-flame/10 text-bone"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          {flash.text}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roster.map((s) => {
          const on = !!s.openSince;
          return (
            <button
              key={s.id}
              onClick={() => open(s)}
              className={`card-link flex items-center justify-between p-5 text-left ${
                on ? "border-flame" : ""
              }`}
            >
              <span>
                <span className="block font-display text-2xl uppercase leading-none">
                  {s.full_name}
                </span>
                <span className="mt-1 block font-body text-[11px] uppercase tracking-widest text-bone/40">
                  {s.role}
                </span>
              </span>
              <span className="text-right">
                {on ? (
                  <>
                    <span className="block font-body text-xs font-bold uppercase tracking-widest text-flame">
                      On
                    </span>
                    <span className="block font-body text-sm tabular-nums text-bone/60">
                      {elapsed(s.openSince!, now)}
                    </span>
                  </>
                ) : (
                  <span className="block font-body text-xs uppercase tracking-widest text-bone/30">
                    Off
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {roster.length === 0 && (
        <p className="mt-8 border border-concrete bg-[#0d0d0d] p-12 text-center font-body text-bone/50">
          No active staff yet. Add staff and set their PINs under Manage Staff.
        </p>
      )}

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
          onClick={close}
        >
          <div
            className="w-full max-w-sm border border-concrete bg-[#0d0d0d] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-body text-[11px] uppercase tracking-widest text-bone/40">
              {active.openSince ? "Clock out" : "Clock in"}
            </p>
            <p className="font-display text-3xl uppercase">{active.full_name}</p>

            <div className="mt-5 flex h-12 items-center justify-center gap-3 border border-concrete bg-[#111]">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`h-3 w-3 rounded-full ${
                    i < pin.length ? "bg-flame" : "bg-concrete"
                  } ${i >= 4 && pin.length <= i ? "opacity-40" : ""}`}
                />
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                <button
                  key={d}
                  onClick={() => press(d)}
                  className="border border-concrete py-4 font-display text-3xl hover:border-flame hover:text-flame"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => setPin("")}
                className="border border-concrete py-4 font-body text-xs uppercase tracking-widest text-bone/50 hover:text-flame"
              >
                Clear
              </button>
              <button
                onClick={() => press("0")}
                className="border border-concrete py-4 font-display text-3xl hover:border-flame hover:text-flame"
              >
                0
              </button>
              <button
                onClick={submit}
                disabled={pin.length < 4 || busy}
                className="bg-flame py-4 font-display text-2xl uppercase text-ink transition-colors hover:bg-bone disabled:opacity-40"
              >
                {busy ? "…" : "Go"}
              </button>
            </div>

            <button
              onClick={close}
              className="mt-4 w-full font-body text-xs uppercase tracking-widest text-bone/40 hover:text-flame"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
