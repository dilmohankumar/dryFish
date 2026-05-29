import { useState, useEffect } from "react";
import { ordersAPI, userAPI } from "../utils/api";

export default function CheckoutPage({ cartItems, total, onBack }) {
  const [user, setUser] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await userAPI.getMe();
      setUser(data.data || data.user);
      if (data.data?.addresses?.[0] || data.user?.addresses?.[0]) {
        setSelectedAddress((data.data?.addresses || data.user?.addresses)[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    setProcessing(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: selectedAddress,
        paymentMethod,
        totalAmount: total,
      };

      const response = await ordersAPI.create(orderData);
      alert("Order placed successfully!");
      onBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <div className="p-8 text-red-600">Error loading user data</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={onBack}
        className="mb-6 text-[#1A3A5C] hover:underline"
      >
        ← Back to Cart
      </button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Delivery Address */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
              {user.addresses && user.addresses.length > 0 ? (
                <div className="space-y-2">
                  {user.addresses.map((addr, idx) => (
                    <label key={idx} className="flex items-start gap-3 p-3 border rounded cursor-pointer">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress?._id === addr._id}
                        onChange={() => setSelectedAddress(addr)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-semibold">{addr.street}</p>
                        <p className="text-gray-600 text-sm">
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No addresses available. Please add an address in your profile.</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>UPI</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded p-4 text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={processing || !selectedAddress}
              className="w-full px-4 py-3 bg-[#1A3A5C] text-white rounded-lg hover:bg-[#142d47] disabled:opacity-50"
            >
              {processing ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white border rounded-lg p-6 h-fit sticky top-6">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4 pb-4 border-b">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>
                  {item.productId} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
