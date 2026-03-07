# Coolify Deployment Guide (Multi-Domain)

To deploy the GSG Convenience Goods and My Personal Shopper storefronts on the same Next.js service in Coolify:

## 1. Environment Variables
Add the following environment variables to your Next.js service in Coolify:
```env
NEXT_PUBLIC_SITE_GOODS_URL=https://goods.gsgbrands.com.gh
NEXT_PUBLIC_SITE_SHOPPER_URL=https://shopper.gsgbrands.com.gh
```

## 2. Domains Configuration
In the Coolify dashboard for your Next.js service:
1. Go to the **Settings** tab.
2. In the **Domains** field, enter both domains separated by a comma:
   `https://goods.gsgbrands.com.gh,https://shopper.gsgbrands.com.gh`
3. Ensure **HTTPS/SSL** is enabled (Coolify will automatically provision Let's Encrypt certificates for both).

## 3. DNS Configuration (Cloudflare)
Ensure both subdomains point to your VPS IP address:
- `A` record for `goods` -> `[VPS IP]`
- `A` record for `shopper` -> `[VPS IP]`

## 4. Routing Logic
The application uses Next.js Middleware (`middleware.ts`) to inspect the incoming `Host` header.
- If the host starts with `shopper.`, it rewrites the path to serve the `/shopper` route group.
- Otherwise, it serves the default `/(store)` route group.
