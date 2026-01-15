import { APIRequestContext, expect } from '@playwright/test';
import { CartAPI } from '../cart-api';
import { CreateCartResponse } from '../../types/cart.types';

/**
 * Helper function to create a new cart and return the cart ID
 * @param request - APIRequestContext from Playwright test fixture
 * @returns Promise<string> - The cart ID
 */
export async function createCartHelper(request: APIRequestContext): Promise<string> {
  const api = new CartAPI(request);
  const createResponse: CreateCartResponse = await api.createCart();
  expect(createResponse.cartId).toBeTruthy();
  return createResponse.cartId;
}

/**
 * Helper function to create a new cart using an existing CartAPI instance
 * @param api - CartAPI instance
 * @returns Promise<string> - The cart ID
 */
export async function createCartWithApi(api: CartAPI): Promise<string> {
  const createResponse: CreateCartResponse = await api.createCart();
  return createResponse.cartId;
}
