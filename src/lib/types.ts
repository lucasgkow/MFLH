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

// ---- Staff operations ----

export type Staff = {
  id: string;
  full_name: string;
  role: string;
  pin: string | null;
  hourly_rate: number | null;
  active: boolean;
  created_at: string;
};

export type TimeEntry = {
  id: string;
  staff_id: string;
  clock_in: string;
  clock_out: string | null;
  note: string | null;
  created_at: string;
};

export type Referral = {
  id: string;
  staff_id: string | null;
  referred_name: string;
  referred_email: string | null;
  referred_phone: string | null;
  status: string;
  commission_amount: number | null;
  commission_paid: boolean;
  note: string | null;
  created_at: string;
  staff?: { full_name: string } | null;
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
