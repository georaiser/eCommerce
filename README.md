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
│   │   ├── authController.js       ← login, register, logout handlers
│   │   ├── userController.js       ← getUsers, addUser (reads/writes users.json)
│   │   └── productController.js    ← getProducts, addProduct (reads/writes products.json)
│   │
│   ├── routes/
│   │   ├── appRoutes.js            ← GET /, GET /login
│   │   ├── authRoutes.js           ← POST /auth/register, /auth/login
│   │   ├── userRoutes.js           ← GET /users, POST /user
│   │   └── productRoutes.js        ← GET /products, POST /products
│   │
│   │
│   ├── config/
│   │   └── db.js                   (empty — planned for PostgreSQL connection via Sequelize)
│   │
│   ├── data/
│   │   ├── users.json              ← temp local data source (dev only)
│   │   └── products.json           ← temp local data source (dev only)
│   │
│   └── views/                      ← Handlebars (HBS) server-rendered templates
│       ├── home.hbs                ← home page template
│       ├── products.hbs            ← products list + add-product form
│       └── layouts/
│           └── main.hbs            ← base layout wrapper
│
├── public/                         ← static files served by Express
│   ├── css/                        ← stylesheets
│   └── products.js                 ← client-side JS for the products form
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

## 🔄 Client–Server Flow (Users)

Similar to the products flow, user forms are handled by client-side JS:

```
Browser (e.g. users.js)                 Server (userController.js)
──────────────────────                  ──────────────────────────────
User submits form          ──POST──►    addUser(req, res)
fetch('/user', {JSON})                  reads req.body
                                        appends to users.json
                           ◄────────    res.send('User X added!')
response.ok → reload page  
                           ──GET───►    getUsers(req, res)
                                        reads users.json
                           ◄────────    res.render('users', { users })
Updated table displayed
```

---

## 🔄 Client–Server Flow (Products)


The product form in `products.hbs` is wired by `public/products.js`:

```
Browser (products.js)                   Server (productController.js)
──────────────────────                  ──────────────────────────────
User submits form          ──POST──►    addProduct(req, res)
fetch('/products', {JSON})              reads req.body
                                        appends to products.json
                           ◄────────    res.send('Product X added!')
response.ok → reload page  
                           ──GET───►    getProducts(req, res)
                                        reads products.json
                           ◄────────    res.render('products', { products })
Updated table displayed
```

> `public/products.js` runs in the **browser** and only communicates via HTTP.
> `productController.js` runs on the **server** and has exclusive access to the file system.

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

```
