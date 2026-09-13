// Cart functionality

// Get cart from localStorage
const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Save cart to localStorage
const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
};

// Update cart count in navigation
const updateCartCount = () => {
  const cart = getCart();
  const cartCount = document.getElementById("navCartCount");
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
};

// Add item to cart
const addToCart = (product) => {
  let cart = getCart();

  // Check if product already in cart
  const existingItem = cart.find((item) => item._id === product._id);

  if (existingItem) {
    // Check stock
    if (existingItem.quantity + (product.quantity || 1) > product.stock) {
      Auth.showToast("Cannot add more than available stock", "error");
      return;
    }
    existingItem.quantity += product.quantity || 1;
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: product.quantity || 1,
    });
  }

  saveCart(cart);
  Auth.showToast(`${product.name} added to cart!`, "success");
};

// Remove item from cart
const removeFromCart = (productId) => {
  let cart = getCart();
  cart = cart.filter((item) => item._id !== productId);
  saveCart(cart);
  Auth.showToast("Item removed from cart", "success");
  renderCart();
};

// Update item quantity
const updateCartQuantity = (productId, change) => {
  let cart = getCart();
  const item = cart.find((item) => item._id === productId);

  if (item) {
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > item.stock) {
      Auth.showToast("Cannot exceed available stock", "error");
      return;
    }

    item.quantity = newQuantity;
    saveCart(cart);
    renderCart();
  }
};

// Calculate cart totals
const getCartTotals = () => {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Can add tax/shipping here
  return { cart, subtotal, total };
};

// Render cart page
const renderCart = () => {
  const container = document.getElementById("cartContent");
  if (!container) return;

  const { cart, subtotal, total } = getCartTotals();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">&#128722;</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <a href="products.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="cart-items">
      ${cart
        .map(
          (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          </div>
          <div class="cart-item-quantity">
            <button onclick="updateCartQuantity('${item._id}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartQuantity('${item._id}', 1)">+</button>
          </div>
          <div class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</div>
          <button class="cart-item-remove" onclick="removeFromCart('${item._id}')" title="Remove item">&times;</button>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="cart-summary">
      <div class="cart-total">Total: $${total.toFixed(2)}</div>
      <div class="cart-actions">
        <a href="products.html" class="btn btn-secondary">Continue Shopping</a>
        <a href="checkout.html" class="btn btn-primary">Proceed to Checkout</a>
      </div>
    </div>
  `;
};

// Initialize cart page
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  // Check if we're on cart page
  if (document.getElementById("cartContent")) {
    renderCart();
  }
});

// Export for use in other files
window.Cart = {
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCartTotals,
  renderCart,
  updateCartCount,
};
