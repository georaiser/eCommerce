# User Management API

A RESTful User Management API built with **Node.js** and **Express**.

---

## 📁 Project Structure

```
user-management-api/
│
├── src/
│   ├── controllers/
│   │   ├── userController.js
│   │   └── authController.js
│   │
│   ├── models/
│   │   └── userModel.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── authRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── services/
│   │   └── userService.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   └── app.js
│
├── package.json
└── server.js
```

---

## 📂 Files & Their Purpose

### Root

| File | Purpose |
|------|---------|
| `server.js` | Entry point — starts the HTTP server and connects to the database |
| `package.json` | Project metadata, scripts and dependencies |

---

### `src/`

| File | Purpose |
|------|---------|
| `app.js` | Creates the Express app, registers middlewares and mounts all routes |

---

### `src/config/`

| File | Purpose |
|------|---------|
| `db.js` | PostgreSQL connection setup using **Sequelize** (defines the `sequelize` instance) |

---

### `src/models/`

| File | Purpose |
|------|---------|
| `userModel.js` | Sequelize model — defines the `users` table with fields `name`, `email`, `password`, `role` |

---

### `src/services/`

| File | Purpose |
|------|---------|
| `userService.js` | Business logic for users — queries the DB and returns processed data |

---

### `src/controllers/`
Receive HTTP requests, call the service, and send the response.

| File | Purpose |
|------|---------|
| `userController.js` | Handles `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id` |
| `authController.js` | Handles `POST /auth/register` and `POST /auth/login` |

---

### `src/routes/`
Map URL endpoints to their controller functions.

| File | Purpose |
|------|---------|
| `userRoutes.js` | Defines user-related routes, applies `authMiddleware` to protected endpoints |
| `authRoutes.js` | Defines public auth routes (register, login) |

---

### `src/middleware/`

| File | Purpose |
|------|---------|
| `authMiddleware.js` | Verifies the JWT token on protected routes before reaching the controller |

---

## 🔑 Environment Variables

Create a `.env` file in the root:

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
# Core
npm install express dotenv

# Database
npm install sequelize pg pg-hstore

# Auth
npm install bcryptjs jsonwebtoken

# Dev
npm install -D nodemon
```

---

## 📌 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and receive a JWT |
| GET | `/users` | Protected | Get all users |
| GET | `/users/:id` | Protected | Get a single user |
| PATCH | `/users/:id` | Protected | Update a user |
| DELETE | `/users/:id` | Protected | Delete a user |
