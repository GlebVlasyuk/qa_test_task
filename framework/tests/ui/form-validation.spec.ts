import { test, expect } from '../../fixtures/fixtures';

test.describe('Form Validation, @ui', () => {

  test('Should have required validation on item name', async ({ shoppingCartPage }) => {
    const nameInput = shoppingCartPage.addItemComponent.itemNameInput;
    expect(await nameInput.getAttribute('required')).toBe('');
  });

  test('Should have required validation on item price', async ({ shoppingCartPage }) => {
    const priceInput = shoppingCartPage.addItemComponent.itemPriceInput;
    expect(await priceInput.getAttribute('required')).toBe('');
    expect(await priceInput.getAttribute('min')).toBe('0');
  });

  test('Should have required validation on item quantity', async ({ shoppingCartPage }) => {
    const quantityInput = shoppingCartPage.addItemComponent.itemQuantityInput;
    expect(await quantityInput.getAttribute('required')).toBe('');
    expect(await quantityInput.getAttribute('min')).toBe('1');
  });
});
