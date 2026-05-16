import Link from "next/link";
import { adminGetClasses } from "@/lib/admin-data";
import { deleteClass } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}

export default async function AdminClassesPage() {
  const classes = await adminGetClasses();
  // Calendar agenda: chronological, grouped by day.
  const sorted = [...classes].sort(
    (a, b) => +new Date(a.starts_at) - +new Date(b.starts_at)
  );
  const groups = sorted.reduce<Record<string, typeof sorted>>((acc, c) => {
    const k = dayKey(c.starts_at);
    (acc[k] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl uppercase">Classes</h1>
        <Link href="/admin/classes/new" className="btn-primary text-xl">
          + New Class
        </Link>
      </div>

      <div className="mt-8 space-y-8">
        {Object.keys(groups).length ? (
          Object.entries(groups).map(([day, list]) => (
            <section key={day}>
              <h2 className="border-b border-concrete pb-2 font-display text-2xl uppercase text-flame">
                {day}
              </h2>
              <ul className="mt-3 space-y-2">
                {list.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-4 border border-concrete bg-[#0d0d0d] p-4"
                  >
                    <div className="flex items-center gap-5">
                      <span className="w-20 font-display text-xl text-bone/70">
                        {timeOf(c.starts_at)}
                      </span>
                      <div>
                        <p className="font-display text-2xl uppercase">
                          {c.title}
                        </p>
                        <p className="font-body text-xs uppercase tracking-[0.15em] text-bone/40">
                          {c.class_type} · {c.coach_name} · cap{" "}
                          {c.capacity}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <Link
                        href={`/admin/classes/${c.id}`}
                        className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/80 hover:text-flame"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={c.id} action={deleteClass} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))
        ) : (
          <p className="border border-concrete bg-[#0d0d0d] p-10 text-center font-body text-bone/50">
            No classes yet. Create the first one.
          </p>
        )}
      </div>
    </div>
  );
}
