import { test, expect } from '../../fixtures/fixtures';
import { isValidUUID } from '../../utils/helpers';

test.describe('POST /cart - Create Cart API, @api', () => {
  test('Should create a new cart', async ({ api }) => {
    const response = await api.createCart();
    
    expect(response.cartId).toBeTruthy();
    expect(isValidUUID(response.cartId)).toBe(true);
  });

  // additional test to validate that the cart ID is a unique UUID
  test('Should create unique cart IDs', async ({ api }) => {
    const response1 = await api.createCart();
    const response2 = await api.createCart();
    
    expect(response1.cartId).not.toBe(response2.cartId);
  });
});
