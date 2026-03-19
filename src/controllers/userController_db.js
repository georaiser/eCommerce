import { getAllUsers, createUser } from '../models/userModel.js';

const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers(); // Calls the model!
        res.render('users', { pageName: 'Users', users });
    } catch (error) {
        res.status(500).send("Database error");
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        await createUser(name, email, password, role); // Calls the model!
        res.send(`User ${name} added successfully!`);
    } catch (error) {
        res.status(500).send("Error saving user");
    }
};

export { getUsers, addUser };
