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
import { PRODUCTS } from "../pages/productGrid.jsx";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { userAPI } from "../utils/api.js";
import { getMegaMenu } from "../data/megaMenu.js";

// ── Path builders (pure — no hooks) ─────────────────────────────────────────
// Shared by every "go to X" call site so the URL a click lands on and the
// params a route reads back out always agree.
function buildShopPath(category = "All") {
  return category && category !== "All" ? `/shop?category=${encodeURIComponent(category)}` : "/shop";
}

function buildCategoryPath(payload = {}) {
  const slug = payload.slug || "featured-new";
  const menu = getMegaMenu(slug);
  const filter = payload.filter || menu?.filter || "All";
  const label = payload.label || menu?.label || null;
  const params = new URLSearchParams();
  params.set("filter", filter);
  if (payload.tag) params.set("tag", payload.tag);
  if (label) params.set("label", label);
  return `/category/${slug}?${params.toString()}`;
}

// ── Route-level wrappers ─────────────────────────────────────────────────
// Thin adapters that pull params/search-params/location.state out of the URL
// and hand the existing page components the same props they always expected.

function ShopRoute({
  cart, cartInc, cartDec, cartFirstAdd,
  sidebarOpen, setSidebarOpen,
  selectedSort, setSelectedSort,
  selectedCats, setSelectedCats,
  selectedOrigins, setSelectedOrigins,
  clearFilters, onProductClick, onBackToHome,
}) {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";

  return (
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
          key={category}
          selectedSort={selectedSort}
          selectedCats={selectedCats}
          selectedOrigins={selectedOrigins}
          cart={cart}
          onProductClick={onProductClick}
          onInc={cartInc}
          onDec={cartDec}
          onFirstAdd={cartFirstAdd}
          onOpenSidebar={() => setSidebarOpen(true)}
          onBackToHome={onBackToHome}
          initialCategory={category}
        />
      </main>
    </div>
  );
}

function CategoryRoute({ cart, onInc, onDec, onFirstAdd, onProductClick, onBackToHome, onNavigateCategory }) {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const menu = getMegaMenu(slug);
  const filter = searchParams.get("filter") || menu?.filter || "All";
  const tag = searchParams.get("tag") || null;
  const label = searchParams.get("label") || null;

  return (
    <div className="flex-1">
      <CategoryPage
        key={`${slug}-${filter}-${tag || ""}-${label || ""}`}
        slug={slug}
        filter={filter}
        tag={tag}
        highlightLabel={label}
        cart={cart}
        onInc={onInc}
        onDec={onDec}
        onFirstAdd={onFirstAdd}
        onProductClick={onProductClick}
        onBackToHome={onBackToHome}
        onNavigateCategory={onNavigateCategory}
      />
    </div>
  );
}

function ProductDetailRoute({ cart, onCartInc, onCartDec, onCartFirstAdd }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === Number(id));

  return (
    <div className="flex-1">
      <ProductDetail
        product={product}
        onBack={() => navigate(-1)}
        cart={cart}
        onCartInc={onCartInc}
        onCartDec={onCartDec}
        onCartFirstAdd={onCartFirstAdd}
      />
    </div>
  );
}

function CheckoutRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const checkoutData = location.state;

  // Direct/refresh visits to /checkout carry no cart snapshot — bounce to cart.
  if (!checkoutData) return <Navigate to="/cart" replace />;

  return (
    <div className="flex-1">
      <Checkout
        cartItems={checkoutData.items}
        total={checkoutData.total}
        onBack={() => navigate("/cart")}
      />
    </div>
  );
}

function StoreLayout({ user, onLogout, onLoginClick }) {
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();

  const cartInc = useCallback(id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 })), []);
  const cartDec = useCallback(id => setCart(c => { const n = (c[id] || 1) - 1; return n <= 0 ? { ...c, [id]: 0 } : { ...c, [id]: n }; }), []);
  const cartFirstAdd = useCallback(id => setCart(c => ({ ...c, [id]: 1 })), []);
  const cartRemove = useCallback(id => setCart(c => ({ ...c, [id]: 0 })), []);
  const clearFilters = () => { setSelectedSort(null); setSelectedCats([]); setSelectedOrigins([]); };

  // ── Navigation helpers ──────────────────────────────────────────────────
  const goHome = () => navigate("/");
  const goShop = (category = "All") => navigate(buildShopPath(category));
  const goCategory = (payload = {}) => navigate(buildCategoryPath(payload));
  const goProduct = (product) => navigate(`/product/${product.id}`);
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
  const handleCheckout = (items, total) => navigate("/checkout", { state: { items, total } });

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
        onNavigate={(page) => navigate(`/${page}`)}
        onCategorySelect={handleCategorySelect}
      />

      <Routes>
        <Route
          path="/"
          element={
            <div className="flex-1">
              <Home
                cart={cart}
                onInc={cartInc}
                onDec={cartDec}
                onFirstAdd={cartFirstAdd}
                onProductClick={goProduct}
                onShopNow={() => goCategory({ slug: "featured-new", filter: "All", label: "Featured & New" })}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          }
        />
        <Route
          path="/shop"
          element={
            <ShopRoute
              cart={cart} cartInc={cartInc} cartDec={cartDec} cartFirstAdd={cartFirstAdd}
              sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
              selectedSort={selectedSort} setSelectedSort={setSelectedSort}
              selectedCats={selectedCats} setSelectedCats={setSelectedCats}
              selectedOrigins={selectedOrigins} setSelectedOrigins={setSelectedOrigins}
              clearFilters={clearFilters}
              onProductClick={goProduct}
              onBackToHome={goHome}
            />
          }
        />
        <Route
          path="/category/:slug"
          element={
            <CategoryRoute
              cart={cart} onInc={cartInc} onDec={cartDec} onFirstAdd={cartFirstAdd}
              onProductClick={goProduct} onBackToHome={goHome} onNavigateCategory={goCategory}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetailRoute
              cart={cart} onCartInc={cartInc} onCartDec={cartDec} onCartFirstAdd={cartFirstAdd}
            />
          }
        />
        <Route path="/cart" element={<div className="flex-1"><Cart onCheckout={handleCheckout} /></div>} />
        <Route path="/checkout" element={<CheckoutRoute />} />
        <Route path="/orders" element={<div className="flex-1"><Orders /></div>} />
        <Route path="/wishlist" element={<div className="flex-1"><Wishlist /></div>} />
        <Route path="/profile" element={<div className="flex-1"><Profile /></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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
