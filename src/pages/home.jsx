import { useMemo, useState } from "react";
import ProductGrid, { PRODUCTS } from "./productGrid";

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

const CATEGORIES = ["All","Prawns","Anchovies","Sardines","Mackerel","Bombay Duck","Tuna","Squid","Combo Packs"];
const discountPct = (p, m) => Math.round(((m - p) / m) * 100);

function applySortAndFilter(products, { selectedSort, selectedCats, selectedOrigins, activeCategory, search }) {
  let list = [...products];
  if (activeCategory && activeCategory !== "All")  list = list.filter(p => p.category === activeCategory);
  if (selectedCats?.length)    list = list.filter(p => selectedCats.includes(p.category));
  if (selectedOrigins?.length) list = list.filter(p => selectedOrigins.includes(p.originType));
  if (search?.trim()) {
    const q = search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
  if (selectedSort === "Alphabetical")           list.sort((a, b) => a.name.localeCompare(b.name));
  if (selectedSort === "Price (Low to High)")    list.sort((a, b) => a.price - b.price);
  if (selectedSort === "Price (High to Low)")    list.sort((a, b) => b.price - a.price);
  if (selectedSort === "Discount (High to Low)") list.sort((a, b) => discountPct(b.price, b.mrp) - discountPct(a.price, a.mrp));
  if (selectedSort === "Popularity")             list.sort((a, b) => b.reviews - a.reviews);
  return list;
}

export default function Home({
  selectedSort = null,
  selectedCats = [],
  selectedOrigins = [],
  cart = {},
  onProductClick = () => {},
  onInc,
  onDec,
  onFirstAdd,
  onOpenSidebar = () => {},
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => applySortAndFilter(PRODUCTS, { selectedSort, selectedCats, selectedOrigins, activeCategory, search }),
    [selectedSort, selectedCats, selectedOrigins, activeCategory, search]
  );

  const activeFilterCount = (selectedCats?.length || 0) + (selectedOrigins?.length || 0) + (selectedSort ? 1 : 0);

  return (
    <div className="flex-1 min-w-0 w-full">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1">
        <span className="hover:text-gray-700 cursor-pointer">Home</span>
        <span>›</span>
        <span className="text-gray-700 font-medium">Dry Fish</span>
      </nav>

      {/* Hero Banner */}
      <div className="rounded-xl sm:rounded-2xl overflow-hidden flex bg-[#EAF1FA] shadow-sm min-h-[130px] sm:min-h-[190px] mb-4 sm:mb-6">
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-4 sm:py-8 gap-1.5 sm:gap-3">
          <p className="text-[9px] sm:text-xs font-bold tracking-[0.2em] text-[#1A3A5C] uppercase">Our Dry Fish</p>
          <p className="text-sm sm:text-lg font-bold text-gray-800 leading-snug">Sun-Dried & Naturally Preserved</p>
          <p className="text-xs text-gray-500 hidden sm:block leading-relaxed">
            Sourced from Coastal Fishing Communities & Verified Suppliers.<br />
            Quality checked by FSSAI certified team.
          </p>
          <p className="text-[10px] text-gray-500 sm:hidden">FSSAI certified · Coastal sourced</p>
        </div>
        <div className="flex w-24 sm:w-52 flex-shrink-0 bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-50 items-center justify-center">
          <span className="text-3xl sm:text-6xl select-none">🐟🦐🦑</span>
        </div>
      </div>

      {/* Top bar */}
      <div className="flex flex-col gap-2 mb-3 sm:mb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900">Dry Fish</h1>
            <button className="hidden sm:flex items-center gap-1 text-[#1A3A5C] text-sm font-semibold hover:underline">
              Categories <ChevronDown />
            </button>
          </div>
          <button
            onClick={onOpenSidebar}
            className="md:hidden flex items-center gap-1.5 border border-gray-200 bg-white text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full hover:border-[#1A3A5C] transition-colors"
          >
            <FilterIcon /> Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#1A3A5C] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dry fish, prawns, squid…"
            className="w-full pl-9 pr-8 py-2 rounded-full border border-gray-200 bg-gray-50 text-xs sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 focus:border-[#1A3A5C] transition-all"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border text-[10px] sm:text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-[#EAF1FA] border-[#1A3A5C] text-[#1A3A5C]"
                : "bg-white border-gray-200 text-gray-600 hover:border-[#1A3A5C] hover:text-[#1A3A5C]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
        <p className="text-xs text-gray-400">
          <span className="font-semibold text-gray-600">{filtered.length}</span> products
          {activeCategory !== "All" && <> · <span className="text-[#1A3A5C] font-semibold">{activeCategory}</span></>}
          {search && <> · "<span className="text-[#1A3A5C] font-semibold">{search}</span>"</>}
        </p>
        <div className="flex flex-wrap gap-1">
          {selectedSort && <span className="text-[9px] bg-[#EAF1FA] text-[#1A3A5C] border border-[#1A3A5C]/20 rounded-full px-2 py-0.5 font-medium">{selectedSort}</span>}
          {selectedCats?.map(c => <span key={c} className="text-[9px] bg-[#EAF1FA] text-[#1A3A5C] border border-[#1A3A5C]/20 rounded-full px-2 py-0.5 font-medium">{c}</span>)}
          {selectedOrigins?.map(o => <span key={o} className="text-[9px] bg-[#FFF4E6] text-[#E07B39] border border-[#E07B39]/20 rounded-full px-2 py-0.5 font-medium">{o}</span>)}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm font-medium text-gray-600">No products found</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search</p>
          <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="mt-4 text-sm text-[#1A3A5C] font-semibold underline underline-offset-2">
            Clear all
          </button>
        </div>
      ) : (
        <ProductGrid
          products={filtered}
          cart={cart}
          onInc={onInc}
          onDec={onDec}
          onFirstAdd={onFirstAdd}
          onProductClick={onProductClick}
        />
      )}
    </div>
  );
}