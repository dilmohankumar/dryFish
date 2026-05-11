// src/api/auth.js
// ─────────────────────────────────────────────────────────────────────────────
// All auth API calls pointing to your Express backend
// ─────────────────────────────────────────────────────────────────────────────

const BASE = "http://localhost:5000/api/auth";

async function request(path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

// POST /api/auth/signup
export const apiSignup = (payload) =>
  request("/signup", payload);

// POST /api/auth/login  → { email/phone, password }
export const apiLogin = (payload) =>
  request("/login", payload);

// POST /api/auth/send-otp
export const apiSendOTP = (payload) =>
  request("/send-otp", payload);

// POST /api/auth/verify-otp
export const apiVerifyOTP = (payload) =>
  request("/verify-otp", payload);

// POST /api/auth/forget-password
export const apiForgetPassword = (payload) =>
  request("/forget-password", payload);

// POST /api/auth/reset-password
export const apiResetPassword = (payload) =>
  request("/reset-password", payload);

// GET /api/auth/me  (needs token)
export const apiGetMe = async (token) => {
  const res = await fetch(`${BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Unauthorized");
  return data;
};