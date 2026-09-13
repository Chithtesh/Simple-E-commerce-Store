// API Configuration
const API_URL = "/api";

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem("token");
};

// Helper function to get headers
const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Generic fetch wrapper
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Auth API
const authAPI = {
  register: (userData) => fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  }),

  login: (credentials) => fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }),

  getProfile: () => fetchAPI("/auth/profile", {
    method: "GET",
  }),
};

// Products API
const productsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/products${queryString ? `?${queryString}` : ""}`);
  },

  getById: (id) => fetchAPI(`/products/${id}`),

  create: (productData) => fetchAPI("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  }),

  update: (id, productData) => fetchAPI(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  }),

  delete: (id) => fetchAPI(`/products/${id}`, {
    method: "DELETE",
  }),
};

// Orders API
const ordersAPI = {
  create: (orderData) => fetchAPI("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  }),

  getMyOrders: () => fetchAPI("/orders/my-orders"),

  getById: (id) => fetchAPI(`/orders/${id}`),

  getAll: () => fetchAPI("/orders"),

  updateStatus: (id, status) => fetchAPI(`/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  }),
};

// Users API
const usersAPI = {
  getAll: () => fetchAPI("/users"),

  getById: (id) => fetchAPI(`/users/${id}`),
};

// Export for use in other files
window.API = {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
  users: usersAPI,
};
