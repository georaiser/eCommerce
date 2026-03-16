const login = (req, res) => {
    res.render('login', { pageName: 'Login', layout: 'auth' });
};

const home = (req, res) => {
    res.render('home', { pageName: 'Home' });
};

export { login, home };