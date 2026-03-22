/**
 * userRoutes.js — Maps user-related HTTP endpoints to controller functions.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file acts as the "Menu" for user operations. It runs on the SERVER (Express).
 * When a request for a user resource comes in, the router checks the Method and URL,
 * then delegates the request to the corresponding function in `userController.js`.
 *
 * The router itself contains NO business logic or file system operations.
 */

import express from 'express';
import { getUsers, addUser, deleteUser, updateUser } from '../controllers/userController.js';
// db users
import { getUsersDB, addUserDB, updateUserDB, deleteUserDB, getUserByIdDB } from '../controllers/userController_db.js';

const router = express.Router();

/**
 * ROUTES (CRUD operations)
 * ──────
 * GET    /users      -> Renders HTML page with a list of all users
 * POST   /user       -> Receives JSON data to create a new user
 * DELETE /user/:id   -> (Planned) Deletes a user by ID
 * PUT    /user/:id   -> (Planned) Updates a user by ID
 */
router.get('/users', getUsers);
router.post('/user', addUser);
router.delete('/user/:id', deleteUser);
router.put('/user/:id', updateUser);


//db users
router.get('/db/users', getUsersDB);
router.post('/db/users', addUserDB);
router.put('/db/users/:id', updateUserDB);
router.delete('/db/users/:id', deleteUserDB);
router.get('/db/users/:id', getUserByIdDB);


export default router;