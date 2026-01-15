# BUG-001: Discount Code Applies Only to First Item Instead of Entire Cart Subtotal

## Summary
Discount codes are incorrectly calculated only on the first item's subtotal instead of the entire cart subtotal, resulting in incorrect discount amounts when the cart contains multiple items.

## Severity
**High** - Affects core business logic and customer pricing calculations

## Priority
**P1 - Critical** - Incorrect pricing can lead to revenue loss and customer trust issues

## Environment
- Application: Shopping Cart API
- Version: Current
- Endpoint: `POST /cart/:cartId/discount`
- Method: `calculateCartSummary()` function

## Description
When applying a discount code to a cart with multiple items, the backend only calculates the discount based on the first item's subtotal (`items[0].subtotal`) instead of the entire cart subtotal. This results in customers receiving a smaller discount than they should receive.

## Preconditions
1. A cart exists with ID: `{cartId}`
2. The cart contains 2 or more items

## Steps to Reproduce
1. Create a new cart using `POST /cart`
2. Add first item: `{ name: "Item 1", price: 10, quantity: 1 }` → Subtotal: 10
3. Add second item: `{ name: "Item 2", price: 20, quantity: 2 }` → Subtotal: 40
4. Apply discount code `SAVE10` using `POST /cart/{cartId}/discount` with body `{ code: "SAVE10" }`
5. Get cart details using `GET /cart/{cartId}`

## Expected Result
- Discount should be calculated on entire cart subtotal: `(10 + 40) * 10% = 5`
- Cart discount field should be: `5`
- Cart total should be: `50 - 5 = 45`
- Response: `{ message: "Discount code applied", discount: "10%" }`

## Actual Result
- Discount is calculated only on first item: `10 * 10% = 1`
- Cart discount field is: `1` (incorrect)
- Cart total is: `50 - 1 = 49` (incorrect)
- Response: `{ message: "Discount code applied", discount: "10%" }`

## Evidence/Logs

### Backend Code (src/index.js:106)
```javascript
let discount = 0;
if (cart.discountCode && items.length > 0) {
  const discountPercent = discountCodes[cart.discountCode];
  discount = (items[0].subtotal * discountPercent) / 100;  // ❌ BUG: Only first item
}
```

### Expected Code
```javascript
let discount = 0;
if (cart.discountCode && items.length > 0) {
  const discountPercent = discountCodes[cart.discountCode];
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);  // ✅ Calculate entire subtotal
  discount = (subtotal * discountPercent) / 100;  // ✅ Apply to entire subtotal
}
```

### Test Results
- Test file: `framework/tests/api/apply-discount.spec.ts`
- Failing tests:
  - `Should apply discount code SAVE10 to entire cart subtotal with multiple items`
  - `Should apply discount code SAVE20 to entire cart subtotal with multiple items`
  - `Should apply discount code HALF to entire cart subtotal with multiple items`
  - `Should recalculate discount when adding item after discount is applied`
  - `should apply discount after adding items` (integration test)
  - `should maintain discount code after adding more items` (integration test)

## Impact
- **Revenue Loss**: Customers receive smaller discounts than they should
- **Business Logic Violation**: Discounts should apply to the entire purchase, not just the first item
- **Customer Trust**: Incorrect pricing calculations can lead to customer complaints
- **Compliance**: May violate advertised discount terms

## Workaround
None - discount calculation must be fixed in the backend

## Additional Notes
- This bug affects all discount codes: `SAVE10`, `SAVE20`, and `HALF`
- The bug also affects scenarios where items are added after a discount is applied
- The bug affects scenarios where items are removed after a discount is applied (discount should recalculate)
