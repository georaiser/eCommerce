const login = (req, res) => {
    res.send('Login page');
};

const home = (req, res) => {
    res.send('Welcome to the User Management API');
};

export { login, home };