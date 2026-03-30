import { sequelize, User } from '../../models/ORM/index.js';

// GET /users
const getUsers = async (req, res) => {
    try {
        const usersRaw = await User.findAll({ order: [['id', 'ASC']] });

        const users = usersRaw.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            credit: user.credit,
            created_at: new Date(user.created_at).toLocaleString(),
        }));

        res.render("users_page", { pageName: "Users", users });
    } catch (error) {
        res.status(500).send(`Error getting users: ${error}`);
    }
};

// POST /users
const addUser = async (req, res) => {
  try {
    const { name, email, password, role, credit } = req.body;
    //credit = credit? credit : 0.0; credit value always is required in body
    await User.create({ name, email, password, role, credit});
    res.send(`User ${name} added successfully!`);
  } catch (error) {
    res.status(500).send(`Error saving user: ${error}`);
  }
};

// DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // ID comes from the URL (req.params), not the body
    await User.destroy({ where: { id: id }})
    res.send(`User ${id} deleted successfully!`);
  } catch (error) {
    res.status(500).send(`Error deleting user: ${error}`);
  }
};

// PUT /users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // ID comes from the URL
    let { name, email, password, role, credit } = req.body; // Data comes from the body

    // Fetch the existing user first to protect blank fields like password
    const existingUser = await User.findByPk(id); // Calls the model ORM!

    name = name || existingUser.name;
    email = email || existingUser.email;
    password = password || existingUser.password;
    role = role || existingUser.role;
    credit = credit || existingUser.credit;

    // Save changes using Sequelize ORM syntax!
    await existingUser.update({ name, email, password, role, credit });
    res.send(`User ${name} updated successfully!`);
  } catch (error) {
    res.status(500).send(`Error updating user: ${error}`);
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id); // Calls the ORM model!
    res.render("users_page", { pageName: "Users", users: [user] });
  } catch (error) {
    res.status(500).send(`Error getting user: ${error}`);
  }
};
export { getUsers, addUser, deleteUser, updateUser, getUserById };