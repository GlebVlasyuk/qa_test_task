/**
 * Enum containing all API response messages
 * Used to avoid duplication and ensure consistency across tests
 */
export enum ApiMessages {
  DISCOUNT_CODE_APPLIED = 'Discount code applied',
  INVALID_DISCOUNT_CODE = 'Invalid discount code',
  CART_NOT_FOUND = 'Cart not found',
  ITEM_NOT_FOUND = 'Item not found',
  INVALID_ITEM_NAME = 'Invalid item name',
  INVALID_PRICE = 'Invalid price',
  INVALID_QUANTITY = 'Invalid quantity',
  CART_EMPTY = 'Cannot apply discount code to empty cart',
}
