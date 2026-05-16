import Link from "next/link";
import Image from "next/image";
import type { EventRow } from "@/lib/types";
import { formatEventDate } from "@/lib/format";

export function EventCard({ event }: { event: EventRow }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col border border-concrete bg-[#0d0d0d] transition-colors hover:border-flame"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
        {event.featured_image_url ? (
          <Image
            src={event.featured_image_url}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-5xl text-bone/10">
            MFLH
          </div>
        )}
        <span className="absolute left-4 top-4 bg-flame px-3 py-1 font-body text-[11px] font-bold uppercase tracking-widest text-ink">
          {event.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-flame">
          {formatEventDate(event.event_date, event.event_time)}
        </p>
        <h3 className="mt-2 text-3xl uppercase leading-none">
          {event.title}
        </h3>
        {event.location && (
          <p className="mt-2 font-body text-sm text-bone/60">
            {event.location}
          </p>
        )}
        <span className="mt-auto pt-5 font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/80 group-hover:text-flame">
          Details →
        </span>
      </div>
    </Link>
  );
}
