// Authentication utilities

// Check if user is logged in
const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

// Get current user data
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Update navigation based on auth state
const updateNav = () => {
  const user = getCurrentUser();
  const navAuth = document.getElementById("navAuth");
  const navUser = document.getElementById("navUser");
  const navAdmin = document.getElementById("navAdmin");
  const navUserName = document.getElementById("navUserName");

  if (user) {
    if (navAuth) navAuth.style.display = "none";
    if (navUser) {
      navUser.style.display = "flex";
      if (navUserName) navUserName.textContent = user.name;
    }
    if (navAdmin && user.role === "admin") {
      navAdmin.style.display = "flex";
    } else if (navAdmin) {
      navAdmin.style.display = "none";
    }
  } else {
    if (navAuth) navAuth.style.display = "flex";
    if (navUser) navUser.style.display = "none";
    if (navAdmin) navAdmin.style.display = "none";
  }
};

// Show toast notification
const showToast = (message, type = "success") => {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
};

// Logout
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  showToast("Logged out successfully", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
};

// Setup logout button
const setupLogout = () => {
  const logoutBtn = document.getElementById("navLogout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }
};

// Setup mobile navigation toggle
const setupMobileNav = () => {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
      });
    });
  }
};

// Handle login form
const handleLogin = async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await API.auth.login({ email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    showToast("Login successful!", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    showToast(error.message, "error");
  }
};

// Handle register form
const handleRegister = async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters", "error");
    return;
  }

  try {
    const data = await API.auth.register({ name, email, password, confirmPassword });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    showToast("Registration successful!", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    showToast(error.message, "error");
  }
};

// Setup login form
const setupLoginForm = () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
};

// Setup register form
const setupRegisterForm = () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
};

// Initialize auth on page load
document.addEventListener("DOMContentLoaded", () => {
  updateNav();
  setupLogout();
  setupMobileNav();
  setupLoginForm();
  setupRegisterForm();
});

// Export for use in other files
window.Auth = {
  isLoggedIn,
  getCurrentUser,
  updateNav,
  showToast,
  logout,
  setupLogout,
  setupMobileNav,
  handleLogin,
  handleRegister,
  setupLoginForm,
  setupRegisterForm,
};
