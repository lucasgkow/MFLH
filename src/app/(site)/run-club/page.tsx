import type { Metadata } from "next";
import {
  getRunClubEvents,
  stravaConfigured,
  stravaClubUrl
} from "@/lib/strava";
import { formatDateTime, metersToMiles } from "@/lib/format";
import { SITE } from "@/lib/constants";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Run Club",
  description:
    "The Move Fast Lift Heavy Run Club — weekly group runs across Long Island. Routes and schedule synced live from Strava."
};

export default async function RunClubPage() {
  const [events, clubUrl] = await Promise.all([
    getRunClubEvents(),
    Promise.resolve(stravaClubUrl())
  ]);
  const joinUrl = clubUrl ?? SITE.socials.instagramMain;

  return (
    <section className="container-site py-20">
      <p className="eyebrow mb-4">The Run Club</p>
      <h1 className="text-6xl uppercase leading-[0.9] sm:text-8xl">
        Move Fast<span className="text-flame">.</span> Together
        <span className="text-flame">.</span>
      </h1>
      <p className="mt-6 max-w-xl font-body text-lg text-bone/75">
        Weekly group runs across Long Island. All paces welcome — show up, lock
        in, and put in the miles with the crew. Routes and times sync live from
        our Strava club.
      </p>
      <a
        href={joinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-8"
      >
        Join Us On Strava
      </a>

      <h2 className="mt-16 text-3xl uppercase">Upcoming Runs</h2>

      {events.length ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {events.map((e) => (
            <div key={e.id} className="card p-6">
              <h3 className="text-2xl uppercase leading-none">{e.title}</h3>
              {e.occurrences[0] && (
                <p className="mt-3 font-body text-sm font-bold uppercase tracking-widest text-flame">
                  {formatDateTime(e.occurrences[0])}
                </p>
              )}
              {e.address && (
                <p className="mt-1 font-body text-sm text-bone/60">
                  {e.address}
                </p>
              )}
              {e.description && (
                <p className="mt-3 font-body text-sm text-bone/70 line-clamp-3">
                  {e.description}
                </p>
              )}
              {e.routeUrl && (
                <a
                  href={e.routeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/70 hover:text-flame"
                >
                  View route
                  {e.routeName ? ` — ${e.routeName}` : ""}
                  {e.routeDistanceMeters
                    ? ` (${metersToMiles(e.routeDistanceMeters)})`
                    : ""}{" "}
                  →
                </a>
              )}
              {e.occurrences.length > 1 && (
                <p className="mt-3 font-body text-[11px] uppercase tracking-widest text-bone/40">
                  Also: {e.occurrences.slice(1, 3).map((o) => formatDateTime(o)).join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-concrete bg-[#0d0d0d] p-12 text-center">
          <p className="font-body text-bone/60">
            {stravaConfigured()
              ? "No runs are on the schedule right now — check our Strava club for the latest."
              : "Run schedule syncs from Strava. Follow the club to get every run, route, and time."}
          </p>
          <a
            href={joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block font-body text-xs font-bold uppercase tracking-[0.2em] text-flame hover:underline"
          >
            Go to the Strava club →
          </a>
        </div>
      )}
    </section>
  );
}
