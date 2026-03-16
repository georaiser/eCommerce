# User Management API

A RESTful User Management API built with **Node.js**, **Express**, and **ES6** (import/export).

> Currently using a local `users.json` file as data source. PostgreSQL + Sequelize integration is planned.

---

## 📁 Project Structure

```
user-management-api/
│
├── src/
│   ├── controllers/
│   │   ├── appController.js      ← home & login page handlers
│   │   ├── userController.js     ← getUsers, addUser (reads/writes users.json)
│   │   └── authController.js     ← (empty — planned for JWT auth)
│   │
│   ├── routes/
│   │   ├── appRoutes.js          ← GET /, GET /login
│   │   ├── userRoutes.js         ← GET /users, POST /user
│   │   └── authRoutes.js         ← (empty — planned for auth endpoints)
│   │
│   ├── models/
│   │   └── userModel.js          ← (empty — planned for Sequelize model)
│   │
│   ├── services/
│   │   └── userService.js        ← (empty — planned for DB business logic)
│   │
│   ├── middleware/
│   │   └── authMiddleware.js     ← (empty — planned for JWT verification)
│   │
│   ├── config/
│   │   └── db.js                 ← (empty — planned for PostgreSQL connection)
│   │
│   ├── data/
│   │   └── users.json            ← local data source (temporary, dev only)
│   │
│   └── app.js                    ← Express setup, middleware, routes
│
├── .env
├── .gitignore
├── package.json
└── server.js                     ← entry point, starts the server
```

---

## 📂 Files & Their Purpose

### Root

| File | Purpose |
|------|---------|
| `server.js` | Imports `app`, reads `PORT` from env, starts the HTTP server |
| `package.json` | Scripts (`dev`, `start`) and dependencies. Has `"type": "module"` for ES6 |
| `.env` | Local environment variables (never commit) |
| `.gitignore` | Excludes `node_modules`, `.env` from git |

---

### `src/app.js`
Creates and configures the Express app. Registers middleware and mounts all routes. Exports `app` — never calls `listen` here.

---

### `src/controllers/`

| File | Exports | Purpose |
|------|---------|---------|
| `appController.js` | `home`, `login` | Basic page response handlers |
| `userController.js` | `getUsers`, `addUser` | Reads/writes `users.json` (temporary, until DB is wired) |
| `authController.js` | — | Planned: register, login with JWT |

---

### `src/routes/`

| File | Endpoints | Purpose |
|------|-----------|---------|
| `appRoutes.js` | `GET /`, `GET /login` | General app pages |
| `userRoutes.js` | `GET /users`, `POST /user` | User CRUD |
| `authRoutes.js` | — | Planned: `POST /auth/register`, `POST /auth/login` |

---

### `src/data/`

| File | Purpose |
|------|---------|
| `users.json` | Temporary local data store used by `userController.js` while DB is not yet connected |

---

### Planned (empty files)

| File | Plan |
|------|------|
| `config/db.js` | PostgreSQL connection via Sequelize |
| `models/userModel.js` | Sequelize `User` model |
| `services/userService.js` | DB queries and business logic |
| `middleware/authMiddleware.js` | JWT token verification |

---

## 🔑 Environment Variables

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=usermanagement
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

---

## 🚀 Dependencies

```bash
npm install express dotenv        # core
npm install sequelize pg pg-hstore # database (postgres)
npm install bcryptjs jsonwebtoken  # auth
npm install -D nodemon             # dev
```

---

## 📌 Current API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Home page |
| GET | `/login` | Login page |
| GET | `/users` | Get all users (from `users.json`) |
| POST | `/user` | Add a new user (to `users.json`) |
