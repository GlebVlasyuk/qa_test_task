import { test } from '../../fixtures/fixtures';
import { validTestItems } from '../../utils/test-data';

const DISCOUNT_CODE_APPLIED_MESSAGE = 'Discount code applied!';

test.describe('End-to-End Scenarios, @ui', () => {

  test('Should complete full shopping flow', async ({ shoppingCartPage }) => {
    await shoppingCartPage.addItemComponent.addItem(validTestItems[1].name, validTestItems[1].price, validTestItems[1].quantity);
    await shoppingCartPage.addItemComponent.addItem(validTestItems[2].name, validTestItems[2].price, validTestItems[2].quantity);
    await shoppingCartPage.waitForCartUpdate();

    const initialSubtotal = validTestItems[1].price * validTestItems[1].quantity + validTestItems[2].price * validTestItems[2].quantity;
    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${initialSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed('-$0.00');
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${initialSubtotal.toFixed(2)}`);

    // Apply discount
    // NOTE: This test expects discount on entire cart subtotal (correct behavior).
    // Backend bug (BUG-001): discount is only applied to first item, so this test will fail until bug is fixed.
    await shoppingCartPage.discountCodeComponent.applyDiscountCodeAndExpectAlert('SAVE20', DISCOUNT_CODE_APPLIED_MESSAGE);
    await shoppingCartPage.waitForCartUpdate();

    const expectedDiscount = initialSubtotal * 0.2; // 20% discount on entire cart
    const expectedTotal = initialSubtotal - expectedDiscount;
    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${initialSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed(`-$${expectedDiscount.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${expectedTotal.toFixed(2)}`);

    const cartItemRow = shoppingCartPage.cartItemsComponent.getCartItemRowByIndex(1);
    await cartItemRow.clickCartItemRemoveButton();
    await shoppingCartPage.waitForCartUpdate();

    const remainingSubtotal = validTestItems[2].price * validTestItems[2].quantity;
    const remainingDiscount = remainingSubtotal * 0.2; // 20% discount still applied
    const remainingTotal = remainingSubtotal - remainingDiscount;
    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${remainingSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed(`-$${remainingDiscount.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${remainingTotal.toFixed(2)}`);
  });
});
