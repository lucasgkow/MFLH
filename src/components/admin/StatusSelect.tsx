"use client";

import { useTransition } from "react";

export function StatusSelect({
  id,
  current,
  options,
  action
}: {
  id: string;
  current: string;
  options: string[];
  action: (id: string, status: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={(e) =>
        startTransition(() => action(id, e.target.value))
      }
      className="border border-concrete bg-[#111] px-3 py-1.5 font-body text-sm text-bone disabled:opacity-50"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
