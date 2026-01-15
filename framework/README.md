# Shopping Cart Test Framework

A comprehensive TypeScript + Playwright test framework for the Shopping Cart API application.

## Structure

```
framework/
├── api/                    # API modules for testing endpoints
│   └── cart-api.ts        # Cart API client
├── pages/                  # Page Object Model
│   └── shopping-cart.page.ts  # Shopping cart page object
├── tests/                  # Test suites
│   ├── api/               # API tests
│   │   └── cart-api.spec.ts
│   └── ui/                # UI tests
│       └── shopping-cart-ui.spec.ts
├── types/                  # TypeScript type definitions
│   └── cart.types.ts
├── utils/                  # Utilities and helpers
│   ├── constants.ts       # Test constants
│   ├── test-data.ts       # Test data
│   └── helpers.ts         # Helper functions
├── package.json
├── tsconfig.json
├── playwright.config.ts
└── README.md
```

## Setup

1. Install dependencies:
```bash
cd framework
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Make sure the application is running on `http://localhost:3000`:
```bash
# From project root
docker-compose up --build
```

## Running Tests

Run only API tests:
```bash
npm run test:api
```

Run only UI tests:
```bash
npm run test:ui
```

View test report:
```bash
npm run test:report
```

## Test Coverage

### API Tests
- Health check endpoint
- Cart creation and retrieval
- Adding items (valid and invalid data)
- Removing items
- Applying discount codes (valid and invalid)
- Cart summary calculations
- Complex scenarios

### UI Tests
- Page load and initial state
- Form validation
- Adding items via UI
- Removing items via UI
- Applying discount codes via UI
- Order summary display
- End-to-end scenarios

## Framework Features

- **TypeScript**: Full type safety
- **Page Object Model**: Organized UI test code
- **API Modules**: Reusable API client
- **Test Data Management**: Centralized test data
- **Helper Utilities**: Reusable calculation and validation functions
- **Comprehensive Coverage**: Positive, negative, and edge cases

## Test Coverage and Results Summary

### Test Statistics
- **Total Test Files**: 12
  - API Tests: 6 files
  - UI Tests: 6 files
- **Total Test Cases**: 53 tests
  - API Tests: 35 test cases
  - UI Tests: 18 test cases
- **Test Framework**: Playwright + TypeScript
- **Execution Mode**: Fully parallel execution supported

### API Test Coverage

All 6 API endpoints are covered with comprehensive tests:

1. **`POST /cart`** - Create Cart (`create-cart-api.spec.ts`)
   - ✅ Cart creation with valid UUID format
   - ✅ Unique cart IDs generated
   - ✅ 2 test cases

2. **`GET /cart/:cartId`** - Get Cart (`get-cart.spec-api.ts`)
   - ✅ Empty cart retrieval
   - ✅ 404 error handling for non-existent carts
   - ✅ Subtotal calculations for multiple items
   - ✅ Total calculations without discount
   - ✅ 4 test cases

3. **`POST /cart/:cartId/items`** - Add Item (`add-item-api.spec.ts`)
   - ✅ Adding valid items
   - ✅ Adding multiple items
   - ✅ Validation: negative price, zero price, zero quantity, negative quantity
   - ✅ Validation: missing name, missing price, missing quantity
   - ✅ Validation: name with only spaces (exposes BUG-003)
   - ✅ 404 error for non-existent cart
   - ✅ 11 test cases

4. **`DELETE /cart/:cartId/items/:itemId`** - Remove Item (`remove-item-api.spec.ts`)
   - ✅ Removing items from cart
   - ✅ Removing last item (empty cart verification)
   - ✅ Removing non-existent item (404)
   - ✅ Removing from non-existent cart (404)
   - ✅ Attempting to remove same item twice (404)
   - ✅ Discount recalculation after item removal (exposes BUG-001)
   - ✅ 6 test cases

5. **`POST /cart/:cartId/discount`** - Apply Discount (`apply-discount-api.spec.ts`)
   - ✅ Applying valid discount codes (SAVE10, SAVE20, HALF) with single item
   - ✅ Discount calculation verification
   - ✅ Applying discount with multiple items (exposes BUG-001) - SAVE10, SAVE20, HALF
   - ✅ Recalculating discount when adding item after discount is applied (exposes BUG-001)
   - ✅ Empty cart validation (exposes BUG-002)
   - ✅ Invalid discount code handling
   - ✅ 404 error for non-existent cart
   - ✅ Cart summary structure validation
   - ✅ 11 test cases

6. **`GET /health`** - Health Check (`health-check-api.spec.ts`)
   - ✅ Health status verification
   - ✅ 1 test case

### UI Test Coverage

All UI functionality is covered with comprehensive end-to-end tests using Page Object Model pattern:

1. **Page Load and Initial State** (`page-load-initial-state.spec.ts`)
   - ✅ Page loads successfully with correct heading
   - ✅ Form inputs display with correct initial values (empty name/price, quantity = 1)
   - ✅ Empty cart message displays correctly
   - ✅ Order summary shows zero values initially
   - ✅ 3 test cases

2. **Form Validation** (`form-validation.spec.ts`)
   - ✅ Required field validation on item name input
   - ✅ Required field and minimum value (0) validation on item price input
   - ✅ Required field and minimum value (1) validation on item quantity input
   - ✅ HTML5 validation attributes verified
   - ✅ 3 test cases

3. **Add Item via UI** (`add-item-ui.spec.ts`)
   - ✅ Adding single item to cart via form
   - ✅ Cart items display correctly (name, price x quantity, subtotal)
   - ✅ Order summary updates correctly (subtotal, discount, total)
   - ✅ Form clears after adding item (name/price empty, quantity resets to 1)
   - ✅ Adding multiple items (3 items) to cart
   - ✅ Validation of all items and order summary for multiple items
   - ✅ Form state validation after multiple additions
   - ✅ 2 test cases

4. **Remove Item via UI** (`remove-item-ui.spec.ts`)
   - ✅ Removing single item from cart
   - ✅ Verification of cart item display before removal
   - ✅ Empty cart state after removing last item
   - ✅ Order summary resets to zero after removal
   - ✅ Removing item when multiple items exist
   - ✅ Correct item removal (verifies remaining item)
   - ✅ Order summary recalculates correctly after removal
   - ✅ 2 test cases

5. **Apply Discount via UI** (`apply-discount-ui.spec.ts`)
   - ✅ Applying valid discount code SAVE10 (10% discount)
   - ✅ Applying valid discount code SAVE20 (20% discount)
   - ✅ Applying valid discount code HALF (50% discount)
   - ✅ Alert dialog message verification ("Discount code applied!")
   - ✅ Discount code input field updates after application
   - ✅ Order summary displays correct discount and total calculations
   - ✅ Preventing duplicate discount application (same code twice)
   - ✅ Replacing discount code (SAVE10 → SAVE20)
   - ✅ Discount hint display (available codes)
   - ✅ Invalid discount code error handling with alert dialog
   - ✅ 7 test cases

6. **End-to-End Scenarios** (`e2e-scenarios.spec.ts`)
   - ✅ Complete shopping flow: add items → apply discount → remove item
   - ✅ Order summary updates at each step
   - ✅ Discount calculation verification (exposes BUG-001 - discount only on first item)
   - ✅ Cart state management through full workflow
   - ✅ 1 test case (comprehensive end-to-end flow)

### Bugs Found

During testing, **4 bugs** were identified and documented:

1. **BUG-001 (Critical - P1)**: Discount only applies to first item instead of entire cart subtotal
   - Affects all discount scenarios
   - Multiple tests expose this issue
   - Potential revenue impact

2. **BUG-002 (High - P2)**: Discount codes can be applied to empty carts
   - Doesn't align with industry standards
   - UX confusion

3. **BUG-003 (Medium - P3)**: Item names with only spaces are accepted
   - Data quality issue
   - Validation gap

4. **BUG-004 (Low - P3)**: Mathematical inconsistency in rounding logic
   - Minor precision discrepancy (usually $0.01)
   - Code quality issue

All bugs are documented in `/bugs` directory with detailed reports following Jira format.

### Test Results

- **Test Execution**: All tests run successfully in parallel mode
- **Test Isolation**: Each test uses isolated fixtures to prevent interference
- **Bug Exposure**: Tests are written to expect correct behavior and fail when bugs are present
- **Coverage**: 100% of API endpoints covered, all major UI flows covered
- **Best Practices**: Tests follow QA best practices - test what should happen, not current behavior

#### API Test Results
- **Total Tests**: 35 test cases
- **Passing**: 32 test cases
- **Failing (Intentional)**: 3 test cases (exposing bugs)

#### UI Test Results
- **Total Tests**: 18 test cases
- **Passing**: 17 test cases
- **Failing (Intentional)**: 1 test case (exposing BUG-001 in e2e scenario)

### Known Test Failures

The following tests intentionally fail to expose bugs (following QA best practices):

**API Tests:**
- Tests expecting discount on entire cart subtotal (BUG-001) - 2 test cases
- Test expecting empty cart rejection for discounts (BUG-002) - 1 test case

**UI Tests:**
- End-to-end scenario expecting discount on entire cart subtotal (BUG-001) - 1 test case

**Note:** Tests for whitespace-only name rejection (BUG-003) currently pass in UI as the validation is handled client-side, but the backend API accepts such values, which is tested in API tests.

These failures will be resolved once the corresponding bugs are fixed.

### Potential Issues

#### Security Concern: Item IDs Exposed in Inline Event Handlers

**Description:**
Item IDs (UUIDs) are exposed in the HTML markup via inline `onclick` handlers on the "Remove" buttons:
```html
<button class="btn btn-danger" onclick="removeItem('5080a74f-cd2a-429a-834f-33166f4db0e2')">Remove</button>
```

**Concerns:**
1. **ID Exposure**: Item IDs are visible in the DOM and can be extracted via browser DevTools or JavaScript
2. **Security Best Practices**: Using inline event handlers (`onclick`) is generally discouraged in modern web development
3. **Potential Risk**: If the application doesn't properly validate cart ownership on the server-side, exposed IDs could potentially be misused

**Note:** Since item IDs are UUIDs (non-sequential and hard to guess), the actual security risk depends on whether proper server-side authorization exists. This is more of a security best practice concern rather than a critical vulnerability.

#### Resource Management Concern: Lack of Cart Deletion Endpoint

**Description:**
The application does not provide an endpoint to delete/remove carts (e.g., `DELETE /cart/:cartId`). This means that once a cart is created, there is no way to clean it up programmatically.

**Concerns:**
1. **Test Resource Accumulation**: Each API test creates a new cart, and with parallel test execution, this results in hundreds or thousands of carts being created without any cleanup mechanism
2. **Database Growth**: Over time, the database will accumulate orphaned test carts that never get removed, leading to unnecessary storage usage
3. **Test Isolation**: While tests are isolated (each test creates its own cart), the inability to clean up after tests means the system state accumulates test data
4. **Performance Impact**: Large numbers of accumulated carts could potentially impact database query performance and storage costs in production-like environments

**Recommendations:**
- **Add Cart Deletion Endpoint**: Implement `DELETE /cart/:cartId` endpoint to allow programmatic cart cleanup
- **Test Cleanup**: Add cleanup logic in test fixtures or teardown hooks to remove carts after test execution

**Impact:**
This is primarily a development/maintenance concern rather than a functional bug. Tests will continue to work correctly, but the system will accumulate test data over time.
