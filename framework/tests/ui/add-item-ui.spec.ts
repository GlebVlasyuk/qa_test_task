import { test } from '../../fixtures/fixtures';
import { validTestItems } from '../../utils/test-data';

test.describe('Add Item via UI, @ui', () => {

    test('Should add item to cart via form', async ({ shoppingCartPage }) => {
    const item = validTestItems[0];
    await shoppingCartPage.addItemComponent.addItem(item.name, item.price, item.quantity);

    await shoppingCartPage.cartItemsComponent.expectCartItemsCountToBeCorrect(1);
    const cartItemRow = shoppingCartPage.cartItemsComponent.getCartItemRowByIndex(1);
    await cartItemRow.expectCartItemRowToBeDisplayed();
    await cartItemRow.expectCartItemNameToBeDisplayed(item.name);
    await cartItemRow.expectCartItemDetailsToBeDisplayed(`$${item.price.toFixed(2)} x ${item.quantity}`);
    
    const expectedSubtotal = item.price * item.quantity;
    await cartItemRow.expectCartItemSubtotalToBeDisplayed(`$${expectedSubtotal.toFixed(2)}`);

    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${expectedSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed('-$0.00');
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${expectedSubtotal.toFixed(2)}`);

    // additional checks, verifying that the form is cleared after adding the item
    await shoppingCartPage.addItemComponent.expectItemNameInputToBeCorrectlyDisplayed('');
    await shoppingCartPage.addItemComponent.expectItemPriceInputToBeCorrectlyDisplayed('');
    await shoppingCartPage.addItemComponent.expectItemQuantityInputToBeCorrectlyDisplayed('1');
    await shoppingCartPage.addItemComponent.expectAddToCartButtonToBeEnabled();
  });

  test('Should add multiple items (3) to cart', async ({ shoppingCartPage }) => {
    const itemsToAdd = validTestItems.slice(0, 3);
    for (const item of itemsToAdd) {
      await shoppingCartPage.addItemComponent.addItem(item.name, item.price, item.quantity);
      await shoppingCartPage.waitForCartUpdate();
    }

    await shoppingCartPage.cartItemsComponent.expectCartItemsCountToBeCorrect(itemsToAdd.length);
    
    // Validate each item
    let expectedTotalSubtotal = 0;
    for (let i = 0; i < itemsToAdd.length; i++) {
      const item = itemsToAdd[i];
      const cartItemRow = shoppingCartPage.cartItemsComponent.getCartItemRowByIndex(i + 1);
      await cartItemRow.expectCartItemRowToBeDisplayed();
      await cartItemRow.expectCartItemNameToBeDisplayed(item.name);
      await cartItemRow.expectCartItemDetailsToBeDisplayed(`$${item.price.toFixed(2)} x ${item.quantity}`);
      
      const expectedSubtotal = item.price * item.quantity;
      expectedTotalSubtotal += expectedSubtotal;
      await cartItemRow.expectCartItemSubtotalToBeDisplayed(`$${expectedSubtotal.toFixed(2)}`);
    }

    // Validate order summary
    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${expectedTotalSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed('-$0.00');
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${expectedTotalSubtotal.toFixed(2)}`);

    // Validate form is cleared after adding items
    await shoppingCartPage.addItemComponent.expectItemNameInputToBeCorrectlyDisplayed('');
    await shoppingCartPage.addItemComponent.expectItemPriceInputToBeCorrectlyDisplayed('');
    await shoppingCartPage.addItemComponent.expectItemQuantityInputToBeCorrectlyDisplayed('1');
    await shoppingCartPage.addItemComponent.expectAddToCartButtonToBeEnabled();
  });
});
