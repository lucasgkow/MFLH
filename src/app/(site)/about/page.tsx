import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = {
  title: "About",
  description:
    "Chris Harris — 4× CrossFit Games qualifier and Hyrox pioneer. The story behind MFLH Collective."
};

const CREDENTIALS = [
  "4× CrossFit Games qualifier",
  "4th place team — 2016 CrossFit Games",
  "4th place — 2023 CrossFit Games",
  "Hyrox competitor & movement pioneer",
  "CrossFit Level 2 (CF-L2)",
  "USA Olympic Weightlifting certified",
  "Gymnastics certified",
  "Parisi Speed School certified",
  "15+ years coaching"
];

const TEAM = [
  { name: "Chris Harris", role: "Founder / Head Coach" },
  { name: "[MISSING: coach name]", role: "Performance Coach" },
  { name: "[MISSING: coach name]", role: "Strength Coach" },
  { name: "[MISSING: coach name]", role: "Recovery Practitioner" }
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-concrete">
        <Image
          src="/photos/brand-wall.webp"
          alt="MFLH Move Fast Lift Heavy wall mural on the training floor"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="container-site relative z-10 py-28">
          <p className="eyebrow mb-4">About MFLH</p>
          <h1 className="text-6xl uppercase leading-[0.9] sm:text-8xl">
            Born In Struggle.
            <br />
            Built To Last<span className="text-flame">.</span>
          </h1>
        </div>
      </section>

      {/* CHRIS STORY */}
      <section className="container-site grid gap-12 py-24 md:grid-cols-2 md:items-start">
        <Placeholder
          label="PHOTO: Chris Harris individual shot — recommend portrait against dark wall"
          className="aspect-[4/5] w-full md:sticky md:top-24"
        />
        <div>
          <SectionHeading
            eyebrow="The Founder"
            title="Chris Harris"
            className="mb-8"
          />
          <div className="space-y-5 font-body text-bone/75">
            <p>
              Chris Harris has spent his life at the edge of what the body can
              do. A four-time CrossFit Games qualifier — 4th place with his
              team in 2016, 4th place again in 2023 — he didn&apos;t just
              compete at the top. He helped pioneer the Hyrox movement on Long
              Island and built MFLH Collective to give serious athletes a place
              to match his standard.
            </p>
            <p>
              MFLH was born in struggle, grown with love, and built to last.
              It&apos;s not a wellness spa. It&apos;s a place where serious
              athletes grind — and where anyone willing to do the work is
              welcome.
            </p>
          </div>
          <p className="eyebrow mb-4 mt-10">Credentials</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {CREDENTIALS.map((c) => (
              <li
                key={c}
                className="border-l-2 border-flame pl-4 font-body text-sm text-bone/75"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ORIGIN */}
      <section className="border-y border-concrete bg-[#0b0b0b]">
        <div className="container-site py-24 text-center">
          <p className="eyebrow mb-6">Our Origin</p>
          <p className="mx-auto max-w-3xl font-display text-4xl uppercase leading-tight sm:text-6xl">
            Born in struggle. Grown with love.
            <span className="text-flame"> Built to last.</span>
          </p>
          <p className="mx-auto mt-8 max-w-2xl font-body text-bone/70">
            We started with a barbell, a concrete floor, and a refusal to do
            things halfway. Everything you see now was earned rep by rep —
            by a community that shows up when it&apos;s hard.
          </p>
        </div>
      </section>

      {/* TEAM */}
      <section className="container-site py-24">
        <SectionHeading
          eyebrow="The Coaches"
          title="Who You'll Train With"
          className="mb-14"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <div
              key={i}
              className="border border-concrete bg-[#0d0d0d]"
            >
              <Placeholder
                label="MISSING: coach headshot — recommend portrait against dark wall"
                className="aspect-[4/5] w-full"
              />
              <div className="p-6">
                <p className="text-2xl uppercase">{m.name}</p>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-flame">
                  {m.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="relative overflow-hidden border-t border-concrete">
        <Image
          src="/photos/community-group.webp"
          alt="MFLH community gathered on the training floor"
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="container-site relative z-10 grid gap-10 py-24 md:grid-cols-2">
          <SectionHeading eyebrow="Philosophy" title="Train With Purpose" />
          <div className="space-y-5 font-body text-bone/80">
            <p>
              No fluff. No filler. Every session has intent. We train movement
              that transfers — to the race, to the platform, to life.
            </p>
            <p>
              Hard work is the price of entry. Community is what keeps you
              here. We hold a standard because we believe you can meet it.
            </p>
            <Link
              href="/get-started"
              className="btn-primary mt-4 inline-flex"
            >
              Start Training
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
