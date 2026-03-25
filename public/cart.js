// send POST request to /cart with { productId, quantity }

document.addEventListener("DOMContentLoaded", () => {

  // ADD ITEM TO CART (From Product List)
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-add-cart")) {
      const productId = event.target.getAttribute("data-id");
      const row = event.target.closest("tr");
      const quantity = row.querySelector(".amount-input").value;

      if (!quantity || quantity <= 0) return alert("Enter a valid quantity!");

      // Use fetch() to POST /cart with { productId, quantity }
      const response = await fetch("/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        console.log(`Add product ${productId} with quantity ${quantity} to cart!`);
        window.location.reload();
      } else {
        alert("Failed to add product to cart.");
      }
    }
  });

  // UPDATE ITEM QUANTITY (Inside Cart)
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-update-cart")) {
      const cartItemId = event.target.getAttribute("data-id");
      
      const newQuantity = prompt("Enter new quantity:");
      if (newQuantity === null || newQuantity <= 0) return;

      // Use fetch() to PUT /cart/:id with { quantity: newQuantity }
      const response = await fetch(`/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        console.log(`Update cart item ${cartItemId} to quantity ${newQuantity}!`);
        window.location.reload();
      } else {
        alert("Failed to update cart item.");
      }
    }
  });

  // REMOVE ITEM FROM CART (Inside Cart)
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-remove-cart")) {
      const cartItemId = event.target.getAttribute("data-id");

      if (!confirm("Remove this item from your cart?")) return;

      // Use fetch() to DELETE /cart/:id
      const response = await fetch(`/cart/${cartItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log(`Remove cart item ${cartItemId}!`);
        window.location.reload();
      } else {
        alert("Failed to remove cart item.");
      }
    }
  });

});
