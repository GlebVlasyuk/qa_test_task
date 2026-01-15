import { test, expect } from '../../fixtures/fixtures';
import { validTestItems } from '../../utils/test-data';
import { DiscountCode } from '../../api/discount-codes.enum';
import {
  calculateExpectedDiscount,
  calculateExpectedTotal,
} from '../../utils/helpers';

test.describe('DELETE /cart/:cartId/items/:itemId - Remove Item from Cart API, @api', () => {
  test('Should remove item from cart', async ({ api, cartId }) => {
    const item1 = await api.addItem(cartId, validTestItems[0]);
    const item2 = await api.addItem(cartId, validTestItems[1]);

    let cart = await api.getCart(cartId);
    expect(cart.items).toHaveLength(2);

    await api.removeItem(cartId, item1.id);

    cart = await api.getCart(cartId);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].id).toBe(item2.id);
  });

  test('Should return 404 when removing item from non-existent cart', async ({ api }) => {
    const error = await api.removeItemExpectError('non-existent-cart-id', 'item-id', 404);
    expect(error.error).toBe('Cart not found');
  });

  test('Should return 404 when removing non-existent item', async ({ api, cartWithItem }) => {
    const error = await api.removeItemExpectError(cartWithItem, 'non-existent-item-id', 404);
    expect(error.error).toBe('Item not found');
  });

  test('Should remove item from cart with only one item and verify cart becomes empty', async ({ api, cartId }) => {
    const item = await api.addItem(cartId, validTestItems[0]);
    
    let cart = await api.getCart(cartId);
    expect(cart.items).toHaveLength(1);
    expect(cart.subtotal).toBeGreaterThan(0);

    await api.removeItem(cartId, item.id);

    cart = await api.getCart(cartId);
    expect(cart.items).toEqual([]);
    expect(cart.subtotal).toBe(0);
    expect(cart.discount).toBe(0);
    expect(cart.total).toBe(0);
    expect(cart.discountCode).toBeNull();
  });

  test('Should return 404 when attempting to remove the same item twice', async ({ api, cartId }) => {
    const item = await api.addItem(cartId, validTestItems[0]);
    
    await api.removeItem(cartId, item.id);

    const error = await api.removeItemExpectError(cartId, item.id, 404);
    expect(error.error).toBe('Item not found');
  });

  // NOTE: This test expects correct behavior - discount should be recalculated on entire subtotal after item removal.
  // Backend bug: discount is only calculated on first item, so this test will fail to expose the issue.
  test('Should recalculate discount when removing item from cart with applied discount', async ({ api, cartId }) => {
    // Add items and apply discount
    const item1 = await api.addItem(cartId, { name: 'Item 1', price: 100, quantity: 1 });
    await api.addItem(cartId, { name: 'Item 2', price: 50, quantity: 1 });
    
    await api.applyDiscount(cartId, DiscountCode.SAVE10);
    
    let cart = await api.getCart(cartId);
    expect(cart.discountCode).toBe(DiscountCode.SAVE10);

    // Remove the first item
    await api.removeItem(cartId, item1.id);

    cart = await api.getCart(cartId);
    const expectedSubtotal = 50; // Only item2 remains
    // Expected correct behavior: discount should be recalculated on entire subtotal (50 * 10% = 5)
    // Backend bug: discount is only calculated on first item, so discount would be 0 or incorrect
    const expectedDiscount = calculateExpectedDiscount(expectedSubtotal, DiscountCode.SAVE10); // (50 * 10) / 100 = 5
    const expectedTotal = calculateExpectedTotal(expectedSubtotal, expectedDiscount); // 50 - 5 = 45
    
    expect(cart.subtotal).toBe(expectedSubtotal);
    expect(cart.discount).toBeCloseTo(expectedDiscount, 2);
    expect(cart.total).toBeCloseTo(expectedTotal, 2);
    expect(cart.discountCode).toBe(DiscountCode.SAVE10); // Discount code should persist
  });
});
