-- Personal-shopper core schema.
--
-- Promotes the previously-orphaned supabase/shopper_schema.sql to a tracked
-- migration so a fresh Supabase project can stand up the personal-shopper
-- feature with a single `supabase db push`. Fully idempotent: every CREATE
-- uses IF NOT EXISTS or a DO-block guard, every CREATE POLICY is preceded by
-- DROP POLICY IF EXISTS, so it's safe to re-run on databases that already
-- have parts of the schema in place.

-- 1. Enum -------------------------------------------------------------------

DO $$
BEGIN
  CREATE TYPE shopper_request_status AS ENUM (
    'SUBMITTED', 'REVIEWING', 'SOURCING', 'AWAITING_CONFIRMATION',
    'PAID', 'SHOPPING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- 2. Tables -----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.shopper_requests (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status             shopper_request_status NOT NULL DEFAULT 'SUBMITTED',
  subtotal_est       NUMERIC(10,2) NOT NULL DEFAULT 0,
  commission         NUMERIC(10,2) NOT NULL DEFAULT 0,
  sourcing_fee       NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee_est   NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_est          NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes              TEXT,
  delivery_address   JSONB,
  preferred_time     TEXT,
  contact_name       TEXT NOT NULL,
  contact_phone      TEXT NOT NULL,
  contact_email      TEXT,
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shopper_request_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id       UUID NOT NULL REFERENCES public.shopper_requests(id) ON DELETE CASCADE,
  name_brand       TEXT NOT NULL,
  qty_size_range   TEXT NOT NULL,
  remark           TEXT,
  estimated_price  NUMERIC(10,2) NOT NULL DEFAULT 0,
  market_price     NUMERIC(10,2),
  source_type      TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shopper_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID NOT NULL REFERENCES public.shopper_requests(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  metadata    JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shopper_status_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID NOT NULL REFERENCES public.shopper_requests(id) ON DELETE CASCADE,
  status      shopper_request_status NOT NULL,
  note        TEXT,
  created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS --------------------------------------------------------------------

ALTER TABLE public.shopper_requests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopper_request_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopper_attachments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopper_status_history  ENABLE ROW LEVEL SECURITY;

-- shopper_requests
DROP POLICY IF EXISTS "Users can view own requests"   ON public.shopper_requests;
CREATE POLICY "Users can view own requests" ON public.shopper_requests
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Anyone can insert requests"    ON public.shopper_requests;
CREATE POLICY "Anyone can insert requests" ON public.shopper_requests
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can do all on requests"  ON public.shopper_requests;
CREATE POLICY "Admin can do all on requests" ON public.shopper_requests
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

-- shopper_request_items
DROP POLICY IF EXISTS "Users can view own items"      ON public.shopper_request_items;
CREATE POLICY "Users can view own items" ON public.shopper_request_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shopper_requests
      WHERE id = shopper_request_items.request_id
        AND (user_id = auth.uid() OR user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Anyone can insert items"       ON public.shopper_request_items;
CREATE POLICY "Anyone can insert items" ON public.shopper_request_items
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can do all on items"     ON public.shopper_request_items;
CREATE POLICY "Admin can do all on items" ON public.shopper_request_items
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

-- shopper_attachments
DROP POLICY IF EXISTS "Users can view own attachments"    ON public.shopper_attachments;
CREATE POLICY "Users can view own attachments" ON public.shopper_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shopper_requests
      WHERE id = shopper_attachments.request_id
        AND (user_id = auth.uid() OR user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Anyone can insert attachments"     ON public.shopper_attachments;
CREATE POLICY "Anyone can insert attachments" ON public.shopper_attachments
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can do all on attachments"   ON public.shopper_attachments;
CREATE POLICY "Admin can do all on attachments" ON public.shopper_attachments
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

-- shopper_status_history
DROP POLICY IF EXISTS "Users can view own history"    ON public.shopper_status_history;
CREATE POLICY "Users can view own history" ON public.shopper_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shopper_requests
      WHERE id = shopper_status_history.request_id
        AND (user_id = auth.uid() OR user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Anyone can insert history"     ON public.shopper_status_history;
CREATE POLICY "Anyone can insert history" ON public.shopper_status_history
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can do all on history"   ON public.shopper_status_history;
CREATE POLICY "Admin can do all on history" ON public.shopper_status_history
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

-- 4. Force PostgREST to reload its schema cache so the new tables are
--    immediately visible at the REST endpoint. Without this, the storefront
--    will keep returning "Could not find the table 'public.shopper_requests'
--    in the schema cache" for a few seconds-to-minutes after this runs.
NOTIFY pgrst, 'reload schema';
