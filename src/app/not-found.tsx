import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-5 text-center">
      <p className="font-display text-[28vw] leading-none text-flame sm:text-[200px]">
        404
      </p>
      <p className="font-display text-4xl uppercase">
        Wrong rep. Wrong page.
      </p>
      <p className="mt-3 max-w-md font-body text-bone/60">
        This one doesn&apos;t exist. Get back to work.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back Home
      </Link>
    </main>
  );
}
