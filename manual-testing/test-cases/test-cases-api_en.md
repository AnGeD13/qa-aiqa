# Pizzaed API Test Cases

**Objective:** verify the contract of the `/api/course/v1/shop/*` endpoints: response codes, product filtering, cart quantity boundaries, order creation, and isolation of training sessions.

**Scope:** P0 and P1 items from [`checklist-pizzaed_en.md`](../checklists/checklist-pizzaed_en.md). UI cases are in [`test-cases-ui_en.md`](test-cases-ui_en.md). P2 items are not in this set.

**Test environment:** Pizzaed training environment, base path `/api/course/v1/shop`. Requests are sent with Postman or an equivalent client.

**Last updated:** 2026-09-10

**Data conventions:**

- Every request is sent with the `X-Course-Session` header. The value is unique per test run and is referred to as `S1`; the second value is `S2`.
- Paths in the cases are shortened and omit the `/api/course/v1` prefix.
- *Product A* — an available product; *Cheesecake* («Чизкейк») — the reference out-of-stock product; `{id_A}` and `{id_cheesecake}` are their identifiers.
- Response codes that are not fixed in the requirements are marked with a question from [`open-questions_en.md`](../open-questions_en.md) and are recorded as the actual contract.

---

## Products

### TC-API-PROD-01. Get the product list

**Covers:** CL-API-PROD-1 | **Priority:** P0

**Preconditions:** session `S1` is defined.

**Steps:**

1. Send `GET /shop/products` with the header `X-Course-Session: S1`.
2. Check the response code.
3. Check the structure of the list items.

**Expected result:** code 200; the body contains a non-empty product list; each item includes an identifier, name, category, description, price, rating, badges, and stock status.

**Rationale:** the base catalog contract, which every UI check and every later API case depends on. An incomplete item structure breaks the product card.

### TC-API-PROD-02. Search products with the q parameter

**Covers:** CL-API-PROD-2 | **Priority:** P1

**Preconditions:** session `S1` is defined.

**Steps:**

1. Send `GET /shop/products?q=соус`.
2. Check the response code and the list contents.
3. Check the categories of the products found.
4. Send `GET /shop/products?q=zzzqwerty` and check the response.

**Expected result:** code 200. For the query «соус», products are returned that match by name, description, or badges, including products from different categories. For a string known to be absent, an empty list is returned, not an error.

**Rationale:** server-side search is the data source for the UI. An empty result set must remain a valid 200 response; otherwise the client shows an error instead of a no-results message.

### TC-API-PROD-03. Filter products with the category parameter

**Covers:** CL-API-PROD-3, CL-API-PROD-6, Q-18 | **Priority:** P1

**Preconditions:** the allowed values of the `category` parameter are known.

**Steps:** send the request from the table and check the response code and the list contents.

| Variant | Request | Expected result |
|---|---|---|
| 1 | `GET /shop/products?category=<existing>` | 200, only products in that category |
| 2 | `GET /shop/products?category=zzz` | 200 and an empty list, no server error |
| 3 | `GET /shop/products?category=` | 200, behavior is recorded as the contract |

**Expected result:** matches the table; a 5xx response is not acceptable in any variant.

**Rationale:** the requirements do not describe the reaction to a category that does not exist (Q-18). Incorrect handling of an unknown value is a typical cause of a 500 on a public endpoint.

### TC-API-PROD-04. Filter by stock with the in_stock parameter

**Covers:** CL-API-PROD-4, Q-18 | **Priority:** P1

**Preconditions:** the data includes both available products and «Чизкейк».

**Steps:**

1. Send `GET /shop/products?in_stock=true` and check the stock status of every item.
2. Send `GET /shop/products?in_stock=false` and check the list contents.

**Expected result:** code 200. With `true`, every product is available and «Чизкейк» is absent; with `false`, only unavailable products are returned, including «Чизкейк».

**Rationale:** automated tests use this parameter to prepare data. Inverted or ignored filtering leads to attempts to add a product that is known to be unavailable.

### TC-API-PROD-05. Sending q and category together

**Covers:** CL-API-PROD-5, Q-19 | **Priority:** P1

**Preconditions:** a pair of "category and search word" is selected that produces a non-empty intersection.

**Steps:**

1. Send `GET /shop/products?q=соус&category=<category>`.
2. Check the response code and the list contents.

**Expected result:** code 200. The result matches the working assumption in Q-19 — the parameters are applied together as a logical AND; the actual behavior is recorded as the contract.

**Rationale:** for the UI, the requirement gives search priority over the category; for the API, the rule is not described. A mismatch between the two levels makes manual and automated checks behave differently.

### TC-API-PROD-06. Get a product by identifier

**Covers:** CL-API-PROD-7 | **Priority:** P0

**Preconditions:** `{id_A}` is known.

**Steps:**

1. Send `GET /shop/products/{id_A}`.
2. Check the response code.
3. Compare the product fields with the data from the catalog list.

**Expected result:** code 200, a single product is returned, and the fields match the data from `GET /shop/products`.

**Rationale:** the product-card contract. A mismatch between the list and the card means the user decides to order from stale data.

### TC-API-PROD-07. Request a missing or invalid product identifier

**Covers:** CL-API-PROD-8, CL-API-PROD-9 | **Priority:** P0

**Preconditions:** session `S1` is defined.

**Steps:** send the request from the table and check the response code.

| Variant | Request | Expected code |
|---|---|---|
| 1 | `GET /shop/products/999999` | 404 |
| 2 | `GET /shop/products/abc` | 404 or 422; a 5xx response is not acceptable |
| 3 | `GET /shop/products/-1` | 404 or 422; a 5xx response is not acceptable |

**Expected result:** a numeric identifier that does not exist returns 404, as the requirement states. For non-numeric and negative values, the server responds with a valid client error code and no internal error.

**Rationale:** status 404 is stated explicitly in the requirement. An incorrect identifier type is checked separately, because type coercion without validation is a common cause of an unhandled exception.

---

## Cart

### TC-API-CART-01. Add an available product to the cart

**Covers:** CL-API-CART-1 | **Priority:** P0

**Preconditions:** the cart of session `S1` is empty, and `{id_A}` is known.

**Steps:**

1. Send `POST /shop/cart` with a body that contains `{id_A}` and quantity 1.
2. Check the response code.
3. Send `GET /shop/cart` and check the contents.

**Expected result:** code 201; the cart contains one line item, Product A, with quantity 1.

**Rationale:** status 201 is stated explicitly in the requirement. The case creates the precondition for every other cart and order check.

### TC-API-CART-02. Adding an unavailable product is rejected

**Covers:** CL-API-CART-2, Q-17, acceptance criterion | **Priority:** P0

**Preconditions:** the cart of session `S1` is empty, and `{id_cheesecake}` is known.

**Steps:**

1. Send `POST /shop/cart` with `{id_cheesecake}` and quantity 1.
2. Check the response code and the error body.
3. Send `GET /shop/cart` and check the contents.

**Expected result:** the request is rejected with a client error code, expected 422 with a JSON description; the cart stays empty.

**Rationale:** a verbatim acceptance criterion, checked by bypassing the UI. If the barrier exists only on the client, any direct request can order an unavailable product.

### TC-API-CART-03. Get the cart of the current session

**Covers:** CL-API-CART-3 | **Priority:** P0

**Preconditions:** the cart of session `S1` contains two line items with known prices and quantities.

**Steps:**

1. Send `GET /shop/cart`.
2. Check the response code and the line items.
3. Check the calculated values: items subtotal, discount, delivery fee, and total.

**Expected result:** code 200; the line items match the products that were added; the items subtotal equals the sum of price × quantity; the calculated fields are present.

**Rationale:** the API cart is the only data source for the UI and for the order amount. An error in its calculations spreads to every other level.

### TC-API-CART-04. Change the quantity inside the allowed range

**Covers:** CL-API-CART-4, Q-15 | **Priority:** P0

**Preconditions:** the cart of session `S1` contains Product A with quantity 1.

**Steps:** send `PATCH /shop/cart/{id_A}` with the quantity from the table, then check the response code and the cart.

| Variant | Quantity | Expected result |
|---|---|---|
| 1 | 1 | quantity 1 |
| 2 | 10 | quantity 10 |
| 3 | 20 | quantity 20 |

**Expected result:** every variant returns a success code (expected 200), the cart quantity matches the request, and the items subtotal is recalculated.

**Rationale:** the lower and upper bounds of the allowed range 1–20. The success code of `PATCH` is not fixed in the requirements (Q-15), so the case records the actual contract.

### TC-API-CART-05. Changing the quantity to an invalid value is rejected

**Covers:** CL-API-CART-5, CL-API-CART-6, CL-API-CART-7, Q-16 | **Priority:** P0

**Preconditions:** the cart of session `S1` contains Product A with quantity 5.

**Steps:** send `PATCH /shop/cart/{id_A}` with the value from the table, and check the response code, the error body, and the cart state.

| Variant | Quantity | Expected result |
|---|---|---|
| 1 | 21 | 422, JSON with an error description |
| 2 | -1 | 422, JSON with an error description |
| 3 | `abc` | a client error code; a 5xx response is not acceptable |
| 4 | omitted from the body | a client error code; a 5xx response is not acceptable |

**Expected result:** no variant changes the cart, the quantity stays at 5, and errors are returned as JSON.

**Rationale:** the requirement limits quantity to the range 1–20, and the validation-error format to status 422. Exceeding the upper bound with a direct request creates an order the store cannot fulfill.

### TC-API-CART-06. Setting the quantity to 0 removes the line item

**Covers:** CL-API-CART-8 | **Priority:** P1

**Preconditions:** the cart of session `S1` contains Product A with quantity 3.

**Steps:**

1. Send `PATCH /shop/cart/{id_A}` with quantity 0.
2. Check the response code.
3. Send `GET /shop/cart` and check the contents.

**Expected result:** the request succeeds, the line item is removed from the cart, and the calculated values are zero.

**Rationale:** removal at zero is defined for the cart as a whole and must apply at both levels. A line item with quantity 0 in the data distorts the order amount and the UI.

### TC-API-CART-07. Remove a product from the cart

**Covers:** CL-API-CART-9, CL-API-CART-10, Q-15 | **Priority:** P0

**Preconditions:** the cart of session `S1` contains Product A.

**Steps:**

1. Send `DELETE /shop/cart/{id_A}` and check the response code.
2. Send `GET /shop/cart` and check the contents.
3. Send `DELETE /shop/cart/{id_A}` again for the line item that is already gone.
4. Check the response code of the second request.

**Expected result:** the first request succeeds (expected 200 or 204) and the line item is removed. The repeat request returns a success code or 404; a 5xx response is not acceptable.

**Rationale:** the requirements do not define the success code of `DELETE` (Q-15). A repeated delete checks resilience: the client may send the request twice after a dropped connection.

### TC-API-CART-08. Adding the product again, and exceeding the limit on add

**Covers:** CL-API-CART-11, CL-API-CART-12 | **Priority:** P1

**Preconditions:** the cart of session `S1` is empty.

**Steps:**

1. Send `POST /shop/cart` with `{id_A}` and quantity 1.
2. Send the same request again and check the response code and the cart.
3. Clear the cart.
4. Send `POST /shop/cart` with `{id_A}` and quantity 21, and check the response code and the cart.

**Expected result:** adding the product again increases the existing line item to quantity 2 and does not create a duplicate. Adding with quantity 21 is rejected with a client error code, and the cart stays empty.

**Rationale:** the requirement describes the 1–20 limit for a quantity change, but not for an add, which leaves a way around the boundary through `POST`. A duplicate line item also lets the limit be exceeded by the sum of two line items of the same product.

---

## Orders

### TC-API-ORD-01. Create an order with valid data

**Covers:** CL-API-ORD-1 | **Priority:** P0

**Preconditions:** the cart of session `S1` contains available products.

**Steps:**

1. Send `POST /shop/orders` with a name, phone, and delivery address.
2. Check the response code.
3. Check the fields of the created order.

**Expected result:** code 201; the response contains the order number, amount, and status `created`.

**Rationale:** status 201 and status `created` are stated explicitly in the requirements. This is the final step of the main path at the API level.

### TC-API-ORD-02. Creating an order with an empty cart is rejected

**Covers:** CL-API-ORD-2, acceptance criterion | **Priority:** P0

**Preconditions:** the cart of session `S1` is empty.

**Steps:**

1. Send `POST /shop/orders` with a valid name, phone, and address.
2. Check the response code and the error body.
3. Send `GET /shop/orders` and confirm that no new order was created.

**Expected result:** the request is rejected with a client error code and a description; no order is created.

**Rationale:** an acceptance criterion checked by bypassing the UI. An order with no products is an invalid record that still enters the delivery operations.

### TC-API-ORD-03. Creating an order without required fields returns 422

**Covers:** CL-API-ORD-3, Q-08 | **Priority:** P0

**Preconditions:** the cart of session `S1` contains available products.

**Steps:** send `POST /shop/orders` with the body from the table and check the response code and the error format.

| Variant | Request body | Expected result |
|---|---|---|
| 1 | name field omitted | 422, JSON with an error description |
| 2 | phone field omitted | 422, JSON with an error description |
| 3 | address field omitted | 422, JSON with an error description |
| 4 | all fields sent as empty strings | 422, JSON with an error description |
| 5 | empty request body | 422, JSON with an error description |

**Expected result:** in every variant no order is created, status 422 is returned with a JSON error body, and the cart keeps its contents.

**Rationale:** the requirement states the validation-error format explicitly — JSON and status 422. The empty-body variant also checks that missing data does not cause an unhandled exception.

### TC-API-ORD-04. The cart is cleared after the order is created

**Covers:** CL-API-ORD-4, acceptance criterion | **Priority:** P0

**Preconditions:** the cart of session `S1` contains available products.

**Steps:**

1. Send `POST /shop/orders` with valid data and confirm code 201.
2. Send `GET /shop/cart`.
3. Check the cart contents and calculated values.

**Expected result:** the cart is empty; the items subtotal, discount, and total are zero.

**Rationale:** the acceptance criterion is checked at the data level, not only by the look of the interface. Clearing the cart only on the client leaves the line items on the server and leads to a duplicate order.

### TC-API-ORD-05. The order amount matches the cart calculation

**Covers:** CL-API-ORD-5 | **Priority:** P1

**Preconditions:** the cart of session `S1` contains products with a subtotal below 1500 ₽, and promo code `QA60` is applied.

**Steps:**

1. Send `GET /shop/cart` and record the items subtotal, discount, delivery fee, and total.
2. Send `POST /shop/orders` with valid data.
3. Compare the amount in the response with the recorded cart total.

**Expected result:** the order amount equals the cart total, including the discount and the delivery fee.

**Rationale:** the order records the amount due. Recalculating with a different formula at creation time means the user pays an amount other than the one they saw.

### TC-API-ORD-06. Get the session order list

**Covers:** CL-API-ORD-6, Q-20 | **Priority:** P1

**Preconditions:** session `S1` has at least one order with a known number.

**Steps:**

1. Send `GET /shop/orders`.
2. Check the response code and the response structure.
3. Find the order with the recorded number in the list.

**Expected result:** code 200; the list contains the created order with the correct amount and status `created`.

**Rationale:** the endpoint behavior is not described in the requirements (Q-20), so the case records the minimum contract — the created order must be readable.

---

## Training-session isolation

### TC-API-SESS-01. Carts of different sessions are isolated

**Covers:** CL-SESS-1 | **Priority:** P0

**Preconditions:** two different `X-Course-Session` values are defined, `S1` and `S2`; both carts are empty.

**Steps:**

1. Send `POST /shop/cart` with `{id_A}` and the header `X-Course-Session: S1`.
2. Send `GET /shop/cart` with the header `X-Course-Session: S2` and check the contents.
3. Send `POST /shop/cart` with a different product and the header `S2`.
4. Send `GET /shop/cart` with the header `S1` and check the contents.

**Expected result:** cart `S2` does not contain the product added to `S1`, and the reverse is also true. Each session sees only its own line items.

**Rationale:** data isolation is the stated purpose of the header. Without it, parallel automated tests are unstable, and manual run results are not reproducible.

### TC-API-SESS-02. Orders of different sessions are isolated

**Covers:** CL-SESS-2 | **Priority:** P0

**Preconditions:** sessions `S1` and `S2` are defined; the cart of `S1` contains available products.

**Steps:**

1. Create an order in session `S1` and record its number.
2. Send `GET /shop/orders` with the header `X-Course-Session: S2`.
3. Check whether the `S1` order is present in the response.

**Expected result:** the order list of session `S2` does not contain the order created in session `S1`.

**Rationale:** orders contain personal data — name, phone, and address. Availability from another session is a data leak, not only a testing obstacle.

### TC-API-SESS-03. A request without the session header does not return another session's data

**Covers:** CL-SESS-3, Q-21 | **Priority:** P1

**Preconditions:** the cart of session `S1` contains products.

**Steps:**

1. Send `GET /shop/cart` without the `X-Course-Session` header.
2. Check the response code and body.
3. Send `GET /shop/orders` without the header and check the response.

**Expected result:** the server either rejects the request with a client error code or returns empty data. Data from session `S1` is absent from the response, and a 5xx response is not acceptable.

**Rationale:** the requirements do not state that the header is mandatory (Q-21). A shared default cart means every user of the environment works with the same data.

---

## API security

### TC-API-SEC-01. The order amount is not accepted from the client

**Covers:** SEC-3 | **Priority:** P1

**Preconditions:** the cart of session `S1` contains products with a known order total.

**Steps:**

1. Send `POST /shop/orders` with valid data plus extra amount and discount fields that contain understated values, for example an amount of 1 and a discount of 100%.
2. Check the response code.
3. Check the amount on the created order.

**Expected result:** the order amount is calculated by the server from the cart contents and does not match the submitted values, or the request is rejected with a validation error.

**Rationale:** the amount must be calculated on the server. Trusting client values lets any order be placed for an arbitrary amount, which is a direct financial risk.

### TC-API-SEC-02. Another session's cart cannot be modified

**Covers:** SEC-4 | **Priority:** P1

**Preconditions:** the cart of session `S1` contains Product A with quantity 2; session `S2` is defined.

**Steps:**

1. Send `PATCH /shop/cart/{id_A}` with quantity 20 and the header `X-Course-Session: S2`.
2. Send `GET /shop/cart` with the header `S1` and check the quantity.
3. Send `DELETE /shop/cart/{id_A}` with the header `S2`.
4. Send `GET /shop/cart` with the header `S1` and check the contents.

**Expected result:** the quantity and contents of cart `S1` are unchanged. Requests from session `S2` affect only its own cart.

**Rationale:** a check for horizontal privilege escalation across sessions. The ability to change another cart means the product identifier is used as a key with no binding to the data owner.
