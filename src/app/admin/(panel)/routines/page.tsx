import Link from "next/link";
import { adminGetRoutines } from "@/lib/admin-data";
import { deleteRoutine } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDay } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminRoutinesPage() {
  const routines = await adminGetRoutines();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl uppercase">Routines</h1>
        <Link href="/admin/routines/new" className="btn-primary text-xl">
          + New Routine
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {routines.length ? (
          routines.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between border border-concrete bg-[#0d0d0d] p-5"
            >
              <div>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-flame">
                  {formatDay(r.routine_date)} ·{" "}
                  {r.published ? "Published" : "Draft"}
                </p>
                <p className="font-display text-2xl uppercase">
                  {r.title}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/routines/${r.id}`}
                  className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/80 hover:text-flame"
                >
                  Edit
                </Link>
                <DeleteButton id={r.id} action={deleteRoutine} />
              </div>
            </div>
          ))
        ) : (
          <p className="border border-concrete bg-[#0d0d0d] p-10 text-center font-body text-bone/50">
            No routines yet.
          </p>
        )}
      </div>
    </div>
  );
}
