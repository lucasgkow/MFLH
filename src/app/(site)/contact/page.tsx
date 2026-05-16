import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { ContactForm } from "@/components/forms/ContactForm";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with MFLH Collective in Bohemia, NY."
};

export default function ContactPage() {
  return (
    <section className="container-site py-20">
      <p className="eyebrow mb-4">Contact</p>
      <h1 className="text-6xl uppercase leading-[0.9] sm:text-8xl">
        Talk To Us<span className="text-flame">.</span>
      </h1>

      <div className="mt-14 grid gap-16 lg:grid-cols-2">
        <div>
          <ContactForm />
        </div>

        <div>
          <h2 className="text-3xl uppercase">Visit The Gym</h2>
          <address className="mt-4 font-body text-lg not-italic text-bone/80">
            {SITE.address}
          </address>
          <p className="mt-4 font-body text-sm text-bone/60">
            Hours vary by class & open-gym access.{" "}
            <Link href="/schedule" className="text-flame hover:underline">
              See the full schedule →
            </Link>
          </p>
          <a
            href={SITE.socials.instagramCollective}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-body text-sm text-flame hover:underline"
          >
            @mflhcollective on Instagram →
          </a>

          <Placeholder
            label="MAP: Google Maps embed — 190 McCormick Dr, Bohemia, NY 11716"
            className="mt-8 aspect-[16/10] w-full"
          />
        </div>
      </div>
    </section>
  );
}
