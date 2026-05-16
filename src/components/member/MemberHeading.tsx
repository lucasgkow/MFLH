import Link from "next/link";

// Shared editorial header for member screens — same visual language as the
// marketing site's SectionHeading (eyebrow + oversized Bebas title).
export function MemberHeading({
  eyebrow,
  title,
  back
}: {
  eyebrow: string;
  title: string;
  back?: { href: string; label: string };
}) {
  return (
    <div className="space-y-2">
      {back && (
        <Link
          href={back.href}
          className="inline-block font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/45 hover:text-flame"
        >
          ← {back.label}
        </Link>
      )}
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="text-6xl uppercase leading-[0.85]">{title}</h1>
    </div>
  );
}
