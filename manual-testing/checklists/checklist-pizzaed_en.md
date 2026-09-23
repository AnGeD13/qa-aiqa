# Pizzaed Functional Test Checklist

**Objective:** verify that the catalog, cart, amount calculation, checkout, and API contract match the requirements in [`requirements_en.md`](../requirements_en.md).

**Scope:** UI (catalog, search and filtering, cart, checkout) and the API `/api/course/v1/shop/*`. Out of scope: authentication, payment, the admin panel, and order-status changes after creation.

**Test environment:** Pizzaed training environment, current version. Every API request is sent with an `X-Course-Session` header that is unique per test run. Browser: latest Chrome, resolution 1920×1080.

**Last updated:** 2026-09-10

**Priorities:** P0 — blocks the main path or money calculations; P1 — affects functionality; P2 — display details.

**Open questions:** working assumptions for ambiguous requirements are recorded in [`open-questions_en.md`](../open-questions_en.md). References such as `Q-01` point to the assumption that was adopted.

---

## CL-CAT. Catalog and product card

- [ ] **P0** The catalog opens and shows products from all four categories: pizza, drinks, desserts, sauces *(without the catalog there is no entry point to the main path)*
- [ ] **P1** The product card contains all seven fields: name, category, description, price, rating, badges, stock status *(an incomplete card withholds the data the user needs to choose)*
- [ ] **P1** The unavailable product «Чизкейк» is present in the catalog and visually marked as out of stock *(the requirement forbids hiding the product, but requires its status to be shown)*
- [ ] **P0** The add-to-cart control for «Чизкейк» cannot be activated *(a UI barrier against an order that cannot be fulfilled)*
- [ ] **P2** Prices are shown in rubles in one format across the catalog *(inconsistent formatting undermines trust in the calculations)*
- [ ] **P2** The rating stays within the allowed range, with no negative values and no values above the maximum *(Q-14)*

## CL-SRCH. Search and filtering

- [ ] **P0** A search by product name returns the matching products *(the first of the three match sources required)*
- [ ] **P0** A search by a word from the description returns products that match in the description *(the second match source)*
- [ ] **P0** A search by a badge returns products that carry that badge *(the third match source)*
- [ ] **P0** A search for «соус» finds products from different categories *(a direct acceptance criterion)*
- [ ] **P0** While a search is active, results are shown across all categories, not only inside the category selected earlier *(search takes priority over the filter, Q-12)*
- [ ] **P0** A single-category filter works only when the search field is empty *(the primary filtering mode)*
- [ ] **P1** After the search field is cleared, category filtering is available again *(the reverse state transition, where the control most often stops working)*
- [ ] **P1** Search does not depend on the case of the query *(Q-13)*
- [ ] **P1** A search for part of a word returns matches *(Q-13)*
- [ ] **P1** A query that matches no product shows an empty result without a UI error *(a negative scenario, a typical source of layout breakage)*
- [ ] **P2** A query made only of spaces does not break the result list *(incorrect handling of empty input)*

## CL-CART. Cart: contents and quantity

- [ ] **P0** An available product is added to the cart from the catalog *(a required step of the main path)*
- [ ] **P0** Item quantity changes within the range 1–20 *(the lower and upper bounds of the range)*
- [ ] **P0** Decreasing the quantity to 0 removes the item from the cart *(a separate requirement)*
- [ ] **P1** The cart shows four calculated values: items subtotal, discount, delivery fee, and order total *(the user must see how the final price is composed)*
- [ ] **P1** The items subtotal equals the sum of price × quantity across all line items *(the base arithmetic that the discount and delivery depend on)*
- [ ] **P1** Several different products are present in the cart at the same time as separate line items *(Q-06)*
- [ ] **P1** Adding the same product from the catalog again increases the quantity of the existing line item instead of creating a duplicate
- [ ] **P1** An empty cart is displayed correctly and does not show stray values in the calculations *(the initial state, often skipped during development)*

## CL-PROMO. Promo code and discount calculation

- [ ] **P0** Promo code `QA60` is applied and gives a 10% discount on the items subtotal before delivery *(the key business rule)*
- [ ] **P0** The discount is rounded down to whole rubles on an amount that is not a multiple of 10 *(this checks rounding itself, not merely that a discount exists)*
- [ ] **P0** The order total equals the items subtotal minus the discount plus the delivery fee *(the total formula the user sees)*
- [ ] **P0** Entering `QA60` again does not increase the discount *(protection against applying it more than once)*
- [ ] **P0** After the cart contents change, the discount is recalculated from the new items subtotal *(the discount must not stay frozen at the old value)*
- [ ] **P1** A promo code with leading and trailing spaces is applied correctly *(the rule that ignores spaces)*
- [ ] **P1** A promo code in lowercase is applied correctly *(the case-insensitivity rule)*
- [ ] **P1** Any promo code other than `QA60` gives no discount *(Q-05)*
- [ ] **P1** An empty promo code gives no discount and does not cause a UI error *(the empty-input negative scenario)*
- [ ] **P1** When every item is removed from the cart, the discount resets to zero *(Q-03)*

## CL-DLV. Delivery fee

- [ ] **P0** At an items subtotal of 1499 ₽, delivery costs 199 ₽ *(the value immediately below the threshold)*
- [ ] **P0** At an items subtotal of exactly 1500 ₽, delivery is free *(the exact threshold, where a comparison-sign error is most common)*
- [ ] **P0** At an items subtotal of 1501 ₽, delivery is free *(the value immediately above the threshold)*
- [ ] **P0** Applying `QA60` so that the amount due falls below 1500 ₽ does not bring back a paid delivery *(the threshold is based on the items subtotal before the discount, Q-01)*
- [ ] **P1** Reducing the items subtotal below the threshold restores the 199 ₽ delivery fee *(delivery recalculated in the reverse direction)*

## CL-ORD. Checkout and result popup

- [ ] **P0** An order is placed when name, phone, and delivery address are filled in *(the final step of the main path)*
- [ ] **P0** After a successful checkout, a popup shows the order number, amount, and status `created` *(a direct acceptance criterion)*
- [ ] **P0** After a successful checkout, the cart is empty *(a direct acceptance criterion; prevents a repeat order)*
- [ ] **P0** Attempting to check out an empty cart shows an error popup *(a direct acceptance criterion)*
- [ ] **P1** Checkout with an empty name is rejected *(Q-08)*
- [ ] **P1** Checkout with an empty phone is rejected *(Q-08)*
- [ ] **P1** Checkout with an empty address is rejected *(Q-08)*
- [ ] **P1** The amount in the popup matches the order total shown in the cart before checkout *(a mismatched amount is a direct financial risk)*
- [ ] **P1** An order for a minimal amount, such as a single sauce, is created successfully *(no minimum order amount, Q-11)*
- [ ] **P1** The popup closes and returns the user to a working interface *(without this, further work is impossible)*

## CL-API-PROD. API: products

- [ ] **P0** `GET /shop/products` returns 200 and a product list *(the base catalog contract)*
- [ ] **P1** `GET /shop/products?q=соус` returns products that match by name, description, or badges *(the server-side search implementation)*
- [ ] **P1** `GET /shop/products?category=` with an existing category returns only products in that category *(filtering at the API level)*
- [ ] **P1** `GET /shop/products?in_stock=true` returns only available products; `in_stock=false` returns only unavailable ones *(Q-18)*
- [ ] **P1** Sending `q` and `category` together is handled predictably *(Q-19)*
- [ ] **P1** `GET /shop/products?category=` with a category that does not exist returns an empty list and no server error *(Q-18)*
- [ ] **P0** `GET /shop/products/{id}` with an existing identifier returns 200 and a single product *(the product-card contract)*
- [ ] **P0** `GET /shop/products/{id}` with an identifier that does not exist returns 404 *(the status code stated explicitly in the requirements)*
- [ ] **P1** `GET /shop/products/{id}` with a non-numeric identifier does not return 500 *(resilience to an incorrect type)*

## CL-API-CART. API: cart

- [ ] **P0** `POST /shop/cart` with an available product returns 201 *(the status code stated explicitly)*
- [ ] **P0** `POST /shop/cart` with the unavailable «Чизкейк» is rejected *(a direct acceptance criterion, an API barrier, Q-17)*
- [ ] **P0** `GET /shop/cart` returns the current session cart with the correct line items and calculations *(the data source for the UI)*
- [ ] **P0** `PATCH /shop/cart/{productId}` changes the quantity within 1–20 *(Q-15)*
- [ ] **P0** `PATCH /shop/cart/{productId}` with a quantity of 21 is rejected with status 422 and a JSON error description *(Q-16)*
- [ ] **P0** `PATCH /shop/cart/{productId}` with a negative quantity is rejected *(Q-16)*
- [ ] **P1** `PATCH /shop/cart/{productId}` with a non-numeric quantity is rejected without a server error *(Q-16)*
- [ ] **P1** `PATCH /shop/cart/{productId}` with a quantity of 0 removes the item from the cart *(the API follows the UI rule)*
- [ ] **P0** `DELETE /shop/cart/{productId}` removes the item, and the cart no longer contains that line *(Q-15)*
- [ ] **P1** `DELETE /shop/cart/{productId}` for a product that is not in the cart does not return 500 *(delete idempotency)*
- [ ] **P1** `POST /shop/cart` for a product already in the cart is handled predictably
- [ ] **P1** `POST /shop/cart` with a quantity above 20 is rejected *(the range boundary at the API level)*

## CL-API-ORD. API: orders

- [ ] **P0** `POST /shop/orders` with valid data returns 201 and an order with status `created` *(the status code stated explicitly)*
- [ ] **P0** `POST /shop/orders` with an empty cart is rejected *(the acceptance criterion, repeated at the API level)*
- [ ] **P0** `POST /shop/orders` without the required fields returns 422 with a JSON error body *(the specified validation-error format)*
- [ ] **P0** After a successful `POST /shop/orders`, `GET /shop/cart` returns an empty cart *(the acceptance criterion at the data level, not only in the UI)*
- [ ] **P1** The amount in the `POST /shop/orders` response matches the cart calculation, including the discount and delivery fee *(financial consistency between API and UI)*
- [ ] **P1** `GET /shop/orders` returns 200 and contains the created order *(Q-20)*

## CL-SESS. Training-session isolation

- [ ] **P0** Carts for two different `X-Course-Session` values cannot see each other *(without isolation, automated tests are unstable when run in parallel)*
- [ ] **P0** An order created in one session does not appear in another session's order list *(the same isolation for orders)*
- [ ] **P1** A request without the `X-Course-Session` header is handled predictably and does not return another session's data *(Q-21)*

---

## 💡 Non-obvious checks (boundaries, UX, security)

### Boundaries and calculation integrity

- [ ] **P0** A discount on an items subtotal that yields a fractional 10% is rounded down, not by standard half-up rounding *(a 1 ₽ difference is a calculation defect that is easy to miss)*
- [ ] **P1** The combination of the upper quantity bound and the delivery threshold: 20 units of an expensive product with `QA60` applied is calculated correctly *(three rules intersecting at once)*
- [ ] **P1** Applying `QA60` before the cart is filled, then adding products, produces the correct discount *(the reverse order of actions relative to the expected scenario)*
- [ ] **P1** A cart filled through the API is displayed correctly in the UI of the same session *(a check that there is a single source of data)*
- [ ] **P1** A quantity change made through the API is reflected in the UI after the page is refreshed *(client state out of sync with the server)*
- [ ] **P2** Rapid repeated clicks on the increase-quantity button do not exceed the limit of 20 *(a client-side race)*
- [ ] **P2** Rapid repeated clicks on the place-order button do not create multiple orders *(duplicate orders are a direct financial risk)*

### UX and display

- [ ] **P1** An empty search result is accompanied by a clear message, not just a blank area *(the user should not take a blank screen for a failure)*
- [ ] **P1** The add button for an unavailable product visually explains why it is inactive *(without a hint, the block looks like a defect)*
- [ ] **P2** A long product name or description does not break the card layout *(a typical responsive-grid defect)*
- [ ] **P2** The catalog and cart stay usable at a mobile resolution *(food delivery is ordered mostly from a phone)*
- [ ] **P2** Refreshing the page does not lose the cart contents *(a lost cart is a common reason to abandon an order)*

### Security and resilience

- [ ] **P1** Entering HTML or script markup in the search field does not cause it to execute *(a basic reflected-XSS check)*
- [ ] **P1** Entering HTML or script markup in the name and address fields does not cause it to execute in the order popup *(stored XSS via order data)*
- [ ] **P1** Changing the price or amount in the `POST /shop/orders` request body does not affect the order total *(the calculation must run on the server and must not be accepted from the client)*
- [ ] **P1** Accessing a cart with someone else's `X-Course-Session` value does not allow its contents to be changed *(horizontal privilege escalation across sessions)*
- [ ] **P2** Error messages do not expose internal stack traces or SQL queries *(leakage of technical details)*
- [ ] **P2** A very long string in the search field and in the order fields does not cause a server error *(resilience to oversized input)*
