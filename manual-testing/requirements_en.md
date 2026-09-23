# Pizzaed Requirements

## Pizzaed is a training pizza-delivery store used for QA practice.

### Functional requirements

- The user sees a product catalog with four categories: pizza, drinks, desserts, and sauces.
- The user can search products by name, description, and badges. While a search is active, results are shown across all categories.
- The user can filter the catalog by a single category when the search field is empty.
- A product card shows the name, category, description, price, rating, badges, and stock status.
- An available product can be added to the cart from the catalog.
- An unavailable product is shown in the catalog but cannot be added to the cart.
- In the cart, the user can increase or decrease an item quantity within the range 1 to 20.
- If an item quantity is decreased to 0, the item is removed from the cart.
- The cart shows the items subtotal, discount, delivery fee, and order total.
- The user can apply promo code QA60 and see the recalculated order total.
- To place an order, the user enters a name, phone number, and delivery address.
- After a successful checkout, the user sees a popup with the order number, amount, and status.
- If the order cannot be placed, the user sees a popup describing the error.
- After a successful checkout, the cart is cleared.

### Business rules

- Promo code QA60 gives a 10% discount on the items subtotal, before delivery.
- The discount is rounded down to whole rubles.
- If the promo code is not QA60, no discount is applied.
- Leading and trailing spaces in the promo code are ignored, and letter case does not matter.
- Entering QA60 again does not increase the discount — the promo code is applied once to the current cart.
- If the cart contents change after the promo code is entered, the discount is recalculated from the new items subtotal.
- Delivery costs 199 rubles when the items subtotal is below 1500 rubles.
- Delivery is free when the items subtotal is 1500 rubles or more.
- The current version does not enforce a minimum order amount.
- The product «Чизкейк» (Cheesecake) is the reference out-of-stock item.
- A new order is created with status `created`.

### API requirements

- GET /api/course/v1/shop/products returns the product list and supports `q`, `category`, and `in_stock`.
- GET /api/course/v1/shop/products/{id} returns a single product, or 404 if the product is not found.
- GET /api/course/v1/shop/cart returns the cart of the current training session.
- POST /api/course/v1/shop/cart adds a product to the cart and returns 201.
- PATCH /api/course/v1/shop/cart/{productId} changes the quantity of a cart item.
- DELETE /api/course/v1/shop/cart/{productId} removes a product from the cart.
- POST /api/course/v1/shop/orders creates an order and returns 201.
- Validation errors are returned as JSON with status 422.

### Acceptance criteria

- The user can complete the main path: catalog → cart → checkout → successful-order popup.
- Attempting to check out an empty cart shows an error popup.
- «Чизкейк» cannot be added through the UI, and the API rejects the attempt.
- A search for «соус» (sauce) finds products from different categories when they match by name, description, or badges.
- Promo code QA60 changes the discount and the order total.
- After an order is created, the cart is empty.
