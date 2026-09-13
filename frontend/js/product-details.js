// Product details page functionality

// Load product details
const loadProductDetails = async () => {
  const container = document.getElementById("productDetails");
  if (!container) return;

  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#9888;</div>
        <h3>Product not found</h3>
        <p>No product ID specified</p>
        <a href="products.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }

  try {
    container.innerHTML = '<div class="loading">Loading product details...</div>';
    const product = await API.products.getById(productId);

    const stars = "&#9733;".repeat(Math.floor(product.rating)) + "&#9734;".repeat(5 - Math.floor(product.rating));
    const inStock = product.stock > 0;

    container.innerHTML = `
      <div class="product-details">
        <img src="${product.image}" alt="${product.name}" class="product-details-image">
        <div class="product-details-info">
          <span class="product-details-category">${product.category}</span>
          <h2>${product.name}</h2>
          <p class="product-details-description">${product.description}</p>
          <p class="product-details-price">$${product.price.toFixed(2)}</p>
          <div class="product-details-rating">
            <span>${stars}</span>
            <span>${product.rating} / 5</span>
          </div>
          <p class="product-details-stock ${inStock ? "in-stock" : "out-of-stock"}">
            ${inStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </p>
          <div class="quantity-selector">
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" value="1" min="1" max="${product.stock}" ${!inStock ? "disabled" : ""}>
          </div>
          <div class="product-details-actions">
            <button class="btn btn-primary" id="addToCartBtn" data-id="${product._id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}" data-stock="${product.stock}" ${!inStock ? "disabled" : ""}>
              ${inStock ? "Add to Cart" : "Out of Stock"}
            </button>
            <a href="products.html" class="btn btn-secondary">Back to Products</a>
          </div>
        </div>
      </div>
    `;

    // Add to cart button event listener
    const addToCartBtn = document.getElementById("addToCartBtn");
    if (addToCartBtn && inStock) {
      addToCartBtn.addEventListener("click", () => {
        const quantity = parseInt(document.getElementById("quantity").value);
        const productData = {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: quantity,
        };
        addToCart(productData);
      });
    }
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#9888;</div>
        <h3>Error loading product</h3>
        <p>${error.message}</p>
        <a href="products.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
  }
};

// Initialize product details page
document.addEventListener("DOMContentLoaded", loadProductDetails);
