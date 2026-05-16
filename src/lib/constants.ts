export const SITE = {
  name: "MFLH Collective",
  tagline: "Move Fast. Lift Heavy.",
  description: "Bohemia's only Hyrox performance gym.",
  address: "190 McCormick Dr, Bohemia, NY 11716",
  email: "info@mflhcollective.com",
  phone: "",
  scheduleUrl: "https://mflh.pushpress.com/calendar",
  socials: {
    instagramMain: "https://instagram.com/movefastliftheavy",
    instagramCollective: "https://instagram.com/mflhcollective",
    instagramChris: "https://instagram.com/iamchrisharris",
    facebook: "https://facebook.com/mflhcollective"
  }
} as const;

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/training", label: "What We Offer" },
  { href: "/schedule", label: "Schedule" },
  { href: "/events", label: "Events" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
  { href: "/member", label: "Members" }
] as const;

export const TRAINING_TRACKS = [
  {
    code: "MFLH OG",
    title: "Hybrid Performance",
    blurb:
      "Strength, conditioning, Hyrox, and endurance under one roof. The flagship program. Built to make you hard to kill."
  },
  {
    code: "MFLH Pump",
    title: "Hypertrophy & Aesthetics",
    blurb:
      "Muscle, size, and raw strength. Bodybuilding principles run by coaches who actually compete."
  },
  {
    code: "MFLH Compete",
    title: "Competitive CrossFit",
    blurb:
      "Advanced progressions for athletes chasing the leaderboard. No hand-holding. Pure work."
  }
] as const;

export const FACILITY = [
  "Sauna",
  "Cold Plunge",
  "24/7 Open Gym",
  "Tempo Coffee Bar",
  "Recovery Practitioners"
] as const;

export const TESTIMONIALS = [
  {
    name: "Christian Reyes",
    quote:
      "Best gym I've ever been a part of. The coaching is elite and the community pushes you every single day. This place changed how I train."
  },
  {
    name: "Philip Cepeda",
    quote:
      "Chris and the team don't just coach workouts — they build athletes. The programming is no joke and the results speak for themselves."
  },
  {
    name: "John Murray",
    quote:
      "Walked in unsure, left obsessed. The energy at MFLH is unmatched. Everyone is here to work and get better. No egos, just grind."
  },
  {
    name: "Reginald Jackson",
    quote:
      "The facility is world-class and the people make it home. Sauna, cold plunge, 24/7 access — but the real draw is the standard they hold you to."
  }
] as const;

export const GOAL_OPTIONS = [
  "Performance / Hyrox",
  "Strength & Muscle",
  "General Fitness",
  "Competitive CrossFit",
  "Weight Loss",
  "50+ Fitness"
] as const;

export const CONTACT_SUBJECTS = [
  "General Inquiry",
  "Membership",
  "Events",
  "Media / Press",
  "Other"
] as const;

export const EVENT_CATEGORIES = [
  "Run Club",
  "Special Event",
  "Competition",
  "Workshop"
] as const;

export const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

// Blended MFLH leaderboard score. Tweak weights here — no migration needed
// (the SQL function returns raw counts; points are computed in the app).
export const SCORING = {
  checkin: 10,
  workout: 15,
  benchmark: 20,
  classAttended: 5
} as const;

export function mflhPoints(row: {
  checkins: number;
  workouts: number;
  benchmarks: number;
  classes_attended: number;
}) {
  return (
    row.checkins * SCORING.checkin +
    row.workouts * SCORING.workout +
    row.benchmarks * SCORING.benchmark +
    row.classes_attended * SCORING.classAttended
  );
}
