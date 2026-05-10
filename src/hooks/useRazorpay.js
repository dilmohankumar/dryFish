// src/hooks/useRazorpay.js
// ─────────────────────────────────────────────────────────────────────────────
// Production-grade Razorpay integration hook
// ─────────────────────────────────────────────────────────────────────────────

import { toast } from "sonner";
const RAZORPAY_KEY =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXXXXXXXXXX";

// Dynamically load Razorpay SDK (avoids blocking page load)
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
// openRazorpay({ product, variant, qty, onSuccess, onFailure })
//
// product  — full product object
// variant  — { label, price, mrp }
// qty      — number
// onSuccess(paymentId) — called after successful payment
// onFailure(error)     — called on failure / dismiss
// ─────────────────────────────────────────────────────────────────────────────
export async function openRazorpay({
  product,
  variant,
  qty = 1,
  onSuccess,
  onFailure,
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    toast.error(
      "Failed to load payment gateway. Please check your internet connection.",
    );
    return;
  }

  const totalPaise = variant.price * qty * 100; // Razorpay expects paise

  // In production: call YOUR backend here to create an order and get order_id
  // const { order_id } = await fetch("/api/orders/create", {
  //   method: "POST",
  //   body: JSON.stringify({ amount: totalPaise, product_id: product.id, qty }),
  // }).then(r => r.json());

  const options = {
    key: RAZORPAY_KEY,
    amount: totalPaise,
    currency: "INR",
    name: "dryfish.co",
    description: `${product.name} — ${variant.label} × ${qty}`,
    image: "https://dryfish.co/logo.png", // replace with your logo URL

    // order_id,  // ← uncomment when backend is ready

    prefill: {
      name: "", // pre-fill from user profile if available
      email: "",
      contact: "",
    },

    notes: {
      product_id: product.id,
      product_name: product.name,
      variant: variant.label,
      quantity: qty,
    },

    theme: {
      color: "#1A3A5C",
    },

    modal: {
      ondismiss: () => {
        if (onFailure) onFailure({ reason: "dismissed" });
      },
    },

    handler: function (response) {
      // response = { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      // In production: verify signature on YOUR backend before fulfilling order
      // fetch("/api/orders/verify", { method: "POST", body: JSON.stringify(response) })
      if (onSuccess) onSuccess(response.razorpay_payment_id);
    },
  };

  const rzp = new window.Razorpay(options);

  rzp.on("payment.failed", function (response) {
    if (onFailure) onFailure(response.error);
  });

  rzp.open();
}

export default openRazorpay;
