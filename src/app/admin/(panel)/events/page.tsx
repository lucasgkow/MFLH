import Link from "next/link";
import { adminGetEvents } from "@/lib/admin-data";
import { deleteEvent } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EventsAdminPage() {
  const events = await adminGetEvents();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl uppercase">Events</h1>
        <Link href="/admin/events/new" className="btn-primary text-xl">
          + New Event
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-concrete">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[#0d0d0d] font-body text-xs uppercase tracking-[0.15em] text-bone/50">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date</th>
              <th className="p-4">Reg.</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete font-body text-sm">
            {events.length ? (
              events.map((e) => (
                <tr key={e.id} className="hover:bg-[#0d0d0d]">
                  <td className="p-4 font-bold">{e.title}</td>
                  <td className="p-4 text-bone/70">{e.category}</td>
                  <td className="p-4 text-bone/70">
                    {formatEventDate(e.event_date, e.event_time)}
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        e.registration_open
                          ? "text-flame"
                          : "text-bone/40"
                      }
                    >
                      {e.registration_open ? "Open" : "Closed"}
                    </span>
                  </td>
                  <td className="flex items-center gap-4 p-4">
                    <Link
                      href={`/admin/events/${e.id}`}
                      className="font-bold uppercase tracking-[0.2em] text-bone/80 hover:text-flame"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={e.id} action={deleteEvent} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-bone/50">
                  No events yet. Create the first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
