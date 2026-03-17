/**
 * products.js — Client-side script for the Products page.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file runs in the BROWSER. It is responsible for collecting form data
 * and sending it to the server via HTTP. It does NOT read or write files directly.
 *
 * HOW IT CONNECTS TO productController.js (SERVER)
 * ──────────────────────────────────────────────────
 *  1. User fills in the form and clicks "Add Product".
 *  2. This script intercepts the submit event and calls fetch() with POST /products.
 *  3. Express routes the request to `addProduct` in productController.js.
 *  4. The controller reads the JSON body (req.body), appends the product to
 *     products.json, and responds with a success message.
 *  5. On success, this script reloads the page so the updated table is rendered
 *     fresh via `getProducts` (also in productController.js).
 *
 * SEPARATION OF CONCERNS
 * ───────────────────────
 *  • Browser (this file) : collects input, sends HTTP request, handles UI feedback.
 *  • Server (controller) : validates, persists data, sends HTTP response.
 *  They communicate only through the HTTP request/response cycle.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('product-form');

  form.addEventListener('submit', async (event) => {
    // Prevent the browser from doing a native form POST (wrong encoding)
    event.preventDefault();

    // Build the product object from the form inputs
    const product = {
      name: document.getElementById('name').value.trim(),
      category: document.getElementById('category').value.trim(),
      price: parseFloat(document.getElementById('price').value),
    };

    try {
      // Send JSON to POST /products — handled by addProduct in productController.js
      const response = await fetch('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        form.reset();
        // Reload so the HBS template re-renders the updated product list
        window.location.reload();
      } else {
        alert('Failed to add product. Please try again.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred. Check the console for details.');
    }
  });
});
