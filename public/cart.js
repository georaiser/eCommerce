document.addEventListener("DOMContentLoaded", () => {

  // ADD ITEM TO CART (From Product List)
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-add-cart")) {
      const productId = event.target.getAttribute("data-id");
      const row = event.target.closest("tr");
      const quantity = row.querySelector(".amount-input").value;

      if (!quantity || quantity <= 0) return alert("Enter a valid quantity!");

      // TODO: Use fetch() to POST /cart with { productId, quantity }
      console.log(`Add product ${productId} with quantity ${quantity} to cart!`);
    }
  });

  // UPDATE ITEM QUANTITY (Inside Cart)
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-update-cart")) {
      const cartItemId = event.target.getAttribute("data-id");
      
      const newQuantity = prompt("Enter new quantity:");
      if (newQuantity === null || newQuantity <= 0) return;

      // TODO: Use fetch() to PUT /cart/:id with { quantity: newQuantity }
      console.log(`Update cart item ${cartItemId} to quantity ${newQuantity}!`);
    }
  });

  // REMOVE ITEM FROM CART (Inside Cart)
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-remove-cart")) {
      const cartItemId = event.target.getAttribute("data-id");

      if (!confirm("Remove this item from your cart?")) return;

      // TODO: Use fetch() to DELETE /cart/:id
      console.log(`Remove cart item ${cartItemId}!`);
    }
  });

});
