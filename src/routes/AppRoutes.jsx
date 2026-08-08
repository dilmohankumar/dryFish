import { useState, useCallback, useEffect } from "react";
import Navbar from "../components/layout/Navbar/navbar.jsx";
import Footer from "../components/layout/Footer/footer.jsx";
import Home from "../pages/home.jsx";
import Shop from "../pages/shop.jsx";
import CategoryPage from "../pages/category.jsx";
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
import { getMegaMenu } from "../data/megaMenu.js";

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
  const [shopCategory, setShopCategory] = useState("All");
  // Category rough-page state (mega menu / primary nav destinations)
  const [categoryState, setCategoryState] = useState({
    slug: "dry-prawns",
    filter: "Prawns",
    tag: null,
    label: null,
  });

  const cartInc = useCallback(id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 })), []);
  const cartDec = useCallback(id => setCart(c => { const n = (c[id] || 1) - 1; return n <= 0 ? { ...c, [id]: 0 } : { ...c, [id]: n }; }), []);
  const cartFirstAdd = useCallback(id => setCart(c => ({ ...c, [id]: 1 })), []);
  const cartRemove = useCallback(id => setCart(c => ({ ...c, [id]: 0 })), []);
  const clearFilters = () => { setSelectedSort(null); setSelectedCats([]); setSelectedOrigins([]); };

  const handleCheckout = (items, total) => {
    setCheckoutData({ items, total });
    setCurrentPage("checkout");
  };

  // ── Navigation helpers ──────────────────────────────────────────────────
  const goHome = () => { setCurrentPage("home"); setSelectedProduct(null); };
  const goShop = (category = "All") => {
    setShopCategory(category);
    setCurrentPage("shop");
    setSelectedProduct(null);
  };
  const goCategory = (payload = {}) => {
    const slug = payload.slug || "featured-new";
    const menu = getMegaMenu(slug);
    setCategoryState({
      slug,
      filter: payload.filter || menu?.filter || "All",
      tag: payload.tag || null,
      label: payload.label || null,
    });
    setCurrentPage("category");
    setSelectedProduct(null);
  };
  const handleCategorySelect = (cat) => {
    if (cat?.slug) {
      return goCategory({
        slug: cat.slug,
        filter: cat.filter,
        tag: cat.tag,
        label: cat.labelNav || cat.label,
      });
    }
    // Fallback for older callers that only pass a filter string/object
    goShop(cat?.filter || "All");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar
        onOpenSidebar={() => setSidebarOpen(true)}
        cart={cart}
        onCartInc={cartInc}
        onCartDec={cartDec}
        onCartRemove={cartRemove}
        onLogoClick={goHome}
        user={user}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
        onNavigate={setCurrentPage}
        onCategorySelect={handleCategorySelect}
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
      ) : currentPage === "category" ? (
        <div className="flex-1">
          <CategoryPage
            key={`${categoryState.slug}-${categoryState.filter}-${categoryState.tag || ""}-${categoryState.label || ""}`}
            slug={categoryState.slug}
            filter={categoryState.filter}
            tag={categoryState.tag}
            highlightLabel={categoryState.label}
            cart={cart}
            onInc={cartInc}
            onDec={cartDec}
            onFirstAdd={cartFirstAdd}
            onProductClick={setSelectedProduct}
            onBackToHome={goHome}
            onNavigateCategory={goCategory}
          />
        </div>
      ) : currentPage === "shop" ? (
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
            <Shop
              key={shopCategory}
              selectedSort={selectedSort}
              selectedCats={selectedCats}
              selectedOrigins={selectedOrigins}
              cart={cart}
              onProductClick={setSelectedProduct}
              onInc={cartInc}
              onDec={cartDec}
              onFirstAdd={cartFirstAdd}
              onOpenSidebar={() => setSidebarOpen(true)}
              onBackToHome={goHome}
              initialCategory={shopCategory}
            />
          </main>
        </div>
      ) : (
        <div className="flex-1">
          <Home
            cart={cart}
            onInc={cartInc}
            onDec={cartDec}
            onFirstAdd={cartFirstAdd}
            onProductClick={setSelectedProduct}
            onShopNow={() => goCategory({ slug: "featured-new", filter: "All", label: "Featured & New" })}
            onCategorySelect={handleCategorySelect}
          />
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