import {
  getRunClubEvents,
  stravaConfigured,
  stravaClubUrl
} from "@/lib/strava";
import { formatDateTime, metersToMiles } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RunClubAdminPage() {
  const connected = stravaConfigured();
  const events = connected ? await getRunClubEvents() : [];
  const clubUrl = stravaClubUrl();

  return (
    <div>
      <h1 className="text-5xl uppercase">Run Club</h1>
      <p className="mt-2 font-body text-sm text-bone/50">
        Upcoming group events and routes sync live from Strava to the public{" "}
        <a href="/run-club" className="text-flame hover:underline">
          /run-club
        </a>{" "}
        page.
      </p>

      <div className="mt-6 flex items-center gap-3 border border-concrete bg-[#0d0d0d] p-5">
        <span
          className={`inline-block h-3 w-3 rounded-full ${
            connected ? "bg-flame" : "bg-bone/30"
          }`}
        />
        <p className="font-body text-sm">
          {connected ? (
            <>
              Connected to Strava
              {clubUrl && (
                <>
                  {" — "}
                  <a
                    href={clubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-flame hover:underline"
                  >
                    view club
                  </a>
                </>
              )}
            </>
          ) : (
            <span className="text-bone/60">
              Not connected. Set STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET,
              STRAVA_REFRESH_TOKEN and STRAVA_CLUB_ID to sync the run club.
            </span>
          )}
        </p>
      </div>

      {connected && (
        <>
          <h2 className="mt-10 text-3xl uppercase">Synced Events</h2>
          <div className="mt-4 space-y-3">
            {events.length ? (
              events.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-3 border border-concrete bg-[#0d0d0d] px-5 py-4"
                >
                  <div>
                    <p className="font-display text-xl uppercase">{e.title}</p>
                    {e.occurrences[0] && (
                      <p className="font-body text-sm text-bone/60">
                        {formatDateTime(e.occurrences[0])}
                        {e.address ? ` · ${e.address}` : ""}
                      </p>
                    )}
                  </div>
                  {e.routeUrl && (
                    <a
                      href={e.routeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/60 hover:text-flame"
                    >
                      Route
                      {e.routeDistanceMeters
                        ? ` (${metersToMiles(e.routeDistanceMeters)})`
                        : ""}{" "}
                      →
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="border border-concrete bg-[#0d0d0d] p-10 text-center font-body text-bone/50">
                No upcoming events returned by Strava.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
