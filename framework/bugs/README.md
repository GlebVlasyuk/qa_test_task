# Bug Reports

This directory contains bug reports for issues found during testing of the Shopping Cart API application.

## Bug List

| Bug ID | Title | Severity | Priority | Status |
|--------|-------|----------|----------|--------|
| [BUG-001](./BUG-001-discount-only-first-item.md) | Discount Code Applies Only to First Item Instead of Entire Cart Subtotal | High | P1 - Critical | Open |
| [BUG-002](./BUG-002-empty-cart-discount.md) | Discount Code Can Be Applied to Empty Cart | Medium | P2 - High | Open |
| [BUG-003](./BUG-003-empty-string-name-validation.md) | Item Name with Only Spaces Is Accepted | Low | P3 - Medium | Open |
| [BUG-004](./BUG-004-rounding-inconsistency.md) | Mathematical Inconsistency in Discount Rounding Logic | Low | P3 - Low | Open |

## Summary

### Critical Issues (P1)
- **BUG-001**: Discount calculation bug affects all discount codes and causes incorrect pricing - customers receive smaller discounts than expected, leading to potential revenue loss.

### High Priority Issues (P2)
- **BUG-002**: API allows applying discount codes to empty carts, which doesn't align with industry best practices (WooCommerce, Shopify standards).

### Medium/Low Priority Issues (P3)
- **BUG-003**: Item name validation doesn't reject whitespace-only strings, affecting data quality.
- **BUG-004**: Rounding logic creates minor mathematical inconsistencies (usually 0.01 difference).

## Testing Coverage

All bugs have corresponding test cases in the test suite:
- `framework/tests/api/apply-discount.spec.ts` - Tests for BUG-001, BUG-002
- `framework/tests/api/add-item.spec.ts` - Tests for BUG-003
- Test comments document BUG-004 in `apply-discount.spec.ts`
