-- MFLH Collective — seed data
-- Idempotent: safe to re-run. Run after 0001_init.sql.

-- ---------------------------------------------------------------------------
-- Run Club — every Sunday 7AM, rotating location
-- ---------------------------------------------------------------------------
insert into events (title, slug, description, category, event_date, event_time, location, registration_open)
values
  ('Run Club — Patchogue', 'run-club-patchogue-2026-05-17',
   'Every Sunday. 7AM. A new location. Show up. This week we run Patchogue. All paces welcome — we move together, nobody gets left behind.',
   'Run Club', '2026-05-17', '07:00', 'Patchogue, NY', true),
  ('Run Club — Bay Shore', 'run-club-bay-shore-2026-05-24',
   'Every Sunday. 7AM. A new location. Show up. This week we run Bay Shore. All paces welcome — we move together, nobody gets left behind.',
   'Run Club', '2026-05-24', '07:00', 'Bay Shore, NY', true),
  ('Run Club — Sayville', 'run-club-sayville-2026-05-31',
   'Every Sunday. 7AM. A new location. Show up. This week we run Sayville. All paces welcome — we move together, nobody gets left behind.',
   'Run Club', '2026-05-31', '07:00', 'Sayville, NY', true),
  ('Run Club — Islip', 'run-club-islip-2026-06-07',
   'Every Sunday. 7AM. A new location. Show up. This week we run Islip. All paces welcome — we move together, nobody gets left behind.',
   'Run Club', '2026-06-07', '07:00', 'Islip, NY', true),
  ('Dad''s Workout — Father''s Day', 'dads-workout-fathers-day-2026',
   'Bring your dad. Bring your kids. One workout, the whole family. Partner-style session built for every fitness level, finished with coffee at the Tempo bar. Free for members'' guests.',
   'Special Event', '2026-06-15', '09:00', 'MFLH Collective — 190 McCormick Dr, Bohemia, NY', true)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Merch — placeholder imagery until product photos arrive
-- ---------------------------------------------------------------------------
insert into products (name, slug, description, price, sizes, image_url, in_stock, featured)
values
  ('Gym Class Hoodie', 'gym-class-hoodie',
   'Heavyweight fleece hoodie. Oversized fit, embroidered MFLH mark, built for the cold plunge walk-of-shame and everything before it.',
   65.00, '{"S","M","L","XL","XXL"}', null, true, true),
  ('Perfect Match Tee', 'perfect-match-tee',
   'Premium cotton tee with the MFLH wordmark. Cut for training, worn everywhere else.',
   35.00, '{"XS","S","M","L","XL","XXL"}', null, true, true),
  ('Real Tree Snapback', 'real-tree-snapback',
   'Structured snapback with raised MFLH logo. One size. Earned, not given.',
   30.00, '{"OS"}', null, true, true)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- FAQs
-- ---------------------------------------------------------------------------
insert into faqs (question, answer, display_order)
values
  ('Do I need to be fit to start?',
   'No. Every workout scales. We meet you where you are and build you into an athlete. The only requirement is showing up.',
   1),
  ('What is Hyrox and why does it matter here?',
   'Hyrox is a global fitness race — running mixed with functional workout stations. MFLH is Bohemia''s only Hyrox-focused performance gym, and our owner Chris Harris is a pioneer in the movement.',
   2),
  ('What are the training tracks?',
   'MFLH OG (hybrid performance — strength, conditioning, Hyrox, endurance), MFLH Pump (hypertrophy and aesthetics), and MFLH Compete (advanced competitive CrossFit).',
   3),
  ('Is there 24/7 access?',
   'Yes. Members get 24/7 open-gym access to professional-grade equipment, plus sauna, cold plunge, and the Tempo coffee bar.',
   4),
  ('How do I get pricing?',
   'Pricing is handled personally — start with the form on the Get Started page and Chris or a coach will reach out to talk through the right plan for your goals.',
   5),
  ('When does Run Club meet?',
   'Every Sunday at 7AM at a rotating location. Free, open to all paces. Check the Events page for this week''s spot.',
   6)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Site settings (key/value)
-- ---------------------------------------------------------------------------
insert into site_settings (key, value)
values
  ('gym_address', '190 McCormick Dr, Bohemia, NY 11716'),
  ('gym_phone', ''),
  ('gym_email', 'info@mflhcollective.com'),
  ('instagram_main', 'https://instagram.com/movefastliftheavy'),
  ('instagram_collective', 'https://instagram.com/mflhcollective'),
  ('instagram_chris', 'https://instagram.com/iamchrisharris'),
  ('facebook', 'https://facebook.com/mflhcollective')
on conflict (key) do update set value = excluded.value;
