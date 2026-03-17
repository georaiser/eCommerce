/**
 * appController.js — Handles top-level application routes.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file runs on the SERVER (Node.js/Express). It handles requests that
 * don't belong to a specific resource (like products or users), such as the
 * homepage or static pages.
 *
 * REQUEST CYCLE
 * ──────────────
 *  HTTP request
 *    → appRoutes.js      (maps the URL + method to the right handler)
 *    → appController.js  (reads req, processes data, sends res)
 *    → products.json       (temporary file-based data store)
 */

/**
 * GET /
 * Renders the homepage.
 * The HBS template receives `pageName` to highlight the active nav link.
 */
const home = (req, res) => {
    res.render('home', { pageName: 'Home' });
};

export { home };