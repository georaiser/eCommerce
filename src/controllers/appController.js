const home = (req, res) => {
    res.render('home', { pageName: 'Home' });
};

export { home };