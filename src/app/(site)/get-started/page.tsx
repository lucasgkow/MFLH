import type { Metadata } from "next";
import { getFaqs } from "@/lib/data";
import { GetStartedForm } from "@/components/forms/GetStartedForm";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Start training at MFLH Collective. Tell us your goal — a coach will reach out."
};

export default async function GetStartedPage() {
  const faqs = await getFaqs();

  return (
    <section className="container-site py-20">
      <p className="eyebrow mb-4">Get Started</p>
      <h1 className="text-6xl uppercase leading-[0.9] sm:text-8xl">
        Stop Thinking.
        <br />
        Start Training<span className="text-flame">.</span>
      </h1>
      <p className="mt-6 max-w-xl font-body text-lg text-bone/75">
        No pricing games. Tell us your goal — Chris or a coach reaches out
        personally to find the right plan for you.
      </p>

      <div className="mt-14 grid gap-16 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <GetStartedForm />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-4xl uppercase">FAQ</h2>
          <div className="mt-6 divide-y divide-concrete border-y border-concrete">
            {faqs.length ? (
              faqs.map((f) => (
                <details key={f.id} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-display text-xl uppercase">
                    {f.question}
                    <span className="text-flame transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 font-body text-sm text-bone/70">
                    {f.answer}
                  </p>
                </details>
              ))
            ) : (
              <p className="py-6 font-body text-sm text-bone/50">
                FAQs load from Supabase once connected.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
