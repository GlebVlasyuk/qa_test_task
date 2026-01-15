import { test, expect } from '../../fixtures/fixtures';

test.describe('Page Load and Initial State, @ui', () => {

  test('Should load the shopping cart page', async ({ shoppingCartPage }) => {
    await expect(shoppingCartPage.page.locator('h1')).toHaveText('Shopping Cart');
    await shoppingCartPage.addItemComponent.expectItemNameInputToBeCorrectlyDisplayed('');
    await shoppingCartPage.addItemComponent.expectItemPriceInputToBeCorrectlyDisplayed('');
    await shoppingCartPage.addItemComponent.expectItemQuantityInputToBeCorrectlyDisplayed('1');
  });

  test('Should display empty cart initially', async ({ shoppingCartPage }) => {
    await shoppingCartPage.cartItemsComponent.expectCartItemsToBeDisplayed();
    await shoppingCartPage.cartItemsComponent.expectEmptyCartMessageToBeDisplayed();
    await shoppingCartPage.cartItemsComponent.expectCartItemsCountToBeCorrect(0);
  });

  test('Should display zero values in order summary initially', async ({ shoppingCartPage }) => {
    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed('$0.00');
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed('-$0.00');
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed('$0.00');
  });
});
