# Personal Shopper API

## Endpoints

### `POST /api/shopper/requests`
Creates a new personal shopper request.

**Payload:**
```json
{
  "items": [
    {
      "nameBrand": "Milo Cereal 500g",
      "qtySizeRange": "2 packs",
      "estimatedPrice": "45.00",
      "sourceType": "",
      "remark": "Make sure expiry date is far"
    }
  ],
  "contactName": "John Doe",
  "contactPhone": "0240000000",
  "contactEmail": "john@example.com",
  "deliveryAddress": { "text": "123 Main St, Accra" },
  "preferredTime": "Tomorrow morning",
  "notes": "Call upon arrival",
  "subtotalEst": 90.00,
  "markup": 4.50,
  "totalEst": 94.50
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-of-new-request",
  "success": true
}
```

### `GET /api/shopper/requests`
Fetches requests.
- `?id=uuid` - Fetch specific request
- `?phone=024...` - Fetch requests by phone number
- No params - Fetch all (Admin only)

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "status": "SUBMITTED",
    "total_est": 94.50,
    "items": [...],
    "history": [...]
  }
]
```
