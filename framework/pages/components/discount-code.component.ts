import { expect, Locator, Page } from "@playwright/test";

export class DiscountCodeComponent {
  readonly page: Page;
  readonly discountCodeContainer: Locator;
  readonly discountCodeInput: Locator;
  readonly applyDiscountButton: Locator;
  readonly availableDiscountCodes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.discountCodeContainer = page.locator('div.section:has-text("Discount Code")');
    this.discountCodeInput = this.discountCodeContainer.locator('#discountCode');
    this.applyDiscountButton = this.discountCodeContainer.locator('#applyDiscount');
    this.availableDiscountCodes = this.discountCodeContainer.locator('.hint');
  }

  async applyDiscountCode(code: string): Promise<void> {
    await this.discountCodeInput.fill(code);
    await this.applyDiscountButton.click();
  }

  async applyDiscountCodeAndExpectAlert(code: string, expectedMessage: string): Promise<void> {
    const dialogPromise = this.page.waitForEvent('dialog');
    await this.discountCodeInput.fill(code);
    await this.applyDiscountButton.click();
    const dialog = await dialogPromise;
    expect(dialog.message(), `Alert message should be "${expectedMessage}"`).toBe(expectedMessage);
    await dialog.accept();
  }

  async expectDiscountCodeInputToBeCorrectlyDisplayed(expectedDiscountCode: string): Promise<void> {
    await expect(this.discountCodeInput, 'Discount code input should be correctly displayed').toHaveValue(expectedDiscountCode);
    await expect.soft(this.discountCodeInput, 'Discount code input placeholder should be correct').toHaveAttribute('placeholder', 'Enter discount code');
  }

  async expectApplyDiscountButtonToBeEnabled(): Promise<void> {
    await expect(this.applyDiscountButton, 'Apply discount button should be enabled').toBeEnabled();
  }

  async expectDiscountCodeHintToBeCorrectlyDisplayed(expectedDiscountCodeHint: string): Promise<void> {
    await expect(this.availableDiscountCodes, 'Discount code hint should be correctly displayed').toHaveText(expectedDiscountCodeHint);
  }
}