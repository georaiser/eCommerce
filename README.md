# CommerceManager API

A RESTful platform API covering **User Administration**, **E-Commerce**, and **Inventory Management**, built with **Node.js**, **Express**, **PostgreSQL** and **ES6** (import/export).

---

## 📁 Project Structure

```
commerceManager/
│
├── src/
│   ├── controllers/
│   │   ├── appController.js        ← home & page handlers
│   │   ├── authController.js       (empty — planned for register, login with JWT)
│   │   ├── userController.js       ← getUsers, addUser (reads/writes users.json)
│   │   ├── productController.js    (empty — planned for product CRUD)
│   │   ├── orderController.js      (empty — planned for place & manage orders)
│   │   ├── cartController.js       (empty — planned for cart operations)
│   │   ├── inventoryController.js  (empty — planned for stock management)
│   │   └── categoryController.js   (empty — planned for product categories)
│   │
│   ├── models/
│   │   ├── userModel.js            (empty — planned for Sequelize users table)
│   │   ├── productModel.js         (empty — planned for Sequelize products table)
│   │   ├── orderModel.js           (empty — planned for Sequelize orders table)
│   │   ├── orderItemModel.js       (empty — planned for order line items)
│   │   ├── cartModel.js            (empty — planned for Sequelize carts table)
│   │   ├── inventoryModel.js       (empty — planned for stock levels)
│   │   └── categoryModel.js        (empty — planned for product categories)
│   │
│   ├── routes/
│   │   ├── appRoutes.js            ← GET /, GET /login
│   │   ├── authRoutes.js           (empty — planned for POST /auth/register, /auth/login)
│   │   ├── userRoutes.js           ← GET /users, POST /user
│   │   ├── productRoutes.js        (empty — planned for GET|POST|PATCH|DELETE /products)
│   │   ├── orderRoutes.js          (empty — planned for GET|POST /orders)
│   │   ├── cartRoutes.js           (empty — planned for GET|POST|DELETE /cart)
│   │   ├── inventoryRoutes.js      (empty — planned for GET|PATCH /inventory)
│   │   └── categoryRoutes.js       (empty — planned for GET|POST /categories)
│   │
│   ├── services/
│   │   ├── userService.js          (empty — planned for user business logic & DB queries)
│   │   ├── orderService.js         (empty — planned for order processing logic)
│   │   └── inventoryService.js     (empty — planned for stock tracking logic)
│   │
│   ├── middleware/
│   │   └── authMiddleware.js       (empty — planned for JWT token verification)
│   │
│   ├── config/
│   │   └── db.js                   (empty — planned for PostgreSQL connection via Sequelize)
│   │
│   ├── data/
│   │   └── users.json              ← temp local data source (dev only)
│   │
│   └── views/                      ← Handlebars (HBS) server-rendered templates
│       ├── home.hbs                ← home page template
│       └── layouts/
│           └── main.hbs            ← base layout wrapper
│
├── src/app.js                      ← Express setup, middleware, routes
├── .env
├── .gitignore
├── package.json
└── server.js                       ← entry point, starts server
```

---

## 📂 Layers

| Layer | Responsibility |
|-------|---------------|
| `routes/` | Maps HTTP endpoints to controllers |
| `controllers/` | Handles request/response, calls services |
| `services/` | Business logic, DB queries via models |
| `models/` | Sequelize table definitions |
| `middleware/` | JWT verification, error handling |
| `views/` | HBS templates for server-rendered pages |
| `config/` | DB connection and environment setup |

---

## 📌 API Endpoints

### Auth (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login, receive JWT |

### Users (protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get a user |
| PATCH | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

### Products (protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |
| POST | `/products` | Create a product |
| PATCH | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

### Orders (protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | List orders |
| POST | `/orders` | Place an order |
| GET | `/orders/:id` | Order detail |

### Inventory (protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inventory` | View stock levels |
| PATCH | `/inventory/:productId` | Update stock |
| GET | `/inventory/low-stock` | Items below threshold |

---

## 🔑 Environment Variables

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nexuscore
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

---

## 🚀 Dependencies

```bash
npm install express dotenv
npm install sequelize pg pg-hstore
npm install bcryptjs jsonwebtoken
npm install express-handlebars
npm install -D nodemon
```

---

## ✅ Implementation Order

1. `config/db.js` — PostgreSQL connection
2. `models/userModel.js` — User table
3. `authController.js` + `authRoutes.js` — register/login
4. `authMiddleware.js` — protect routes
5. `models/productModel.js` + `categoryModel.js` — product catalog
6. `inventoryController.js` — stock management
7. `orderController.js` + `cartController.js` — e-commerce flow
