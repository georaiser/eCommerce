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

// json file users
//import { getUsers, addUser, deleteUser, updateUser } from '../controllers/userController_json.js';

// db postgresql users
import { getUsersDB, addUserDB, updateUserDB, deleteUserDB, getUserByIdDB } from '../controllers/userController.js';

const router = express.Router();

// CRUD operations with json file
// router.get('/users', getUsers);
// router.post('/user', addUser);
// router.delete('/user/:id', deleteUser);
// router.put('/user/:id', updateUser);

// CRUD operations with db postgresql
router.get('/users', getUsersDB);
router.post('/users', addUserDB);
router.put('/user/:id', updateUserDB);
router.delete('/user/:id', deleteUserDB);
router.get('/user/:id', getUserByIdDB);

export default router;