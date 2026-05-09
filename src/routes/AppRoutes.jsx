import { useState } from "react";
import Navbar from "../components/layout/Navbar/navbar.jsx";
import Footer from "../components/layout/Footer/footer.jsx";
import Home from "../pages/home.jsx";
import Sidebar from "../components/layout/sidebar/sidebar.jsx";
import ProductDetail from "../pages/productDetails.jsx";

function App() {
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // null = home
  const [cart, setCart] = useState({});

  const handleClearAll = () => {
    setSelectedSort(null);
    setSelectedCats([]);
    setSelectedOrigins([]);
  };

  const handleAddToCart = (productId, variantLabel, qty) => {
    const key = `${productId}-${variantLabel}`;
    setCart(c => ({ ...c, [key]: qty }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        onOpenSidebar={() => setSidebarOpen(true)}
        cart={cart}
        onLogoClick={() => setSelectedProduct(null)}
      />

      {selectedProduct ? (
        /* ── Product Detail — full width, no sidebar ── */
        <div className="flex-1">
          <ProductDetail
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        </div>
      ) : (
        /* ── Home + Sidebar ── */
        <div className="flex flex-1 max-w-7xl w-full mx-auto px-6 py-6 gap-8">
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
              onAddToCart={handleAddToCart}
            />
          </main>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;