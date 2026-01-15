import { CartSummary, DiscountCode } from '../types/cart.types';
import { DISCOUNT_CODES } from './constants';

export function calculateExpectedSubtotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateExpectedDiscount(
  subtotal: number,
  discountCode: DiscountCode | null
): number {
  if (!discountCode || !DISCOUNT_CODES[discountCode]) {
    return 0;
  }
  const percentage = DISCOUNT_CODES[discountCode].percentage;
  return Math.round((subtotal * percentage) / 100 * 100) / 100;
}

export function calculateExpectedTotal(subtotal: number, discount: number): number {
  return Math.round((subtotal - discount) * 100) / 100;
}

export function validateCartSummary(cart: CartSummary): boolean {
  const calculatedSubtotal = calculateExpectedSubtotal(cart.items);
  const calculatedDiscount = calculateExpectedDiscount(cart.subtotal, cart.discountCode as DiscountCode | null);
  const calculatedTotal = calculateExpectedTotal(cart.subtotal, cart.discount);

  return (
    Math.abs(cart.subtotal - calculatedSubtotal) < 0.01 &&
    Math.abs(cart.discount - calculatedDiscount) < 0.01 &&
    Math.abs(cart.total - calculatedTotal) < 0.01
  );
}

export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Validates if a string is a valid UUID v4 format
 * @param uuid - String to validate
 * @returns boolean - True if the string is a valid UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
