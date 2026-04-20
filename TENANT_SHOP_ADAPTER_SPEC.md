# Tenant Shop Adapter — HTTPS Contract

> What every tenant shop onboarded to Barns.ai **must** expose for the Sasu brain to drive their WhatsApp bot. Derived from the Sarah Lawson Imports reference so each tenant = one Sarah Lawson at the protocol level.

**Audience:** Engineering teams (or agents) building a new tenant shop, or porting an existing shop (Next.js + Supabase, Django, WordPress, etc.) so it can plug into Barns.ai.

**Sibling doc:** [`BARNS_INTEGRATION_SPEC.md`](./BARNS_INTEGRATION_SPEC.md) defines Barns ⇄ Sasu. This doc defines **Sasu ⇄ tenant shop adapter**.

---

## 1. Where this adapter sits

```
Customer → Meta → Barns /webhook
                    │
                    ▼
              Sasu brain (LLM + tool loop)
                    │  HTTPS per tool call
                    ▼
              ★ YOUR SHOP ADAPTER (this spec) ★
                    │
                    ▼
              your DB (Supabase / Postgres / …)
```

The adapter is a **thin HTTPS facade**: authenticate Sasu, return JSON for product/order/customer/coupon/ticket/knowledge, accept order/ticket/return creates. It does not know Meta, LLMs, or Barns.

---

## 2. Auth

```http
Authorization: Bearer <shop_adapter_api_key>
X-Request-Id: <uuid>
Content-Type: application/json
```

`401` on invalid key:

```json
{ "error": { "code": "unauthorized", "message": "Invalid API key" } }
```

Rotation: Barns may issue a new key; accept **old + new** for up to **72 hours** during rotation.

---

## 3. Conventions

- **Base path:** `https://<your-domain>/brain/v1` (whatever Barns stores).  
- **JSON** UTF-8.  
- **Dates:** ISO-8601 UTC.  
- **IDs:** strings (UUIDs preferred).  
- **Money:** consistent minor units *or* decimals + always include `currency`.  
- **Pagination:** `?limit=20&cursor=` → `{ items, next_cursor }`.  
- **Errors:** `{ "error": { "code", "message" } }` — codes: `unauthorized`, `not_found`, `validation_error`, `rate_limited`, `conflict`, `internal`.  
- **Rate limits:** ~60 req/min/IP, **429** + `Retry-After`.  
- **Timeouts:** Sasu default **8000 ms** per call; target **p95 < 3000 ms** on adapter.

---

## 4. Data types

### 4.1 Product

`id`, `slug`, `name`, `description`, `price`, `currency`, `image`, `images[]` (`url`, `position`), `in_stock`, `stock_quantity`, `moq`, `category`, `tags[]`, `metadata` (object).

### 4.2 Order

`id`, `order_number`, `status` (`pending` | `confirmed` | `processing` | `shipped` | `out_for_delivery` | `delivered` | `cancelled` | `returned`), `payment_status`, `total`, `subtotal`, `shipping_fee`, `currency`, `customer_email`, `customer_name`, `shipping_address` (object), `items[]` (line items with `product_id`, `product_name`, `slug`, `image`, `quantity`, `unit_price`, `total_price`), `tracking_url`, `created_at`, `updated_at`.

### 4.3 Customer

`id`, `email`, `name`, `phone`, `total_orders`, `total_spent`, `currency`, `last_order_at`, `tags[]`.

### 4.4 Coupon

`code`, `valid`, `reason`, `type` (`percent` | …), `value`, `minimum_purchase`, `currency`, `expires_at` — or invalid shape with `reason` enum: `not_found`, `expired`, `usage_limit_reached`, `minimum_not_met`, `inactive`.

### 4.5 Ticket

`id`, `ticket_number`, `subject`, `description`, `category`, `status`, `priority`, `email`, `created_at`.

### 4.6 Return

`id`, `order_id`, `reason`, `description`, `status`, `created_at`.

### 4.7 Knowledge entry

`id`, `title`, `path`, `category`, `content`, `keywords[]`.

### 4.8 Store info

`brand_name`, `tagline`, `currency`, `contact` (`email`, `phone`, `whatsapp`, `address`), `policies` (`shipping`, `returns`, `payment`, `business_hours`), `site_url`, `pages[]` (`title`, `path`).

---

## 5. Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/brain/v1/products` | `q` (required), `limit`, optional `category` → `{ products: Product[] }` |
| GET | `/brain/v1/products/:slug_or_id` | One product → `{ product }` or **404** |
| GET | `/brain/v1/recommendations` | `context`, `limit` → `{ products }` |
| GET | `/brain/v1/orders` | `number` + `email` (required) → `{ order }` or **404** |
| GET | `/brain/v1/customer` | `email` → `{ customer }` or **404** |
| GET | `/brain/v1/customer/orders` | `email`, `limit` → `{ orders: Order[] }` |
| POST | `/brain/v1/orders` | Create order (see §5.7 request shape) → **201** `{ order, payment }` |
| GET | `/brain/v1/coupons/:code` | Optional `cart_total` → `{ coupon }` (**200** valid or invalid) |
| POST | `/brain/v1/tickets` | Create ticket → **201** `{ ticket }` |
| POST | `/brain/v1/returns` | Initiate return → **201** `{ return }` |
| GET | `/brain/v1/knowledge` | `q`, `limit` → `{ entries: KnowledgeEntry[] }` |
| GET | `/brain/v1/store-info` | → `{ store_info: StoreInfo }` |
| GET | `/brain/v1/health` | Unauthenticated `{ status, version }` |

### 5.7 `POST /brain/v1/orders` (request sketch)

```json
{
  "customer": { "email", "name", "phone" },
  "items": [{ "product_id", "quantity" }],
  "shipping_address": { "line1", "city", "region", "country" },
  "delivery_method": "delivery",
  "payment_method": "momo",
  "coupon_code": null,
  "notes": "",
  "source": "whatsapp_brain"
}
```

**201** `{ "order": Order, "payment": { "required", "url", "provider", "expires_at" } }`.  
**422** validation with `fields` map. Fraud / stock limits on tenant side.

---

## 6. Sasu tool → endpoint map

| Sarah Lawson–style tool | Endpoint |
|-------------------------|----------|
| `search_products` | `GET /brain/v1/products?q=` |
| `get_product_for_cart` | `GET /brain/v1/products/:slug_or_id` |
| `track_order` | `GET /brain/v1/orders?number=&email=` |
| `get_customer_orders` | `GET /brain/v1/customer/orders?email=` |
| `get_customer_profile` | `GET /brain/v1/customer?email=` |
| `check_coupon` | `GET /brain/v1/coupons/:code` |
| `create_support_ticket` | `POST /brain/v1/tickets` |
| `initiate_return` | `POST /brain/v1/returns` |
| `get_recommendations` | `GET /brain/v1/recommendations` |
| `get_store_info` | `GET /brain/v1/store-info` |
| `get_website_info` | `GET /brain/v1/knowledge?q=` |
| `create_order` | `POST /brain/v1/orders` |

---

## 7. Minimum viable adapter

Launch with: `GET /products`, `GET /orders`, `GET /store-info`, `GET /knowledge`, `GET /health`.  
Everything else may return **501**:

```json
{ "error": { "code": "not_implemented", "message": "…" } }
```

Sasu degrades gracefully (e.g. “order on the website”).

---

## 8. Next.js route layout (reference)

Map to `app/brain/v1/.../route.ts` handlers; validate `Authorization` against `SHOP_ADAPTER_API_KEY`; use server-side DB client; mirror Sarah Lawson `chat-tools.ts` logic without LLM/UI coupling.

---

## 9. Smoke tests (before go-live)

```bash
curl -H "Authorization: Bearer $KEY" https://your-shop/brain/v1/health
curl -H "Authorization: Bearer $KEY" "https://your-shop/brain/v1/products?q=kettle&limit=3"
curl -H "Authorization: Bearer $KEY" "https://your-shop/brain/v1/orders?number=SL-00001&email=test@example.com"
curl -H "Authorization: Bearer $KEY" https://your-shop/brain/v1/store-info
```

---

## 10. Checklist

- [ ] HTTPS, valid cert  
- [ ] Bearer on all routes except `/health`  
- [ ] p95 < 3s  
- [ ] Error shape §3  
- [ ] Money + `currency`  
- [ ] Order `status` enum §4.2  
- [ ] Validation + stock + rate limits on `POST /orders`  
- [ ] Log `X-Request-Id`  
- [ ] Knowledge populated (about, contact, shipping, returns, payment)  
- [ ] Store-info brand voice  

---

## 11. Versioning

Contract **v1**. Sasu sends `X-Brain-Api-Version: 1`; unknown version → **400**. Breaking changes → `/brain/v2` with 90-day overlap.

---

## 12. Embedding the WhatsApp inbox in your own admin

Your tenant admin dashboard (Next.js, Django, whatever you ship to your own staff) can render the WhatsApp inbox as a Barns-hosted iframe. Your staff never leave your admin to read chats.

Full normative contract for this is **Barns ⇄ Sasu** (see [`BARNS_INTEGRATION_SPEC.md`](./BARNS_INTEGRATION_SPEC.md) §3.3 and §6). This section is the **tenant-side** implementation guide.

### 12.1 What Barns gives you at onboarding

- `tenant_admin_key` — Bearer token your backend uses to mint short-lived embed URLs. **Never put this in a browser.**
- `allowed_embed_origins` — the absolute origins your tenants/staff can host the iframe on (e.g. `https://admin.your-domain.com`). Declared during onboarding; editable later via Barns admin.
- An embed URL endpoint:

  ```
  POST https://barns.sasulabs.me/api/tenant-admin/inbox-token
  ```

### 12.2 Minting an embed URL (from your backend)

```http
POST https://barns.sasulabs.me/api/tenant-admin/inbox-token
Authorization: Bearer <your tenant_admin_key>
Content-Type: application/json

{
  "session_user_id": "admin-42",
  "return_origin":   "https://admin.your-domain.com"
}
```

Response (`200`):

```json
{
  "embed_url":  "https://barns.sasulabs.me/inbox-embed/<JWT>",
  "expires_at": "2026-04-18T13:00:00Z"
}
```

Embed URLs are single-session and expire (≤ 60 min). Re-mint before expiry. Treat `403` as "your origin is not allow-listed" and `410 Gone` as "URL expired — mint a new one".

### 12.3 Rendering the iframe

```html
<iframe
  src="https://barns.sasulabs.me/inbox-embed/<JWT>"
  style="width:100%;height:640px;border:0;border-radius:12px;"
  allow="clipboard-read; clipboard-write; microphone"
  title="WhatsApp inbox"
></iframe>
```

The iframe is served with `Content-Security-Policy: frame-ancestors <your origin>` — only your origin can embed it. If you change admin domains, update `allowed_embed_origins` first.

### 12.4 `postMessage` events (inbox → your admin)

```js
window.addEventListener("message", (ev) => {
  if (ev.origin !== "https://barns.sasulabs.me") return;
  const msg = ev.data || {};
  switch (msg.type) {
    case "sasu.inbox.ready":
      // msg.payload.version — hide your spinner
      break;
    case "sasu.inbox.resize":
      iframeRef.style.height = `${msg.payload.heightPx}px`;
      break;
    case "sasu.inbox.unread":
      setUnreadBadge(msg.payload.count);
      break;
    case "sasu.inbox.notification":
      // msg.payload = { chat_id, preview, timestamp }
      maybeDesktopNotify(msg.payload);
      break;
    case "sasu.inbox.error":
      // msg.payload = { code, message, retryable }
      showToast(msg.payload.message);
      break;
  }
});
```

Always check `ev.origin`. The payload shapes are stable within a given `api_contract_version` (exposed on `GET /api/brain/v1/ui/whatsapp-inbox/manifest.json`); additive changes only within a version.

### 12.5 Branding

Barns injects `brandColor`, `brandLogoUrl`, and `tenantName` from your tenant row into `WA_INBOX_CONFIG`. Update them via Barns admin; the next iframe load picks them up.

### 12.6 Smart-replies / summary / tag inside the inbox

These buttons call Barns thin-proxies (`/api/whatsapp/smart-replies` etc.) which Barns routes to Sasu's `/api/brain/v1/*` using your encrypted `brain_api_key`. You never expose that key to the browser and never need to touch Sasu directly from your admin UI.

### 12.7 Fallback (optional, deprecated 90 days after launch)

During rollout Barns keeps `https://barns.sasulabs.me/portal/whatsapp-inbox` as a direct-login fallback in case you haven't shipped the iframe yet. Your staff can sign in there with a Barns tenant-admin account. Plan to migrate to §12.3 before the 90-day deprecation window closes.

### 12.8 What you do **not** need to implement

- No Sasu URLs in your code.
- No direct Meta Graph calls (Barns does all outbound messaging).
- No WhatsApp webhook (Barns owns it).
- No LLM keys (Sasu holds them; Barns mediates).

You only implement: the `/brain/v1/*` shop adapter (§1–§11 above) and the iframe embed (this §12).

---

*Last updated: 2026-04-18 · Owner: Doctor Barns · Reference tenant: Sarah Lawson Imports.*
