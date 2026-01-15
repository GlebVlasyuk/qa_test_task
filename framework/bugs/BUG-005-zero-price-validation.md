# BUG-005: Item with Zero Price Is Accepted Through API

## Summary
The API accepts items with zero price (returns `201 Created`) when it should reject them with `400 Bad Request`. Items with zero price should be invalid as they don't represent a valid product price in a shopping cart system.

## Severity
**Medium** - Data validation issue that can lead to incorrect cart calculations and business logic errors

## Priority
**P2 - High** - Price validation is critical for correct cart calculations and preventing free items from being added unintentionally

## Environment
- Application: Shopping Cart API
- Version: Current
- Endpoint: `POST /cart/:cartId/items`

## Description
The backend validation for item price doesn't reject zero values. While negative prices are correctly rejected, zero prices are accepted, which can lead to:
- Items being added to cart with no value
- Incorrect subtotal calculations (though mathematically correct, business-wise incorrect)
- Potential abuse where items can be added for free
- Inconsistency with validation logic (negative prices rejected, but zero accepted)

## Preconditions
1. A cart exists with ID: `{cartId}`

## Steps to Reproduce
1. Create a new cart using `POST /cart`
2. Attempt to add an item with zero price:
   ```json
   POST /cart/{cartId}/items
   {
     "name": "AQA Free Item",
     "price": 0,
     "quantity": 1
   }
   ```

## Expected Result
- API should return `400 Bad Request`
- Error message: `"Invalid price"`
- Item should not be added to the cart

## Actual Result
- API returns `201 Created`
- Item is successfully added with price: `0`
- Response: `{ id: "...", name: "AQA Free Item", price: 0, quantity: 1 }`
- Cart contains item with zero price

## Evidence/Logs

### Test Results
- Test file: `framework/tests/api/add-item-api.spec.ts`
- Failing test: `Should reject item with zero price`
- Expected status: `400`
- Actual status: `201`
- Error message: `Expected status 400, but got 201`

### Example Request/Response

**Request:**
```bash
POST /cart/123e4567-e89b-12d3-a456-426614174000/items
Content-Type: application/json

{
  "name": "AQA Free Item",
  "price": 0,
  "quantity": 1
}
```

**Actual Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "AQA Free Item",
  "price": 0,
  "quantity": 1
}
```

**Expected Response (400 Bad Request):**
```json
{
  "error": "Invalid price"
}
```

## Impact
- **Business Logic**: Items with zero price can be added to carts, which may not align with business requirements
- **Data Integrity**: Cart calculations may include free items unintentionally
- **Validation Consistency**: Negative prices are rejected, but zero prices are accepted, creating inconsistent validation behavior
- **Potential Abuse**: Users could potentially add items with zero price, which might not be intended behavior
- **Cart Summary**: While mathematically correct (0 * quantity = 0), it may not represent valid business scenarios

## Workaround
Frontend can validate that price > 0 before submission, but backend validation is still required for API security and consistency.

## Additional Notes
- The API correctly rejects negative prices (`price < 0`)
- The API correctly rejects zero quantity (`quantity === 0`)
- The API should also reject zero price (`price === 0`) for consistency
- Consider if zero price should be allowed for promotional items (if so, this may be a feature request rather than a bug)
- If zero price should be allowed, the test case should be updated to reflect this business requirement
