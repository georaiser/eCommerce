const login = (req, res) => {
    res.render('login', { pageName: 'Login', layout: 'auth' });
};

const register = (req, res) => {
    res.send('Register');

};

const logout = (req, res) => {
    res.send('Logout');
};

export { login, register, logout };