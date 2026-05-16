"use client";

import { useTransition } from "react";

export function DeleteButton({
  id,
  action,
  label = "Delete"
}: {
  id: string;
  action: (id: string) => Promise<void>;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this item? This cannot be undone.")) {
          startTransition(() => action(id));
        }
      }}
      className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/50 hover:text-flame disabled:opacity-50"
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}
