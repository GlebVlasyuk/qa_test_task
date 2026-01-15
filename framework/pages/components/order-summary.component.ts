import { expect, Locator, Page } from "@playwright/test";

export class OrderSummaryComponent {
  readonly page: Page;
  readonly orderSummaryContainer: Locator;
  readonly subtotal: Locator;
  readonly discount: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderSummaryContainer = page.locator('div.section:has-text("Order Summary")');
    this.subtotal = this.orderSummaryContainer.locator('#subtotal');
    this.discount = this.orderSummaryContainer.locator('#discount');
    this.total = this.orderSummaryContainer.locator('#total');
  }

  async getSubtotal(): Promise<number> {
    const text = await this.subtotal.textContent();
    return text ? parseFloat(text.replace('$', '')) : 0;
  }
  
  async getDiscount(): Promise<number> {
    const text = await this.discount.textContent();
    return text ? parseFloat(text.replace('-$', '')) : 0;
  }

  async getTotal(): Promise<number> {
    const text = await this.total.textContent();
    return text ? parseFloat(text.replace('$', '')) : 0;
  }

  async expectSubtotalToBeCorrectlyDisplayed(expectedSubtotal: string): Promise<void> {
    await expect(this.subtotal, 'Subtotal should be correctly displayed').toHaveText(expectedSubtotal);
  }

    async expectDiscountToBeCorrectlyDisplayed(expectedDiscount: string): Promise<void> {
    await expect(this.discount, 'Discount should be correctly displayed').toHaveText(expectedDiscount);
    await expect.soft(this.discount, 'Discount should be correctly colored').toHaveCSS('color', 'rgb(39, 174, 96)');
  }

  async expectTotalToBeCorrectlyDisplayed(expectedTotal: string): Promise<void> {
    await expect(this.total, 'Total should be correctly displayed').toHaveText(expectedTotal);
  }
}