# Open Questions on the Pizzaed Requirements

Ambiguities found while reviewing [`requirements.md`](requirements_en.md) and [`documentation.md`](documentation_en.md) before the checklist and test cases were written.

Each question states the working assumption testing will use if the analyst does not answer. A mismatch between actual behavior and that assumption is filed as a bug report that cites the question ID.

Priority: **P0** — blocks correct money calculations or the main path; **P1** — affects coverage scope; **P2** — a detail to clarify.

## Cart, discount, and delivery

| ID | Requirement | Question | Working assumption | Priority |
|---|---|---|---|---|
| Q-01 | L30-31 | Is the 1500 ₽ free-delivery threshold based on the items subtotal before the discount, or after `QA60` is applied? | Before the discount: a 1600 ₽ cart with `QA60` still gets free delivery, even though the amount due is 1440 ₽ | P0 |
| Q-02 | L25 | Does rounding down apply only to the discount, or to the order total as well? | Only to the discount; the items subtotal, delivery fee, and total are built from whole rubles | P0 |
| Q-03 | L28-29 | Does an applied `QA60` stay active after the cart is fully cleared and filled again? | The discount is recalculated from the new items subtotal; an empty cart has a discount of 0 | P0 |
| Q-04 | L20, L27 | Does an applied promo code persist after a successful checkout? | The promo code is cleared together with the cart | P1 |
| Q-05 | L26 | How does the system report an invalid promo code: an error message, a separate field, or a silent discount of 0? | The discount is not applied; whether an error text is shown is confirmed during exploratory testing | P1 |
| Q-06 | L13-14 | Is there a limit on the number of distinct line items in the cart? | No limit; the 1–20 range applies to each line item separately | P2 |
| Q-07 | L11-12 | What happens to a cart line if the product becomes unavailable after it was added? | Behavior is undefined; the scenario is left for exploratory testing | P2 |

## Checkout

| ID | Requirement | Question | Working assumption | Priority |
|---|---|---|---|---|
| Q-08 | L17 | What validation rules apply to name, phone, and address: mask, minimum and maximum length, allowed characters? | Only required-field checks are verified, plus rejection of empty values | P0 |
| Q-09 | L19, L51 | Which texts and conditions does the error popup have, besides an empty cart? | One case is known — an empty cart; other conditions are recorded as observed | P1 |
| Q-10 | L34 | Which other order statuses exist, and who changes them? | Only order creation in status `created` is tested | P2 |
| Q-11 | L32 | Is an order for a minimal amount, such as a single sauce, created successfully? | Yes, there is no minimum amount | P1 |

## Catalog, search, and filtering

| ID | Requirement | Question | Working assumption | Priority |
|---|---|---|---|---|
| Q-12 | L8-9 | When a search query is entered, is the selected category visually cleared, or does it stay selected but get ignored? | Search takes priority and returns results across all categories; the category control is reset | P0 |
| Q-13 | L8 | Is search case-sensitive, does it support partial matches, and is there a minimum query length? | Case does not matter, matching is partial, and there is no minimum length | P1 |
| Q-14 | L10 | What is the allowed rating range, and how is the rating displayed? | Range 0–5; the display format is recorded as observed | P2 |

## API contract

| ID | Requirement | Question | Working assumption | Priority |
|---|---|---|---|---|
| Q-15 | L43-44 | Which success status codes do `PATCH /cart/{productId}` and `DELETE /cart/{productId}` return? | `200` for `PATCH`, `200` or `204` for `DELETE`; the actual value is recorded as the contract | P0 |
| Q-16 | L43, L47 | Which status code and response body does `PATCH` return for a quantity above 20, a negative quantity, or a non-numeric value? | `422` with a JSON error description | P0 |
| Q-17 | L42, L52 | Which status code does `POST /cart` return when adding the unavailable product «Чизкейк»? | `422`; a different code is recorded as a contract mismatch | P0 |
| Q-18 | L39 | Which values do `q`, `category`, and `in_stock` accept, and what is returned for a category that does not exist? | `in_stock` accepts `true`/`false`; an unknown category returns an empty list | P1 |
| Q-19 | L39, L9 | Does the API apply the same search-over-category priority as the UI when `q` and `category` are sent together? | On the API, both parameters are applied together as a logical AND | P1 |
| Q-20 | documentation.md L21 | `GET /api/course/v1/shop/orders` is not described in the requirements: what is the response format, sort order, and pagination? | Returns the order list for the current session; covered by a basic check only | P1 |
| Q-21 | documentation.md L13 | Is the `X-Course-Session` header required, and what is returned when it is missing? | The header is required for isolation; behavior without it is recorded as observed | P0 |
