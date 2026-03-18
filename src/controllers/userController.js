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
    //const users_filter = users.users.filter(user => user.id == 3);
    res.render('users', { pageName: 'Users', users: users });
};

/**
 * POST /user
 * Reads req.body (JSON payload), appends the new user to the file, and responds.
 */
const addUser = (req, res) => {
    const user = req.body;  
    //Add a unique ID to the user
    user.id =  Date.now();   
    //Read the JSON file
    const users = JSON.parse(fs.readFileSync("./src/data/users.json", 'utf8')); 
    //Add the new user to the array
    users.push(user); 
    //Write the JSON file
    fs.writeFileSync("./src/data/users.json", JSON.stringify(users));   
    //Send success response
    res.send(`User ${user.name} added successfully!`);                           
};

/**
 * DELETE /user/:id
 * Deletes a user by ID
 */
const deleteUser = (req, res) => {
    //Get the ID from the URL
    const { id } = req.params;
    //Read the JSON file
    const users = JSON.parse(fs.readFileSync("./src/data/users.json", 'utf8'));  
    //Filter out the user with the matching ID
    const users_filter = users.filter(user => user.id != id);
    //Write the JSON file
    fs.writeFileSync("./src/data/users.json", JSON.stringify(users_filter));
    //Send success response
    res.send(`User ${id} deleted successfully!`);
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