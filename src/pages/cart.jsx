import { useState, useEffect } from "react";
import { cartAPI, productsAPI } from "../utils/api";

export default function CartPage({ onCheckout }) {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartAPI.get();
      setItems(cartData.items || []);

      // Load product details for all cart items
      const prods = {};
      for (const item of cartData.items || []) {
        const prod = await productsAPI.getById(item.productId);
        prods[item.productId] = prod;
      }
      setProducts(prods);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    try {
      await cartAPI.update(productId, quantity);
      setItems(items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartAPI.remove(productId);
      setItems(items.filter(item => item.productId !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  const clearCart = async () => {
    if (!confirm("Clear entire cart?")) return;
    try {
      await cartAPI.clear();
      setItems([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const total = items.reduce((sum, item) => {
    const price = products[item.productId]?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  if (loading) return <div className="p-8 text-center">Loading cart...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (items.length === 0)
    return (
      <div className="p-8 text-center text-gray-500">
        Your cart is empty
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item) => {
          const product = products[item.productId];
          if (!product) return null;
          return (
            <div
              key={item.productId}
              className="flex items-center gap-4 border rounded-lg p-4 bg-white"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600">₹{product.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="px-3 py-1 border rounded"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{product.price * item.quantity}</p>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Clear Cart
          </button>
          <button
            onClick={() => onCheckout(items, total)}
            className="flex-1 px-4 py-2 bg-[#1A3A5C] text-white rounded-lg hover:bg-[#142d47]"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
