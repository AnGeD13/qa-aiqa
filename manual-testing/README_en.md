# Manual Testing

Manual test artifacts for [Pizzaed](https://aiqa.su/base/shop), a training pizza-delivery store used for QA practice.

Coverage includes the catalog, search and filtering, the cart, promo code `QA60`, discount and delivery calculation, checkout, and the API contract for `/api/course/v1/shop/*`. Out of scope: authentication, payment, the admin panel, and order-status changes after creation.


## What is tested

- The catalog of four categories (pizza, drinks, desserts, sauces) and the product card, including the unavailable product «Чизкейк».
- Search by name, description, and badges. While a search is active, results are shown across all categories; a single-category filter works only when the search field is empty.
- The cart: quantity from 1 to 20, removal of a line item at zero, items subtotal, discount, delivery fee, and order total.
- Promo code `QA60`: a 10% discount on the items subtotal before delivery, rounded down to whole rubles. Delivery is free from 1500 ₽; otherwise it costs 199 ₽.
- Checkout (name, phone, address) and a popup with the order number, amount, and status `created`. An empty cart is rejected.
- The products, cart, and orders API. Sessions are isolated with the `X-Course-Session` header.

## Structure

| Path | Contents |
|---|---|
| [`requirements_en.md`](requirements_en.md) | Functional requirements, business rules, the API, and acceptance criteria. |
| [`documentation_en.md`](documentation_en.md) | User scenarios and the endpoint list. |
| [`open-questions_en.md`](open-questions_en.md) | Requirement ambiguities and the working assumptions adopted by default (`Q-01`…`Q-21`). |
| [`checklists/checklist-pizzaed_en.md`](checklists/checklist-pizzaed_en.md) | UI and API checklist with priorities P0–P2. |
| [`test-cases/test-cases-ui_en.md`](test-cases/test-cases-ui_en.md) | Detailed UI cases for P0 and P1 items. |
| [`test-cases/test-cases-api_en.md`](test-cases/test-cases-api_en.md) | Detailed API cases for P0 and P1 items. |
| [`bug-reports/bug-report.md`](bug-reports/bug-report.md) | Draft notes on the defects found. |

Checklist and test cases last updated: 2026-09-10. Test environment: latest Chrome, resolution 1920×1080. API requests use a unique `X-Course-Session` value for each test run.
