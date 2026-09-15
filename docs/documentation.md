# Документация проекта "Пиццаед"

## Пользовательские сценарии

- Просмотр каталога и карточек товаров
- Поиск товаров по названию, описанию и бейджам
- Фильтрация по категориям
- Добавление доступного товара в корзину
- Изменение количества товара от 1 до 20
- Применение промокода QA60
- Оформление заказа и получение popup результата

## API - для изоляции данных использовать заголовок X-Course-Session

- GET /api/course/v1/shop/products
- GET /api/course/v1/shop/products/{id}
- GET /api/course/v1/shop/cart
- POST /api/course/v1/shop/cart
- PATCH /api/course/v1/shop/cart/{productId}
- DELETE /api/course/v1/shop/cart/{productId}
- POST /api/course/v1/shop/orders
- GET /api/course/v1/shop/orders
