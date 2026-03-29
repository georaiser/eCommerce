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



export { getUsers };