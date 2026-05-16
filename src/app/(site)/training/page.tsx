import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "What We Offer",
  description:
    "MFLH OG, Pump, and Compete training tracks plus recovery, 24/7 open gym, and the Tempo coffee bar."
};

const OFFERINGS = [
  {
    code: "MFLH OG",
    title: "Hybrid Performance",
    body: "The flagship. Strength, conditioning, Hyrox, and endurance programmed together so nothing gets left behind. Built for athletes who want to be good at everything and weak at nothing.",
    img: "/photos/gym-floor-hero.webp",
    alt: "MFLH training floor with hexagon lighting and dumbbell racks"
  },
  {
    code: "MFLH Pump",
    title: "Hypertrophy & Aesthetics",
    body: "Size, shape, and raw strength. Bodybuilding principles run by coaches who actually compete. Progressive overload, real accessory work, results you can see.",
    img: "/photos/equipment-rack.webp",
    alt: "Rack of medicine balls, sandbags and kettlebells"
  },
  {
    code: "MFLH Compete",
    title: "Competitive CrossFit",
    body: "For athletes chasing the leaderboard. Advanced progressions, high-skill gymnastics, Olympic lifting, and competition prep. No hand-holding — pure work.",
    img: "/photos/conditioning-bikes.webp",
    alt: "Row of assault bikes on the conditioning floor"
  }
];

const SUPPORT = [
  {
    title: "Recovery",
    body: "Sauna, cold plunge, on-site chiro, and nutrition support. Recovery is training too.",
    img: "/photos/gym-floor-rowers.webp",
    alt: "Rowers and ski ergs on the MFLH floor"
  },
  {
    title: "24/7 Open Gym",
    body: "Members get round-the-clock access to professional-grade equipment. Train on your schedule.",
    img: "/photos/brand-wall.webp",
    alt: "MFLH wall mural and open training floor"
  },
  {
    title: "Tempo Coffee Bar & Lounge",
    body: "Fuel up, cool down, stay a while. The Tempo bar is where the community lives between sessions.",
    img: "/photos/community-group.webp",
    alt: "MFLH community gathered on the floor"
  }
];

export default function TrainingPage() {
  return (
    <>
      <section className="border-b border-concrete">
        <div className="container-site py-24">
          <p className="eyebrow mb-4">What We Offer</p>
          <h1 className="text-6xl uppercase leading-[0.9] sm:text-8xl">
            Train With Purpose<span className="text-flame">.</span>
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg text-bone/75">
            Three tracks. One standard. Pick the work that matches your goal —
            switch when you&apos;re ready for more.
          </p>
        </div>
      </section>

      {OFFERINGS.map((o, i) => (
        <section
          key={o.code}
          className="border-b border-concrete"
        >
          <div
            className={`container-site grid items-center gap-10 py-20 md:grid-cols-2 ${
              i % 2 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
              <Image
                src={o.img}
                alt={o.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-display text-5xl uppercase text-flame">
                {o.code}
              </p>
              <h2 className="mt-1 text-4xl uppercase sm:text-5xl">
                {o.title}
              </h2>
              <p className="mt-5 max-w-md font-body text-bone/75">
                {o.body}
              </p>
            </div>
          </div>
        </section>
      ))}

      <section className="bg-[#0b0b0b]">
        <div className="container-site py-24">
          <SectionHeading
            eyebrow="Beyond The Workout"
            title="Recovery & Lifestyle"
            className="mb-14"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {SUPPORT.map((s) => (
              <div
                key={s.title}
                className="border border-concrete bg-ink"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                  <Image
                    src={s.img}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-80"
                  />
                </div>
                <div className="p-7">
                  <h3 className="text-3xl uppercase">{s.title}</h3>
                  <p className="mt-3 font-body text-sm text-bone/65">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-24 text-center">
        <h2 className="text-5xl uppercase sm:text-6xl">
          Find Your Track<span className="text-flame">.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-body text-bone/70">
          Not sure where you fit? Tell us your goal — a coach will point you
          to the right program.
        </p>
        <Link href="/get-started" className="btn-primary mt-8">
          Get Started
        </Link>
      </section>
    </>
  );
}
