import { Page } from '@playwright/test';
import { AddItemComponent } from './components/add-item.component';
import { CartItemsComponent } from './components/cart-items.component';
import { OrderSummaryComponent } from './components/order-summary.component';
import { DiscountCodeComponent } from './components/discount-code.component';

export class ShoppingCartPage {
  readonly page: Page;
  readonly addItemComponent: AddItemComponent;
  readonly cartItemsComponent: CartItemsComponent;
  readonly discountCodeComponent: DiscountCodeComponent;
  readonly orderSummaryComponent: OrderSummaryComponent;

  constructor(page: Page) {
    this.page = page;
    this.addItemComponent = new AddItemComponent(page);
    this.cartItemsComponent = new CartItemsComponent(page);
    this.discountCodeComponent = new DiscountCodeComponent(page);
    this.orderSummaryComponent = new OrderSummaryComponent(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCartUpdate(): Promise<void> {
    await this.page.waitForTimeout(1000);
  }
}
