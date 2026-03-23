/**
 * appController.js — Server-side handlers for product operations.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file runs on the SERVER (Node.js/Express). It handles requests that
 * don't belong to a specific resource (like products or users), such as the
 * homepage or static pages.
 */

// Renders the homepage.
const home = (req, res) => {
    res.render('home', { pageName: 'Home' });
};

// TODO: about page
// TODO: contact page
// TODO: 

export { home };