import { notFound } from "next/navigation";
import { adminGetClass, adminGetClassRoster } from "@/lib/admin-data";
import { ClassForm } from "@/components/admin/ClassForm";

export const dynamic = "force-dynamic";

export default async function EditClassPage({
  params
}: {
  params: { id: string };
}) {
  const gymClass = await adminGetClass(params.id);
  if (!gymClass) notFound();
  const roster = await adminGetClassRoster(params.id);

  return (
    <div>
      <h1 className="text-5xl uppercase">Edit Class</h1>
      <p className="mt-2 font-body text-sm text-bone/50">{gymClass.title}</p>
      <div className="mt-8">
        <ClassForm gymClass={gymClass} />
      </div>

      <h2 className="mt-12 text-3xl uppercase">
        Roster ({roster.length}/{gymClass.capacity})
      </h2>
      <ul className="mt-4 divide-y divide-concrete border border-concrete">
        {roster.length ? (
          roster.map((r: any) => (
            <li
              key={r.id}
              className="flex justify-between px-4 py-3 font-body text-sm"
            >
              <span>{r.profiles?.display_name || "Athlete"}</span>
              <span className="text-bone/40">{r.status}</span>
            </li>
          ))
        ) : (
          <li className="px-4 py-6 text-center font-body text-sm text-bone/40">
            No one registered yet.
          </li>
        )}
      </ul>
    </div>
  );
}
