/**
 * userController.js — Server-side handlers for user operations.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file runs on the SERVER (Node.js/Express). 
 * it sits between the routes and the data layer. 
 * It receives requests for user data, processes them, and sends a response.
 * It can read/write from a JSON file (as shown here) or interact with a database (see userController_db.js).
*/

import fs from 'fs';

// Reads users from a JSON file and renders the users view
const getUsers = (req, res) => {
    const users = JSON.parse(fs.readFileSync("./src/data/users.json", 'utf8'));
    //const users_filter = users.users.filter(user => user.id == 3);
    res.render('users', { pageName: 'Users', users: users });
};

// Adds a new user to the JSON file and sends a success response
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

// Deletes a user by ID from the JSON file and sends a success response
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

// Updates a user by ID in the JSON file (TODO: Implement logic)
const updateUser = (req, res) => {
    const { id } = req.params;
    const user = req.body;
    // TODO: Implement user update logic
};

export { getUsers, addUser, deleteUser, updateUser };