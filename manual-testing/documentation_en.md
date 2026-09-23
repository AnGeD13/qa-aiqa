# Pizzaed Project Documentation

## User scenarios

- Browse the catalog and product cards
- Search products by name, description, and badges
- Filter by category
- Add an available product to the cart
- Change item quantity from 1 to 20
- Apply promo code QA60
- Place an order and receive a result popup

## API — isolate data with the X-Course-Session header

- GET /api/course/v1/shop/products
- GET /api/course/v1/shop/products/{id}
- GET /api/course/v1/shop/cart
- POST /api/course/v1/shop/cart
- PATCH /api/course/v1/shop/cart/{productId}
- DELETE /api/course/v1/shop/cart/{productId}
- POST /api/course/v1/shop/orders
- GET /api/course/v1/shop/orders
