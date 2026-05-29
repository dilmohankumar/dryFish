// src/api/auth.js
// ─────────────────────────────────────────────────────────────────────────────
// All auth API calls pointing to your Express backend
// ─────────────────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

async function request(path, body, token) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data.message || data.error || "Something went wrong";
      console.error(`[${res.status}] ${path}:`, errorMsg);
      throw new Error(errorMsg);
    }
    return data;
  } catch (err) {
    console.error("Request error:", err);
    throw err;
  }
}

// POST /api/v1/auth/signup
export const apiSignup = (payload) =>
  request("/auth/signup", payload);

// POST /api/v1/auth/login  → { email/phone, password }
export const apiLogin = (payload) =>
  request("/auth/login", payload);

// POST /api/v1/auth/signup/verify-otp
export const apiVerifyOTP = (payload) =>
  request("/auth/signup/verify-otp", payload);

// POST /api/v1/auth/password-reset/request
export const apiForgetPassword = (payload) =>
  request("/auth/password-reset/request", payload);

// POST /api/v1/auth/password-reset/verify-otp
export const apiResetPassword = (payload) =>
  request("/auth/password-reset/verify-otp", payload);

// GET /api/v1/auth/me  (needs token)
export const apiGetMe = async (token) => {
  const res = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Unauthorized");
  return data;
};