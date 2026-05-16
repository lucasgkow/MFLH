import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMember } from "@/lib/auth";
import { getClassWithRoster } from "@/lib/member-data";
import {
  registerForClass,
  cancelRegistration,
  checkIn
} from "@/app/member/actions";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ClassDetailPage({
  params
}: {
  params: { id: string };
}) {
  const { user } = await requireMember();
  const data = await getClassWithRoster(params.id);
  if (!data) notFound();
  const { gymClass, roster } = data;
  const mine = roster.some(
    (r: any) => r.member_id === user.id && r.status !== "cancelled"
  );

  return (
    <div className="space-y-6">
      <Link
        href="/member/schedule"
        className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/50 hover:text-flame"
      >
        ← Schedule
      </Link>

      <div>
        <p className="font-body text-sm text-flame">
          {formatDateTime(gymClass.starts_at)}
        </p>
        <h1 className="text-5xl uppercase leading-none">{gymClass.title}</h1>
        <p className="mt-2 font-body text-xs uppercase tracking-widest text-bone/40">
          {gymClass.class_type} · {gymClass.coach_name} ·{" "}
          {gymClass.duration_min} min · {gymClass.location}
        </p>
      </div>

      {gymClass.description && (
        <p className="font-body text-bone/75">{gymClass.description}</p>
      )}

      {mine ? (
        <div className="space-y-3">
          <form action={cancelRegistration.bind(null, gymClass.id)}>
            <button className="btn-outline w-full">
              Cancel Registration
            </button>
          </form>
          <form action={checkIn}>
            <input type="hidden" name="class_id" value={gymClass.id} />
            <button className="btn-primary w-full">Check In</button>
          </form>
        </div>
      ) : (
        <form action={registerForClass.bind(null, gymClass.id)}>
          <button className="btn-primary w-full">Register</button>
        </form>
      )}

      <div>
        <p className="eyebrow mb-3">
          Who&apos;s in ({roster.length}/{gymClass.capacity})
        </p>
        <ul className="divide-y divide-concrete border border-concrete">
          {roster.length ? (
            roster.map((r: any) => (
              <li
                key={r.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span className="flex h-8 w-8 items-center justify-center bg-concrete font-display text-sm uppercase">
                  {(r.profiles?.display_name || "A").slice(0, 2)}
                </span>
                <span className="font-body text-sm text-bone/80">
                  {r.profiles?.display_name || "Athlete"}
                  {r.member_id === user.id && (
                    <span className="ml-2 text-flame">(you)</span>
                  )}
                </span>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center font-body text-sm text-bone/40">
              Be the first to register.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
