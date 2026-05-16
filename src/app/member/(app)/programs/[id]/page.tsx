import { notFound } from "next/navigation";
import { requireMember } from "@/lib/auth";
import { getProgram } from "@/lib/member-data";
import { MemberHeading } from "@/components/member/MemberHeading";

export const dynamic = "force-dynamic";

export default async function ProgramDetailPage({
  params
}: {
  params: { id: string };
}) {
  await requireMember();
  const data = await getProgram(params.id);
  if (!data) notFound();
  const { program, workouts } = data;

  const byWeek = (workouts as any[]).reduce<Record<number, any[]>>(
    (acc, w) => {
      (acc[w.week] ||= []).push(w);
      return acc;
    },
    {}
  );
  const weeks = Object.keys(byWeek)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      <MemberHeading
        eyebrow={`${program.weeks}-week program`}
        title={program.title}
        back={{ href: "/member/programs", label: "Programs" }}
      />
      {program.description && (
        <p className="font-body text-bone/70">{program.description}</p>
      )}

      {weeks.length ? (
        weeks.map((wk) => (
          <section key={wk} className="space-y-3">
            <h2 className="font-display text-3xl uppercase text-flame">
              Week {wk}
            </h2>
            {byWeek[wk]
              .sort((a, b) => a.day - b.day || a.position - b.position)
              .map((w) => (
                <div key={w.id} className="card p-5">
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-bone/40">
                    Day {w.day}
                  </p>
                  <p className="mt-1 font-display text-2xl uppercase">
                    {w.title}
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap font-body text-sm text-bone/75">
                    {w.body}
                  </pre>
                </div>
              ))}
          </section>
        ))
      ) : (
        <p className="card p-8 text-center font-body text-bone/50">
          Workouts coming soon.
        </p>
      )}
    </div>
  );
}
