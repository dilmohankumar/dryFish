import { useState, useCallback } from "react";
import { openRazorpay } from "../hooks/useRazorpay.js";

// ── Icons ──────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
  </svg>
);
const MinusIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
  </svg>
);
const BuyIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg className={`w-3 h-3 ${filled ? "text-amber-400" : "text-gray-200"}`} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);
const LocalIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
  </svg>
);
const ImportIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

// ── Data ───────────────────────────────────────────────────────────────────
export const PRODUCTS = [
  { id: 1,  name: "Dry Prawns [Karandi]",    category: "Prawns",      origin: "Kerala Coast, India",      originType: "Locally Sourced", desc: "Small sun-dried prawns with an intense umami flavour",              weight: "200 g", price: 320,  mrp: 380,  rating: 4, reviews: 128, emoji: "🦐", bg: "#FFF4E6", description: "Hand-picked from the pristine backwaters of Kerala, these small sun-dried prawns are packed with an intense umami flavour. Traditionally dried under the sun for 3–4 days, they retain all their natural oils and nutrients.", howWePickTheBest: ["Sourced directly from licensed coastal fishermen","Sun-dried for a minimum of 72 hours","No artificial preservatives or additives","FSSAI certified processing and packaging unit"], howToUse: "Soak in warm water for 15–20 minutes before cooking. Perfect for curries, chutneys, and coastal rice dishes.", shelfLife: "6 months in an airtight container. Refrigerate after opening.", variants: [{ label: "200 g", price: 320, mrp: 380 },{ label: "500 g", price: 750, mrp: 900 },{ label: "1 kg", price: 1400, mrp: 1700 }], slides: ["🦐","🦐","🦐"] },
  { id: 2,  name: "Bombay Duck [Bombil]",     category: "Bombay Duck", origin: "Mumbai Coast, India",       originType: "Locally Sourced", desc: "Crispy sun-dried Bombay duck, a coastal delicacy",                  weight: "150 g", price: 210,  mrp: 250,  rating: 5, reviews: 94,  emoji: "🐟", bg: "#E8F4FD", description: "Bombay Duck (Bombil) is a quintessential coastal delicacy. Sun-dried on the shores of Mumbai, these fish develop a crispy texture and pungent aroma.", howWePickTheBest: ["Fresh Bombil sourced daily from licensed Mumbai fishermen","Dried on traditional bamboo racks","No chemicals or artificial drying agents","Vacuum packed to preserve freshness"], howToUse: "Deep fry till golden and serve as a side dish, or crumble into curries.", shelfLife: "4 months in an airtight container.", variants: [{ label: "150 g", price: 210, mrp: 250 },{ label: "300 g", price: 400, mrp: 480 }], slides: ["🐟","🐟","🐟"] },
  { id: 3,  name: "Dry Anchovies [Netholi]",  category: "Anchovies",   origin: "Kerala Coast, India",      originType: "Locally Sourced", desc: "Tiny fish packed with calcium and deep sea flavour",                weight: "250 g", price: 180,  mrp: 220,  rating: 4, reviews: 76,  emoji: "🐠", bg: "#F0FFF4", description: "Netholi (Anchovies) are tiny powerhouses of nutrition, an excellent source of calcium and omega-3 fatty acids.", howWePickTheBest: ["Only fresh-catch anchovies selected","Washed and sun-dried within hours of catch","Sorted by size for uniform drying","FSSAI certified facility"], howToUse: "Dry roast and grind into chutney powder, or use whole in coconut-based curries.", shelfLife: "5 months in an airtight container.", variants: [{ label: "250 g", price: 180, mrp: 220 },{ label: "500 g", price: 340, mrp: 420 }], slides: ["🐠","🐠","🐠"] },
  { id: 4,  name: "Dry Sardines [Mathi]",     category: "Sardines",    origin: "Kollam, Kerala",           originType: "Locally Sourced", desc: "Rich in omega-3, traditionally sun-dried on the coast",             weight: "300 g", price: 160,  mrp: 200,  rating: 4, reviews: 112, emoji: "🐡", bg: "#FFF0F3", description: "Mathi (Sardines) are a staple of Kerala coastal cuisine, omega-3 rich and traditionally sun-dried.", howWePickTheBest: ["Freshly caught sardines from Kollam harbour","Gutted, cleaned, and sun-dried traditionally","No added salt beyond natural brine","Quality tested before packaging"], howToUse: "Soak for 20 minutes and cook in spicy coconut curry.", shelfLife: "5 months in a cool dry container.", variants: [{ label: "300 g", price: 160, mrp: 200 },{ label: "600 g", price: 300, mrp: 380 }], slides: ["🐡","🐡","🐡"] },
  { id: 5,  name: "Dry Tuna [Sura]",          category: "Tuna",        origin: "Sri Lanka (Imported)",     originType: "Imported",        desc: "Premium quality dried tuna with meaty texture",                    weight: "200 g", price: 480,  mrp: 560,  rating: 5, reviews: 59,  emoji: "🐟", bg: "#F5F0FF", description: "Premium Sri Lankan sun-dried tuna with a firm, meaty texture for authentic South Indian fish curries.", howWePickTheBest: ["Imported from certified Sri Lankan suppliers","Skipjack tuna — preferred variety for drying","Traditional rope-hanging drying method","Lab tested for quality and safety"], howToUse: "Break into chunks and cook in tamarind-based gravy.", shelfLife: "8 months vacuum sealed.", variants: [{ label: "200 g", price: 480, mrp: 560 },{ label: "500 g", price: 1100, mrp: 1300 }], slides: ["🐟","🐟","🐟"] },
  { id: 6,  name: "Dry Squid [Kanava]",       category: "Squid",       origin: "Kochi, Kerala",            originType: "Locally Sourced", desc: "Tender squid rings dried to perfection",                           weight: "150 g", price: 390,  mrp: 450,  rating: 4, reviews: 43,  emoji: "🦑", bg: "#FFFBEA", description: "Kochi-sourced squid sliced into rings and sun-dried for a chewy, intensely flavourful ingredient.", howWePickTheBest: ["Fresh squid cleaned same-day as catch","Uniform ring slicing for even drying","Salt-cured lightly before sun drying","No artificial tenderisers"], howToUse: "Rehydrate 30 minutes. Stir-fry with coconut oil and spices.", shelfLife: "4 months airtight.", variants: [{ label: "150 g", price: 390, mrp: 450 },{ label: "350 g", price: 850, mrp: 1000 }], slides: ["🦑","🦑","🦑"] },
  { id: 7,  name: "Dry Mackerel [Bangda]",    category: "Mackerel",    origin: "Mangalore, Karnataka",     originType: "Locally Sourced", desc: "Bold flavoured mackerel, staple of coastal kitchens",               weight: "300 g", price: 240,  mrp: 290,  rating: 4, reviews: 87,  emoji: "🐟", bg: "#E6F7FF", description: "Bangda (Indian Mackerel) from Mangalore — the backbone of Konkani and Goan cuisine.", howWePickTheBest: ["Sourced from Mangalore's Old Port fish market","Split and salted before traditional sun drying","Uniform drying and proper salt balance checked","Packed same-day as production"], howToUse: "Grill lightly or add to coconut milk curry.", shelfLife: "5 months in cool dry place.", variants: [{ label: "300 g", price: 240, mrp: 290 },{ label: "700 g", price: 520, mrp: 640 }], slides: ["🐟","🐟","🐟"] },
  { id: 8,  name: "King Prawns Dried",        category: "Prawns",      origin: "Thailand (Imported)",      originType: "Imported",        desc: "Large imported prawns, perfect for curries & stir-fries",          weight: "200 g", price: 650,  mrp: 780,  rating: 5, reviews: 38,  emoji: "🦐", bg: "#FFF4E6", description: "Premium Thai King Prawns sun-dried and vacuum packed for maximum freshness.", howWePickTheBest: ["Grade-A Tiger Prawns from certified Thai farms","Peeled, deveined, sun-dried within 4 hours","Vacuum sealed immediately","Import certified and lab tested"], howToUse: "Soak 20–25 min. Use in biryani, prawn masala, pasta.", shelfLife: "12 months vacuum sealed.", variants: [{ label: "200 g", price: 650, mrp: 780 },{ label: "500 g", price: 1500, mrp: 1800 }], slides: ["🦐","🦐","🦐"] },
  { id: 9,  name: "Coastal Combo Pack",       category: "Combo Packs", origin: "Kerala & Karnataka",       originType: "Locally Sourced", desc: "Assorted dry fish pack — prawns, sardines & anchovies",             weight: "500 g", price: 520,  mrp: 650,  rating: 5, reviews: 201, emoji: "🎁", bg: "#F0FFF4", description: "Our bestselling combo brings together Dry Prawns, Sardines, and Anchovies in one value pack.", howWePickTheBest: ["Each variety from its best coastal region","Freshly packed to order","No mixing of old and new stock","Gift-ready sealed packaging"], howToUse: "Use each variety as per individual recipes.", shelfLife: "5 months. Refrigerate after opening.", variants: [{ label: "500 g (mixed)", price: 520, mrp: 650 },{ label: "1 kg (mixed)", price: 980, mrp: 1250 }], slides: ["🎁","🎁","🎁"] },
  { id: 10, name: "Baby Anchovies [Poovan]",  category: "Anchovies",   origin: "Kozhikode, Kerala",        originType: "Locally Sourced", desc: "Miniature anchovies ideal for chutneys and rice dishes",            weight: "200 g", price: 150,  mrp: 180,  rating: 3, reviews: 55,  emoji: "🐠", bg: "#FFF0F3", description: "Baby anchovies (Poovan) are the tiniest variety of dry fish, incredibly flavourful.", howWePickTheBest: ["Smallest grade anchovies selected","Washed and sun-dried 2 days","No added colouring or chemicals","Packed fresh from Kozhikode unit"], howToUse: "Dry roast and grind into chutney or temper in mustard oil.", shelfLife: "4 months airtight.", variants: [{ label: "200 g", price: 150, mrp: 180 },{ label: "400 g", price: 280, mrp: 340 }], slides: ["🐠","🐠","🐠"] },
  { id: 11, name: "Premium Tuna Chunks",      category: "Tuna",        origin: "Maldives (Imported)",      originType: "Imported",        desc: "Thick-cut tuna pieces with a smoky dry-cured finish",               weight: "250 g", price: 580,  mrp: 700,  rating: 5, reviews: 29,  emoji: "🐟", bg: "#F5F0FF", description: "Maldivian-style thick-cut tuna chunks, dry-cured and smoked before sun drying.", howWePickTheBest: ["Skipjack tuna from certified Maldivian suppliers","Natural salt brine cure, then cold-smoked","3–4cm thick cut for maximum bite","Import certified and batch tested"], howToUse: "Flake into coconut-based curries or rice porridge.", shelfLife: "10 months vacuum sealed.", variants: [{ label: "250 g", price: 580, mrp: 700 },{ label: "600 g", price: 1300, mrp: 1600 }], slides: ["🐟","🐟","🐟"] },
  { id: 12, name: "Mixed Seafood Combo",      category: "Combo Packs", origin: "Multiple Coastal Regions", originType: "Locally Sourced", desc: "6-variety dry fish pack for the ultimate coastal feast",             weight: "750 g", price: 890,  mrp: 1100, rating: 5, reviews: 172, emoji: "🎁", bg: "#E8F4FD", description: "Six coastal favourites — Prawns, Bombay Duck, Anchovies, Sardines, Mackerel, and Squid.", howWePickTheBest: ["Six varieties from their best regional sources","Each individually vacuum-sealed","Production date on each inner pack","Premium gift box available on request"], howToUse: "Each variety comes with a recipe suggestion label.", shelfLife: "5–6 months depending on variety.", variants: [{ label: "750 g (6-pack)", price: 890, mrp: 1100 },{ label: "1.5 kg (6-pack)", price: 1650, mrp: 2100 }], slides: ["🎁","🎁","🎁"] },
];

const discountPct = (p, m) => Math.round(((m - p) / m) * 100);

// ── Global toast (singleton — only one shown at a time) ───────────────────
function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-4 sm:px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-semibold animate-bounce-in
      ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-500 text-white"}`}
      style={{ animation: "slideUp .25s ease" }}
    >
      <span className="text-base">{toast.type === "success" ? "✓" : "✕"}</span>
      <span className="max-w-[260px] truncate">{toast.message}</span>
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 text-xs font-bold">✕</button>
    </div>
  );
}

// ── useBuyFlow ─────────────────────────────────────────────────────────────
function useBuyFlow(product, onToast) {
  const [status, setStatus] = useState("idle");

  const triggerBuy = useCallback(async (variant, qty) => {
    if (status === "paying") return;
    setStatus("paying");
    try {
      await openRazorpay({
        product,
        variant,
        qty,
        onSuccess: (paymentId) => {
          setStatus("success");
          onToast({
            message: `🎉 Order placed! ID: ${paymentId.slice(0, 18)}…`,
            type: "success",
          });
          setTimeout(() => setStatus("idle"), 3000);
        },
        onFailure: (err) => {
          if (err?.reason === "dismissed") {
            setStatus("idle");
          } else {
            setStatus("failed");
            onToast({ message: "Payment failed. Please try again.", type: "error" });
            setTimeout(() => setStatus("idle"), 2000);
          }
        },
      });
    } catch {
      setStatus("idle");
    }
  }, [product, status, onToast]);

  return { status, triggerBuy };
}

// ── Product Card ───────────────────────────────────────────────────────────
function ProductCard({ product, qty, onInc, onDec, onFirstAdd, onCardClick, onToast }) {
  const variant = product.variants[0];
  const { status, triggerBuy } = useBuyFlow(product, onToast);
  const isPaying  = status === "paying";
  const isSuccess = status === "success";
  const hasItems  = qty > 0;
  const total     = variant.price * (qty || 1);

  return (
    <div
      className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col group cursor-pointer"
      onClick={() => onCardClick(product)}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ background: product.bg, height: 160 }}>
        <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl select-none group-hover:scale-110 transition-transform duration-300">
          {product.emoji}
        </div>
        {discountPct(product.price, product.mrp) > 0 && (
          <span className="absolute top-2 left-2 bg-[#E07B39] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
            {discountPct(product.price, product.mrp)}% OFF
          </span>
        )}
        {hasItems && (
          <span className="absolute top-2 right-2 bg-[#1A3A5C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            {qty} in cart
          </span>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-2.5 sm:p-3.5 flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-gray-400">
          {product.originType === "Locally Sourced" ? <LocalIcon /> : <ImportIcon />}
          <span className="truncate">{product.originType}</span>
        </div>

        <h3 className="font-bold text-gray-900 text-[11px] sm:text-xs leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-[9px] sm:text-[10px] text-gray-500 line-clamp-1 hidden sm:block">{product.desc}</p>
        <p className="text-[9px] sm:text-[10px] text-gray-400">{variant.label}</p>

        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => <StarIcon key={i} filled={i < product.rating} />)}
          <span className="text-[9px] text-gray-400 ml-1">({product.reviews})</span>
        </div>

        {/* ── Price row ── */}
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm sm:text-base font-extrabold text-gray-900">₹{variant.price}</span>
          <span className="text-[9px] sm:text-[10px] text-gray-400 line-through">₹{variant.mrp}</span>
          {hasItems && (
            <span className="ml-auto text-[9px] sm:text-[10px] font-bold text-[#1A3A5C]">
              Total ₹{total}
            </span>
          )}
        </div>

        {/* ── Action row ── */}
        <div className="flex items-center gap-1.5 mt-1" onClick={e => e.stopPropagation()}>

          {/* qty stepper OR Add button */}
          {hasItems ? (
            <div className="flex items-center gap-1 bg-gray-100 rounded-full px-1.5 py-1 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onDec(); }}
                className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-[#1A3A5C] transition-colors"
              >
                <MinusIcon />
              </button>
              <span className="text-[11px] font-bold text-gray-800 w-4 text-center tabular-nums">{qty}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onInc(); }}
                className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-[#1A3A5C] transition-colors"
              >
                <PlusIcon />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onFirstAdd(); }}
              className="flex-1 text-[10px] sm:text-xs font-bold py-1.5 rounded-full border-2 border-[#1A3A5C] text-[#1A3A5C] hover:bg-[#EAF1FA] transition-all active:scale-95"
            >
              + Add
            </button>
          )}

          {/* Buy button — always visible, amount = qty × price */}
          <button
            onClick={(e) => { e.stopPropagation(); triggerBuy(variant, qty > 0 ? qty : 1); }}
            disabled={isPaying}
            className={`flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-sm flex-shrink-0
              ${isSuccess
                ? "bg-green-500 text-white"
                : isPaying
                ? "bg-[#1A3A5C]/50 text-white cursor-not-allowed"
                : "bg-[#1A3A5C] text-white hover:bg-[#142d47]"
              }`}
          >
            {isPaying ? (
              <>
                <svg className="w-3 h-3 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="hidden sm:inline">Paying…</span>
              </>
            ) : isSuccess ? (
              <><CheckIcon /><span className="hidden sm:inline">Done!</span></>
            ) : (
              <>
                <BuyIcon />
                <span>
                  {hasItems ? `Buy ₹${total}` : `Buy ₹${variant.price}`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ProductGrid ────────────────────────────────────────────────────────────
export default function ProductGrid({
  products = PRODUCTS,
  cart = {},
  onInc,
  onDec,
  onFirstAdd,
  onProductClick = () => {},
}) {
  const [localCart, setLocalCart] = useState({});
  const [toast, setToast] = useState(null);

  const isControlled = typeof onInc === "function";
  const activeCart   = isControlled ? cart : localCart;
  const handleInc    = isControlled ? onInc    : id => setLocalCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const handleDec    = isControlled ? onDec    : id => setLocalCart(c => { const n=(c[id]||1)-1; return n<=0?{...c,[id]:0}:{...c,[id]:n}; });
  const handleFirst  = isControlled ? onFirstAdd : id => setLocalCart(c => ({ ...c, [id]: 1 }));

  const showToast = useCallback((t) => {
    setToast(t);
    setTimeout(() => setToast(null), 5000);
  }, []);

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-5">
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            qty={activeCart[p.id] || 0}
            onInc={() => handleInc(p.id)}
            onDec={() => handleDec(p.id)}
            onFirstAdd={() => handleFirst(p.id)}
            onCardClick={onProductClick}
            onToast={showToast}
          />
        ))}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}