import Link from "next/link";
import { SITE, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-concrete bg-ink">
      <div className="container-site grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-4xl uppercase">
            MFLH<span className="text-flame">.</span>
          </p>
          <p className="mt-3 max-w-xs font-body text-sm text-bone/60">
            Move Fast. Lift Heavy. Bohemia&apos;s only Hyrox performance gym.
            Train with purpose.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Visit</p>
          <address className="font-body text-sm not-italic text-bone/70">
            {SITE.address}
          </address>
          <Link
            href="/schedule"
            className="mt-3 inline-block font-body text-sm text-flame hover:underline"
          >
            View Schedule →
          </Link>
        </div>

        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-body text-sm text-bone/70 hover:text-flame"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Follow</p>
          <ul className="space-y-2">
            <li>
              <a
                href={SITE.socials.instagramMain}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-bone/70 hover:text-flame"
              >
                @movefastliftheavy
              </a>
            </li>
            <li>
              <a
                href={SITE.socials.instagramCollective}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-bone/70 hover:text-flame"
              >
                @mflhcollective
              </a>
            </li>
            <li>
              <a
                href={SITE.socials.instagramChris}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-bone/70 hover:text-flame"
              >
                @iamchrisharris
              </a>
            </li>
            <li>
              <a
                href={SITE.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-bone/70 hover:text-flame"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-concrete">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-5 text-xs text-bone/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="font-body uppercase tracking-[0.2em]">
            Born in struggle. Built to last.
          </p>
        </div>
      </div>
    </footer>
  );
}
