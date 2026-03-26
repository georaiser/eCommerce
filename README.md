# CommerceManager

A RESTful platform covering **User Administration**, **E-Commerce**, and **Inventory Management**, built with **Node.js**, **Express**, **PostgreSQL** and **ES6** (import/export).

---

## 📁 Project Structure

```
commerceManager/
│
├── src/
│   ├── controllers/
│   │   ├── appController.js        ← home & page handlers
│   │   ├── userController.js       ← user CRUD handlers
│   │   ├── productController.js    ← product CRUD handlers
│   │   └── cartController.js       ← shopping cart & inventory handlers
│   │
│   ├── routes/
│   │   ├── appRoutes.js            ← GET /
│   │   ├── userRoutes.js           ← GET /users, POST /user, PUT /user/:id, DELETE /user/:id
│   │   ├── productRoutes.js        ← GET /products, POST /product, PUT /product/:id, DELETE /product/:id
│   │   └── cartRoutes.js           ← GET /cart, POST /cart, PUT /cart/:id, DELETE /cart/:id
│   │
│   ├── models/
│   │   ├── userModel.js            ← PostgreSQL queries for Users
│   │   ├── productModel.js         ← PostgreSQL queries for Products
│   │   └── cartModel.js            ← PostgreSQL queries for Cart
│   │
│   ├── config/
│   │   ├── db.js                   ← PostgreSQL pool connection setup
│   │   ├── create_db.js            ← Initialization script to create database
│   │   ├── create_tables.js        ← Initialization script to build tables
│   │   └── seed_db.js              ← Initialization script to INSERT default data
│   │
│   ├── data/
│   │   ├── users.json              ← (Deprecated) historical local data source
│   │   └── products.json           ← (Deprecated) historical local data source
│   │
│   └── views/                      ← Handlebars (HBS) server-rendered templates
│       ├── home.hbs                ← home page template
│       ├── products_page.hbs       ← products list + add-product form
│       ├── users_page.hbs          ← users list + add-user form
│       ├── cart_page.hbs           ← interactive shopping cart display
│       └── layouts/
│           └── main.hbs            ← base layout wrapper
│
├── public/                         ← static files served by Express
│   ├── css/                        ← stylesheets
│   ├── products.js                 ← client-side JS for the products form
│   ├── users.js                    ← client-side JS for the users form
│   └── cart.js                     ← client-side JS for shopping cart actions
│
├── src/app.js                      ← Express setup, middleware, routes
├── .env                            ← Environment variables
├── package.json                    ← Depedency list
└── server.js                       ← Entry point, starts server
```

---

## 🔄 Client–Server Architecture

The application uses standard Model-View-Controller (MVC) paradigms heavily tied to client-side Fetch API interactions.

```
Browser (e.g. cart.js)                  Server (cartController.js & cartModel.js)
──────────────────────                  ────────────────────────────────────────
User clicks "Quantity"     ──PUT──►     updateCartItemQuantity(req, res)
fetch('/cart/1', {JSON})                1. Checks PostgreSQL for remaining stock
                                        2. Determines difference vs existing quantity
                                        3. Updates 'products' table (Shelf Stock)
                           ◄────────    4. Updates 'cart' table and responds HTTP 200
response.ok → reload page  
                           ──GET───►    shoppingCart(req, res)
                                        queries DB for total and cart composition
                           ◄────────    res.render('cart_page', { cart, products, total })
Updated cart table & total rendered dynamically
```

> **Client Scripts** run in the **browser** (`public/*.js`) and communicate strictly via HTTP Requests.
> **Controllers** run on the **server** (`src/controllers/*.js`), execute business logic, call **Models**, and return HTTP Responses.
> **Models** interact safely with the **PostgreSQL Database** (`src/models/*.js`).

---

## 📌 API Endpoints

### Models & Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| POST | `/user` | Create a user |
| PUT | `/user/:id` | Update a user |
| DELETE | `/user/:id` | Delete a user |
|
| GET | `/products` | List all products |
| POST | `/product` | Create a product |
| PUT | `/product/:id` | Update a product |
| DELETE | `/product/:id` | Delete a product |
|
| GET | `/cart` | View current user cart |
| POST | `/cart` | Add product to cart (Upsert) |
| PUT | `/cart/:id` | Edit item quantity in cart |
| DELETE | `/cart/:id` | Remove a product from cart |
| DELETE | `/cart` | Clear entire cart |

---

## ✅ Completed Features
- **PostgreSQL Database Integration**
- **User Management** (CRUD operations)
- **Product Management** (CRUD operations)
- **Handlebars UI Engine** (Layouts + Views)
- **Shopping Cart System**
- **Dynamic Inventory Management** (Real-time logical shelf stock allocations)
- **Stock Validation Guardrails** (Server-side 400 Bad Request prevention + Client-side HTML protections)

## ⏳ What remains to be implemented?
- Transaction management with sql queries
- Object-Relational Mapping (ORM)
- User authentication
- Session management
- Role management

---

## 🔑 Environment Variables

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=db_jre
DB_USER=postgres
DB_PASSWORD=your_password
```
