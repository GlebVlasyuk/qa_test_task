# BUG-002: Discount Code Can Be Applied to Empty Cart

## Summary
The API allows applying discount codes to empty carts, which contradicts industry best practices and common e-commerce platform behavior (WooCommerce, Shopify, etc.). Discount codes should only be applicable when the cart contains at least one item.

## Severity
**Medium** - Affects UX and follows anti-patterns, but doesn't cause incorrect calculations (discount = 0)

## Priority
**P2 - High** - Should align with industry standards and improve user experience

## Environment
- Application: Shopping Cart API
- Version: Current
- Endpoint: `POST /cart/:cartId/discount`

## Description
The backend allows applying discount codes to empty carts. While the discount is stored, it's not calculated until items are added (since discount = 0 when cart is empty). However, this creates confusion and doesn't align with standard e-commerce practices where discount codes should only be applicable to carts with items.

## Preconditions
1. A cart exists with ID: `{cartId}`
2. The cart is empty (no items added)

## Steps to Reproduce
1. Create a new cart using `POST /cart`
2. Verify cart is empty using `GET /cart/{cartId}` → Should return empty items array
3. Apply discount code `SAVE10` using `POST /cart/{cartId}/discount` with body `{ code: "SAVE10" }`

## Expected Result
- API should return `400 Bad Request`
- Error message: `"Cannot apply discount code to empty cart"`
- Cart discount code should remain `null`
- Cart summary should remain unchanged

## Actual Result
- API returns `200 OK`
- Response: `{ message: "Discount code applied", discount: "10%" }`
- Cart discount code is set to `"SAVE10"` (stored but not calculated)
- Cart summary shows: `{ items: [], subtotal: 0, discount: 0, total: 0, discountCode: "SAVE10" }`

## Evidence/Logs

### Backend Code (src/index.js:79-93)
```javascript
app.post('/cart/:cartId/discount', (req, res) => {
  const cart = carts.get(req.params.cartId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const { code } = req.body;

  if (!code || !discountCodes[code]) {
    return res.status(400).json({ error: 'Invalid discount code' });
  }

  cart.discountCode = code;  // ❌ BUG: No validation for empty cart
  res.json({ message: 'Discount code applied', discount: `${discountCodes[code]}%` });
});
```

### Expected Code
```javascript
app.post('/cart/:cartId/discount', (req, res) => {
  const cart = carts.get(req.params.cartId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const { code } = req.body;

  if (!code || !discountCodes[code]) {
    return res.status(400).json({ error: 'Invalid discount code' });
  }

  // ✅ Validate cart has items
  if (cart.items.length === 0) {
    return res.status(400).json({ error: 'Cannot apply discount code to empty cart' });
  }

  cart.discountCode = code;
  res.json({ message: 'Discount code applied', discount: `${discountCodes[code]}%` });
});
```

### Test Results
- Test file: `framework/tests/api/apply-discount.spec.ts`
- Failing test: `Should return error when applying discount code to empty cart`

### Industry Best Practices
- **WooCommerce**: Prevents applying coupons to empty carts
- **Shopify**: Discount codes can only be applied when cart has items
- **Magento**: Similar behavior - coupons require items in cart

## Impact
- **UX Confusion**: Users can apply codes to empty carts, which is confusing
- **Non-Standard Behavior**: Doesn't align with industry-standard e-commerce platforms
- **UI Inconsistency**: UI should disable "Apply Discount" button when cart is empty (defense in depth)

## Workaround
UI-level validation can disable the "Apply Discount" button when the cart is empty, but API-level validation is still required.

## Additional Notes
- While discount calculation correctly returns 0 for empty carts, allowing the operation itself is the issue
- Validation should be at API level (required) and UI level (recommended for better UX)
