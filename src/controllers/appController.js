const login = (req, res) => {
    res.send('Login page');
};

const home = (req, res) => {
    res.render('home', { pageName: 'home' });
};

export { login, home };