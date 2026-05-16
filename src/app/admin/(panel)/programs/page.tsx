import Link from "next/link";
import { adminGetPrograms } from "@/lib/admin-data";
import { deleteProgram } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  const programs = await adminGetPrograms();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl uppercase">Programs</h1>
        <Link href="/admin/programs/new" className="btn-primary text-xl">
          + New Program
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {programs.length ? (
          programs.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between border border-concrete bg-[#0d0d0d] p-5"
            >
              <div>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-flame">
                  {p.weeks} weeks · {p.count} workouts ·{" "}
                  {p.published ? "Published" : "Draft"}
                </p>
                <p className="font-display text-2xl uppercase">
                  {p.title}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/programs/${p.id}`}
                  className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/80 hover:text-flame"
                >
                  Edit
                </Link>
                <DeleteButton id={p.id} action={deleteProgram} />
              </div>
            </div>
          ))
        ) : (
          <p className="border border-concrete bg-[#0d0d0d] p-10 text-center font-body text-bone/50">
            No programs yet.
          </p>
        )}
      </div>
    </div>
  );
}
