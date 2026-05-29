import { useState, useEffect } from "react";
import { wishlistAPI, productsAPI, cartAPI } from "../utils/api";

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistAPI.get();
      setItems(data.items || []);

      // Load product details
      const prods = {};
      for (const item of data.items || []) {
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

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      setItems(items.filter(item => item.productId !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  const addToCart = async (productId) => {
    try {
      await cartAPI.add(productId, 1);
      alert("Added to cart!");
    } catch (err) {
      setError(err.message);
    }
  };

  const clearWishlist = async () => {
    if (!confirm("Clear entire wishlist?")) return;
    try {
      await wishlistAPI.clear();
      setItems([]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading wishlist...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (items.length === 0)
    return (
      <div className="p-8 text-center text-gray-500">
        Your wishlist is empty
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <button
          onClick={clearWishlist}
          className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const product = products[item.productId];
          if (!product) return null;
          return (
            <div
              key={item.productId}
              className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition"
            >
              {product.image && (
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2 mb-2">{product.name}</h3>
                <p className="text-lg font-bold text-[#1A3A5C] mb-3">
                  ₹{product.price}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(item.productId)}
                    className="flex-1 px-3 py-2 bg-[#1A3A5C] text-white rounded text-sm hover:bg-[#142d47]"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="px-3 py-2 border border-red-600 text-red-600 rounded text-sm hover:bg-red-50"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
