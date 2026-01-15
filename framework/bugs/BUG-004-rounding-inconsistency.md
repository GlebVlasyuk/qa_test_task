# BUG-004: Mathematical Inconsistency in Discount Rounding Logic

## Summary
The backend's rounding logic creates a mathematical inconsistency where `subtotal - discount (rounded) ≠ total (rounded)` in some cases. This occurs because the discount and total are calculated using unrounded values, then rounded separately, rather than rounding the discount first and then calculating the total.

## Severity
**Low** - Creates minor precision discrepancies but doesn't cause major functional issues

## Priority
**P3 - Low** - Cosmetic/consistency issue, very small impact

## Environment
- Application: Shopping Cart API
- Version: Current
- Method: `calculateCartSummary()` function in `src/index.js`

## Description
When calculating discounts and totals, the backend:
1. Calculates discount unrounded: `discount = (subtotal * percentage) / 100`
2. Calculates total unrounded: `total = subtotal - discount`
3. Rounds both separately: `discount = Math.round(discount * 100) / 100` and `total = Math.round(total * 100) / 100`

This can lead to cases where `subtotal - discount (rounded) ≠ total (rounded)`.

## Preconditions
1. A cart exists with items
2. A discount code is applied (e.g., `HALF` - 50% discount)

## Steps to Reproduce
1. Create a new cart using `POST /cart`
2. Add item: `{ name: "Item 1", price: 10.99, quantity: 1 }` → Subtotal: 10.99
3. Apply discount code `HALF` using `POST /cart/{cartId}/discount` with body `{ code: "HALF" }`
4. Get cart details using `GET /cart/{cartId}`

## Expected Result
- Discount calculation:
  - Discount unrounded: `10.99 * 50% = 5.495`
  - Discount rounded: `Math.round(5.495 * 100) / 100 = 5.50`
  - Total calculated from rounded discount: `10.99 - 5.50 = 5.49`
  - Total rounded: `5.49`
- Result: `subtotal (10.99) - discount (5.50) = total (5.49)` ✅ Consistent

## Actual Result
- Discount calculation:
  - Discount unrounded: `10.99 * 50% = 5.495`
  - Discount rounded: `Math.round(5.495 * 100) / 100 = 5.50`
  - Total unrounded: `10.99 - 5.495 = 5.495`
  - Total rounded: `Math.round(5.495 * 100) / 100 = 5.50`
- Result: `subtotal (10.99) - discount (5.50) = 5.49`, but `total = 5.50` ❌ Inconsistent

## Evidence/Logs

### Backend Code (src/index.js:103-116)
```javascript
let discount = 0;
if (cart.discountCode && items.length > 0) {
  const discountPercent = discountCodes[cart.discountCode];
  discount = (items[0].subtotal * discountPercent) / 100;  // Unrounded
}

const total = subtotal - discount;  // Unrounded

return {
  items,
  subtotal: Math.round(subtotal * 100) / 100,
  discountCode: cart.discountCode,
  discount: Math.round(discount * 100) / 100,  // Round separately
  total: Math.round(total * 100) / 100  // Round separately
};
```

### Expected Code (Standard Approach)
```javascript
let discount = 0;
if (cart.discountCode && items.length > 0) {
  const discountPercent = discountCodes[cart.discountCode];
  const discountUnrounded = (items[0].subtotal * discountPercent) / 100;
  discount = Math.round(discountUnrounded * 100) / 100;  // Round first
}

const total = subtotal - discount;  // Use rounded discount
const totalRounded = Math.round(total * 100) / 100;

return {
  items,
  subtotal: Math.round(subtotal * 100) / 100,
  discountCode: cart.discountCode,
  discount: discount,
  total: totalRounded
};
```

### Test Results
- Test file: `framework/tests/api/apply-discount.spec.ts`
- Test: `verifyDiscountCalculation()` function includes comment documenting this behavior
- Example case: HALF discount on item with price 10.99

### Example Calculation

**With HALF (50%) discount on item price 10.99:**

**Current (Inconsistent):**
```
Discount unrounded: 5.495
Discount rounded: 5.50
Total unrounded: 5.495
Total rounded: 5.50
Subtotal - Discount (rounded): 10.99 - 5.50 = 5.49
Total (rounded): 5.50
Difference: 0.01 ❌
```

**Expected (Consistent):**
```
Discount unrounded: 5.495
Discount rounded: 5.50
Total (from rounded discount): 10.99 - 5.50 = 5.49
Total rounded: 5.49
Subtotal - Discount (rounded): 10.99 - 5.50 = 5.49
Total (rounded): 5.49
Difference: 0.00 ✅
```

## Impact
- **Minor Precision Issues**: Small discrepancies (usually 0.01) between expected and actual totals
- **Mathematical Inconsistency**: Breaks the equation `subtotal - discount = total` when using rounded values
- **Accounting Standards**: Some accounting systems may flag these inconsistencies
- **User Trust**: Users may notice slight discrepancies in calculations

## Workaround
None required - the discrepancies are very small (usually 0.01) and don't affect functionality significantly.

## Additional Notes
- This is a common rounding issue in financial calculations
- The standard approach is to round the discount first, then calculate total from the rounded discount
- This ensures the equation `subtotal - discount = total` always holds true with rounded values
- The current implementation works but creates mathematical inconsistencies
