import { test } from '../../fixtures/fixtures';
import { validTestItems } from '../../utils/test-data';

test.describe('Remove Item via UI, @ui', () => {

  test('Should remove item from cart', async ({ shoppingCartPage }) => {
    await shoppingCartPage.addItemComponent.addItem(validTestItems[0].name, validTestItems[0].price, validTestItems[0].quantity);
    await shoppingCartPage.waitForCartUpdate();

    await shoppingCartPage.cartItemsComponent.expectCartItemsCountToBeCorrect(1);

    const cartItemRow = shoppingCartPage.cartItemsComponent.getCartItemRowByIndex(1);
    await cartItemRow.expectCartItemRowToBeDisplayed();
    await cartItemRow.expectCartItemNameToBeDisplayed(validTestItems[0].name);
    await cartItemRow.expectCartItemRemoveButtonToBeDisplayed();
    await cartItemRow.expectCartItemRemoveButtonToBeEnabled();

    await cartItemRow.clickCartItemRemoveButton();
    await shoppingCartPage.waitForCartUpdate();

    await shoppingCartPage.cartItemsComponent.expectCartItemsCountToBeCorrect(0);
    await shoppingCartPage.cartItemsComponent.expectEmptyCartMessageToBeDisplayed();
    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed('$0.00');
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed('-$0.00');
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed('$0.00');
  });

  test('Should remove correct item when multiple items exist', async ({ shoppingCartPage }) => {
    await shoppingCartPage.addItemComponent.addItem(validTestItems[0].name, validTestItems[0].price, validTestItems[0].quantity);
    await shoppingCartPage.waitForCartUpdate();
    await shoppingCartPage.addItemComponent.addItem(validTestItems[1].name, validTestItems[1].price, validTestItems[1].quantity);
    await shoppingCartPage.waitForCartUpdate();

    await shoppingCartPage.cartItemsComponent.expectCartItemsCountToBeCorrect(2);

    const cartItemRow = shoppingCartPage.cartItemsComponent.getCartItemRowByIndex(1);
    await cartItemRow.clickCartItemRemoveButton();
    await shoppingCartPage.waitForCartUpdate();

    await shoppingCartPage.cartItemsComponent.expectCartItemsCountToBeCorrect(1);
    const remainingItemRow = shoppingCartPage.cartItemsComponent.getCartItemRowByIndex(1);
    await remainingItemRow.expectCartItemNameToBeDisplayed(validTestItems[1].name);
    await remainingItemRow.expectCartItemRemoveButtonToBeDisplayed();
    await remainingItemRow.expectCartItemRemoveButtonToBeEnabled();

    const expectedSubtotal = validTestItems[1].price * validTestItems[1].quantity;
    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${expectedSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed('-$0.00');
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${expectedSubtotal.toFixed(2)}`);
  });
});
