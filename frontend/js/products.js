// Products page functionality

// Render product card
const renderProductCard = (product) => {
  const stars = "&#9733;".repeat(Math.floor(product.rating)) + "&#9734;".repeat(5 - Math.floor(product.rating));

  return `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-card-image" loading="lazy">
      <div class="product-card-body">
        <span class="product-card-category">${product.category}</span>
        <h3 class="product-card-title">${product.name}</h3>
        <p class="product-card-description">${product.description}</p>
        <div class="product-card-footer">
          <span class="product-card-price">$${product.price.toFixed(2)}</span>
          <span class="product-card-rating">${stars} ${product.rating}</span>
        </div>
        <div class="product-card-actions">
          <a href="product-details.html?id=${product._id}" class="btn btn-secondary btn-sm">View Details</a>
          <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product._id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}" data-stock="${product.stock}">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
};

// Load products
const loadProducts = async (params = {}) => {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  try {
    grid.innerHTML = '<div class="loading">Loading products...</div>';
    const products = await API.products.getAll(params);
    grid.innerHTML = "";

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">&#128270;</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(renderProductCard).join("");

    // Add event listeners to Add to Cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const product = {
          _id: e.target.dataset.id,
          name: e.target.dataset.name,
          price: parseFloat(e.target.dataset.price),
          image: e.target.dataset.image,
          stock: parseInt(e.target.dataset.stock),
        };
        addToCart(product);
      });
    });
  } catch (error) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">&#9888;</div>
        <h3>Error loading products</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
};

// Search and filter functionality
const setupSearchAndFilter = () => {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");
  const searchBtn = document.getElementById("searchBtn");

  const applyFilters = () => {
    const params = {};
    if (searchInput && searchInput.value.trim()) {
      params.search = searchInput.value.trim();
    }
    if (categoryFilter && categoryFilter.value !== "All") {
      params.category = categoryFilter.value;
    }
    if (sortFilter && sortFilter.value !== "default") {
      params.sort = sortFilter.value;
    }
    loadProducts(params);
  };

  if (searchBtn) {
    searchBtn.addEventListener("click", applyFilters);
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        applyFilters();
      }
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFilters);
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", applyFilters);
  }
};

// Initialize products page
document.addEventListener("DOMContentLoaded", () => {
  setupSearchAndFilter();
  loadProducts();
});
