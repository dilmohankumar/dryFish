import { useState, useCallback } from "react";
import Navbar from "../components/layout/Navbar/navbar.jsx";
import Footer from "../components/layout/Footer/footer.jsx";
import Home from "../pages/home.jsx";
import Sidebar from "../components/layout/sidebar/sidebar.jsx";
import ProductDetail from "../pages/productDetails.jsx";
import Login from "../pages/auth/login.jsx";
import Signup from "../pages/auth/signup.jsx";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

// ─ Store layout (Navbar + Sidebar + Home/Detail + Footer) ─  
function StoreLayout({ user, onLogout, onLoginClick }) {
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState({});

  const cartInc = useCallback(id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 })), []);
  const cartDec = useCallback(id => setCart(c => { const n = (c[id] || 1) - 1; return n <= 0 ? { ...c, [id]: 0 } : { ...c, [id]: n }; }), []);
  const cartFirstAdd = useCallback(id => setCart(c => ({ ...c, [id]: 1 })), []);
  const cartRemove = useCallback(id => setCart(c => ({ ...c, [id]: 0 })), []);
  const clearFilters = () => { setSelectedSort(null); setSelectedCats([]); setSelectedOrigins([]); };

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
      />

      {selectedProduct ? (
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

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    navigate("/login", { replace: true });
  };

  return (
    <Routes>
      {/* Auth pages — no navbar/footer */}
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

      {/* Main store — all other paths */}
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