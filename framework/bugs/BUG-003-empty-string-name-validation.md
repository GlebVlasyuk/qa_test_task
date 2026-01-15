# BUG-003: Item Name with Only Spaces Is Accepted

## Summary
The API accepts item names that contain only whitespace characters (e.g., `"   "`), which should be rejected as invalid. Empty or whitespace-only names don't provide meaningful item identification and should be validated.

## Severity
**Low** - Data quality issue, but doesn't cause functional errors

## Priority
**P3 - Medium** - Should improve data validation and quality

## Environment
- Application: Shopping Cart API
- Version: Current
- Endpoint: `POST /cart/:cartId/items`

## Description
The backend validation for item names only checks if the name exists and is a string type (`if (!name || typeof name !== 'string')`), but doesn't validate if the string is empty or contains only whitespace characters. This allows items with names like `"   "` (three spaces) to be added to the cart.

## Preconditions
1. A cart exists with ID: `{cartId}`

## Steps to Reproduce
1. Create a new cart using `POST /cart`
2. Attempt to add an item with whitespace-only name:
   ```json
   POST /cart/{cartId}/items
   {
     "name": "   ",
     "price": 10,
     "quantity": 1
   }
   ```

## Expected Result
- API should return `400 Bad Request`
- Error message: `"Invalid item name"`
- Item should not be added to the cart

## Actual Result
- API returns `201 Created`
- Item is successfully added with name: `"   "` (whitespace-only)
- Response: `{ id: "...", name: "   ", price: 10, quantity: 1 }`
- Cart contains item with invalid name

## Evidence/Logs

### Backend Code (src/index.js:41-43)
```javascript
if (!name || typeof name !== 'string') {
  return res.status(400).json({ error: 'Invalid item name' });
}
// ❌ BUG: Doesn't check for empty or whitespace-only strings
```

### Expected Code
```javascript
if (!name || typeof name !== 'string' || name.trim().length === 0) {
  return res.status(400).json({ error: 'Invalid item name' });
}
// ✅ Validate that name is not empty or whitespace-only
```

### Test Results
- Test file: `framework/tests/api/add-item.spec.ts`
- Failing test: `Should reject item with name containing only spaces`

### Example Request/Response

**Request:**
```bash
POST /cart/123e4567-e89b-12d3-a456-426614174000/items
Content-Type: application/json

{
  "name": "   ",
  "price": 10,
  "quantity": 1
}
```

**Actual Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "   ",
  "price": 10,
  "quantity": 1
}
```

**Expected Response (400 Bad Request):**
```json
{
  "error": "Invalid item name"
}
```

## Impact
- **Data Quality**: Cart contains items with meaningless names
- **UI Display**: Items with whitespace-only names may display incorrectly or cause confusion
- **Business Logic**: Difficult to identify/search items with invalid names
- **Reporting**: Analytics and reports may show items with empty/whitespace names

## Workaround
Frontend can validate and trim item names before submission, but backend validation is still required.

## Additional Notes
- Similar validation should be considered for other string fields (if any)
- Consider trimming whitespace from names even if validation passes (defensive programming)
- This is a common validation pattern in most web applications
