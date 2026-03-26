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
│   │   └── cartController.js       ← shopping cart, inventory & checkout handlers
│   │
│   ├── routes/
│   │   ├── appRoutes.js            ← GET /
│   │   ├── userRoutes.js           ← GET /users, POST /user, PUT /user/:id, DELETE /user/:id
│   │   ├── productRoutes.js        ← GET /products, POST /product, PUT /product/:id, DELETE /product/:id
│   │   └── cartRoutes.js           ← GET /cart, POST /cart, PUT /cart/:id, DELETE /cart/:id, POST /cart/checkout
│   │
│   ├── models/
│   │   ├── userModel.js            ← PostgreSQL queries for Users (accepts optional dbClient)
│   │   ├── productModel.js         ← PostgreSQL queries for Products (accepts optional dbClient)
│   │   └── cartModel.js            ← PostgreSQL queries for Cart (accepts optional dbClient)
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
│       ├── users_page.hbs          ← users list + add-user form (incl. credit balance)
│       ├── cart_page.hbs           ← interactive shopping cart + checkout button
│       └── layouts/
│           └── main.hbs            ← base layout wrapper
│
├── public/                         ← static files served by Express
│   ├── css/                        ← stylesheets (incl. global watermark background)
│   ├── products.js                 ← client-side JS for the products form
│   ├── users.js                    ← client-side JS for the users form
│   └── cart.js                     ← client-side JS for cart actions & checkout
│
├── src/app.js                      ← Express setup, middleware, routes
├── .env                            ← Environment variables
├── package.json                    ← Dependency list
└── server.js                       ← Entry point, starts server
```

---

## 🔄 Client–Server Architecture

The application uses standard Model-View-Controller (MVC) paradigms tied to client-side Fetch API interactions.

```
Browser (e.g. cart.js)                  Server (cartController.js → cartModel.js)
──────────────────────                  ──────────────────────────────────────────
User clicks "Checkout"     ─POST──►     checkoutCart(req, res)
fetch('/cart/checkout')                 1. BEGIN transaction (dedicated client)
                                        2. Reads cart total  (model)
                                        3. Reads user credit (model)
                                        4. Validates: credit >= total
                                        5. Deducts credit    (model)
                                        6. Clears cart       (model)
                                        7. COMMIT (or ROLLBACK on any error)
                           ◄────────    HTTP 200 "Purchase successful!"
response.ok → reload page
```

> **Client Scripts** run in the **browser** (`public/*.js`) and communicate strictly via HTTP Requests.  
> **Controllers** run on the **server** (`src/controllers/*.js`), manage business logic and **transaction lifecycle**.  
> **Models** execute **SQL queries** (`src/models/*.js`) and accept an optional `dbClient` to participate in a transaction.

---

## 🔐 Transaction Pattern

All multi-step cart mutations (Add, Edit, Remove, Clear, Checkout) are wrapped in atomic PostgreSQL transactions. The pattern is:

1. **Controller** checks out a dedicated connection: `const client = await pool.connect()`
2. **Controller** opens the transaction: `await client.query('BEGIN')`
3. **Controller** calls model functions, passing `client` instead of the default `pool`
4. **Models** use `dbClient = pool` as default — so they work for single queries without any changes
5. **Controller** commits or rolls back: `COMMIT` on success, `ROLLBACK` on any thrown error
6. **Controller** always releases the connection: `client.release()` in `finally`

```js
// Model — ORM-ready, works with pool or client
const getCartItem = async (userId, productId, dbClient = pool) => { ... };

// Controller — manages transaction, delegates SQL to models
const client = await pool.connect();
try {
    await client.query('BEGIN');
    const item = await getCartItem(userId, productId, client); // passes client
    await updateProductStock(productId, newStock, client);     // passes client
    await client.query('COMMIT');
} catch (err) {
    await client.query('ROLLBACK');
} finally {
    client.release();
}
```

---

## 📌 API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users (incl. credit balance) |
| POST | `/user` | Create a user (with starting credit) |
| PUT | `/user/:id` | Update a user (incl. credit amount) |
| DELETE | `/user/:id` | Delete a user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |
| POST | `/product` | Create a product |
| PUT | `/product/:id` | Update a product |
| DELETE | `/product/:id` | Delete a product |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | View current user cart + credit balance |
| POST | `/cart` | Add product to cart — atomic: deducts shelf stock |
| PUT | `/cart/:id` | Edit item quantity — atomic: syncs shelf stock delta |
| DELETE | `/cart/:id` | Remove product — atomic: restores shelf stock |
| DELETE | `/cart` | Clear entire cart — atomic: restores all shelf stock |
| POST | `/cart/checkout` | Purchase cart — atomic: deducts user credit, clears cart |

---

## ✅ Completed Features

- **PostgreSQL Database Integration** — pool-based connections with automated initialization on boot
- **User Management** — CRUD with per-user `credit` balance (display & edit)
- **Product Management** — CRUD with real-time `stock` tracking
- **Handlebars UI Engine** — Layouts, partials and server-rendered views
- **Shopping Cart System** — Upsert logic, quantity updates, item removal, full clear
- **Dynamic Inventory Management** — Real-time logical shelf stock allocations on every cart action
- **Stock Validation** — Server-side 400 guardrails + client-side HTML max attribute
- **ACID Transaction Management** — All cart mutations wrapped in `BEGIN/COMMIT/ROLLBACK`
- **Checkout System** — Credit balance deduction with insufficient-funds rollback
- **ORM-Ready Model Layer** — Every model function accepts `dbClient = pool` for easy migration

## ⏳ What remains to be implemented?

- Object-Relational Mapping (ORM) — e.g. Sequelize or Prisma
- User authentication
- Session management (replace hardcoded `userId = 1`)
- Role-based access control (RBAC)

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
