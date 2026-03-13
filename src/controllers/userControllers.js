import fs from 'fs';

const login = (req, res) => {
    res.send('Login page');
};

const home = (req, res) => {
    res.send('Welcome to the User Management API');
};

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
    //res.send(users.users);
};

export { login, home, getUsers, addUser };