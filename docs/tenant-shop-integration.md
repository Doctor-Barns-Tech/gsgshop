# Tenant shop integration (Barns / Sasu)

Implements [`TENANT_SHOP_ADAPTER_SPEC.md`](../TENANT_SHOP_ADAPTER_SPEC.md) as **`/brain/v1/*`** (see also [`TENANT_SHOP_TEAM.md`](../TENANT_SHOP_TEAM.md)).

## Base URL (give to Barns at onboarding)

```
https://<your-production-domain>/brain/v1
```

Example: `https://goods.gsgbrands.com.gh/brain/v1`

## Endpoints implemented

| Method | Path | Notes |
|--------|------|--------|
| GET | `/brain/v1/health` | **No Bearer.** `{ status, version }` |
| GET | `/brain/v1/products` | `q` **required**, optional `category`, `limit` |
| GET | `/brain/v1/products/:slug_or_id` | Single product |
| GET | `/brain/v1/recommendations` | Featured / recent products |
| GET | `/brain/v1/orders` | `number` + `email` **required** |
| POST | `/brain/v1/orders` | Create order (see spec §5.7) |
| GET | `/brain/v1/customer` | `email` **required** |
| GET | `/brain/v1/customer/orders` | `email` **required**, optional `limit` |
| GET | `/brain/v1/coupons/:code` | Optional `cart_total` |
| POST | `/brain/v1/tickets` | Support ticket → `support_tickets` |
| POST | `/brain/v1/returns` | `customer_email`, `order_id` or `order_number`, `reason` |
| GET | `/brain/v1/knowledge` | `q` **required**, optional `limit` |
| GET | `/brain/v1/store-info` | Brand + contact + policy links |

Legacy internal API under **`/api/brain/*`** (older contract) remains for backward compatibility; new integrations should use **`/brain/v1`**.

## Smoke tests

```bash
export KEY="your-adapter-key"
curl "https://your-domain/brain/v1/health"
curl -H "Authorization: Bearer $KEY" "https://your-domain/brain/v1/products?q=rice&limit=3"
curl -H "Authorization: Bearer $KEY" "https://your-domain/brain/v1/orders?number=ORD-123&email=test@example.com"
curl -H "Authorization: Bearer $KEY" "https://your-domain/brain/v1/store-info"
```

## Environment variables

### Required for `/brain/v1`

| Variable | Purpose |
|----------|---------|
| `SHOP_ADAPTER_API_KEY` | Bearer token Sasu / Barns sends as `Authorization: Bearer …` |
| `NEXT_PUBLIC_APP_URL` | Public site URL (store-info, tracking links, payment URLs). Example: `https://goods.gsgbrands.com.gh` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only DB access (already used by the app) |

### Optional

| Variable | Purpose |
|----------|---------|
| `SHOP_ADAPTER_API_KEY_PREVIOUS` | Previous key during rotation (accept up to 72h alongside the new key) |
| `BRAIN_API_KEY` | **Legacy:** same Bearer accepted if `SHOP_ADAPTER_API_KEY` unset (older `/api/brain` clients) |
| `BRAIN_V1_CORS_ORIGIN` | Defaults to `*`. Set to Barns origin if you must restrict CORS (e.g. `https://barns.sasulabs.me`). Middleware adds CORS + `OPTIONS` for `/brain/*` so clients can read the API. |

### WhatsApp inbox embed (spec §12) — optional

| Variable | Purpose |
|----------|---------|
| `BARNS_TENANT_ADMIN_KEY` | Server-only. Used by `POST /api/tenant-admin/inbox-token` to mint iframe URLs. **Never expose to the browser.** |
| `BARNS_API_BASE_URL` | Default `https://barns.sasulabs.me` if unset |

### Headers (clients)

| Header | Purpose |
|--------|---------|
| `Authorization: Bearer <SHOP_ADAPTER_API_KEY>` | Required on all routes except `/health` |
| `X-Request-Id: <uuid>` | Recommended — logged server-side for cross-system tracing |
| `X-Brain-Api-Version: 1` | Optional; if sent, must be `1` |

## Operational notes

- **HTTPS** with a valid certificate in production.
- **Rate limiting** (~60 req/min/IP) is recommended at the edge (Cloudflare / Coolify / Vercel); not yet enforced in-app.
- **Timeouts:** keep DB queries fast; Sasu default is ~8s per tool call.

## Troubleshooting: “bot can’t read the shop”

1. **Production env** — `SHOP_ADAPTER_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` must be set on Vercel/Coolify (same values as local). If the key only exists in `.env.local`, production will return **401** or **500**.
2. **URL** — Barns must call the deployed host (e.g. `https://goods.gsgbrands.com.gh/brain/v1/...`), not localhost.
3. **CORS / OPTIONS** — Middleware sends `Access-Control-Allow-*` for `/brain/*`. If a custom origin is required, set `BRAIN_V1_CORS_ORIGIN`.
4. **Product search** — `GET /brain/v1/products` without `q` returns featured-style products (compat header `X-Brain-Compat: empty-q-used-recommendations`) instead of failing.
