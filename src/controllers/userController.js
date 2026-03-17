/**
 * userController.js — Server-side handlers for user operations.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file runs on the SERVER (Node.js/Express). Similar to the product controller,
 * it sits between the routes and the data layer. It receives requests for user
 * data, processes them, and sends a response.
 *
 * REQUEST CYCLE
 * ──────────────
 *  HTTP request
 *    → userRoutes.js         (maps URL to the controller)
 *    → userController.js     (reads/writes data, sends response)
 *    → users.json            (temporary file-based data store)
 */

import fs from 'fs';

/**
 * GET /users
 * Reads all users from the JSON file and renders the users view.
 * The HBS template receives the `users` array to build the UI.
 */
const getUsers = (req, res) => {
    const users = JSON.parse(fs.readFileSync("./src/data/users.json", 'utf8'));
    res.render('users', { pageName: 'Users', users: users.users });
};

/**
 * POST /user
 * Reads req.body (JSON payload), appends the new user to the file, and responds.
 */
const addUser = (req, res) => {
    const user = req.body;                                                       // JSON payload from the client
    const users = JSON.parse(fs.readFileSync("./src/data/users.json", 'utf8'));  // load current list
    users.users.push(user);                                                      // append new user
    fs.writeFileSync("./src/data/users.json", JSON.stringify(users));            // persist to disk
    res.send(`User ${user.name} added successfully!`);                           // send success response
};

/**
 * DELETE /user/:id
 * (Planned functionality for deleting a user)
 */
const deleteUser = (req, res) => {
    const { id } = req.params;
    // TODO: Implement user deletion logic
};

/**
 * PUT /user/:id
 * (Planned functionality for updating a user)
 */
const updateUser = (req, res) => {
    const { id } = req.params;
    const user = req.body;
    // TODO: Implement user update logic
};

export { getUsers, addUser, deleteUser, updateUser };