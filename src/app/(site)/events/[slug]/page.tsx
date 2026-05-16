import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventBySlug } from "@/lib/data";
import { formatEventDate } from "@/lib/format";
import { EventRegistrationForm } from "@/components/forms/EventRegistrationForm";

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: event.description ?? undefined
  };
}

export default async function EventDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const event = await getEventBySlug(params.slug);
  if (!event) notFound();

  return (
    <article>
      <section className="relative overflow-hidden border-b border-concrete">
        {event.featured_image_url ? (
          <Image
            src={event.featured_image_url}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
        ) : (
          <Image
            src="/photos/brand-wall.webp"
            alt="MFLH wall mural"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
        )}
        <div className="container-site relative z-10 py-24">
          <Link
            href="/events"
            className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/60 hover:text-flame"
          >
            ← All Events
          </Link>
          <span className="mt-6 inline-block bg-flame px-3 py-1 font-body text-[11px] font-bold uppercase tracking-widest text-ink">
            {event.category}
          </span>
          <h1 className="mt-4 text-5xl uppercase leading-[0.9] sm:text-7xl">
            {event.title}
          </h1>
          <p className="mt-4 font-display text-3xl uppercase text-flame">
            {formatEventDate(event.event_date, event.event_time)}
          </p>
          {event.location && (
            <p className="mt-1 font-body text-bone/70">{event.location}</p>
          )}
        </div>
      </section>

      <section className="container-site grid gap-12 py-16 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-3xl uppercase">Details</h2>
          <p className="mt-4 whitespace-pre-line font-body text-lg leading-relaxed text-bone/80">
            {event.description || "More details coming soon."}
          </p>
          {event.max_capacity && (
            <p className="mt-6 font-body text-sm text-bone/50">
              Capacity: {event.max_capacity} athletes
            </p>
          )}
        </div>

        <div className="md:col-span-1">
          {event.registration_open ? (
            <EventRegistrationForm eventId={event.id} />
          ) : (
            <div className="border border-concrete bg-[#0d0d0d] p-8 text-center">
              <p className="font-display text-3xl uppercase text-bone/60">
                Registration Closed
              </p>
              <p className="mt-2 font-body text-sm text-bone/50">
                Follow us on Instagram for the next one.
              </p>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
