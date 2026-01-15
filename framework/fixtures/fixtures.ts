import { test as base } from '@playwright/test';
import { CartAPI } from '../api/cart-api';
import { ShoppingCartPage } from '../pages/shopping-cart.page';
import { validTestItems } from '../utils/test-data';

type TestFixtures = {
  api: CartAPI;
  cartId: string;
  cartWithItem: string;
  shoppingCartPage: ShoppingCartPage;
};

export const test = base.extend<TestFixtures>({
  api: async ({ request }, use) => {
    const api = new CartAPI(request);
    await use(api);
  },
  cartId: async ({ api }, use) => {
    const createResponse = await api.createCart();
    await use(createResponse.cartId);
  },
  cartWithItem: async ({ api }, use) => {
    const createResponse = await api.createCart();
    const cartId = createResponse.cartId;
    await api.addItem(cartId, validTestItems[0]);
    await use(cartId);
  },
  shoppingCartPage: async ({ page }, use) => {
    const shoppingCartPage = new ShoppingCartPage(page);
    await shoppingCartPage.open();
    await shoppingCartPage.waitForCartUpdate();
    await use(shoppingCartPage);
  },
});

export { expect } from '@playwright/test';
