import { AddItemRequest } from '../types/cart.types';

// added basic test items with common logic, can be extended later with more specific values
export const validTestItems: AddItemRequest[] = [
  { name: 'AQA Product A', price: 10.99, quantity: 1 },
  { name: 'AQA Product B', price: 25.50, quantity: 2 },
  { name: 'AQA Product C', price: 5.00, quantity: 5 },
  { name: 'AQA Product D', price: 100.00, quantity: 1 },
  { name: 'AQA Expensive Item', price: 999.99, quantity: 1 },
];

export const invalidTestItems = {
  negativePrice: { name: 'AQA Invalid Item', price: -10, quantity: 1 },
  // added to negative by common logic but it can be designed by requirement so better to clarify
  zeroPrice: { name: 'AQA Free Item', price: 0, quantity: 1 },
  zeroQuantity: { name: 'AQA Item', price: 10, quantity: 0 },
  negativeQuantity: { name: 'AQA Item', price: 10, quantity: -1 },
  missingName: { price: 10, quantity: 1 },
  missingPrice: { name: 'AQA Item', quantity: 1 },
  missingQuantity: { name: 'AQA Item', price: 10 },
  invalidNameType: { name: 123, price: 10, quantity: 1 },
  invalidPriceType: { name: 'AQA Item', price: 'ten', quantity: 1 },
  invalidQuantityType: { name: 'AQA Item', price: 10, quantity: 'one' },
};
