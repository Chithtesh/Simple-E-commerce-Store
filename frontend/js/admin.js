// Admin panel functionality

// Check if user is admin
const checkAdminAccess = () => {
  const user = Auth.getCurrentUser();
  if (!user || user.role !== "admin") {
    Auth.showToast("Access denied. Admin only.", "error");
    window.location.href = "index.html";
    return false;
  }
  return true;
};

// Render dashboard stats
const renderDashboard = async () => {
  if (!checkAdminAccess()) return;

  try {
    const [products, users, orders] = await Promise.all([
      API.products.getAll(),
      API.users.getAll(),
      API.orders.getAll(),
    ]);

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("totalUsers").textContent = users.length;
    document.getElementById("totalOrders").textContent = orders.length;
    document.getElementById("totalSales").textContent = `$${totalSales.toFixed(2)}`;
  } catch (error) {
    Auth.showToast("Error loading dashboard stats", "error");
  }
};

// Render products table
const renderProductsTable = async () => {
  if (!checkAdminAccess()) return;

  const tbody = document.getElementById("productsTableBody");
  if (!tbody) return;

  try {
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading products...</td></tr>';
    const products = await API.products.getAll();

    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No products found</td></tr>';
      return;
    }

    tbody.innerHTML = products
      .map(
        (product) => `
      <tr>
        <td><img src="${product.image}" alt="${product.name}"></td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${product.stock}</td>
        <td class="admin-table-actions">
          <button class="btn btn-sm btn-primary edit-product-btn" data-id="${product._id}">Edit</button>
          <button class="btn btn-sm btn-danger delete-product-btn" data-id="${product._id}">Delete</button>
        </td>
      </tr>
    `
      )
      .join("");

    // Add event listeners
    document.querySelectorAll(".edit-product-btn").forEach((btn) => {
      btn.addEventListener("click", () => openProductModal(btn.dataset.id));
    });

    document.querySelectorAll(".delete-product-btn").forEach((btn) => {
      btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
    });
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger-color);">Error: ${error.message}</td></tr>`;
  }
};

// Open product modal (add/edit)
const openProductModal = async (productId = null) => {
  const modal = document.getElementById("productModal");
  const form = document.getElementById("productForm");
  const title = document.getElementById("modalTitle");

  if (!modal || !form) return;

  // Reset form
  form.reset();
  document.getElementById("productId").value = "";

  if (productId) {
    try {
      const product = await API.products.getById(productId);
      title.textContent = "Edit Product";
      document.getElementById("productId").value = product._id;
      document.getElementById("productName").value = product.name;
      document.getElementById("productDescription").value = product.description;
      document.getElementById("productPrice").value = product.price;
      document.getElementById("productCategory").value = product.category;
      document.getElementById("productImage").value = product.image;
      document.getElementById("productStock").value = product.stock;
      document.getElementById("productRating").value = product.rating;
    } catch (error) {
      Auth.showToast("Error loading product", "error");
      return;
    }
  } else {
    title.textContent = "Add Product";
  }

  modal.classList.add("active");
};

// Close product modal
const closeProductModal = () => {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.classList.remove("active");
  }
};

// Save product (create/update)
const saveProduct = async (e) => {
  e.preventDefault();

  const productId = document.getElementById("productId").value;
  const productData = {
    name: document.getElementById("productName").value,
    description: document.getElementById("productDescription").value,
    price: parseFloat(document.getElementById("productPrice").value),
    category: document.getElementById("productCategory").value,
    image: document.getElementById("productImage").value,
    stock: parseInt(document.getElementById("productStock").value),
    rating: parseFloat(document.getElementById("productRating").value) || 0,
  };

  try {
    if (productId) {
      await API.products.update(productId, productData);
      Auth.showToast("Product updated successfully", "success");
    } else {
      await API.products.create(productData);
      Auth.showToast("Product created successfully", "success");
    }

    closeProductModal();
    renderProductsTable();
  } catch (error) {
    Auth.showToast(error.message, "error");
  }
};

// Delete product
const deleteProduct = async (productId) => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    await API.products.delete(productId);
    Auth.showToast("Product deleted successfully", "success");
    renderProductsTable();
  } catch (error) {
    Auth.showToast(error.message, "error");
  }
};

// Render orders table
const renderOrdersTable = async () => {
  if (!checkAdminAccess()) return;

  const tbody = document.getElementById("ordersTableBody");
  if (!tbody) return;

  try {
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading orders...</td></tr>';
    const orders = await API.orders.getAll();

    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No orders found</td></tr>';
      return;
    }

    tbody.innerHTML = orders
      .map(
        (order) => `
      <tr>
        <td>#${order._id.slice(-8).toUpperCase()}</td>
        <td>${order.user?.name || "Unknown"}</td>
        <td>$${order.totalAmount.toFixed(2)}</td>
        <td><span class="order-status ${order.status.toLowerCase()}">${order.status}</span></td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td class="admin-table-actions">
          <button class="btn btn-sm btn-primary update-status-btn" data-id="${order._id}" data-status="${order.status}">Update Status</button>
        </td>
      </tr>
    `
      )
      .join("");

    // Add event listeners
    document.querySelectorAll(".update-status-btn").forEach((btn) => {
      btn.addEventListener("click", () => openStatusModal(btn.dataset.id, btn.dataset.status));
    });
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger-color);">Error: ${error.message}</td></tr>`;
  }
};

// Open status modal
const openStatusModal = (orderId, currentStatus) => {
  const modal = document.getElementById("statusModal");
  const form = document.getElementById("statusForm");

  if (!modal || !form) return;

  document.getElementById("orderId").value = orderId;
  document.getElementById("orderStatus").value = currentStatus;

  modal.classList.add("active");
};

// Close status modal
const closeStatusModal = () => {
  const modal = document.getElementById("statusModal");
  if (modal) {
    modal.classList.remove("active");
  }
};

// Update order status
const updateOrderStatus = async (e) => {
  e.preventDefault();

  const orderId = document.getElementById("orderId").value;
  const status = document.getElementById("orderStatus").value;

  try {
    await API.orders.updateStatus(orderId, status);
    Auth.showToast("Order status updated", "success");
    closeStatusModal();
    renderOrdersTable();
  } catch (error) {
    Auth.showToast(error.message, "error");
  }
};

// Render users table
const renderUsersTable = async () => {
  if (!checkAdminAccess()) return;

  const tbody = document.getElementById("usersTableBody");
  if (!tbody) return;

  try {
    tbody.innerHTML = '<tr><td colspan="4" class="loading">Loading users...</td></tr>';
    const users = await API.users.getAll();

    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No users found</td></tr>';
      return;
    }

    tbody.innerHTML = users
      .map(
        (user) => `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
      </tr>
    `
      )
      .join("");
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--danger-color);">Error: ${error.message}</td></tr>`;
  }
};

// Initialize admin pages
document.addEventListener("DOMContentLoaded", () => {
  // Dashboard
  if (document.getElementById("adminStats")) {
    renderDashboard();
  }

  // Products management
  if (document.getElementById("productsTableBody")) {
    renderProductsTable();
  }

  const addProductBtn = document.getElementById("addProductBtn");
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => openProductModal());
  }

  const closeModal = document.getElementById("closeModal");
  if (closeModal) {
    closeModal.addEventListener("click", closeProductModal);
  }

  const productForm = document.getElementById("productForm");
  if (productForm) {
    productForm.addEventListener("submit", saveProduct);
  }

  // Orders management
  if (document.getElementById("ordersTableBody")) {
    renderOrdersTable();
  }

  const closeStatusModalBtn = document.getElementById("closeStatusModal");
  if (closeStatusModalBtn) {
    closeStatusModalBtn.addEventListener("click", closeStatusModal);
  }

  const statusForm = document.getElementById("statusForm");
  if (statusForm) {
    statusForm.addEventListener("submit", updateOrderStatus);
  }

  // Users management
  if (document.getElementById("usersTableBody")) {
    renderUsersTable();
  }

  // Close modals on outside click
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  });
});
