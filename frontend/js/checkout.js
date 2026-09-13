// Checkout page functionality

// Render checkout page
const renderCheckout = () => {
  const container = document.getElementById("checkoutContent");
  if (!container) return;

  // Check if user is logged in
  if (!Auth.isLoggedIn()) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#128274;</div>
        <h3>Please login to checkout</h3>
        <p>You need to be logged in to complete your purchase.</p>
        <a href="login.html" class="btn btn-primary">Login</a>
      </div>
    `;
    return;
  }

  const { cart, subtotal, total } = Cart.getCartTotals();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#128722;</div>
        <h3>Your cart is empty</h3>
        <p>Add some products before checking out.</p>
        <a href="products.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }

  const user = Auth.getCurrentUser();

  container.innerHTML = `
    <div class="checkout-content">
      <div class="checkout-form">
        <h3>Shipping Information</h3>
        <form id="checkoutForm">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" value="${user ? user.name : ""}" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" value="${user ? user.email : ""}" required>
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" required placeholder="Enter your phone number">
          </div>
          <div class="form-group">
            <label for="street">Street Address</label>
            <input type="text" id="street" required placeholder="Enter your street address">
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" required placeholder="Enter your city">
          </div>
          <div class="form-group">
            <label for="state">State</label>
            <input type="text" id="state" required placeholder="Enter your state">
          </div>
          <div class="form-group">
            <label for="zipCode">ZIP Code</label>
            <input type="text" id="zipCode" required placeholder="Enter your ZIP code">
          </div>
          <div class="form-group">
            <label for="country">Country</label>
            <input type="text" id="country" required placeholder="Enter your country">
          </div>
          <div class="form-group">
            <label for="paymentMethod">Payment Method</label>
            <select id="paymentMethod" required>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Demo Payment">Demo Payment</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Place Order</button>
        </form>
      </div>
      <div class="checkout-summary">
        <h3>Order Summary</h3>
        <div class="checkout-summary-items">
          ${cart
            .map(
              (item) => `
            <div class="checkout-item">
              <div>
                <div>${item.name}</div>
                <div style="font-size: 0.875rem; color: var(--gray-500);">Qty: ${item.quantity} x $${item.price.toFixed(2)}</div>
              </div>
              <div>$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="checkout-total">
          <span>Total:</span>
          <span>$${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;

  // Setup form submission
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckout);
  }
};

// Handle checkout form submission
const handleCheckout = async (e) => {
  e.preventDefault();

  if (!Auth.isLoggedIn()) {
    Auth.showToast("Please login to checkout", "error");
    window.location.href = "login.html";
    return;
  }

  const { cart } = Cart.getCartTotals();

  if (cart.length === 0) {
    Auth.showToast("Your cart is empty", "error");
    return;
  }

  const shippingAddress = {
    street: document.getElementById("street").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    zipCode: document.getElementById("zipCode").value,
    country: document.getElementById("country").value,
  };

  const phone = document.getElementById("phone").value;
  const paymentMethod = document.getElementById("paymentMethod").value;

  try {
    const order = await API.orders.create({
      cartItems: cart,
      shippingAddress,
      phone,
      paymentMethod,
    });

    // Clear cart
    localStorage.removeItem("cart");
    Cart.updateCartCount();

    // Redirect to order success page
    window.location.href = `order-success.html?orderId=${order._id}`;
  } catch (error) {
    Auth.showToast(error.message, "error");
  }
};

// Initialize checkout page
document.addEventListener("DOMContentLoaded", renderCheckout);
