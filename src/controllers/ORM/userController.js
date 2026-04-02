import { sequelize, User } from '../../models/ORM/index.js';

// GET /users
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ raw: true, order: [['id', 'ASC']] });

        // Format dates correctly for Handlebars
        users.forEach(user => {
            user.created_at = new Date(user.created_at).toLocaleString();
        });

        res.render("users_page", { pageName: "Users", users });
    } catch (error) {
        res.status(500).send(`Error getting users: ${error}`);
    }
};

// POST /users
const addUser = async (req, res) => {
  try {
    const { name, email, password, role, credit } = req.body;
    // Fallback to 0.0 if the administrator leaves the credit input completely blank!
    await User.create({ name, email, password, role, credit: credit || 0.0 });
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
    const { id } = req.params; 
    
    // Cleanly extract ONLY the provided fields bypassing blank inputs
    const updates = {};
    for (const key in req.body) {
        if (req.body[key] !== undefined && req.body[key] !== '') {
            updates[key] = req.body[key];
        }
    }

    // Perform a raw DB update directly. Returns array: [affectedCount]
    const [updatedRows] = await User.update(updates, { 
        where: { id }, 
        individualHooks: true // Forces Sequelize to mathematically encrypt the password!
    });

    if (updatedRows === 0) throw new Error("User not found");

    res.send(`User ${id} updated successfully!`);
  } catch (error) {
    res.status(500).send(`Error updating user: ${error.message}`);
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { raw: true }); // Calls the ORM model!
    if (user) user.created_at = new Date(user.created_at).toLocaleString();
    
    res.render("users_page", { pageName: "Users", users: [user] });
  } catch (error) {
    res.status(500).send(`Error getting user: ${error}`);
  }
};
export { getUsers, addUser, deleteUser, updateUser, getUserById };