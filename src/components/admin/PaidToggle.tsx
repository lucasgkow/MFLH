"use client";

import { useTransition } from "react";
import { toggleReferralPaid } from "@/app/admin/referral-actions";

export function PaidToggle({ id, paid }: { id: string; paid: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => toggleReferralPaid(id, !paid))}
      className={`font-body text-xs font-bold uppercase tracking-[0.15em] disabled:opacity-50 ${
        paid ? "text-bone/50 hover:text-flame" : "text-flame hover:text-bone"
      }`}
    >
      {pending ? "…" : paid ? "Paid" : "Mark paid"}
    </button>
  );
}
