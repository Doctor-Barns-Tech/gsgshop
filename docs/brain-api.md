# Brain API (Server-Only)

All endpoints are served by this app under `/api/brain/*`.

**Barns / Sasu tenant contract:** use **`/brain/v1/*`** (Sarah Lawson–style adapter). See [`tenant-shop-integration.md`](./tenant-shop-integration.md) and [`TENANT_SHOP_ADAPTER_SPEC.md`](../TENANT_SHOP_ADAPTER_SPEC.md). The `/api/brain/*` routes remain for older integrations.
External callers must **never** connect to Supabase directly.

## Authentication

- Header required on every request:
  - `Authorization: Bearer <BRAIN_API_KEY>`
- Missing bearer token -> `401`
- Wrong token -> `403`

## Endpoints

- `GET /api/brain/health`
- `GET /api/brain/products?category=<optional>&search=<optional>`
- `GET /api/brain/products/:id` (id or slug)
- `GET /api/brain/categories`
- `POST /api/brain/orders`
- `GET /api/brain/orders/:id`

## Product response mapping

Returned product fields:

- `id` -> `products.id`
- `name` -> `products.name`
- `description` -> `products.description`
- `price` -> `products.price`
- `category` -> `categories.name` (joined from relation)
- `in_stock` -> `products.quantity > 0`
- `image_url` -> first `product_images.url` ordered by `position`

## Order creation mapping

`POST /api/brain/orders` expects:

```json
{
  "items": [{ "product_id": "uuid", "quantity": 2 }],
  "customer_phone": "+233...",
  "customer_name": "Optional"
}
```

The API:

1. Validates items and quantities
2. Loads prices from `products`
3. Computes totals server-side
4. Inserts into `orders`
5. Inserts line items into `order_items`

Response:

```json
{
  "order_id": "uuid",
  "total": 123.45,
  "status": "pending",
  "items": [
    {
      "product_id": "uuid",
      "name": "Product",
      "quantity": 2,
      "unit_price": 50,
      "total_price": 100
    }
  ]
}
```

## Required DB columns (current implementation)

### products

- `id`
- `name`
- `slug`
- `description`
- `price`
- `quantity`
- `status`

### categories (for categories endpoint / product category mapping)

- `name`
- `slug`
- `status`

### product_images

- `url`
- `position`

### orders

- `id`
- `order_number`
- `user_id`
- `email`
- `phone`
- `status`
- `payment_status`
- `currency`
- `subtotal`
- `tax_total`
- `shipping_total`
- `discount_total`
- `total`
- `shipping_method`
- `payment_method`
- `shipping_address` (json)
- `billing_address` (json)
- `metadata` (json)
- `created_at`

### order_items

- `order_id`
- `product_id`
- `product_name`
- `variant_name`
- `quantity`
- `unit_price`
- `total_price`
- `metadata` (json)

