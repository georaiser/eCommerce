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
import { getUsers, addUser, deleteUser, updateUser } from '../controllers/userController.js';
// db postgresql users
import { getUsersDB, addUserDB, updateUserDB, deleteUserDB, getUserByIdDB } from '../controllers/userController_db.js';

const router = express.Router();

//users CRUD operations with json file
router.get('/users', getUsers);
router.post('/user', addUser);
router.delete('/user/:id', deleteUser);
router.put('/user/:id', updateUser);


//users CRUD operations with db postgresql
router.get('/db/users', getUsersDB);
router.post('/db/users', addUserDB);
router.put('/db/users/:id', updateUserDB);
router.delete('/db/users/:id', deleteUserDB);
router.get('/db/users/:id', getUserByIdDB);


export default router;