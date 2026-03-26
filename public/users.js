/**
 * users.js — Client-side script for the users page.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file runs in the BROWSER. It is responsible for collecting form data
 * and sending it to the server via HTTP. It does NOT read or write files directly.
 *
 * HOW IT CONNECTS TO userController.js (SERVER)
 * ──────────────────────────────────────────────────
 *  1. User fills in the form and clicks "Add User".
 *  2. This script intercepts the submit event and calls fetch() with POST /users.
 *  3. Express routes the request to `addUser` in userController.js.
 *  4. The controller reads the data from the body (req.body), appends the user to
 *     database, and responds with a success message.
 *  5. On success, this script reloads the page so the updated table is rendered
 *     fresh via `getusers` (also in userController.js).
 *
 * SEPARATION OF CONCERNS
 * ───────────────────────
 *  • Browser (this file) : collects input, sends HTTP request, handles UI feedback.
 *  • Server (controller) : validates, persists data, sends HTTP response.
 *  They communicate only through the HTTP request/response cycle.
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("user-form");

  form.addEventListener("submit", async (event) => {
    // Prevent the browser from doing a native form POST
    event.preventDefault();

    // Build the user object from the form inputs
    const user = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      role: document.getElementById("role").value.trim(),
      password: document.getElementById("password").value.trim(),
      credit: document.getElementById("credit").value.trim() || 0,
      createdAt: new Date().toISOString(),
    };

    // Client-side Validation
    if (!user.name || !user.email || !user.role || !user.password) {
      alert(
        "Please fill in all fields (Name, Email, and Role) before submitting.",
      );
      return;
    }

    try {
      // Send JSON to POST /user  (mapped to addUser in userController)
      const response = await fetch("/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        form.reset();
        // Reload so the HBS template re-renders the updated users list
        window.location.reload();
      } else {
        alert(await response.text());
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred. Check the console for details.");
    }
  });

  // Add event listeners for delete buttons
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-delete")) {
      // Read the ID from data-id "{{this.id}}"
      const userId = event.target.getAttribute("data-id");

      // Ask for confirmation before deleting
      if (!confirm("Are you sure you want to delete this user?")) return;
      try {
        // Make a DELETE HTTP request to /user/:id
        const response = await fetch(`/user/${userId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          window.location.reload(); // Refresh to see the updated table
        } else {
          alert(await response.text());
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("An error occurred.");
      }
    }
  });

  // Add event listeners for edit buttons
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-edit")) {
      const userId = event.target.getAttribute("data-id");

      // Get the current row to find existing data
      const row = event.target.closest("tr");
      const currentName = row.children[0].innerText;
      const currentEmail = row.children[1].innerText;
      const currentRole = row.children[2].innerText;
      const currentCreditStr = row.children[3].innerText.replace('$', '');

      // Ask the user for the new data (Simple implementation)
      const newName = prompt("Enter new name:", currentName);
      if (newName === null) return; // User clicked Cancel

      const newEmail = prompt("Enter new email:", currentEmail);
      if (newEmail === null) return;

      const newRole = prompt("Enter new role:", currentRole);
      if (newRole === null) return;
      
      const newCredit = prompt("Enter new credit amount:", currentCreditStr);
      if (newCredit === null) return;

      const newPassword = prompt(
        "Enter new password (leave blank to keep current):",
        "",
      );
      if (newPassword === null) return;

      // Build the payload
      const updatedUser = {
        name: newName.trim(),
        email: newEmail.trim(),
        role: newRole.trim(),
        credit: newCredit.trim(),
        password: newPassword.trim(),
      };

      try {
        // Send PUT request WITH the body payload
        const response = await fetch(`/user/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
          // Reload to see the fresh data
          window.location.reload();
        } else {
          alert(await response.text());
        }
      } catch (error) {
        console.error("Error editing user:", error);
        alert("An error occurred.");
      }
    }
  });
});
