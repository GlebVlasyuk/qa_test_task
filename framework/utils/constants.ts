import { DiscountCodeInfo } from '../types/cart.types';

export const BASE_URL = 'http://localhost:3000';

export const DISCOUNT_CODES: Record<string, DiscountCodeInfo> = {
  SAVE10: { code: 'SAVE10', percentage: 10 },
  SAVE20: { code: 'SAVE20', percentage: 20 },
  HALF: { code: 'HALF', percentage: 50 },
};

export const VALID_DISCOUNT_CODES = Object.keys(DISCOUNT_CODES) as Array<keyof typeof DISCOUNT_CODES>;

export const INVALID_DISCOUNT_CODES = [
  'INVALID',
  'SAVE5',
  'SAVE50',
  '',
  'save10', // lowercase
  'SAVE10 ', // trailing space
];
