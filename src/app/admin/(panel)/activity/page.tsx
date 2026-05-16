import { adminGetActivity } from "@/lib/admin-data";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const items = await adminGetActivity();

  return (
    <div>
      <h1 className="text-5xl uppercase">Activity</h1>
      <p className="mt-2 font-body text-sm text-bone/50">
        Live member activity across the app — signups, check-ins, workouts,
        registrations, posts.
      </p>

      <div className="mt-8 divide-y divide-concrete border border-concrete bg-[#0d0d0d]">
        {items.length ? (
          items.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <span className="w-20 shrink-0 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-flame">
                  {a.kind}
                </span>
                <span className="font-body text-sm text-bone/80">
                  {a.text}
                </span>
              </div>
              <span className="shrink-0 font-body text-xs text-bone/40">
                {formatDateTime(a.when)}
              </span>
            </div>
          ))
        ) : (
          <p className="px-5 py-10 text-center font-body text-sm text-bone/50">
            No member activity yet.
          </p>
        )}
      </div>
    </div>
  );
}
