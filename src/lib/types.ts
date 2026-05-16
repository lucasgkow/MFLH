export type Registration = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  goal: string | null;
  referral_source: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

export type EventRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  max_capacity: number | null;
  registration_open: boolean;
  featured_image_url: string | null;
  created_at: string;
};

export type EventRegistration = {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sizes: string[];
  image_url: string | null;
  in_stock: boolean;
  featured: boolean;
  stripe_price_id: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  stripe_session_id: string | null;
  customer_email: string;
  items: CartItem[];
  total: number | null;
  status: string;
  created_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  created_at: string;
};

export type SiteSetting = {
  key: string;
  value: string | null;
};

// ---- Member portal ----

export type MemberProfile = {
  id: string;
  role: "member" | "admin";
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  membership_status: string | null;
  created_at: string;
};

export type GymClass = {
  id: string;
  title: string;
  class_type: string | null;
  description: string | null;
  coach_name: string | null;
  starts_at: string;
  duration_min: number;
  capacity: number;
  location: string | null;
};

export type ClassRegistration = {
  id: string;
  class_id: string;
  member_id: string;
  status: "registered" | "waitlisted" | "cancelled" | "attended";
  created_at: string;
};

export type MemberCheckin = {
  id: string;
  member_id: string;
  class_id: string | null;
  source: string;
  checked_in_at: string;
};

export type Routine = {
  id: string;
  title: string;
  body: string;
  routine_date: string;
  class_type: string | null;
  published: boolean;
  created_at: string;
};

export type WorkoutLog = {
  id: string;
  member_id: string;
  log_date: string;
  title: string;
  notes: string | null;
  created_at: string;
};

export type WorkoutEntry = {
  id: string;
  log_id: string;
  exercise: string;
  reps: number | null;
  weight_kg: number | null;
  distance_m: number | null;
  duration_sec: number | null;
  position: number;
};

export type HyroxBenchmark = {
  id: string;
  name: string;
  description: string | null;
  metric: "time" | "reps" | "weight";
  display_order: number;
};

export type BenchmarkResult = {
  id: string;
  member_id: string;
  benchmark_id: string;
  value: number;
  recorded_on: string;
  notes: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  author_id: string;
  body: string;
  image_url: string | null;
  pinned: boolean;
  created_at: string;
  profiles?: { display_name: string | null; avatar_url: string | null } | null;
};

export type PostComment = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  profiles?: { display_name: string | null } | null;
};

export type PostReaction = {
  id: string;
  post_id: string;
  member_id: string;
  emoji: string;
};

export type Program = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  weeks: number;
  published: boolean;
  created_at: string;
};

export type ProgramWorkout = {
  id: string;
  program_id: string;
  week: number;
  day: number;
  title: string;
  body: string;
  position: number;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  imageUrl: string | null;
};
