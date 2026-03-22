import { getAllUsers, createUser, updateUser, deleteUser, getUserById } from '../models/userModel.js';

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

const updateUserDB = async (req, res) => {
    try {
        const { id, name, email, password, role } = req.body;
        await updateUser(id, name, email, password, role); // Calls the model!
        res.send(`User ${name} updated successfully!`);
    } catch (error) {
        res.status(500).send("Error updating user");
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

const getUserByIdDB = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await getUserById(id); // Calls the model!
        res.render('users', { pageName: 'Users', users: [user] });
    } catch (error) {
        res.status(500).send("Error getting user");
    }
};


export { getUsersDB, addUserDB, updateUserDB, deleteUserDB, getUserByIdDB };
