// Orders functionality

// Render orders list
const renderOrders = async () => {
  const container = document.getElementById("ordersContent");
  if (!container) return;

  // Check if user is logged in
  if (!Auth.isLoggedIn()) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#128274;</div>
        <h3>Please login to view orders</h3>
        <p>You need to be logged in to view your orders.</p>
        <a href="login.html" class="btn btn-primary">Login</a>
      </div>
    `;
    return;
  }

  try {
    container.innerHTML = '<div class="loading">Loading orders...</div>';
    const orders = await API.orders.getMyOrders();

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">&#128230;</div>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders yet. Start shopping!</p>
          <a href="products.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
      return;
    }

    container.innerHTML = orders
      .map(
        (order) => `
      <div class="order-card">
        <div class="order-header">
          <span class="order-id">Order #${order._id.slice(-8).toUpperCase()}</span>
          <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
        </div>
        <div class="order-items">
          ${order.orderItems
            .map(
              (item) => `
            <div class="order-item">
              <img src="${item.image}" alt="${item.name}" class="order-item-image">
              <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">Qty: ${item.quantity} x $${item.price.toFixed(2)}</div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="order-footer">
          <span class="order-total">Total: $${order.totalAmount.toFixed(2)}</span>
          <span class="order-date">${new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#9888;</div>
        <h3>Error loading orders</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
};

// Render order success page
const renderOrderSuccess = async () => {
  const container = document.getElementById("orderInfo");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");

  if (!orderId) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#9888;</div>
        <h3>Order not found</h3>
        <p>No order ID specified</p>
      </div>
    `;
    return;
  }

  try {
    const order = await API.orders.getById(orderId);

    container.innerHTML = `
      <div class="order-info-item">
        <span class="order-info-label">Order ID:</span>
        <span class="order-info-value">#${order._id.slice(-8).toUpperCase()}</span>
      </div>
      <div class="order-info-item">
        <span class="order-info-label">Total Amount:</span>
        <span class="order-info-value">$${order.totalAmount.toFixed(2)}</span>
      </div>
      <div class="order-info-item">
        <span class="order-info-label">Payment Method:</span>
        <span class="order-info-value">${order.paymentMethod}</span>
      </div>
      <div class="order-info-item">
        <span class="order-info-label">Status:</span>
        <span class="order-info-value">${order.status}</span>
      </div>
      <div class="order-info-item">
        <span class="order-info-label">Date:</span>
        <span class="order-info-value">${new Date(order.createdAt).toLocaleDateString()}</span>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#9888;</div>
        <h3>Error loading order</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
};

// Render profile page with orders
const renderProfile = async () => {
  const container = document.getElementById("profileContent");
  if (!container) return;

  // Check if user is logged in
  if (!Auth.isLoggedIn()) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#128274;</div>
        <h3>Please login to view profile</h3>
        <p>You need to be logged in to view your profile.</p>
        <a href="login.html" class="btn btn-primary">Login</a>
      </div>
    `;
    return;
  }

  try {
    const user = await API.auth.getProfile();

    container.innerHTML = `
      <div class="profile-card">
        <h3>Account Information</h3>
        <div class="profile-info">
          <div class="profile-info-item">
            <span class="profile-info-label">Name:</span>
            <span class="profile-info-value">${user.name}</span>
          </div>
          <div class="profile-info-item">
            <span class="profile-info-label">Email:</span>
            <span class="profile-info-value">${user.email}</span>
          </div>
          <div class="profile-info-item">
            <span class="profile-info-label">Role:</span>
            <span class="profile-info-value">${user.role}</span>
          </div>
          <div class="profile-info-item">
            <span class="profile-info-label">Member Since:</span>
            <span class="profile-info-value">${new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div class="profile-card">
        <h3>Quick Links</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="orders.html" class="btn btn-primary">View My Orders</a>
          <a href="products.html" class="btn btn-secondary">Continue Shopping</a>
        </div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#9888;</div>
        <h3>Error loading profile</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
};

// Initialize orders/profile pages
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("ordersContent")) {
    renderOrders();
  }
  if (document.getElementById("profileContent")) {
    renderProfile();
  }
  if (document.getElementById("orderInfo")) {
    renderOrderSuccess();
  }
});
