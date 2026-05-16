import Link from "next/link";
import Image from "next/image";
import { getUpcomingEvents, getFeaturedProducts } from "@/lib/data";
import {
  TRAINING_TRACKS,
  FACILITY,
  TESTIMONIALS
} from "@/lib/constants";
import { EventCard } from "@/components/EventCard";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Placeholder } from "@/components/ui/Placeholder";

export const revalidate = 60;

export default async function HomePage() {
  const [events, products] = await Promise.all([
    getUpcomingEvents(3),
    getFeaturedProducts(3)
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <Image
          src="/photos/gym-floor-hero.webp"
          alt="MFLH Collective training floor — hexagon lighting and loaded dumbbell racks"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container-site relative z-10 pb-20 pt-32">
          <p className="eyebrow mb-4">Bohemia, NY · Hyrox Performance</p>
          <h1 className="text-[19vw] leading-[0.82] sm:text-[15vw] lg:text-[170px]">
            MOVE FAST.
            <br />
            LIFT HEAVY<span className="text-flame">.</span>
          </h1>
          <p className="mt-6 max-w-xl font-body text-lg text-bone/80">
            Bohemia&apos;s only Hyrox performance gym. Train with purpose.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/get-started" className="btn-primary">
              Start Training
            </Link>
            <Link href="/schedule" className="btn-outline">
              View Schedule
            </Link>
          </div>
        </div>
      </section>

      {/* CHRIS HARRIS */}
      <section className="border-y border-concrete bg-[#0b0b0b]">
        <div className="container-site grid gap-10 py-20 md:grid-cols-2 md:items-center">
          <Placeholder
            label="PHOTO: Chris Harris competition shot — recommend mid-movement, dark background"
            className="aspect-[4/5] w-full"
          />
          <div>
            <p className="eyebrow mb-4">The Founder</p>
            <h2 className="text-5xl uppercase leading-[0.95] sm:text-6xl">
              Chris Harris
            </h2>
            <p className="mt-6 font-body text-xl italic text-bone/80">
              &ldquo;We don&apos;t build workouts. We build athletes who are
              hard to kill.&rdquo;
            </p>
            <ul className="mt-8 grid gap-3 font-body text-sm text-bone/70">
              <li className="border-l-2 border-flame pl-4">
                4× CrossFit Games qualifier
              </li>
              <li className="border-l-2 border-flame pl-4">
                Hyrox pioneer & competitor
              </li>
              <li className="border-l-2 border-flame pl-4">
                15+ years coaching elite athletes
              </li>
            </ul>
            <Link
              href="/about"
              className="mt-8 inline-block font-body text-sm font-bold uppercase tracking-[0.2em] text-flame hover:underline"
            >
              Read the full story →
            </Link>
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section className="container-site py-24">
        <SectionHeading
          eyebrow="Three Tracks"
          title="Pick Your Fight"
          className="mb-14"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {TRAINING_TRACKS.map((t) => (
            <div
              key={t.code}
              className="flex flex-col border border-concrete bg-[#0d0d0d] p-8 transition-colors hover:border-flame"
            >
              <p className="font-display text-4xl uppercase text-flame">
                {t.code}
              </p>
              <h3 className="mt-2 text-2xl uppercase">{t.title}</h3>
              <p className="mt-4 font-body text-sm text-bone/65">
                {t.blurb}
              </p>
              <Link
                href="/training"
                className="mt-auto pt-6 font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/80 hover:text-flame"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FACILITY */}
      <section className="relative overflow-hidden border-y border-concrete">
        <Image
          src="/photos/equipment-rack.webp"
          alt="MFLH equipment — medicine balls, sandbags and kettlebells against concrete"
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="container-site relative z-10 py-24">
          <SectionHeading
            eyebrow="The Facility"
            title="Everything You Need"
            className="mb-12"
          />
          <div className="grid gap-px border border-concrete bg-concrete sm:grid-cols-2 lg:grid-cols-5">
            {FACILITY.map((f) => (
              <div
                key={f}
                className="bg-ink p-8 text-center font-display text-2xl uppercase"
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="container-site py-24">
        <div className="mb-12 flex items-end justify-between">
          <SectionHeading eyebrow="What's Next" title="Upcoming Events" />
          <Link
            href="/events"
            className="hidden font-body text-xs font-bold uppercase tracking-[0.2em] text-flame hover:underline sm:block"
          >
            All events →
          </Link>
        </div>
        {events.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className="border border-concrete bg-[#0d0d0d] p-10 text-center font-body text-bone/50">
            Events load from Supabase once the project is connected. Run Club
            meets every Sunday, 7AM.
          </p>
        )}
      </section>

      {/* MERCH */}
      <section className="border-y border-concrete bg-[#0b0b0b]">
        <div className="container-site py-24">
          <div className="mb-12 flex items-end justify-between">
            <SectionHeading eyebrow="The Shop" title="Wear The Work" />
            <Link
              href="/shop"
              className="hidden font-body text-xs font-bold uppercase tracking-[0.2em] text-flame hover:underline sm:block"
            >
              Shop all →
            </Link>
          </div>
          {products.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="border border-concrete bg-ink p-10 text-center font-body text-bone/50">
              Merch loads from Supabase once connected. Hoodies, tees, and
              snapbacks incoming.
            </p>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-site py-24">
        <SectionHeading
          eyebrow="The Standard"
          title="What Athletes Say"
          className="mb-14"
        />
        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="border border-concrete bg-[#0d0d0d] p-8"
            >
              <blockquote className="font-body text-lg text-bone/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 font-display text-2xl uppercase text-flame">
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* RUN CLUB */}
      <section className="relative overflow-hidden border-t border-concrete">
        <Image
          src="/photos/community-large.jpg"
          alt="MFLH Collective community group photo"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="container-site relative z-10 py-28 text-center">
          <p className="eyebrow mb-4">Run Club</p>
          <h2 className="text-5xl uppercase leading-[0.95] sm:text-7xl">
            Every Sunday. 7AM.
            <br />A New Location. Show Up<span className="text-flame">.</span>
          </h2>
          <Link
            href="/events"
            className="btn-primary mt-10"
          >
            Register For Run Club
          </Link>
        </div>
      </section>
    </>
  );
}
