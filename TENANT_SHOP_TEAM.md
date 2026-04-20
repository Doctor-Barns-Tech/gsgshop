# Tenant shop engineers — adapter checklist

You own the **store's HTTPS API** (Next.js, Django, WordPress, etc.). You do **not** run the Meta webhook — Barns (or a monolith Sasu) calls **your** adapter.

- Normative contract: [`../TENANT_SHOP_ADAPTER_SPEC.md`](../TENANT_SHOP_ADAPTER_SPEC.md)

## What you must deliver

1. **HTTPS base URL**, e.g. `https://your-domain.com/brain/v1` (exact path is configurable).
2. **`GET /brain/v1/health`** reachable.
3. **Bearer auth** on every other route using the **shop adapter API key** Barns / Sasu sends in `Authorization: Bearer …`.
4. **Implement** at least the minimum-viable endpoints in spec §7: products, orders, store-info, knowledge, health.
5. **JSON shapes** (`Product`, `Order`, `Customer`, `Coupon`, `Ticket`, `Return`, etc.) exactly as in spec §4 (Sarah Lawson reference).
6. **Log `X-Request-Id`** on every request so errors line up across Barns / Sasu / your shop.

## What to hand to Barns at onboarding

- Adapter base URL.
- Shop adapter API key (accept old + new for ≤72h during rotation).
- Confirmation that smoke tests in spec §9 pass.

## What you do **not** need

- Groq / Meta tokens — they stay on Barns + Sasu.
- Visibility into Sasu's prompts / tools — only the HTTP contract matters to you.
- WhatsApp webhooks on your side — that is Barns's job.

## WhatsApp Graph pitfall (for operators, not tenants)

If the bot fails to send with `OAuthException code:190 "Object does not exist"`, the token or `phone_number_id` on `whatsapp_channels` is wrong, expired, or scoped to a different Meta app. Re-paste a fresh System User access token in `/admin → WhatsApp lines` — no redeploy needed. This never touches your shop adapter.
