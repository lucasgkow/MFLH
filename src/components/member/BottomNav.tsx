"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, CalendarIcon, DumbbellIcon, FeedIcon } from "./Icons";

const ITEMS = [
  { href: "/member", label: "Home", Icon: HomeIcon },
  { href: "/member/schedule", label: "Schedule", Icon: CalendarIcon },
  { href: "/member/workouts", label: "Train", Icon: DumbbellIcon },
  { href: "/member/social", label: "Social", Icon: FeedIcon }
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-30 border-t border-concrete bg-ink/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md">
        {ITEMS.map(({ href, label, Icon }) => {
          const active =
            href === "/member"
              ? pathname === "/member"
              : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`relative flex flex-col items-center gap-1 py-3 font-body text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "text-flame"
                    : "text-bone/45 hover:text-bone/80"
                }`}
              >
                {active && (
                  <span className="absolute inset-x-5 top-0 h-0.5 bg-flame" />
                )}
                <Icon className="h-6 w-6" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
