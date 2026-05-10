import { useState, useCallback } from "react";
import Navbar from "../components/layout/Navbar/navbar.jsx";
import Footer from "../components/layout/Footer/footer.jsx";
import Home from "../pages/home.jsx";
import Sidebar from "../components/layout/sidebar/sidebar.jsx";
import ProductDetail from "../pages/productDetails.jsx";

function App() {
  // ── Filter state (from Sidebar) ──────────────────────────────────────────
  const [selectedSort, setSelectedSort]       = useState(null);
  const [selectedCats, setSelectedCats]       = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [sidebarOpen, setSidebarOpen]         = useState(false);

  // ── Routing: null = home, object = product detail page ───────────────────
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ── Global cart state: { [productId]: qty } ──────────────────────────────
  const [cart, setCart] = useState({});

  // Cart operations
  const cartInc = useCallback((id) => {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }, []);

  const cartDec = useCallback((id) => {
    setCart(c => {
      const n = (c[id] || 1) - 1;
      return n <= 0 ? { ...c, [id]: 0 } : { ...c, [id]: n };
    });
  }, []);

  const cartFirstAdd = useCallback((id) => {
    setCart(c => ({ ...c, [id]: 1 }));
  }, []);

  const cartRemove = useCallback((id) => {
    setCart(c => ({ ...c, [id]: 0 }));
  }, []);

  const handleClearAll = () => {
    setSelectedSort(null);
    setSelectedCats([]);
    setSelectedOrigins([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">

      {/* ── Navbar (always visible, carries cart state) ── */}
      <Navbar
        onOpenSidebar={() => setSidebarOpen(true)}
        cart={cart}
        onCartInc={cartInc}
        onCartDec={cartDec}
        onCartRemove={cartRemove}
        onLogoClick={() => setSelectedProduct(null)}
      />

      {selectedProduct ? (
        // ── Product Detail page (full width, no sidebar) ──────────────────
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
        // ── Home + Sidebar ────────────────────────────────────────────────
        <div className="flex flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 gap-6 sm:gap-8">
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
            selectedCats={selectedCats}
            onCatChange={setSelectedCats}
            selectedOrigins={selectedOrigins}
            onOriginChange={setSelectedOrigins}
            onClearAll={handleClearAll}
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

export default App;