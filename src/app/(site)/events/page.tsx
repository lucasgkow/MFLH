import type { Metadata } from "next";
import { getUpcomingEvents, getPastEvents } from "@/lib/data";
import { EventsBrowser } from "@/components/EventsBrowser";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Run Club, special events, competitions, and workshops at MFLH Collective."
};

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents()
  ]);

  return (
    <section className="container-site py-20">
      <p className="eyebrow mb-4">Events Calendar</p>
      <h1 className="text-6xl uppercase leading-[0.9] sm:text-8xl">
        Show Up<span className="text-flame">.</span>
      </h1>
      <p className="mt-6 max-w-xl font-body text-lg text-bone/75">
        Run Club every Sunday, 7AM. Plus competitions, workshops, and special
        events all year.
      </p>

      <div className="mt-12">
        <EventsBrowser upcoming={upcoming} past={past} />
      </div>
    </section>
  );
}
