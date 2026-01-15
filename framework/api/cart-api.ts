import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import {
  CreateCartResponse,
  CartSummary,
  AddItemRequest,
  AddItemResponse,
  ApplyDiscountResponse,
  HealthCheckResponse,
  ApiError,
} from '../types/cart.types';
import { BASE_URL } from '../utils/constants';

export class CartAPI {
  private readonly cartBaseUrl = `${BASE_URL}/cart`;

  constructor(private request: APIRequestContext) {}

  private async sendRequest<T>(response: APIResponse, expectedStatus: number): Promise<T> {
    const actualStatus = response.status();
    expect(actualStatus, `Expected status ${expectedStatus}, but got ${actualStatus}`).toBe(expectedStatus);
    // HTTP 204 (No Content) responses have no response body, so calling response.json() would fail
    // This check prevents attempting to parse JSON from an empty response body
    if (expectedStatus === 204) {
      return undefined as T;
    }
    return response.json();
  }

  async createCart(): Promise<CreateCartResponse> {
    const response = await this.request.post(this.cartBaseUrl);
    return this.sendRequest<CreateCartResponse>(response, 201);
  }

  async getCart(cartId: string): Promise<CartSummary> {
    const response = await this.request.get(`${this.cartBaseUrl}/${cartId}`);
    return this.sendRequest<CartSummary>(response, 200);
  }

  async addItem(cartId: string, item: AddItemRequest): Promise<AddItemResponse> {
    const response = await this.request.post(`${this.cartBaseUrl}/${cartId}/items`, {
      data: item,
    });
    return this.sendRequest<AddItemResponse>(response, 201);
  }

  async removeItem(cartId: string, itemId: string): Promise<void> {
    const response = await this.request.delete(`${this.cartBaseUrl}/${cartId}/items/${itemId}`);
    return this.sendRequest<void>(response, 204);
  }

  async applyDiscount(cartId: string, code: string): Promise<ApplyDiscountResponse> {
    const response = await this.request.post(`${this.cartBaseUrl}/${cartId}/discount`, {
      data: { code },
    });
    return this.sendRequest<ApplyDiscountResponse>(response, 200);
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await this.request.get(`${BASE_URL}/health`);
    return this.sendRequest<HealthCheckResponse>(response, 200);
  }

  // Negative test methods
  async createCartExpectError(expectedStatus: number): Promise<ApiError> {
    const response = await this.request.post(this.cartBaseUrl);
    return this.sendRequest<ApiError>(response, expectedStatus);
  }

  async getCartExpectError(cartId: string, expectedStatus: number): Promise<ApiError> {
    const response = await this.request.get(`${this.cartBaseUrl}/${cartId}`);
    return this.sendRequest<ApiError>(response, expectedStatus);
  }

  async addItemExpectError(
    cartId: string,
    item: AddItemRequest | Record<string, unknown>,
    expectedStatus: number
  ): Promise<ApiError> {
    const response = await this.request.post(`${this.cartBaseUrl}/${cartId}/items`, {
      data: item,
    });
    return this.sendRequest<ApiError>(response, expectedStatus);
  }

  async removeItemExpectError(
    cartId: string,
    itemId: string,
    expectedStatus: number
  ): Promise<ApiError> {
    const response = await this.request.delete(`${this.cartBaseUrl}/${cartId}/items/${itemId}`);
    return this.sendRequest<ApiError>(response, expectedStatus);
  }

  async applyDiscountExpectError(
    cartId: string,
    code: string,
    expectedStatus: number
  ): Promise<ApiError> {
    const response = await this.request.post(`${this.cartBaseUrl}/${cartId}/discount`, {
      data: { code },
    });
    return this.sendRequest<ApiError>(response, expectedStatus);
  }
}
