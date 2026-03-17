import fs from 'fs';

const getUsers = (req, res) => {
    const users = JSON.parse(fs.readFileSync("./src/data/users.json", 'utf8'));
    res.render('users', { pageName: 'Users', users: users.users });

};

const addUser = (req, res) => {
    const user = req.body;
    const users = JSON.parse(fs.readFileSync("./src/data/users.json", 'utf8'));
    users.users.push(user);
    fs.writeFileSync("./src/data/users.json", JSON.stringify(users));
    res.send(`User ${user.name} added successfully!`);
};

const deleteUser = (req, res) => {
    const { id } = req.params;
  
};

const updateUser = (req, res) => {
    const { id } = req.params;
    const user = req.body;

};

export { getUsers, addUser, deleteUser, updateUser };