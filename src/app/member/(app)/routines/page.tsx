import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { getRoutines } from "@/lib/member-data";
import { MemberHeading } from "@/components/member/MemberHeading";
import { formatDay } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RoutinesPage() {
  await requireMember();
  const routines = await getRoutines();

  return (
    <div className="space-y-6">
      <MemberHeading eyebrow="Programming" title="Routines" />

      <ul className="space-y-4">
        {routines.length ? (
          routines.map((r) => (
            <li key={r.id}>
              <Link
                href={`/member/routines/${r.id}`}
                className="block border border-concrete bg-[#0d0d0d] p-5 hover:border-flame"
              >
                <p className="font-body text-xs uppercase tracking-[0.2em] text-flame">
                  {formatDay(r.routine_date)}
                  {r.class_type ? ` · ${r.class_type}` : ""}
                </p>
                <p className="mt-1 font-display text-3xl uppercase">
                  {r.title}
                </p>
                <p className="mt-2 line-clamp-2 whitespace-pre-line font-body text-sm text-bone/55">
                  {r.body}
                </p>
              </Link>
            </li>
          ))
        ) : (
          <li className="border border-concrete bg-[#0d0d0d] p-8 text-center font-body text-bone/50">
            No routines posted yet.
          </li>
        )}
      </ul>
    </div>
  );
}
