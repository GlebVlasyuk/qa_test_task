import { test, expect } from '../../fixtures/fixtures';
import { validTestItems, invalidTestItems } from '../../utils/test-data';

test.describe('POST /cart/:cartId/items - Add Item to Cart API, @api', () => {

  test('Should add item with valid data', async ({ api, cartId }) => {
    const item = validTestItems[0];
    const response = await api.addItem(cartId, item);

    expect(response.id).toBeTruthy();
    expect(response.name).toBe(item.name);
    expect(response.price).toBe(item.price);
    expect(response.quantity).toBe(item.quantity);

    const cart = await api.getCart(cartId);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].name).toBe(item.name);
    expect(cart.items[0].price).toBe(item.price);
    expect(cart.items[0].quantity).toBe(item.quantity);
  });

  test('Should add multiple items', async ({ api, cartId }) => {
    for (const item of validTestItems) {
      await api.addItem(cartId, item);
    }

    const cart = await api.getCart(cartId);
    expect(cart.items).toHaveLength(validTestItems.length);
  });

  test('Should reject item with negative price', async ({ api, cartId }) => {
    const error = await api.addItemExpectError(cartId, invalidTestItems.negativePrice, 400);
    expect(error.error, 'Should reject item with negative price').toBe('Invalid price');
  });

  test('Should reject item with zero price', async ({ api, cartId }) => {
    const error = await api.addItemExpectError(cartId, invalidTestItems.zeroPrice, 400);
    expect(error.error, 'Should reject item with zero price').toBe('Invalid price');
  });

  test('Should reject item with zero quantity', async ({ api, cartId }) => {
    const error = await api.addItemExpectError(cartId, invalidTestItems.zeroQuantity, 400);
    expect(error.error, 'Should reject item with zero quantity').toBe('Invalid quantity');
  });

  test('Should reject item with negative quantity', async ({ api, cartId }) => {
    const error = await api.addItemExpectError(cartId, invalidTestItems.negativeQuantity, 400);
    expect(error.error, 'Should reject item with negative quantity').toBe('Invalid quantity');
  });

  test('Should reject item with missing name', async ({ api, cartId }) => {
    const error = await api.addItemExpectError(cartId, invalidTestItems.missingName, 400);
    expect(error.error, 'Should reject item with missing name').toBe('Invalid item name');
  });

  test('Should reject item with name containing only spaces', async ({ api, cartId }) => {
    const error = await api.addItemExpectError(cartId, { name: '   ', price: 10, quantity: 1 }, 400);
    expect(error.error, 'Should reject item with name containing only spaces').toBe('Invalid item name');
  });

  test('Should reject item with missing price', async ({ api, cartId }) => {
    const error = await api.addItemExpectError(cartId, invalidTestItems.missingPrice, 400);
    expect(error.error, 'Should reject item with missing price').toContain('Invalid');
  });

  test('Should reject item with missing quantity', async ({ api, cartId }) => {
    const error = await api.addItemExpectError(cartId, invalidTestItems.missingQuantity, 400);
    expect(error.error, 'Should reject item with missing quantity').toContain('Invalid');
  });

  test('Should return 404 when adding item to non-existent cart', async ({ api }) => {
    const error = await api.addItemExpectError('non-existent-cart-id', validTestItems[0], 404);
    expect(error.error, 'Should return 404 when adding item to non-existent cart').toBe('Cart not found');
  });
});
