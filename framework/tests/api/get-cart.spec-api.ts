import { test, expect } from '../../fixtures/fixtures';
import { validTestItems } from '../../utils/test-data';
import { calculateExpectedSubtotal } from '../../utils/helpers';
import { createCartWithApi } from '../../api/helpers/create-cart.api';

  test.describe('GET /cart/:cartId - Get Cart API, @api', () => {
  let cartId: string;

  test.beforeEach(async ({ api }) => {
    cartId = await createCartWithApi(api);
  });

  test('Should get empty cart', async ({ api }) => {
    const cart = await api.getCart(cartId);
    
    expect(cart.items).toEqual([]);
    expect(cart.subtotal).toBe(0);
    expect(cart.discount).toBe(0);
    expect(cart.total).toBe(0);
    expect(cart.discountCode).toBeNull();
  });

  test('Should return 404 for non-existent cart', async ({ api }) => {
    const error = await api.getCartExpectError('non-existent-cart-id', 404);
    expect(error.error).toBe('Cart not found');
  });

  test('Should calculate subtotal correctly', async ({ api }) => {
    for (const item of validTestItems.slice(0, 3)) {
      await api.addItem(cartId, item);
    }

    const cart = await api.getCart(cartId);
    const expectedSubtotal = calculateExpectedSubtotal(
      cart.items.map((item) => ({ price: item.price, quantity: item.quantity }))
    );

    expect(cart.subtotal).toBeCloseTo(expectedSubtotal, 2);
  });

  test('Should calculate total correctly without discount', async ({ api }) => {
    await api.addItem(cartId, { name: 'Test Item', price: 100, quantity: 2 });
    const cart = await api.getCart(cartId);

    expect(cart.subtotal).toBe(200);
    expect(cart.discount).toBe(0);
    expect(cart.total).toBe(200);
  });
});
