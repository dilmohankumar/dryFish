import { useState, useEffect } from "react";
import { ordersAPI } from "../utils/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getMyOrders();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!confirm("Cancel this order?")) return;
    try {
      await ordersAPI.cancel(orderId);
      setOrders(orders.map(o =>
        o._id === orderId ? { ...o, status: "cancelled" } : o
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (orders.length === 0)
    return <div className="p-8 text-center text-gray-500">No orders yet</div>;

  if (selectedOrder) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => setSelectedOrder(null)}
          className="mb-4 text-[#1A3A5C] hover:underline"
        >
          ← Back to Orders
        </button>
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-2xl font-bold mb-4">Order #{selectedOrder._id}</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">Order Date</p>
              <p className="font-semibold">
                {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className={`font-semibold px-2 py-1 rounded ${getStatusColor(selectedOrder.status)}`}>
                {selectedOrder.status}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Items</h3>
          <div className="space-y-2 mb-6">
            {selectedOrder.items?.map((item) => (
              <div key={item._id} className="flex justify-between border-b pb-2">
                <span>{item.productId?.name || "Product"}</span>
                <span>₹{item.price} × {item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₹{selectedOrder.totalAmount}</span>
            </div>
          </div>

          {selectedOrder.shippingAddress && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Shipping Address</h4>
              <p className="text-gray-600">
                {selectedOrder.shippingAddress.street}
                <br />
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                {selectedOrder.shippingAddress.zipCode}
              </p>
            </div>
          )}

          {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
            <button
              onClick={() => cancelOrder(selectedOrder._id)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => setSelectedOrder(order)}
            className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Order #{order._id}</h3>
                <p className="text-gray-600 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`px-3 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                  {order.status}
                </p>
                <p className="font-semibold mt-2">₹{order.totalAmount}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              {order.items?.length} item(s)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
