import { test, expect } from '../../fixtures/fixtures';
import { INVALID_DISCOUNT_CODES } from '../../utils/constants';
import { ApiMessages } from '../../api/messages.enum';
import { DiscountCode } from '../../api/discount-codes.enum';
import { CartSummary } from '../../types/cart.types';
import { validateCartSummary } from '../../utils/helpers';

function verifyDiscountCalculation(
  cart: CartSummary,
  discountCode: DiscountCode,
  discountPercentage: number
): void {
  // Calculate expected subtotal from all items in the cart
  const expectedSubtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  // NOTE: Backend rounding logic - calculates total using unrounded discount, then rounds both discount and total separately.
  // This approach can lead to mathematical inconsistency: subtotal - discount (rounded) ≠ total (rounded) in some cases.
  // Example: For HALF (50%): discount = 5.5, total = 5.5, but 10.99 - 5.5 = 5.49 (not 5.5).
  // Standard approach would round discount first, then calculate total to ensure subtotal - discount = total.
  // However, as QA we test the actual backend behavior, not the ideal behavior.
  const discountUnrounded = (expectedSubtotal * discountPercentage) / 100;
  const totalUnrounded = expectedSubtotal - discountUnrounded;
  const expectedDiscount = Math.round(discountUnrounded * 100) / 100;
  const expectedTotal = Math.round(totalUnrounded * 100) / 100;

  expect(cart.subtotal, 'Subtotal should be calculated correctly').toBe(expectedSubtotal);
  expect(cart.total, 'Total should be calculated correctly').toBe(expectedTotal);
  expect(cart.discountCode, 'Discount code should be applied correctly').toBe(discountCode);
  expect(
    cart.discount,
    `Discount should be ${expectedDiscount} (${discountPercentage}% of entire subtotal ${expectedSubtotal}), but backend only applies discount to first item`
  ).toBe(expectedDiscount);
}

test.describe('POST /cart/:cartId/discount - Apply Discount Code API, @api', () => {
  test('Should apply valid discount code SAVE10', async ({ api, cartWithItem }) => {
    const response = await api.applyDiscount(cartWithItem, DiscountCode.SAVE10);
    
    expect(response.message).toBe(ApiMessages.DISCOUNT_CODE_APPLIED);
    expect(response.discount).toBe('10%');

    const cart = await api.getCart(cartWithItem);
    verifyDiscountCalculation(cart, DiscountCode.SAVE10, 10);
  });

  test('Should apply valid discount code SAVE20', async ({ api, cartWithItem }) => {
    const response = await api.applyDiscount(cartWithItem, DiscountCode.SAVE20);
    
    expect(response.message).toBe(ApiMessages.DISCOUNT_CODE_APPLIED);
    expect(response.discount).toBe('20%');

    const cart = await api.getCart(cartWithItem);
    verifyDiscountCalculation(cart, DiscountCode.SAVE20, 20);
  });

  test('Should apply valid discount code HALF', async ({ api, cartWithItem }) => {
    const response = await api.applyDiscount(cartWithItem, DiscountCode.HALF);
    
    expect(response.message).toBe(ApiMessages.DISCOUNT_CODE_APPLIED);
    expect(response.discount).toBe('50%');

    const cart = await api.getCart(cartWithItem);
    verifyDiscountCalculation(cart, DiscountCode.HALF, 50);
  });

  test('Should recalculate discount when adding item after discount is applied', async ({ api, cartId }) => {
    // Add first item and apply discount
    await api.addItem(cartId, { name: 'Item 1', price: 10, quantity: 1 });
    const response = await api.applyDiscount(cartId, DiscountCode.SAVE10);
    expect(response.message).toBe(ApiMessages.DISCOUNT_CODE_APPLIED);
    expect(response.discount).toBe('10%');

    // Verify discount calculation with first item
    let cart = await api.getCart(cartId);
    expect(cart.items).toHaveLength(1);
    verifyDiscountCalculation(cart, DiscountCode.SAVE10, 10);

    // Add second item
    await api.addItem(cartId, { name: 'Item 2', price: 20, quantity: 2 });

    // Verify discount calculation with both items
    cart = await api.getCart(cartId);
    expect(cart.items).toHaveLength(2);
    verifyDiscountCalculation(cart, DiscountCode.SAVE10, 10);
  });

  // NOTE: This test exposes a backend bug - discount is only applied to the first item (items[0].subtotal)
  // instead of the entire subtotal. This test will fail because it expects correct behavior (discount on entire subtotal).
  test('Should apply discount code SAVE10 to entire cart subtotal with multiple items', async ({ api, cartId }) => {
    // Add 2 items to the cart
    await api.addItem(cartId, { name: '1', price: 10, quantity: 1 },);
    await api.addItem(cartId, { name: '2', price: 20, quantity: 2 });

    const response = await api.applyDiscount(cartId, DiscountCode.SAVE10);
    
    expect(response.message).toBe(ApiMessages.DISCOUNT_CODE_APPLIED);
    expect(response.discount).toBe('10%');

    const cart = await api.getCart(cartId);
    
    expect(cart.items).toHaveLength(2);
    verifyDiscountCalculation(cart, DiscountCode.SAVE10, 10);
  });

  test('Should apply discount code SAVE20 to entire cart subtotal with multiple items', async ({ api, cartId }) => {
    // Add 3 items to the cart
    await api.addItem(cartId, { name: '1', price: 10, quantity: 1 },);
    await api.addItem(cartId, { name: '2', price: 20, quantity: 2 });
    await api.addItem(cartId, { name: '3', price: 50, quantity: 5 });

    const response = await api.applyDiscount(cartId, DiscountCode.SAVE20);
    
    expect(response.message).toBe(ApiMessages.DISCOUNT_CODE_APPLIED);
    expect(response.discount).toBe('20%');

    const cart = await api.getCart(cartId);
    
    expect(cart.items).toHaveLength(3);
    verifyDiscountCalculation(cart, DiscountCode.SAVE20, 20);
  });

  test('Should apply discount code HALF to entire cart subtotal with multiple items', async ({ api, cartId }) => {
    // Add 2 items to the cart
    await api.addItem(cartId, { name: '1', price: 10, quantity: 1 },);
    await api.addItem(cartId, { name: '2', price: 20, quantity: 2 });

    const response = await api.applyDiscount(cartId, DiscountCode.HALF);
    
    expect(response.message).toBe(ApiMessages.DISCOUNT_CODE_APPLIED);
    expect(response.discount).toBe('50%');

    const cart = await api.getCart(cartId);
    
    expect(cart.items).toHaveLength(2);
    verifyDiscountCalculation(cart, DiscountCode.HALF, 50);
  });

  test('Should validate cart summary structure', async ({ api, cartWithItem }) => {
    await api.applyDiscount(cartWithItem, DiscountCode.SAVE10);

    const cart = await api.getCart(cartWithItem);
    expect(validateCartSummary(cart)).toBe(true);
  });

  // NOTE: Industry best practice - discount codes should not be applicable to empty carts.
  // Most e-commerce platforms (WooCommerce, Shopify, etc.) prevent applying discount codes to empty carts.
  // This test expects correct behavior (rejecting empty cart) and will fail to expose the backend issue.
  test('Should return error when applying discount code to empty cart', async ({ api, cartId }) => {
    // Verify cart is empty
    let cart = await api.getCart(cartId);
    expect(cart.items).toEqual([]);

    // Attempting to apply discount to empty cart should return 400 error
    const error = await api.applyDiscountExpectError(cartId, DiscountCode.SAVE10, 400);
    expect(error.error).toBe(ApiMessages.CART_EMPTY);

    // Verify cart remains unchanged (no discount code set)
    cart = await api.getCart(cartId);
    expect(cart.discountCode).toBeNull();
  });

  // negative scenarios
  test('Should return an error on invalid discount code', async ({ api, cartWithItem }) => {
    for (const code of INVALID_DISCOUNT_CODES) {
      const error = await api.applyDiscountExpectError(cartWithItem, code, 400);
      expect(error.error, `Should return an error on invalid discount code: ${code}`).toBe(ApiMessages.INVALID_DISCOUNT_CODE);
    }
  });

  test('Should return 404 when applying discount to non-existent cart', async ({ api }) => {
    const error = await api.applyDiscountExpectError('non-existent-cart-id', DiscountCode.SAVE10, 404);
    expect(error.error, 'Should return 404 when applying discount to non-existent cart').toBe(ApiMessages.CART_NOT_FOUND);
  });
});
