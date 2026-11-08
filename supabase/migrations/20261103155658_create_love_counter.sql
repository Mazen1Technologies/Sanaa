/*
# Create love counter (single shared row, no auth)

1. New Tables
- `love_counter`
  - `id` (smallint, primary key, always 1) so the app keeps exactly one shared row
  - `start_date` (date, not null) the day the couple started counting from
  - `updated_at` (timestamptz) when the date was last changed

2. Security
- Enable RLS on `love_counter`.
- Grant SELECT, INSERT, UPDATE to `anon` and `authenticated` because the app has no sign-in screen.
- Policies allow public read, insert and update. This is intentional: the single row is public shared data, and there is no DELETE grant.
*/

CREATE TABLE IF NOT EXISTS love_counter (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  start_date date NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE love_counter ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON love_counter TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_love_counter" ON love_counter;
CREATE POLICY "anon_select_love_counter" ON love_counter FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_love_counter" ON love_counter;
CREATE POLICY "anon_insert_love_counter" ON love_counter FOR INSERT
  TO anon, authenticated WITH CHECK (id = 1);

DROP POLICY IF EXISTS "anon_update_love_counter" ON love_counter;
CREATE POLICY "anon_update_love_counter" ON love_counter FOR UPDATE
  TO anon, authenticated USING (id = 1) WITH CHECK (id = 1);
