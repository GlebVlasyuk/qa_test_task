import { expect, Locator, Page } from "@playwright/test";

export class CartItemsComponent {
  readonly page: Page;
  readonly cartItemsContainer: Locator;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItemsContainer = page.locator('div.section:has-text("Cart Items")');
    this.cartItems = this.cartItemsContainer.locator('#cartItems');
    this.emptyCartMessage = this.cartItems.locator('.empty-cart');
  }

  /**
   * Gets a cart item row by its 1-based index
   * @param index - 1-based index (first item is 1, second is 2, etc.). Must be >= 1
   */
  getCartItemRowByIndex(index: number): CartItemRow {
    if (index < 1) {
      throw new Error(`Index must be 1 or greater, but got ${index}`);
    }
    return new CartItemRow(this.page, this.cartItems.locator('.cart-item').nth(index - 1));
  }

  async expectCartItemsToBeDisplayed(): Promise<void> {
    await expect(this.cartItems, 'Cart items should be correctly displayed').toBeVisible();
  }

  async expectCartItemsCountToBeCorrect(expectedCartItemsCount: number): Promise<void> {
    await expect(this.cartItems.locator('.cart-item'), 'Cart items count should be correctly displayed').toHaveCount(expectedCartItemsCount);
  }

  async expectEmptyCartMessageToBeDisplayed(): Promise<void> {
    await expect(this.emptyCartMessage, 'Empty cart message should be correctly displayed').toBeVisible();
    await expect(this.emptyCartMessage, 'Empty cart message should be correctly displayed').toHaveText('Your cart is empty');
  }
}

class CartItemRow {
  readonly page: Page;
  readonly cartItemRow: Locator;
  readonly cartItemName: Locator;
  readonly cartItemDetails: Locator;
  readonly cartItemSubtotal: Locator;
  readonly cartItemRemoveButton: Locator;

  constructor(page: Page, parentLocator: Locator) {
    this.page = page;
    this.cartItemRow = parentLocator;
    this.cartItemName = this.cartItemRow.locator('.cart-item-name');
    this.cartItemDetails = this.cartItemRow.locator('.cart-item-details');
    this.cartItemSubtotal = this.cartItemRow.locator('.cart-item-subtotal');
    this.cartItemRemoveButton = this.cartItemRow.getByRole('button', { name: 'Remove' });
  }

  async clickCartItemRemoveButton(): Promise<void> {
    await this.cartItemRemoveButton.click();
  }

  async expectCartItemRowToBeDisplayed(): Promise<void> {
    await expect(this.cartItemRow, 'Cart item row should be correctly displayed').toBeVisible();
  }

  async expectCartItemNameToBeDisplayed(expectedCartItemName: string): Promise<void> {
    await expect(this.cartItemName, 'Cart item name should be correctly displayed').toHaveText(expectedCartItemName);
  }

  async expectCartItemDetailsToBeDisplayed(expectedCartItemDetails: string): Promise<void> {
    await expect(this.cartItemDetails, 'Cart item details should be correctly displayed').toHaveText(expectedCartItemDetails);
  }

  async expectCartItemSubtotalToBeDisplayed(expectedCartItemSubtotal: string): Promise<void> {  
    await expect(this.cartItemSubtotal, 'Cart item subtotal should be correctly displayed').toHaveText(expectedCartItemSubtotal);
  }

  async expectCartItemRemoveButtonToBeDisplayed(): Promise<void> {
    await expect(this.cartItemRemoveButton, 'Cart item remove button should be correctly displayed').toBeVisible();
  }

  async expectCartItemRemoveButtonToBeEnabled(): Promise<void> {
    await expect(this.cartItemRemoveButton, 'Cart item remove button should be enabled').toBeEnabled();
  }
  
}