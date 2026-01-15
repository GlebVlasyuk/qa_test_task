import { expect, Locator, Page } from "@playwright/test";

export class AddItemComponent {
  readonly page: Page;
  readonly addItemContainer: Locator;
  readonly addItemForm: Locator;
  readonly itemNameInput: Locator;
  readonly itemPriceInput: Locator;
  readonly itemQuantityInput: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addItemContainer = page.locator('div.section:has-text("Add Item")');
    this.addItemForm = this.addItemContainer.locator('#addItemForm');
    this.itemNameInput = this.addItemForm.locator('#itemName');
    this.itemPriceInput = this.addItemForm.locator('#itemPrice');
    this.itemQuantityInput = this.addItemForm.locator('#itemQuantity');
    this.addToCartButton = this.addItemForm.locator('button[type="submit"]', { hasText: 'Add to Cart' });
  }

  async addItem(name: string, price: number, quantity: number): Promise<void> {
    await this.itemNameInput.fill(name);
    await this.itemPriceInput.fill(price.toString());
    await this.itemQuantityInput.fill(quantity.toString());
    await this.addToCartButton.click();
  }

  async expectItemNameInputToBeCorrectlyDisplayed(expectedItemName: string): Promise<void> {
    await expect(this.itemNameInput, 'Item name input should be correctly displayed').toHaveValue(expectedItemName);
  }

  async expectItemPriceInputToBeCorrectlyDisplayed(expectedItemPrice: string): Promise<void> {
    await expect(this.itemPriceInput, 'Item price input should be correctly displayed').toHaveValue(expectedItemPrice);
  }

  async expectItemQuantityInputToBeCorrectlyDisplayed(expectedItemQuantity: string): Promise<void> {
    await expect(this.itemQuantityInput, 'Item quantity input should be correctly displayed').toHaveValue(expectedItemQuantity);
  }

  async expectAddToCartButtonToBeEnabled(): Promise<void> {
    await expect(this.addToCartButton, 'Add to cart button should be enabled').toBeEnabled();
  }

  async expectFormValidationError(): Promise<void> {
    // HTML5 validation - check if input is invalid
    const nameValid = await this.itemNameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    const priceValid = await this.itemPriceInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    const quantityValid = await this.itemQuantityInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );

    expect(nameValid || priceValid || quantityValid).toBeFalsy();
  }
}