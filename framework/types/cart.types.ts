export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode: string | null;
  total: number;
}

export interface CreateCartResponse {
  cartId: string;
}

export interface AddItemRequest {
  name: string;
  price: number;
  quantity: number;
}

export interface AddItemResponse {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ApplyDiscountRequest {
  code: string;
}

export interface ApplyDiscountResponse {
  message: string;
  discount: string;
}

export interface HealthCheckResponse {
  status: string;
}

export interface ApiError {
  error: string;
}

export type DiscountCode = 'SAVE10' | 'SAVE20' | 'HALF';

export interface DiscountCodeInfo {
  code: DiscountCode;
  percentage: number;
}
