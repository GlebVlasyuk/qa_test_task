import { test } from '../../fixtures/fixtures';
import { validTestItems } from '../../utils/test-data';

const DISCOUNT_CODE_APPLIED_MESSAGE = 'Discount code applied!';

test.describe('Apply Discount Code via UI, @ui', () => {

  test('Should apply valid discount code SAVE10', async ({ shoppingCartPage }) => {
    await shoppingCartPage.addItemComponent.addItem(validTestItems[0].name, validTestItems[0].price, validTestItems[0].quantity);
    await shoppingCartPage.waitForCartUpdate();

    const expectedSubtotal = validTestItems[0].price * validTestItems[0].quantity;
    const expectedDiscount = expectedSubtotal * 0.1; // 10% discount for SAVE10

    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('');
    await shoppingCartPage.discountCodeComponent.expectApplyDiscountButtonToBeEnabled();
    await shoppingCartPage.discountCodeComponent.applyDiscountCodeAndExpectAlert('SAVE10', DISCOUNT_CODE_APPLIED_MESSAGE);
    await shoppingCartPage.waitForCartUpdate();

    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('SAVE10');

    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${expectedSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed(`-$${expectedDiscount.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${(expectedSubtotal - expectedDiscount).toFixed(2)}`);
  });

  test('Should not apply discount twice when applying same discount code twice', async ({ shoppingCartPage }) => {
    await shoppingCartPage.addItemComponent.addItem(validTestItems[0].name, validTestItems[0].price, validTestItems[0].quantity);
    await shoppingCartPage.waitForCartUpdate();

    const expectedSubtotal = validTestItems[0].price * validTestItems[0].quantity;
    const expectedDiscount = expectedSubtotal * 0.1; // 10% discount for SAVE10

    // Apply discount code first time
    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('');
    await shoppingCartPage.discountCodeComponent.expectApplyDiscountButtonToBeEnabled();
    await shoppingCartPage.discountCodeComponent.applyDiscountCodeAndExpectAlert('SAVE10', DISCOUNT_CODE_APPLIED_MESSAGE);
    await shoppingCartPage.waitForCartUpdate();

    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('SAVE10');
    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${expectedSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed(`-$${expectedDiscount.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${(expectedSubtotal - expectedDiscount).toFixed(2)}`);

    // Try to apply the same discount code again
    await shoppingCartPage.discountCodeComponent.applyDiscountCodeAndExpectAlert('SAVE10', DISCOUNT_CODE_APPLIED_MESSAGE);
    await shoppingCartPage.waitForCartUpdate();

    // Verify discount was not applied twice - discount amount should remain the same
    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${expectedSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed(`-$${expectedDiscount.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${(expectedSubtotal - expectedDiscount).toFixed(2)}`);
  });

  test('Should replace discount code when applying different discount code', async ({ shoppingCartPage }) => {
    await shoppingCartPage.addItemComponent.addItem(validTestItems[0].name, validTestItems[0].price, validTestItems[0].quantity);
    await shoppingCartPage.waitForCartUpdate();

    const expectedSubtotal = validTestItems[0].price * validTestItems[0].quantity;
    const expectedDiscountSAVE10 = expectedSubtotal * 0.1; // 10% discount for SAVE10
    const expectedDiscountSAVE20 = expectedSubtotal * 0.2; // 20% discount for SAVE20

    // Apply SAVE10 discount code first
    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('');
    await shoppingCartPage.discountCodeComponent.expectApplyDiscountButtonToBeEnabled();
    await shoppingCartPage.discountCodeComponent.applyDiscountCodeAndExpectAlert('SAVE10', DISCOUNT_CODE_APPLIED_MESSAGE);
    await shoppingCartPage.waitForCartUpdate();

    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('SAVE10');
    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${expectedSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed(`-$${expectedDiscountSAVE10.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${(expectedSubtotal - expectedDiscountSAVE10).toFixed(2)}`);

    // Apply SAVE20 discount code to replace SAVE10
    await shoppingCartPage.discountCodeComponent.applyDiscountCodeAndExpectAlert('SAVE20', DISCOUNT_CODE_APPLIED_MESSAGE);
    await shoppingCartPage.waitForCartUpdate();

    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('SAVE20');
    
    // Verify discount was replaced - discount amount should change to SAVE20 (20%)
    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${expectedSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed(`-$${expectedDiscountSAVE20.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${(expectedSubtotal - expectedDiscountSAVE20).toFixed(2)}`);
  });

  test('Should apply valid discount code SAVE20', async ({ shoppingCartPage }) => {
    await shoppingCartPage.addItemComponent.addItem(validTestItems[0].name, validTestItems[0].price, validTestItems[0].quantity);
    await shoppingCartPage.waitForCartUpdate();

    const expectedSubtotal = validTestItems[0].price * validTestItems[0].quantity;
    const expectedDiscount = expectedSubtotal * 0.2; // 20% discount for SAVE20

    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('');
    await shoppingCartPage.discountCodeComponent.expectApplyDiscountButtonToBeEnabled();
    await shoppingCartPage.discountCodeComponent.applyDiscountCodeAndExpectAlert('SAVE20', DISCOUNT_CODE_APPLIED_MESSAGE);
    await shoppingCartPage.waitForCartUpdate();

    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('SAVE20');

    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${expectedSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed(`-$${expectedDiscount.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${(expectedSubtotal - expectedDiscount).toFixed(2)}`);
  });

  test('Should apply valid discount code HALF', async ({ shoppingCartPage }) => {
    await shoppingCartPage.addItemComponent.addItem(validTestItems[0].name, validTestItems[0].price, validTestItems[0].quantity);
    await shoppingCartPage.waitForCartUpdate();

    const expectedSubtotal = validTestItems[0].price * validTestItems[0].quantity;
    const expectedDiscount = expectedSubtotal * 0.5; // 50% discount for HALF

    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('');
    await shoppingCartPage.discountCodeComponent.expectApplyDiscountButtonToBeEnabled();
    await shoppingCartPage.discountCodeComponent.applyDiscountCodeAndExpectAlert('HALF', DISCOUNT_CODE_APPLIED_MESSAGE);
    await shoppingCartPage.waitForCartUpdate();

    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('HALF');

    await shoppingCartPage.orderSummaryComponent.expectSubtotalToBeCorrectlyDisplayed(`$${expectedSubtotal.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectDiscountToBeCorrectlyDisplayed(`-$${expectedDiscount.toFixed(2)}`);
    await shoppingCartPage.orderSummaryComponent.expectTotalToBeCorrectlyDisplayed(`$${(expectedSubtotal - expectedDiscount).toFixed(2)}`);
  });

  test('Should display discount hint', async ({ shoppingCartPage }) => {
      await shoppingCartPage.discountCodeComponent.expectDiscountCodeHintToBeCorrectlyDisplayed('Available codes: SAVE10, SAVE20, HALF');
  });

  test('Should display error message when applying invalid discount code', async ({ shoppingCartPage }) => {
    await shoppingCartPage.addItemComponent.addItem(validTestItems[0].name, validTestItems[0].price, validTestItems[0].quantity);
    await shoppingCartPage.waitForCartUpdate();

    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('');
    await shoppingCartPage.discountCodeComponent.expectApplyDiscountButtonToBeEnabled();
    await shoppingCartPage.discountCodeComponent.applyDiscountCodeAndExpectAlert('INVALID', 'Error: Invalid discount code');
    await shoppingCartPage.waitForCartUpdate();

    await shoppingCartPage.discountCodeComponent.expectDiscountCodeInputToBeCorrectlyDisplayed('INVALID');
    await shoppingCartPage.discountCodeComponent.expectApplyDiscountButtonToBeEnabled();
  });
});
