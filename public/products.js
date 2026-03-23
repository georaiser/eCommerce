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
 *  4. The controller reads the data from the body (req.body), appends the product to
 *     database, and responds with a success message.
 *  5. On success, this script reloads the page so the updated table is rendered
 *     fresh via `getProducts` (also in productController.js).
 *
 * SEPARATION OF CONCERNS
 * ───────────────────────
 *  • Browser (this file) : collects input, sends HTTP request, handles UI feedback.
 *  • Server (controller) : validates, persists data, sends HTTP response.
 *  They communicate only through the HTTP request/response cycle.
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("product-form");

  form.addEventListener("submit", async (event) => {
    // Prevent the browser from doing a native form POST (wrong encoding)
    event.preventDefault();

    // Build the product object from the form inputs    <------
    const product = {
      name: document.getElementById("name").value.trim(),
      category: document.getElementById("category").value.trim(),
      price: parseFloat(document.getElementById("price").value),
      stock: parseInt(document.getElementById("stock").value),
      isActive: true,
    };

    // Client-side Validation: Check if any field is empty or invalid
    if (
      !product.name ||
      !product.category ||
      isNaN(product.price) ||
      isNaN(product.stock)
    ) {
      alert(
        "Please fill in all fields (Name, Category, valid Price and Stock) before submitting.",
      );
      return; // Stop execution here
    }

    try {
      // Send JSON to POST /products — handled by addProduct in productController.js
      const response = await fetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        form.reset();
        // Reload so the HBS template re-renders the updated product list
        window.location.reload();
      } else {
        alert("Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred. Check the console for details.");
    }
  });

  // Add event listeners for delete buttons
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-delete")) {
      // Read the ID from data-id "{{this.id}}"
      const productId = event.target.getAttribute("data-id");

      // Ask for confirmation before deleting
      if (!confirm("Are you sure you want to delete this product?")) return;
      try {
        // Make a DELETE HTTP request to /user/:id
        const response = await fetch(`/product/${productId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          //window.location.reload(); // Refresh to see the updated table
          event.target.closest("tr").remove();
        } else {
          alert("Failed to delete product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred.");
      }
    }
  });

  // Add event listeners for edit buttons
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-edit")) {
      // Read the ID from data-id "{{this.id}}"
      const productId = event.target.getAttribute("data-id");

      // Ask for confirmation before editing
      if (!confirm("Are you sure you want to edit this product?")) return;
        try {
        // Make a PUT HTTP request to /product/:id
        const response = await fetch(`/product/${productId}`, {
          method: "PUT",
        });
        if (response.ok) {
          //window.location.reload(); // Refresh to see the updated table
          event.target.closest("tr").remove();
        } else {
          alert("Failed to edit product.");
        }
      } catch (error) {
        console.error("Error editing product:", error);
        alert("An error occurred.");
      }
    }
  });
});
