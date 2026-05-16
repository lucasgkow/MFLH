import Link from "next/link";
import { adminGetClasses } from "@/lib/admin-data";
import { deleteClass } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminClassesPage() {
  const classes = await adminGetClasses();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl uppercase">Classes</h1>
        <Link href="/admin/classes/new" className="btn-primary text-xl">
          + New Class
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-concrete">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-[#0d0d0d] font-body text-xs uppercase tracking-[0.15em] text-bone/50">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Starts</th>
              <th className="p-4">Capacity</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete font-body text-sm">
            {classes.length ? (
              classes.map((c) => (
                <tr key={c.id} className="hover:bg-[#0d0d0d]">
                  <td className="p-4 font-bold">{c.title}</td>
                  <td className="p-4 text-bone/70">{c.class_type}</td>
                  <td className="p-4 text-bone/70">
                    {formatDateTime(c.starts_at)}
                  </td>
                  <td className="p-4 text-bone/70">{c.capacity}</td>
                  <td className="flex items-center gap-4 p-4">
                    <Link
                      href={`/admin/classes/${c.id}`}
                      className="font-bold uppercase tracking-[0.2em] text-bone/80 hover:text-flame"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={c.id} action={deleteClass} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-bone/50">
                  No classes yet. Create the first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
