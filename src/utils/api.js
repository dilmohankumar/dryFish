const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

async function request(path, options = {}) {
  const token = localStorage.getItem("df_token");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API Error");
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════════
export const productsAPI = {
  getAll: (query = "") => request(`/products${query}`),
  getById: (id) => request(`/products/${id}`),
  getFeatured: () => request("/products/featured"),
  getByCategory: (categoryId) => request(`/products/category/${categoryId}`),
  create: (data) => request("/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/products/${id}`, { method: "DELETE" }),
};

// ═══════════════════════════════════════════════════════════════════
// CART
// ═══════════════════════════════════════════════════════════════════
export const cartAPI = {
  get: () => request("/cart"),
  add: (productId, quantity) =>
    request("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),
  update: (productId, quantity) =>
    request(`/cart/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),
  remove: (productId) => request(`/cart/${productId}`, { method: "DELETE" }),
  clear: () => request("/cart", { method: "DELETE" }),
};

// ═══════════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════════
export const ordersAPI = {
  create: (data) =>
    request("/orders", { method: "POST", body: JSON.stringify(data) }),
  getMyOrders: () => request("/orders/my-orders"),
  getById: (id) => request(`/orders/${id}`),
  cancel: (id) =>
    request(`/orders/${id}/cancel`, { method: "PUT", body: JSON.stringify({}) }),
  getAll: () => request("/orders"), // Admin
  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// ═══════════════════════════════════════════════════════════════════
// WISHLIST
// ═══════════════════════════════════════════════════════════════════
export const wishlistAPI = {
  get: () => request("/wishlist"),
  add: (productId) =>
    request("/wishlist/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),
  remove: (productId) => request(`/wishlist/${productId}`, { method: "DELETE" }),
  clear: () => request("/wishlist", { method: "DELETE" }),
};

// ═══════════════════════════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════════════════════════
export const reviewsAPI = {
  getByProduct: (productId) => request(`/reviews/product/${productId}`),
  create: (data) =>
    request("/reviews", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/reviews/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/reviews/${id}`, { method: "DELETE" }),
  markHelpful: (id) =>
    request(`/reviews/${id}/helpful`, {
      method: "PUT",
      body: JSON.stringify({}),
    }),
};

// ═══════════════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════════════
export const categoriesAPI = {
  getAll: () => request("/categories"),
  getTree: () => request("/categories/tree"),
  getById: (id) => request(`/categories/${id}`),
  create: (data) =>
    request("/categories", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/categories/${id}`, { method: "DELETE" }),
};

// ═══════════════════════════════════════════════════════════════════
// USER PROFILE & ACCOUNT
// ═══════════════════════════════════════════════════════════════════
export const userAPI = {
  getMe: () => request("/auth/me"),
  updateProfile: (data) =>
    request("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
  addAddress: (data) =>
    request("/auth/address", { method: "POST", body: JSON.stringify(data) }),
  logout: () =>
    request("/auth/logout", { method: "POST", body: JSON.stringify({}) }),
  refreshToken: (refreshToken) =>
    request("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),
};
