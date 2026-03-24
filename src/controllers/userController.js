/**
 * User Controller (Database Version)
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file runs on the SERVER (Node.js/Express).
 * It sits between the routes and the data layer (database).
 * It receives requests for user data, processes them, and sends a response.
 * It interacts with a database through the userModel.js (see models/userModel.js).
 * 
 * REQUEST CYCLE
 * ──────────────
 *  HTTP request
 *    → userRoutes.js      (maps the URL + method to the right handler)
 *    → userController.js  (reads req, processes data, sends res)
 *    → users.json         (temporary file-based data store, replaces a DB for now)
 */

import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
} from "../models/userModel.js";

// GET /users
const getUsersDB = async (req, res) => {
  try {
    const users = await getAllUsers(); // Calls the model!
    res.render("users_page", { pageName: "Users", users });
  } catch (error) {
    res.status(500).send("Database error");
  }
};

// POST /users
const addUserDB = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    await createUser(name, email, password, role); // Calls the model!
    res.send(`User ${name} added successfully!`);
  } catch (error) {
    res.status(500).send("Error saving user");
  }
};

// DELETE /users/:id
const deleteUserDB = async (req, res) => {
  try {
    const { id } = req.params; // ID comes from the URL (req.params), not the body
    await deleteUser(id); // Calls the model!
    res.send(`User ${id} deleted successfully!`);
  } catch (error) {
    res.status(500).send("Error deleting user");
  }
};

// PUT /users/:id
const updateUserDB = async (req, res) => {
  try {
    const { id } = req.params; // ID comes from the URL
    const { name, email, password, role } = req.body; // Data comes from the body
    await updateUser(id, name, email, password, role); // Calls the model!
    res.send(`User ${name} updated successfully!`);
  } catch (error) {
    res.status(500).send("Error updating user", error);
  }
};

// GET /users/:id
const getUserByIdDB = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id); // Calls the model!
    res.render("users_page", { pageName: "Users", users: [user] });
  } catch (error) {
    res.status(500).send("Error getting user");
  }
};

export { getUsersDB, addUserDB, deleteUserDB, updateUserDB, getUserByIdDB };
