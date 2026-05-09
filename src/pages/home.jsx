import { useMemo, useState } from "react";
import ProductGrid, { PRODUCTS } from "../pages/productGrid";

// ── Icons ──────────────────────────────────────────────────────────────────
const ChevronDown = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
  </svg>
);

// ── Categories ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  "All", "Prawns", "Anchovies", "Sardines",
  "Mackerel", "Bombay Duck", "Tuna", "Squid", "Combo Packs",
];

// ── Sort helper ────────────────────────────────────────────────────────────
const discountPct = (p, m) => Math.round(((m - p) / m) * 100);

function applySortAndFilter(products, { selectedSort, selectedCats, selectedOrigins, activeCategory, search }) {
  let list = [...products];

  // Category pill filter
  if (activeCategory && activeCategory !== "All") {
    list = list.filter(p => p.category === activeCategory);
  }

  // Sidebar category checkboxes
  if (selectedCats && selectedCats.length > 0) {
    list = list.filter(p => selectedCats.includes(p.category));
  }

  // Sidebar origin checkboxes
  if (selectedOrigins && selectedOrigins.length > 0) {
    list = list.filter(p => selectedOrigins.includes(p.originType));
  }

  // Search
  if (search && search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Sort
  if (selectedSort === "Alphabetical")          list.sort((a, b) => a.name.localeCompare(b.name));
  if (selectedSort === "Price (Low to High)")   list.sort((a, b) => a.price - b.price);
  if (selectedSort === "Price (High to Low)")   list.sort((a, b) => b.price - a.price);
  if (selectedSort === "Discount (High to Low)")list.sort((a, b) => discountPct(b.price, b.mrp) - discountPct(a.price, a.mrp));
  if (selectedSort === "Popularity")            list.sort((a, b) => b.reviews - a.reviews);

  return list;
}

// ── Home Page ──────────────────────────────────────────────────────────────
// Props passed from App.jsx:
//   selectedSort, selectedCats, selectedOrigins  — from Sidebar
//   cart                                         — shared cart state
//   onProductClick(product)                      — opens ProductDetail
//   onAddToCart(productId, variantLabel, qty)     — updates cart in App
//   onOpenSidebar()                              — opens mobile sidebar drawer
export default function Home({
  selectedSort = null,
  selectedCats = [],
  selectedOrigins = [],
  cart = {},
  onProductClick = () => {},
  onAddToCart = () => {},
  onOpenSidebar = () => {},
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Local cart (fallback if App doesn't pass cart handlers)
  const [localCart, setLocalCart] = useState({});
  const activeCart = Object.keys(cart).length > 0 ? cart : localCart;

  const handleAdd = (id) => {
    setLocalCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
    onAddToCart(id, PRODUCTS.find(p => p.id === id)?.variants?.[0]?.label || "default", 1);
  };
  const handleInc = (id) => {
    setLocalCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
    onAddToCart(id, PRODUCTS.find(p => p.id === id)?.variants?.[0]?.label || "default", (activeCart[id] || 0) + 1);
  };
  const handleDec = (id) => {
    setLocalCart(c => { const n = (c[id] || 1) - 1; return n <= 0 ? { ...c, [id]: 0 } : { ...c, [id]: n }; });
  };

  const filtered = useMemo(() =>
    applySortAndFilter(PRODUCTS, { selectedSort, selectedCats, selectedOrigins, activeCategory, search }),
    [selectedSort, selectedCats, selectedOrigins, activeCategory, search]
  );

  return (
    <div className="flex-1 min-w-0">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1">
        <span className="hover:text-gray-700 cursor-pointer transition-colors">Home</span>
        <span>›</span>
        <span className="text-gray-700 font-medium">Dry Fish</span>
      </nav>

      {/* Hero Banner */}
      <div className="rounded-2xl overflow-hidden flex bg-[#EAF1FA] shadow-sm min-h-[200px] mb-6">
        <div className="flex-1 flex flex-col justify-center px-8 py-8 gap-3">
          <p className="text-xs font-bold tracking-[0.2em] text-[#1A3A5C] uppercase">Our Dry Fish</p>
          <p className="text-lg font-bold text-gray-800">Sun-Dried & Naturally Preserved</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Sourced from Coastal Fishing Communities &amp; Verified Suppliers.<br />
            Quality checked by FSSAI certified team.
          </p>
        </div>
        <div className="hidden sm:flex w-56 flex-shrink-0 overflow-hidden rounded-r-2xl bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-50 items-center justify-center">
          <span className="text-6xl select-none">🐟🦐🦑</span>
        </div>
      </div>

      {/* Heading + mobile filter button + search */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-gray-900">Dry Fish</h1>
            <button className="flex items-center gap-1 text-[#1A3A5C] text-sm font-semibold hover:underline">
              Categories <ChevronDown />
            </button>
          </div>

          {/* Mobile: filter trigger */}
          <button
            onClick={onOpenSidebar}
            className="md:hidden flex items-center gap-1.5 border border-gray-200 bg-white text-gray-600 text-sm font-medium px-3 py-1.5 rounded-full hover:border-[#1A3A5C] transition-colors"
          >
            <FilterIcon /> Filters
            {(selectedCats.length + selectedOrigins.length + (selectedSort ? 1 : 0)) > 0 && (
              <span className="bg-[#1A3A5C] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {selectedCats.length + selectedOrigins.length + (selectedSort ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dry fish, prawns, squid…"
            className="w-full max-w-md pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 focus:border-[#1A3A5C] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-[#EAF1FA] border-[#1A3A5C] text-[#1A3A5C]"
                : "bg-white border-gray-200 text-gray-600 hover:border-[#1A3A5C] hover:text-[#1A3A5C]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result count + active filters */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-xs text-gray-400">
          Showing <span className="font-semibold text-gray-600">{filtered.length}</span> products
          {activeCategory !== "All" && (
            <> in <span className="text-[#1A3A5C] font-semibold">{activeCategory}</span></>
          )}
          {search && (
            <> for <span className="text-[#1A3A5C] font-semibold">"{search}"</span></>
          )}
        </p>

        {/* Active filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {selectedSort && (
            <span className="text-xs bg-[#EAF1FA] text-[#1A3A5C] border border-[#1A3A5C]/20 rounded-full px-2.5 py-0.5 font-medium">
              {selectedSort}
            </span>
          )}
          {selectedCats.map(c => (
            <span key={c} className="text-xs bg-[#EAF1FA] text-[#1A3A5C] border border-[#1A3A5C]/20 rounded-full px-2.5 py-0.5 font-medium">
              {c}
            </span>
          ))}
          {selectedOrigins.map(o => (
            <span key={o} className="text-xs bg-[#FFF4E6] text-[#E07B39] border border-[#E07B39]/20 rounded-full px-2.5 py-0.5 font-medium">
              {o}
            </span>
          ))}
        </div>
      </div>

      {/* Product Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-base font-medium text-gray-600">No products found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search term</p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("All"); }}
            className="mt-4 text-sm text-[#1A3A5C] font-semibold underline underline-offset-2"
          >
            Clear search & filters
          </button>
        </div>
      ) : (
        <ProductGrid
          products={filtered}
          cart={activeCart}
          onAdd={handleAdd}
          onInc={handleInc}
          onDec={handleDec}
          onProductClick={onProductClick}
        />
      )}
    </div>
  );
}