// src/hooks/useRazorpay.js
// ─────────────────────────────────────────────────────────────────────────────
// Razorpay integration with AUTH GUARD
// If df_token not in localStorage → calls onAuthRequired (redirect to /login)
// ─────────────────────────────────────────────────────────────────────────────

import { toast } from "sonner";

const RAZORPAY_KEY =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXXXXXXXXXX";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// openRazorpay({
//   product, variant, qty,
//   onSuccess, onFailure,
//   onAuthRequired,     ← NEW: called when user is not logged in
//   customDescription,
// })
// ─────────────────────────────────────────────────────────────────────────────
export async function openRazorpay({
  product,
  variant,
  qty = 1,
  onSuccess,
  onFailure,
  onAuthRequired,       // ← redirect to /login
  customDescription,
}) {
  // ── AUTH GUARD — check df_token ─────────────────────────────────────────
  const token = localStorage.getItem("df_token");
  if (!token) {
    // Not logged in → redirect to login
    toast.error("Please login to continue with payment");
    if (onAuthRequired) {
      onAuthRequired();   // caller handles navigate("/login")
    } else {
      window.location.href = "/login"; // fallback
    }
    return; // stop — do NOT open Razorpay
  }

  // ── Load SDK ────────────────────────────────────────────────────────────
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    toast.error("Failed to load payment gateway. Please check your internet connection.");
    return;
  }

  const totalPaise = variant.price * qty * 100;

  // In production: call backend to create order and get order_id
  // const { order_id } = await fetch("/api/orders/create", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify({ amount: totalPaise, product_id: product.id, qty }),
  // }).then(r => r.json());

  // Pre-fill from cached user
  const cachedUser = (() => {
    try { return JSON.parse(localStorage.getItem("df_user") || "{}"); }
    catch { return {}; }
  })();

  const options = {
    key: RAZORPAY_KEY,
    amount: totalPaise,
    currency: "INR",
    name: "dryfish.co",
    description: customDescription || `${product.name} — ${variant.label} × ${qty}`,
    image: "/logo.png",
    // order_id,  // ← uncomment when backend is ready

    prefill: {
      name:    cachedUser.name    || "",
      email:   cachedUser.email   || "",
      contact: cachedUser.phone   || "",
    },

    notes: {
      product_id:   product.id,
      product_name: product.name,
      variant:      variant.label,
      quantity:     qty,
    },

    theme: { color: "#1A3A5C" },

    modal: {
      ondismiss: () => {
        if (onFailure) onFailure({ reason: "dismissed" });
      },
    },

    handler: function (response) {
      // In production: verify signature on backend before fulfilling order
      // fetch("/api/orders/verify", {
      //   method: "POST",
      //   headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      //   body: JSON.stringify(response),
      // });
      if (onSuccess) onSuccess(response.razorpay_payment_id);
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", (response) => {
    if (onFailure) onFailure(response.error);
  });
  rzp.open();
}

export default openRazorpay;