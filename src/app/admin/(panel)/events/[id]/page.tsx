import { notFound } from "next/navigation";
import { adminGetEvent } from "@/lib/admin-data";
import { EventForm } from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params
}: {
  params: { id: string };
}) {
  const event = await adminGetEvent(params.id);
  if (!event) notFound();

  return (
    <div>
      <h1 className="text-5xl uppercase">Edit Event</h1>
      <p className="mt-2 font-body text-sm text-bone/50">{event.title}</p>
      <div className="mt-8">
        <EventForm event={event} />
      </div>
    </div>
  );
}
