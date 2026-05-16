export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="font-display text-6xl uppercase text-flame">Offline</p>
      <p className="mt-3 max-w-xs font-body text-bone/60">
        No connection. Your training waits for no signal — reconnect and pull
        to refresh.
      </p>
    </main>
  );
}
