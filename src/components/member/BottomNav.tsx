"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/member", label: "Home", icon: "⌂" },
  { href: "/member/schedule", label: "Schedule", icon: "▦" },
  { href: "/member/workouts", label: "Workouts", icon: "❑" },
  { href: "/member/social", label: "Social", icon: "◎" }
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-30 border-t border-concrete bg-ink/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md">
        {ITEMS.map((it) => {
          const active =
            it.href === "/member"
              ? pathname === "/member"
              : pathname.startsWith(it.href);
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                className={`flex flex-col items-center gap-1 py-3 font-body text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  active ? "text-flame" : "text-bone/50"
                }`}
              >
                <span className="text-lg leading-none">{it.icon}</span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
