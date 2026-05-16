import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Book your class. Peak times fill fast."
};

export default function SchedulePage() {
  return (
    <section className="container-site py-20">
      <p className="eyebrow mb-4">Class Schedule</p>
      <h1 className="text-6xl uppercase leading-[0.9] sm:text-8xl">
        Book Your Spot<span className="text-flame">.</span>
      </h1>
      <p className="mt-6 max-w-xl font-body text-lg text-flame">
        Book early — peak times fill fast.
      </p>

      <div className="mt-10 border border-concrete bg-[#0d0d0d] p-2 sm:p-4">
        <iframe
          src={SITE.scheduleUrl}
          title="MFLH Collective class schedule"
          className="h-[80vh] min-h-[640px] w-full border-0 bg-ink"
          loading="lazy"
        />
      </div>

      <p className="mt-6 font-body text-sm text-bone/50">
        Trouble loading the calendar?{" "}
        <a
          href={SITE.scheduleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-flame hover:underline"
        >
          Open the booking site in a new tab →
        </a>
      </p>
    </section>
  );
}
