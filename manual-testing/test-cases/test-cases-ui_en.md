# Pizzaed UI Test Cases

**Objective:** detailed verification of the catalog, search, cart, discount and delivery calculation, and checkout through the interface.

**Scope:** P0 and P1 items from [`checklist-pizzaed_en.md`](../checklists/checklist-pizzaed_en.md). API cases are in [`test-cases-api_en.md`](test-cases-api_en.md). P2 items are not in this set.

**Test environment:** Pizzaed training environment, latest Chrome, resolution 1920×1080. Each test run uses an isolated training session.

**Last updated:** 2026-09-10

**Data conventions:**

- *Product A* — any available product from the pizza category.
- *Product B* — any available product from the sauces category.
- *Cheesecake* («Чизкейк») — the reference out-of-stock product.
- Exact prices on the environment are not fixed, so the executor selects the cart contents for boundary amounts and records them in the run result.

---

## Catalog and product card

### TC-CAT-01. The catalog shows products from all four categories

**Covers:** CL-CAT-1 | **Priority:** P0

**Preconditions:** the store home page is open, the search field is empty, and no category filter is selected.

**Steps:**

1. Confirm that the catalog contains products in the pizza category.
2. Confirm that it contains products in the drinks category.
3. Confirm that it contains products in the desserts category.
4. Confirm that it contains products in the sauces category.

**Expected result:** the catalog shows products from all four categories, and the interface shows no loading errors.

**Rationale:** the catalog is the only entry point to the user's main path. If any category is missing, part of the assortment cannot be ordered.

### TC-CAT-02. The product card contains the full set of fields

**Covers:** CL-CAT-2 | **Priority:** P1

**Preconditions:** the catalog is open.

**Steps:**

1. Find Product A in the catalog.
2. Check that the name is displayed.
3. Check that the category is displayed.
4. Check that the description is displayed.
5. Check that the price is displayed.
6. Check that the rating is displayed.
7. Check that the badges are displayed.
8. Check that the stock status is displayed.

**Expected result:** all seven fields are present and filled with non-empty values.

**Rationale:** the requirement lists the card contents explicitly. An incomplete card withholds the data the user needs to choose, and missing badges also break badge search.

### TC-CAT-03. An unavailable product is shown in the catalog with an out-of-stock status

**Covers:** CL-CAT-3 | **Priority:** P1

**Preconditions:** the catalog is open and the search field is empty.

**Steps:**

1. Find the product «Чизкейк» in the catalog.
2. Check the stock status on its card.

**Expected result:** «Чизкейк» is present in the catalog and marked as out of stock.

**Rationale:** the requirement forbids hiding an unavailable product and requires its status to be shown. Hiding the product is as much a defect as omitting the marker.

### TC-CAT-04. An unavailable product cannot be added to the cart from the catalog

**Covers:** CL-CAT-4 | **Priority:** P0

**Preconditions:** the catalog is open and the cart is empty.

**Steps:**

1. Find the product «Чизкейк» in the catalog.
2. Check the state of the add-to-cart button.
3. Activate the add-to-cart button.
4. Open the cart.

**Expected result:** the add button cannot be activated, «Чизкейк» is not added to the cart, and the cart stays empty.

**Rationale:** a direct acceptance criterion. The UI barrier stops an order that cannot be fulfilled before the client calls the server.

---

## Search and filtering

### TC-SRCH-01. Search by product name

**Covers:** CL-SRCH-1 | **Priority:** P0

**Preconditions:** the catalog is open and no category filter is selected.

**Steps:**

1. Record the name of Product A.
2. Enter a word from Product A's name in the search field.
3. Check the result set.

**Expected result:** the results include Product A.

**Rationale:** the name is the first of the three match sources required, and the one users expect most.

### TC-SRCH-02. Search by a word from the description

**Covers:** CL-SRCH-2 | **Priority:** P0

**Preconditions:** the catalog is open, and a product is selected whose target word appears in the description and does not appear in the name.

**Steps:**

1. Enter in the search field a word that occurs only in the selected product's description.
2. Check the result set.

**Expected result:** the results include the selected product.

**Rationale:** description search is implemented least often, even though the requirement treats it as equal to the name. Choosing a word that is absent from the name rules out a false positive.

### TC-SRCH-03. Search by badge

**Covers:** CL-SRCH-3 | **Priority:** P0

**Preconditions:** the catalog is open, and a badge of an existing product is recorded whose text is absent from that product's name and description.

**Steps:**

1. Enter the badge text in the search field.
2. Check the result set.

**Expected result:** the results include products that carry this badge.

**Rationale:** the third match source required by the specification. It is checked separately because badges often never enter the search index.

### TC-SRCH-04. A search for «соус» finds products from different categories

**Covers:** CL-SRCH-4 | **Priority:** P0

**Preconditions:** the catalog is open and no category filter is selected.

**Steps:**

1. Enter the word «соус» in the search field.
2. Check the categories of the products in the results.

**Expected result:** the results contain products from more than one category when they match by name, description, or badges.

**Rationale:** a verbatim acceptance criterion. The case also confirms that search is not limited to the category whose name matches the query.

### TC-SRCH-05. An active search lifts the selected-category restriction

**Covers:** CL-SRCH-5, Q-12 | **Priority:** P0

**Preconditions:** the catalog is open and the search field is empty.

**Steps:**

1. Select the drinks category filter.
2. Enter the word «соус» in the search field.
3. Check the categories of the products in the results.
4. Record the state of the category control.

**Expected result:** the results contain matching products from all categories, not only drinks. The control state is recorded as the actual behavior and compared with the answer to Q-12.

**Rationale:** a hidden dependency between two controls. If the category restriction stays in effect, the user does not find existing products and treats them as missing.

### TC-SRCH-06. Category filtering with an empty search field

**Covers:** CL-SRCH-6 | **Priority:** P0

**Preconditions:** the catalog is open and the search field is empty.

**Steps:**

1. Select the sauces category filter.
2. Check the category of every product in the results.

**Expected result:** the results contain only products in the sauces category.

**Rationale:** the primary filtering mode, which the requirement allows only when the search field is empty.

### TC-SRCH-07. Filtering is restored after the search field is cleared

**Covers:** CL-SRCH-7 | **Priority:** P1

**Preconditions:** the catalog is open.

**Steps:**

1. Enter the word «соус» in the search field.
2. Clear the search field completely.
3. Select the desserts category filter.
4. Check the categories of the products in the results.

**Expected result:** after the search is cleared, the category filter applies again, and the results contain only desserts.

**Rationale:** the reverse state transition. The filter control often stays disabled after the search is removed, and the user loses a way to navigate.

### TC-SRCH-08. Search is case-insensitive and finds a partial match

**Covers:** CL-SRCH-8, CL-SRCH-9, Q-13 | **Priority:** P1

**Preconditions:** the catalog is open and the name of Product A is recorded.

**Steps:**

1. Enter Product A's name in uppercase and check the results.
2. Enter Product A's name in lowercase and check the results.
3. Enter the first three characters of Product A's name and check the results.

**Expected result:** in all three cases the results include Product A.

**Rationale:** the requirements do not describe matching rules, and users type queries freely. Case-sensitive or exact-only search is perceived as the product being absent.

### TC-SRCH-09. A search with no matches shows an empty result and a message

**Covers:** CL-SRCH-10, UX-1 | **Priority:** P1

**Preconditions:** the catalog is open.

**Steps:**

1. Enter a string that is known to be absent from the data, for example `zzzqwerty`.
2. Check the results area.

**Expected result:** no products are shown, the interface displays a clear message that there are no results, and there are no errors or broken layout.

**Rationale:** a negative scenario with two risks: a technical error on an empty result set, and a blank screen being read as an application failure.

---

## Cart: contents and quantity

### TC-CART-01. Add an available product to the cart from the catalog

**Covers:** CL-CART-1 | **Priority:** P0

**Preconditions:** the catalog is open and the cart is empty.

**Steps:**

1. Activate the add-to-cart button for Product A.
2. Open the cart.

**Expected result:** the cart contains one line item, Product A, with quantity 1.

**Rationale:** a required step of the main path. Without it, every later cart and order check is unreachable.

### TC-CART-02. Increase and decrease quantity inside the range

**Covers:** CL-CART-2 | **Priority:** P0

**Preconditions:** the cart contains one Product A with quantity 1.

**Steps:**

1. Activate the increase-quantity button and check the value.
2. Keep increasing until the quantity is 5.
3. Activate the decrease-quantity button and check the value.
4. Check the items subtotal after each change.

**Expected result:** the quantity takes the values 2, 5, and 4 in sequence, and the items subtotal is recalculated in proportion to the quantity.

**Rationale:** the basic quantity control, which every money calculation in the cart depends on.

### TC-CART-03. The upper quantity bound is 20

**Covers:** CL-CART-3 | **Priority:** P0

**Preconditions:** the cart contains one Product A.

**Steps:**

1. Increase the quantity of Product A to 20.
2. Activate the increase-quantity button once more.
3. Check the quantity and the items subtotal.

**Expected result:** the quantity stays at 20, the value 21 is not reached, and the items subtotal does not change after the extra activation.

**Rationale:** the upper bound of the range stated in the requirement. Exceeding the limit creates an order the store is not obliged to fulfill.

### TC-CART-04. Decreasing the quantity to 0 removes the item from the cart

**Covers:** CL-CART-4 | **Priority:** P0

**Preconditions:** the cart contains one Product A with quantity 1.

**Steps:**

1. Activate the decrease-quantity button.
2. Check the cart contents.

**Expected result:** the line item is removed, the cart is empty, and the calculated values are zero.

**Rationale:** the requirement defines removal at zero as a separate rule. The alternative — a line item with quantity 0 — distorts the calculations and the cart view.

### TC-CART-05. The cart shows every calculated value and the correct items subtotal

**Covers:** CL-CART-5, CL-CART-6 | **Priority:** P1

**Preconditions:** the cart is empty, and the prices of Product A and Product B are recorded.

**Steps:**

1. Add Product A with quantity 2.
2. Add Product B with quantity 3.
3. Confirm that these fields are present: items subtotal, discount, delivery fee, order total.
4. Compute the expected items subtotal as price A × 2 + price B × 3 and compare it with the displayed value.

**Expected result:** all four values are displayed, and the items subtotal matches the calculated value.

**Rationale:** the items subtotal is the base for the discount and for the free-delivery threshold. An error here distorts both later calculations.

### TC-CART-06. Different products form separate line items

**Covers:** CL-CART-7 | **Priority:** P1

**Preconditions:** the cart is empty.

**Steps:**

1. Add Product A to the cart.
2. Add Product B to the cart.
3. Check the cart contents.

**Expected result:** the cart contains two separate line items, each with quantity 1, and each quantity can be changed independently.

**Rationale:** merging different products into one line item, or overwriting the previous one, is a critical defect in the order contents.

### TC-CART-07. Adding the product again increases the quantity of the existing line item

**Covers:** CL-CART-8 | **Priority:** P1

**Preconditions:** the cart contains one Product A with quantity 1.

**Steps:**

1. Return to the catalog.
2. Activate the add-to-cart button for Product A again.
3. Check the cart contents.

**Expected result:** the cart contains one line item, Product A, with quantity 2. No duplicate line item is created.

**Rationale:** duplicate line items break both the cart display and the logic of the 20-unit limit per product.

### TC-CART-08. An empty cart is displayed correctly

**Covers:** CL-CART-9 | **Priority:** P1

**Preconditions:** the cart is empty.

**Steps:**

1. Open the cart.
2. Check the contents and the calculated values.

**Expected result:** an empty-cart indicator is shown; the items subtotal, discount, and order total are zero; no stray values are present.

**Rationale:** the initial state is checked least often, and it is where calculation-initialization errors show up, such as a delivery fee on an empty order.

---

## Promo code and discount calculation

### TC-PROMO-01. Promo code QA60 gives a 10% discount on the items subtotal

**Covers:** CL-PROMO-1 | **Priority:** P0

**Preconditions:** the cart contains products whose subtotal is a multiple of 10, for example 1000 ₽; no promo code is applied.

**Steps:**

1. Record the items subtotal.
2. Enter promo code `QA60` and apply it.
3. Check the discount value.

**Expected result:** the discount equals 10% of the items subtotal; for a subtotal of 1000 ₽, the discount is 100 ₽.

**Rationale:** the product's key business rule and a direct acceptance criterion. The amount is a multiple of 10 so the percentage check is separate from the rounding check.

### TC-PROMO-02. The discount is rounded down to whole rubles

**Covers:** CL-PROMO-2, EDGE-1 | **Priority:** P0

**Preconditions:** the cart is empty.

**Steps:**

1. Build a cart whose items subtotal is not a multiple of 10, for example 1234 ₽.
2. Apply promo code `QA60`.
3. Check the discount value.

**Expected result:** the discount is 123 ₽ — 123.4 rounded down. The values 123.4 and 124 are not acceptable.

**Rationale:** rounding down is a separate requirement. Standard half-up rounding, or a fractional display, is a money-calculation defect that does not show up on round amounts.

### TC-PROMO-03. The order total includes the discount and the delivery fee

**Covers:** CL-PROMO-3 | **Priority:** P0

**Preconditions:** the cart contains products with a subtotal below 1500 ₽.

**Steps:**

1. Record the items subtotal, the discount, and the delivery fee.
2. Apply promo code `QA60`.
3. Compute the expected total as items subtotal − discount + delivery fee.
4. Compare it with the displayed order total.

**Expected result:** the order total equals the calculated value.

**Rationale:** the total is the only number the user treats as the order price. An error in the order of operations shows up only on a cart that has both an active discount and a paid delivery.

### TC-PROMO-04. Applying QA60 again does not increase the discount

**Covers:** CL-PROMO-4 | **Priority:** P0

**Preconditions:** the cart contains products, promo code `QA60` is applied, and the discount is recorded.

**Steps:**

1. Enter promo code `QA60` again and apply it.
2. Check the discount and the order total.

**Expected result:** the discount and the order total are unchanged from the first application.

**Rationale:** the single-application rule directly protects revenue. A stacking discount lets the user reduce the order amount arbitrarily.

### TC-PROMO-05. The discount is recalculated when the cart contents change

**Covers:** CL-PROMO-5 | **Priority:** P0

**Preconditions:** the cart contains Product A, promo code `QA60` is applied, and the discount is recorded.

**Steps:**

1. Increase the quantity of Product A by 1 and check the discount.
2. Add Product B and check the discount.
3. Decrease the quantity of Product A by 1 and check the discount.

**Expected result:** after each change, the discount equals 10% of the new items subtotal, rounded down.

**Rationale:** the requirement forbids freezing the discount at the moment the code is entered. A discount that does not shrink when the cart shrinks produces a negative margin; a discount that does not grow when the cart grows misleads the user.

### TC-PROMO-06. The promo code ignores spaces and letter case

**Covers:** CL-PROMO-6, CL-PROMO-7 | **Priority:** P1

**Preconditions:** the cart contains products with a recorded subtotal, and no promo code is applied. Before each variant, the cart is returned to the original state with no discount.

**Steps:** apply the promo code from the table and check the discount.

| Variant | Entered value | Expected discount |
|---|---|---|
| 1 | `  QA60  ` | 10% of the items subtotal |
| 2 | `qa60` | 10% of the items subtotal |
| 3 | `  qa60 ` (with leading and trailing spaces) | 10% of the items subtotal |

**Expected result:** in all three variants the discount is applied the same way as for `QA60`.

**Rationale:** the rules that ignore spaces and letter case are stated in the requirement. A space introduced while pasting the code is the most common way to enter it, and a rejection looks like a promotion that does not work.

### TC-PROMO-07. An invalid or empty promo code gives no discount

**Covers:** CL-PROMO-8, CL-PROMO-9, Q-05 | **Priority:** P1

**Preconditions:** the cart contains products and no promo code is applied.

**Steps:** apply the value from the table and check the discount and the order total.

| Variant | Entered value | Expected result |
|---|---|---|
| 1 | `QA61` | discount 0, total unchanged |
| 2 | `QA6` | discount 0, total unchanged |
| 3 | `QA60QA60` | discount 0, total unchanged |
| 4 | empty string | discount 0, no UI errors |

**Expected result:** the discount is not applied in any variant, the order total does not decrease, and the interface stays usable.

**Rationale:** the requirement accepts a single code. A partial match and a concatenated value check that the comparison is exact, not a substring match.

### TC-PROMO-08. The discount resets when the cart is emptied

**Covers:** CL-PROMO-10, Q-03 | **Priority:** P1

**Preconditions:** the cart contains Product A and promo code `QA60` is applied.

**Steps:**

1. Decrease the quantity of Product A to 0 so the line item is removed.
2. Check the cart's calculated values.
3. Add Product A to the cart again.
4. Check the discount.

**Expected result:** on an empty cart the discount is 0. After the cart is filled again, the discount matches the working assumption in Q-03; the actual behavior is recorded in the run result.

**Rationale:** passing through the empty state is the boundary of the discount lifecycle. A discount retained on an empty cart produces a negative total.

---

## Delivery fee

### TC-DLV-01. The free-delivery threshold boundary

**Covers:** CL-DLV-1, CL-DLV-2, CL-DLV-3 | **Priority:** P0

**Preconditions:** the cart is empty, no promo code is applied, and product prices are known so exact subtotals can be assembled.

**Steps:** for each variant in the table, build a cart with the stated items subtotal and check the delivery fee and the order total.

| Variant | Items subtotal | Expected delivery fee |
|---|---|---|
| 1 | 1499 ₽ | 199 ₽ |
| 2 | exactly 1500 ₽ | 0 ₽ |
| 3 | 1501 ₽ | 0 ₽ |

**Expected result:** the delivery fee matches the table, and the order total includes that value.

**Rationale:** a classic boundary check of the comparison sign. The requirement grants free delivery at an amount "equal to 1500 or more," so exactly 1500 ₽ is the main risk point.

### TC-DLV-02. The QA60 discount does not restore a paid delivery

**Covers:** CL-DLV-4, Q-01 | **Priority:** P0

**Preconditions:** the cart is empty.

**Steps:**

1. Build a cart with an items subtotal of 1600 ₽.
2. Confirm that delivery is free.
3. Apply promo code `QA60`.
4. Check the delivery fee and the order total.

**Expected result:** delivery stays free even though the amount due after the 160 ₽ discount is 1440 ₽. The total is 1440 ₽.

**Rationale:** the requirement ties the threshold to the items subtotal, not to the amount after the discount. This is the main calculation ambiguity (Q-01), and the actual result of the case is the basis for a bug report or for clarifying the requirement.

### TC-DLV-03. Delivery becomes paid again when the items subtotal decreases

**Covers:** CL-DLV-5 | **Priority:** P1

**Preconditions:** the cart contains products with a subtotal of at least 1500 ₽, and delivery is free.

**Steps:**

1. Decrease item quantities so the items subtotal falls below 1500 ₽.
2. Check the delivery fee and the order total.

**Expected result:** the delivery fee is 199 ₽ and is included in the order total.

**Rationale:** recalculation in the reverse direction. A one-way calculation that applies free delivery permanently causes a direct loss on delivery.

---

## Checkout and result popup

### TC-ORD-01. Successful checkout and the result popup

**Covers:** CL-ORD-1, CL-ORD-2, CL-ORD-3, main-path acceptance criterion | **Priority:** P0

**Preconditions:** the cart contains available products, and the order total is recorded.

**Steps:**

1. Go to checkout.
2. Enter a name.
3. Enter a phone number.
4. Enter a delivery address.
5. Confirm the order.
6. Check the popup contents.

**Expected result:** a popup is displayed with the order number, amount, and status `created`.

**Rationale:** the end-to-end main path and the primary acceptance criterion. The case checks the three required popup attributes in one run, because they are produced by a single server response.

### TC-ORD-02. The cart is cleared after a successful checkout

**Covers:** CL-ORD-4, acceptance criterion | **Priority:** P0

**Preconditions:** TC-ORD-01 has been executed, and the successful-order popup is displayed.

**Steps:**

1. Close the popup.
2. Open the cart.
3. Check the contents and the calculated values.

**Expected result:** the cart is empty and the calculated values are zero.

**Rationale:** a verbatim acceptance criterion. A cart that is kept leads to a repeat order of the same products, which for food delivery means a real financial loss.

### TC-ORD-03. Checking out an empty cart is rejected with an error popup

**Covers:** CL-ORD-5, acceptance criterion | **Priority:** P0

**Preconditions:** the cart is empty.

**Steps:**

1. Go to checkout.
2. Fill in the name, phone, and address with valid values.
3. Confirm the order.

**Expected result:** no order is created, and a popup describing the error is displayed.

**Rationale:** a verbatim acceptance criterion. An order with no products creates an unusable record and loads the operational process.

### TC-ORD-04. Checkout with empty required fields is rejected

**Covers:** CL-ORD-6, CL-ORD-7, CL-ORD-8, Q-08 | **Priority:** P1

**Preconditions:** the cart contains available products.

**Steps:** for each variant in the table, fill in the form and confirm checkout.

| Variant | Name | Phone | Address | Expected result |
|---|---|---|---|---|
| 1 | empty | filled | filled | order is not created |
| 2 | filled | empty | filled | order is not created |
| 3 | filled | filled | empty | order is not created |
| 4 | empty | empty | empty | order is not created |

**Expected result:** in every variant the order is not created, the user sees an error message, and the cart keeps its contents.

**Rationale:** the requirement names three fields as required but does not define formats (Q-08). The minimum guaranteed behavior is checked — rejection of an empty value. An order without an address or a phone cannot be fulfilled.

### TC-ORD-05. The amount in the popup matches the cart total

**Covers:** CL-ORD-9 | **Priority:** P1

**Preconditions:** the cart contains products with a subtotal below 1500 ₽, and promo code `QA60` is applied.

**Steps:**

1. Record the order total in the cart.
2. Place the order with valid data.
3. Compare the amount in the popup with the recorded total.

**Expected result:** the amount in the popup equals the cart total, including the discount and the delivery fee.

**Rationale:** a mismatch between the cart and the created order is a direct financial defect. A cart that has both a discount and a paid delivery produces the most complex calculation.

### TC-ORD-06. An order for a minimal amount is created successfully

**Covers:** CL-ORD-10, Q-11 | **Priority:** P1

**Preconditions:** the cart is empty.

**Steps:**

1. Add the cheapest available product to the cart, quantity 1.
2. Place the order with valid data.
3. Check the popup.

**Expected result:** the order is created, and the popup contains the number, amount, and status `created`.

**Rationale:** the requirement states explicitly that there is no minimum order amount. A hidden minimum contradicts the requirement and blocks part of the orders.

### TC-ORD-07. The popup closes and returns a usable interface

**Covers:** CL-ORD-11 | **Priority:** P1

**Preconditions:** an order-result popup is displayed.

**Steps:**

1. Close the popup.
2. Open the catalog.
3. Add Product A to the cart.

**Expected result:** the popup closes, the interface can be used, and the new product is added to the cart.

**Rationale:** a popup that will not close, or that blocks the page, makes a repeat order impossible and drops the user immediately after a successful conversion.

---

## Combined and boundary scenarios

### TC-EDGE-01. Maximum quantity with a discount and free delivery

**Covers:** EDGE-2 | **Priority:** P1

**Preconditions:** the cart is empty, and an available product is selected whose price makes 20 units exceed 1500 ₽.

**Steps:**

1. Add the selected product and increase its quantity to 20.
2. Record the items subtotal.
3. Apply promo code `QA60`.
4. Check the discount, the delivery fee, and the order total.

**Expected result:** the items subtotal equals price × 20, the discount equals 10% of that amount rounded down, delivery is free, and the total equals the items subtotal minus the discount.

**Rationale:** the intersection of three rules — the quantity limit, the discount, and the delivery threshold. Combinations like this expose errors that stay invisible when each rule is checked alone.

### TC-EDGE-02. A promo code applied before the cart is filled

**Covers:** EDGE-3 | **Priority:** P1

**Preconditions:** the cart is empty.

**Steps:**

1. Open the cart and apply promo code `QA60` while it is empty.
2. Add Product A to the cart.
3. Check the discount and the order total.

**Expected result:** the discount equals 10% of the items subtotal, rounded down, or the promo code must be applied again; the actual behavior is recorded and compared with Q-03.

**Rationale:** the reverse order of actions relative to the expected scenario. Users often enter the code first, and losing the discount in that order is perceived as a promotion that does not work.

### TC-EDGE-03. A cart filled through the API is shown in the UI of the same session

**Covers:** EDGE-4, EDGE-5 | **Priority:** P1

**Preconditions:** the `X-Course-Session` value used by the browser is known, and an HTTP client is available.

**Steps:**

1. Add Product A to the cart with `POST /api/course/v1/shop/cart` using the same `X-Course-Session` value.
2. Refresh the cart page in the browser and check the contents.
3. Change the quantity to 3 with `PATCH /api/course/v1/shop/cart/{productId}`.
4. Refresh the cart page and check the quantity and the items subtotal.

**Expected result:** the UI shows the line item created through the API, and quantity 3 after the change; the items subtotal is recalculated.

**Rationale:** checks that the UI and the API share one cart state. A mismatch means the client is caching over server data and leads to an order whose contents differ from what was shown.

---

## Interface security and resilience

### TC-SEC-01. Markup in the search field is not executed

**Covers:** SEC-1 | **Priority:** P1

**Preconditions:** the catalog is open.

**Steps:**

1. Enter `<img src=x onerror=alert(1)>` in the search field.
2. Check the results area.
3. Enter `<script>alert(1)</script>` and check the results.

**Expected result:** the value is handled as plain text, no dialog appears, markup is not injected into the page, and there is no server error.

**Rationale:** the search field is the most accessible unauthenticated input, and its value is reflected in the results. Reflected XSS here needs no prior conditions.

### TC-SEC-02. Markup in the order fields is not executed in the popup

**Covers:** SEC-2 | **Priority:** P1

**Preconditions:** the cart contains available products.

**Steps:**

1. Go to checkout.
2. Enter `<script>alert(1)</script>` in the name field.
3. Enter `<img src=x onerror=alert(1)>` in the address field.
4. Fill in the phone with a valid value and confirm checkout.
5. Check the result popup.

**Expected result:** the entered values are either rejected by validation or displayed as text; no dialog appears and the markup is not executed.

**Rationale:** order data is stored and then displayed, which creates a stored-XSS risk. It is more severe than reflected XSS because it also fires in the interfaces where staff view the order.

### TC-UX-01. The inactive button of an unavailable product is explained to the user

**Covers:** UX-2 | **Priority:** P1

**Preconditions:** the catalog is open.

**Steps:**

1. Find the product «Чизкейк».
2. Check for text, a hint, or a visual cue that explains why adding it is unavailable.
3. Activate the add button and check how the interface responds.

**Expected result:** the user can see why the product is unavailable, and activating the button does not produce a silent lack of response.

**Rationale:** a block without an explanation is perceived as a UI defect and generates support contacts instead of a choice of another product.
