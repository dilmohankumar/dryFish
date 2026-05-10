import { useState, useCallback } from "react";
import { openRazorpay } from "../../../hooks/useRazorpay.js";
import { PRODUCTS } from "../../../pages/productGrid.jsx";

// ── Icons ──────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
  </svg>
);
const CartIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
);
const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
  </svg>
);
const XIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const MinusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const BoltIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// ── Cart Drawer ────────────────────────────────────────────────────────────
function CartDrawer({ cart, onInc, onDec, onRemove, onClose, onLogoClick }) {
  const [checkoutStatus, setCheckoutStatus] = useState("idle");

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const product = PRODUCTS.find(p => p.id === Number(id));
      return product ? { product, qty, variant: product.variants[0] } : null;
    })
    .filter(Boolean);

  const subtotal  = cartItems.reduce((s, { variant, qty }) => s + variant.price * qty, 0);
  const totalMrp  = cartItems.reduce((s, { variant, qty }) => s + variant.mrp * qty, 0);
  const savings   = totalMrp - subtotal;
  const delivery  = subtotal >= 500 ? 0 : 49;
  const grandTotal = subtotal + delivery;

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0 || checkoutStatus === "paying") return;
    setCheckoutStatus("paying");

    // Build a summary product for Razorpay description
    const description = cartItems.map(({ product, qty }) => `${product.name} ×${qty}`).join(", ");

    try {
      await openRazorpay({
        product: { id: "cart", name: "dryfish.co Order" },
        variant: { label: `${cartItems.length} items`, price: grandTotal, mrp: grandTotal },
        qty: 1,
        customDescription: description,
        onSuccess: (paymentId) => {
          setCheckoutStatus("success");
          // In production: send paymentId + cartItems to your backend here
          setTimeout(() => {
            onClose();
            setCheckoutStatus("idle");
          }, 2000);
        },
        onFailure: (err) => {
          if (err?.reason === "dismissed") {
            setCheckoutStatus("idle");
          } else {
            setCheckoutStatus("failed");
            setTimeout(() => setCheckoutStatus("idle"), 2000);
          }
        },
      });
    } catch {
      setCheckoutStatus("idle");
    }
  }, [cartItems, grandTotal, checkoutStatus, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Drawer */}
      <div className="relative bg-white w-full max-w-sm sm:max-w-md h-full flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <CartIcon />
            <h2 className="text-base font-bold text-gray-900">Your Cart</h2>
            {cartItems.length > 0 && (
              <span className="bg-[#1A3A5C] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100">
            <XIcon />
          </button>
        </div>

        {/* Free delivery progress */}
        {subtotal > 0 && subtotal < 500 && (
          <div className="px-5 py-3 bg-blue-50 flex-shrink-0">
            <div className="flex justify-between text-xs text-blue-700 mb-1.5">
              <span>Add ₹{500 - subtotal} more for free delivery</span>
              <span className="font-bold">{Math.round((subtotal / 500) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1A3A5C] rounded-full transition-all duration-500"
                style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {subtotal >= 500 && (
          <div className="px-5 py-2.5 bg-green-50 flex-shrink-0">
            <p className="text-xs text-green-700 font-semibold">✓ You've unlocked free delivery!</p>
          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some dry fish to get started</p>
              <button
                onClick={onClose}
                className="mt-5 bg-[#1A3A5C] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#142d47] transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : cartItems.map(({ product, qty, variant }) => (
            <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              {/* Emoji thumbnail */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm"
                style={{ background: product.bg }}
              >
                {product.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate leading-snug">{product.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{variant.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-extrabold text-gray-900">₹{variant.price * qty}</span>
                  <span className="text-[10px] text-gray-400 line-through">₹{variant.mrp * qty}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onRemove(product.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <TrashIcon />
                </button>
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2 py-1">
                  <button onClick={() => onDec(product.id)} className="text-gray-500 hover:text-[#1A3A5C] transition-colors">
                    <MinusIcon />
                  </button>
                  <span className="text-xs font-bold w-4 text-center tabular-nums">{qty}</span>
                  <button onClick={() => onInc(product.id)} className="text-gray-500 hover:text-[#1A3A5C] transition-colors">
                    <PlusIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary + checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 flex-shrink-0 space-y-3">
            {/* Summary */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({cartItems.reduce((s, { qty }) => s + qty, 0)} items)</span>
                <span className="font-semibold text-gray-800">₹{subtotal}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-600 text-xs">
                  <span>You save</span>
                  <span className="font-semibold">−₹{savings}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span className={`font-semibold ${delivery === 0 ? "text-green-600" : "text-gray-800"}`}>
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              disabled={checkoutStatus === "paying"}
              className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl text-sm transition-all active:scale-[0.98] shadow-lg
                ${checkoutStatus === "success"
                  ? "bg-green-500 text-white"
                  : checkoutStatus === "paying"
                  ? "bg-[#1A3A5C]/60 text-white cursor-not-allowed"
                  : checkoutStatus === "failed"
                  ? "bg-red-500 text-white"
                  : "bg-[#E07B39] text-white hover:bg-[#c96a2c]"
                }`}
            >
              {checkoutStatus === "paying" ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Opening Payment…
                </>
              ) : checkoutStatus === "success" ? (
                "✓ Order Placed!"
              ) : checkoutStatus === "failed" ? (
                "Payment Failed — Retry"
              ) : (
                <>
                  <BoltIcon />
                  Pay ₹{grandTotal} · Checkout
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-gray-400">
              🔒 Secured by Razorpay · UPI · Cards · Net Banking · Wallets
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────
export default function Navbar({
  onOpenSidebar,
  cart = {},
  onCartInc,
  onCartDec,
  onCartRemove,
  onLogoClick,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);

  return (
    <div className="font-sans">
      {/* ── Promo Banner ── */}
      <div className="bg-[#1A3A5C] text-white flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#E07B39] rounded flex items-center justify-center text-white font-bold text-xs flex-shrink-0">🐟</div>
          <span className="font-medium truncate hidden sm:block">Download the App — Get 20% Off + Free Delivery on 1st Order</span>
          <span className="font-medium sm:hidden">20% Off on 1st Order!</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-5 flex-shrink-0">
          <button className="bg-white text-[#1A3A5C] font-bold px-3 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs hover:bg-gray-100 transition-colors">
            Download
          </button>
          <button className="hidden sm:flex items-center gap-1.5 underline underline-offset-2 text-white hover:text-gray-200 transition-colors text-xs">
            <LocationIcon /><span>Select Location</span><ChevronDownIcon />
          </button>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-6">

          {/* Mobile filter */}
          <button onClick={onOpenSidebar} className="md:hidden text-gray-500 hover:text-[#1A3A5C] transition-colors flex-shrink-0">
            <FilterIcon />
          </button>

          {/* Logo */}
          <button onClick={onLogoClick} className="flex-shrink-0">
            <span className="text-xl sm:text-2xl font-black tracking-tight select-none">
              <span className="text-[#1A3A5C]">dry</span>
              <span className="text-[#E07B39]">fish</span>
              <span className="text-[#1A3A5C] hidden sm:inline">.co</span>
            </span>
          </button>

          {/* Search */}
          <div className="flex-1 relative">
            <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search dry fish products…"
              className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 rounded-full border border-gray-200 bg-gray-50 text-xs sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 focus:border-[#1A3A5C] transition-all"
            />
          </div>

          {/* Nav actions */}
          <nav className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
            <button className="hidden sm:flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#1A3A5C] transition-colors text-xs font-medium">
              <div className="relative">
                <span className="text-lg font-black leading-none">🐠</span>
                <span className="absolute -top-1 -right-2 text-[9px] font-bold text-[#E07B39]">+</span>
              </div>
              <span>Fish Plus</span>
            </button>
            <button className="hidden sm:flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#1A3A5C] transition-colors text-xs font-medium">
              <UserIcon /><span>Account</span>
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#1A3A5C] transition-colors text-xs font-medium"
            >
              <div className="relative">
                <CartIcon />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E07B39] text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block">Cart</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Cart Drawer */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onInc={onCartInc}
          onDec={onCartDec}
          onRemove={onCartRemove}
          onClose={() => setCartOpen(false)}
          onLogoClick={onLogoClick}
        />
      )}
    </div>
  );
}