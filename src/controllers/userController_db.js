/**
 * User Controller (Database Version)
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file runs on the SERVER (Node.js/Express).
 * It sits between the routes and the data layer (database).
 * It receives requests for user data, processes them, and sends a response.
 * It interacts with a database through the userModel.js (see models/userModel.js).
 */

import { getAllUsers, createUser, deleteUser, updateUser, getUserById } from '../models/userModel.js';

const getUsersDB = async (req, res) => {
    try {
        const users = await getAllUsers(); // Calls the model!
        res.render('users', { pageName: 'Users', users });
    } catch (error) {
        res.status(500).send("Database error");
    }
};

const addUserDB = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        await createUser(name, email, password, role); // Calls the model!
        res.send(`User ${name} added successfully!`);
    } catch (error) {
        res.status(500).send("Error saving user");
    }
};

const deleteUserDB = async (req, res) => {
    try {
        //const { id } = req.body;
        const id = req.params.id;
        await deleteUser(id); // Calls the model!
        res.send(`User ${id} deleted successfully!`);
    } catch (error) {
        res.status(500).send("Error deleting user");
    }
};

const updateUserDB = async (req, res) => {
    try {
        const { id, name, email, password, role } = req.body;
        await updateUser(id, name, email, password, role); // Calls the model!
        res.send(`User ${name} updated successfully!`);
    } catch (error) {
        res.status(500).send("Error updating user");
    }
};

const getUserByIdDB = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await getUserById(id); // Calls the model!
        res.render('users', { pageName: 'Users', users: [user] });
    } catch (error) {
        res.status(500).send("Error getting user");
    }
};


export { getUsersDB, addUserDB, deleteUserDB, updateUserDB, getUserByIdDB };
