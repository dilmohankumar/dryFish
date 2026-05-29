import { useState, useCallback, useEffect } from "react";
import Navbar from "../components/layout/Navbar/navbar.jsx";
import Footer from "../components/layout/Footer/footer.jsx";
import Home from "../pages/home.jsx";
import Sidebar from "../components/layout/sidebar/sidebar.jsx";
import ProductDetail from "../pages/productDetails.jsx";
import Login from "../pages/auth/login.jsx";
import Signup from "../pages/auth/signup.jsx";
import Cart from "../pages/cart.jsx";
import Checkout from "../pages/checkout.jsx";
import Orders from "../pages/orders.jsx";
import Wishlist from "../pages/wishlist.jsx";
import Profile from "../pages/profile.jsx";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { userAPI } from "../utils/api.js";

function StoreLayout({ user, onLogout, onLoginClick }) {
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("home");
  const [checkoutData, setCheckoutData] = useState(null);

  const cartInc = useCallback(id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 })), []);
  const cartDec = useCallback(id => setCart(c => { const n = (c[id] || 1) - 1; return n <= 0 ? { ...c, [id]: 0 } : { ...c, [id]: n }; }), []);
  const cartFirstAdd = useCallback(id => setCart(c => ({ ...c, [id]: 1 })), []);
  const cartRemove = useCallback(id => setCart(c => ({ ...c, [id]: 0 })), []);
  const clearFilters = () => { setSelectedSort(null); setSelectedCats([]); setSelectedOrigins([]); };

  const handleCheckout = (items, total) => {
    setCheckoutData({ items, total });
    setCurrentPage("checkout");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar
        onOpenSidebar={() => setSidebarOpen(true)}
        cart={cart}
        onCartInc={cartInc}
        onCartDec={cartDec}
        onCartRemove={cartRemove}
        onLogoClick={() => setSelectedProduct(null)}
        user={user}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
        onNavigate={setCurrentPage}
      />

      {currentPage === "checkout" && checkoutData ? (
        <div className="flex-1">
          <Checkout
            cartItems={checkoutData.items}
            total={checkoutData.total}
            onBack={() => {
              setCurrentPage("cart");
              setCheckoutData(null);
            }}
          />
        </div>
      ) : currentPage === "cart" ? (
        <div className="flex-1">
          <Cart
            onCheckout={handleCheckout}
          />
        </div>
      ) : currentPage === "orders" ? (
        <div className="flex-1">
          <Orders />
        </div>
      ) : currentPage === "wishlist" ? (
        <div className="flex-1">
          <Wishlist />
        </div>
      ) : currentPage === "profile" ? (
        <div className="flex-1">
          <Profile />
        </div>
      ) : selectedProduct ? (
        <div className="flex-1">
          <ProductDetail
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            cart={cart}
            onCartInc={cartInc}
            onCartDec={cartDec}
            onCartFirstAdd={cartFirstAdd}
          />
        </div>
      ) : (
        <div className="flex flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 gap-5 sm:gap-8">
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
            selectedCats={selectedCats}
            onCatChange={setSelectedCats}
            selectedOrigins={selectedOrigins}
            onOriginChange={setSelectedOrigins}
            onClearAll={clearFilters}
          />
          <main className="flex-1 min-w-0">
            <Home
              selectedSort={selectedSort}
              selectedCats={selectedCats}
              selectedOrigins={selectedOrigins}
              cart={cart}
              onProductClick={setSelectedProduct}
              onInc={cartInc}
              onDec={cartDec}
              onFirstAdd={cartFirstAdd}
              onOpenSidebar={() => setSidebarOpen(true)}
            />
          </main>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    const token = localStorage.getItem("df_token");
    if (token) {
      try {
        const userData = await userAPI.getMe();
        setUser(userData.data || userData.user);
      } catch (err) {
        localStorage.removeItem("df_token");
        localStorage.removeItem("df_refreshToken");
      }
    }
    setLoading(false);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    navigate("/", { replace: true });
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
    navigate("/", { replace: true });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("df_token");
    localStorage.removeItem("df_refreshToken");
    navigate("/login", { replace: true });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/" replace />
            : <Login onLoginSuccess={handleLoginSuccess} onGoToSignup={() => navigate("/signup")} />
        }
      />
      <Route
        path="/signup"
        element={
          user
            ? <Navigate to="/" replace />
            : <Signup onSignupSuccess={handleSignupSuccess} onGoToLogin={() => navigate("/login")} />
        }
      />

      <Route
        path="/*"
        element={
          <StoreLayout
            user={user}
            onLogout={handleLogout}
            onLoginClick={() => navigate("/login")}
          />
        }
      />
    </Routes>
  );
}