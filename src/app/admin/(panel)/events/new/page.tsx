import { EventForm } from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="text-5xl uppercase">New Event</h1>
      <div className="mt-8">
        <EventForm />
      </div>
    </div>
  );
}
