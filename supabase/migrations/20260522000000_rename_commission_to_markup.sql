-- =====================================================================
-- Rename shopper_requests.commission → shopper_requests.markup
-- =====================================================================
-- "Commission" implied we kept a slice of someone else's money. The fee
-- is actually a markup we charge on top of the source price for sourcing
-- the goods on the customer's behalf, so we rename the column to match
-- the customer-facing language across the shopper site.
--
-- Pure rename: data, NOT NULL, default, and any FKs are preserved by
-- ALTER TABLE ... RENAME COLUMN. PostgREST will start exposing the new
-- name immediately on schema cache refresh.
-- =====================================================================

ALTER TABLE public.shopper_requests
    RENAME COLUMN commission TO markup;
