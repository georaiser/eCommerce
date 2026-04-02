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
import { getUsersDB, addUserDB, updateUserDB, deleteUserDB, getUserByIdDB } from '../../controllers/SQL/userController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

// CRUD operations with db postgresql (Secured for Admins exclusively)
router.get('/users', requireAuth, requireAdmin, getUsersDB);
router.post('/user', requireAuth, requireAdmin, addUserDB);
router.put('/user/:id', requireAuth, requireAdmin, updateUserDB);
router.delete('/user/:id', requireAuth, requireAdmin, deleteUserDB);
router.get('/user/:id', requireAuth, requireAdmin, getUserByIdDB);

export default router;