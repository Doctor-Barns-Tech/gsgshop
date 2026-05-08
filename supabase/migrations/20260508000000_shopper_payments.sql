-- Personal-shopper payment integration.
--
-- Adds the columns and RPC needed to charge a customer for a personal-shopper
-- request through the same Paystack/Moolre infrastructure that powers regular
-- orders. The payment routes detect SR- vs ORD- references and dispatch
-- against the right table.

-- 1. Schema -------------------------------------------------------------------

ALTER TABLE public.shopper_requests
  ADD COLUMN IF NOT EXISTS request_number          TEXT,
  ADD COLUMN IF NOT EXISTS total_final             NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS delivery_fee            NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_status          TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_method          TEXT,
  ADD COLUMN IF NOT EXISTS payment_provider        TEXT,
  ADD COLUMN IF NOT EXISTS payment_transaction_id  TEXT,
  ADD COLUMN IF NOT EXISTS last_payment_ref        TEXT,
  ADD COLUMN IF NOT EXISTS last_payment_attempt_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS paid_at                 TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS metadata                JSONB DEFAULT '{}'::jsonb;

-- Backfill request_number for existing rows. Format mirrors order_number
-- (`ORD-<ts>-<rand>`) but with the SR- prefix so the payment routes can
-- dispatch on it without ambiguity.
UPDATE public.shopper_requests
SET    request_number = 'SR-' || extract(epoch FROM created_at)::bigint::text
                       || '-' || floor(random() * 1000)::int::text
WHERE  request_number IS NULL;

ALTER TABLE public.shopper_requests
  ALTER COLUMN request_number SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS shopper_requests_request_number_key
  ON public.shopper_requests (request_number);

-- New rows auto-generate the request_number.
CREATE OR REPLACE FUNCTION public.shopper_requests_set_request_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.request_number IS NULL OR NEW.request_number = '' THEN
    NEW.request_number := 'SR-'
      || extract(epoch FROM COALESCE(NEW.created_at, now()))::bigint::text
      || '-'
      || floor(random() * 1000)::int::text;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS shopper_requests_set_request_number ON public.shopper_requests;
CREATE TRIGGER shopper_requests_set_request_number
  BEFORE INSERT ON public.shopper_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.shopper_requests_set_request_number();

-- 2. mark_shopper_request_paid ------------------------------------------------
--
-- Mirrors mark_order_paid. Looks the row up by request_number (preferred) or
-- UUID id. Sets payment_status='paid', flips status SUBMITTED/REVIEWING/
-- SOURCING/AWAITING_CONFIRMATION -> PAID, stamps paid_at and metadata.
-- Idempotent: a second call against an already-paid row is a no-op.
CREATE OR REPLACE FUNCTION public.mark_shopper_request_paid(
  request_ref text,
  txn_ref     text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  updated public.shopper_requests;
BEGIN
  UPDATE public.shopper_requests sr
  SET    payment_status = 'paid',
         status         = CASE
                            WHEN sr.status IN ('SUBMITTED','REVIEWING','SOURCING','AWAITING_CONFIRMATION')
                              THEN 'PAID'::shopper_request_status
                            ELSE sr.status
                          END,
         paid_at        = COALESCE(sr.paid_at, now()),
         metadata       = COALESCE(sr.metadata, '{}'::jsonb) || jsonb_build_object(
                            'payment_reference',  txn_ref,
                            'payment_verified_at', to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
                          ),
         updated_at     = now()
  WHERE  sr.request_number = request_ref
     OR  sr.id::text       = request_ref
  RETURNING * INTO updated;

  IF updated.id IS NOT NULL THEN
    INSERT INTO public.shopper_status_history (request_id, status, note)
    VALUES (updated.id, 'PAID', 'Payment confirmed by gateway')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN to_jsonb(updated);
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_shopper_request_paid(text, text) TO anon, authenticated, service_role;
