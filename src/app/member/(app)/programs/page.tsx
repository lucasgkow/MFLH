import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { getPrograms } from "@/lib/member-data";
import { MemberHeading } from "@/components/member/MemberHeading";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  await requireMember();
  const programs = await getPrograms();

  return (
    <div className="space-y-6">
      <MemberHeading eyebrow="Train" title="Programs" />

      <ul className="space-y-4">
        {programs.length ? (
          programs.map((p) => (
            <li key={p.id}>
              <Link
                href={`/member/programs/${p.id}`}
                className="card-link block p-6"
              >
                <p className="font-body text-xs uppercase tracking-[0.2em] text-flame">
                  {p.weeks} weeks
                </p>
                <p className="mt-1 font-display text-3xl uppercase">
                  {p.title}
                </p>
                {p.description && (
                  <p className="mt-2 line-clamp-2 font-body text-sm text-bone/55">
                    {p.description}
                  </p>
                )}
              </Link>
            </li>
          ))
        ) : (
          <li className="card p-8 text-center font-body text-bone/50">
            No programs published yet.
          </li>
        )}
      </ul>
    </div>
  );
}
