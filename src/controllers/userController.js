import fs from 'fs';

const getUsers = (req, res) => {
    const users = JSON.parse(fs.readFileSync("./src/data/users.json", 'utf8'));
    res.json(users.users);
};

const addUser = (req, res) => {
    const user = req.body;
    const users = JSON.parse(fs.readFileSync("./src/data/users.json", 'utf8'));
    users.users.push(user);
    fs.writeFileSync("./src/data/users.json", JSON.stringify(users));
    res.send(`User ${user.name} added successfully!`);
};

export { getUsers, addUser };