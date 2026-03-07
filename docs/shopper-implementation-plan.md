# Personal Shopper Implementation Plan

## 1. Overview
The goal is to add a new "My Personal Shopper by GSG" storefront to the existing GSG Convenience Goods codebase. This storefront will be accessible via the `shopper.gsgbrands.com.gh` subdomain. It will use the same backend, database, and admin dashboard as the existing e-commerce site.

## 2. Architecture & Routing
- **Host-based Routing**: We will update `middleware.ts` to inspect the `Host` header. If the host starts with `shopper.`, we will rewrite the URL path to prefix it with `/shopper`.
  - Example: `https://shopper.gsgbrands.com.gh/` -> `/shopper`
  - Example: `https://shopper.gsgbrands.com.gh/shopping-list` -> `/shopper/shopping-list`
- **Route Group**: We will create an `app/shopper` directory. To apply a specific layout (header/footer) to the shopper pages, we will use a layout inside this directory (`app/shopper/layout.tsx`).
- **Environment Variables**: We will add `NEXT_PUBLIC_SITE_GOODS_URL` and `NEXT_PUBLIC_SITE_SHOPPER_URL` to `.env.local` and Coolify.

## 3. Database Schema
We will create new tables for the Personal Shopper feature to avoid cluttering the existing `orders` table, as the workflow is fundamentally different (request-based, estimated prices, admin adjustments).

- `shopper_requests`: Stores the main request details (user_id, status, subtotal_est, commission, sourcing_fee, delivery_fee_est, total_est, delivery_address, contact info).
- `shopper_request_items`: Stores the individual items requested (name, qty, remark, estimated_price, source_type).
- `shopper_attachments`: Stores uploaded prescriptions or reference images.
- `shopper_status_history`: Tracks status changes over time.

## 4. Backend APIs
We will create new API routes under `app/api/shopper/`:
- `POST /api/shopper/requests`: Create a new request.
- `GET /api/shopper/requests/:id`: Get request details.
- `GET /api/shopper/requests`: List requests (for users to track or admin to view).
- `PATCH /api/shopper/requests/:id`: Update request status/pricing (Admin).
- `POST /api/shopper/requests/:id/attachments`: Upload attachments.

## 5. Frontend Pages (Shopper)
All pages will reside in `app/shopper/`:
- `page.tsx`: Home page with hero, category grid, and CTA.
- `how-it-works/page.tsx`: Explanation of the process and fees.
- `shopping-list/page.tsx`: The core dynamic form for adding items, calculating estimates, and submitting the request.
- `prescription-upload/page.tsx`: UI for uploading medical prescriptions.
- `track/page.tsx`: Order tracking by Request ID or Phone.
- `customer-experience/page.tsx`: Contact information and support hours.
- `faqs/page.tsx`: Frequently asked questions.
- Legal pages: `privacy-policy/page.tsx`, `cookies/page.tsx`, `terms/page.tsx`.

## 6. Admin Dashboard Integration
We will add a new section to the existing admin dashboard (`app/admin/shopper/`):
- `requests/page.tsx`: List view of all shopper requests with status filters.
- `requests/[id]/page.tsx`: Detail view to edit market prices, update statuses, and view attachments.

## 7. Authentication & Payments
- **Auth**: We will reuse the existing Supabase auth. Since the cookie domain will be `.gsgbrands.com.gh`, sessions will be shared across subdomains.
- **Payments**: We will integrate the existing payment flow (e.g., Moolre) for the `PAID` status transition, likely requiring the user to pay the `total_est` upfront.

## 8. Deployment (Coolify)
- Map both `goods.gsgbrands.com.gh` and `shopper.gsgbrands.com.gh` to the same Next.js service.
- Ensure the reverse proxy passes the `Host` header.
- Set up SSL for both domains.