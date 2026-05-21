// Strava (read-only) — pull the Move Fast Lift Heavy Run Club's upcoming group
// events + routes to display on the public site. Degrades to empty when the
// STRAVA_* env vars are absent.
//
// Required env (server-only):
//   STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET — from the Strava API application
//   STRAVA_REFRESH_TOKEN — a refresh token for a club member (read scope)
//   STRAVA_CLUB_ID — the run club's numeric id

export function stravaConfigured(): boolean {
  return !!(
    process.env.STRAVA_CLIENT_ID &&
    process.env.STRAVA_CLIENT_SECRET &&
    process.env.STRAVA_REFRESH_TOKEN &&
    process.env.STRAVA_CLUB_ID
  );
}

export function stravaClubUrl(): string | null {
  const id = process.env.STRAVA_CLUB_ID;
  return id ? `https://www.strava.com/clubs/${id}` : null;
}

// Cache the short-lived access token across requests in the same process.
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  if (!stravaConfigured()) return null;
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }
  try {
    const res = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: process.env.STRAVA_REFRESH_TOKEN
      }),
      cache: "no-store"
    });
    if (!res.ok) {
      console.error("Strava token error", res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as {
      access_token: string;
      expires_at: number;
    };
    tokenCache = {
      token: data.access_token,
      expiresAt: data.expires_at * 1000
    };
    return data.access_token;
  } catch (err) {
    console.error("Strava token request failed", err);
    return null;
  }
}

async function stravaGet<T>(path: string): Promise<T | null> {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    const res = await fetch(`https://www.strava.com/api/v3${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      // Cache club data for 30 minutes so we don't hammer the API.
      next: { revalidate: 1800 }
    });
    if (!res.ok) {
      console.error("Strava API error", path, res.status);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("Strava API request failed", path, err);
    return null;
  }
}

export type RunClubEvent = {
  id: number;
  title: string;
  description: string | null;
  activityType: string | null;
  address: string | null;
  occurrences: string[];
  routeId: number | null;
  routeUrl: string | null;
  routeName: string | null;
  routeDistanceMeters: number | null;
};

type GroupEvent = {
  id: number;
  title: string;
  description?: string | null;
  activity_type?: string | null;
  address?: string | null;
  upcoming_occurrences?: string[];
  route_id?: number | null;
};

type StravaRoute = {
  id: number;
  name?: string;
  distance?: number;
};

export async function getRunClubEvents(): Promise<RunClubEvent[]> {
  const clubId = process.env.STRAVA_CLUB_ID;
  const events = await stravaGet<GroupEvent[]>(
    `/clubs/${clubId}/group_events`
  );
  if (!events) return [];

  // Resolve unique route ids once.
  const routeIds = [
    ...new Set(events.map((e) => e.route_id).filter((r): r is number => !!r))
  ];
  const routes = new Map<number, StravaRoute>();
  await Promise.all(
    routeIds.map(async (rid) => {
      const route = await stravaGet<StravaRoute>(`/routes/${rid}`);
      if (route) routes.set(rid, route);
    })
  );

  return events
    .map((e) => {
      const route = e.route_id ? routes.get(e.route_id) : undefined;
      return {
        id: e.id,
        title: e.title,
        description: e.description ?? null,
        activityType: e.activity_type ?? null,
        address: e.address ?? null,
        occurrences: (e.upcoming_occurrences ?? []).filter(Boolean),
        routeId: e.route_id ?? null,
        routeUrl: e.route_id
          ? `https://www.strava.com/routes/${e.route_id}`
          : null,
        routeName: route?.name ?? null,
        routeDistanceMeters: route?.distance ?? null
      } satisfies RunClubEvent;
    })
    .sort((a, b) => {
      const an = a.occurrences[0] ?? "";
      const bn = b.occurrences[0] ?? "";
      return an.localeCompare(bn);
    });
}
