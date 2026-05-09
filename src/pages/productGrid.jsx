import { useState } from "react";

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const MinusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg className={`w-3.5 h-3.5 ${filled ? "text-amber-400" : "text-gray-300"}`} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);
const LocalIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
  </svg>
);
const ImportIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
  </svg>
);

export const PRODUCTS = [
  {
    id: 1,  name: "Dry Prawns [Karandi]",    category: "Prawns",      origin: "Kerala Coast, India", originType: "Locally Sourced",
    desc: "Small sun-dried prawns with an intense umami flavour", weight: "200 g", price: 320, mrp: 380, rating: 4, reviews: 128, emoji: "🦐", bg: "#FFF4E6",
    description: "Hand-picked from the pristine backwaters of Kerala, these small sun-dried prawns are packed with an intense umami flavour. Traditionally dried under the sun for 3–4 days, they retain all their natural oils and nutrients.",
    howWePickTheBest: ["Sourced directly from licensed coastal fishermen","Sun-dried for a minimum of 72 hours","No artificial preservatives or additives","FSSAI certified processing and packaging unit"],
    howToUse: "Soak in warm water for 15–20 minutes before cooking. Perfect for curries, chutneys, and coastal rice dishes.",
    shelfLife: "6 months in an airtight container. Refrigerate after opening. Best consumed within 30 days of opening.",
    variants: [{ label: "200 g", price: 320, mrp: 380 }, { label: "500 g", price: 750, mrp: 900 }, { label: "1 kg", price: 1400, mrp: 1700 }],
    slides: ["🦐", "🦐", "🦐"],
  },
  {
    id: 2,  name: "Bombay Duck [Bombil]",     category: "Bombay Duck", origin: "Mumbai Coast, India", originType: "Locally Sourced",
    desc: "Crispy sun-dried Bombay duck, a coastal delicacy", weight: "150 g", price: 210, mrp: 250, rating: 5, reviews: 94,  emoji: "🐟", bg: "#E8F4FD",
    description: "Bombay Duck (Bombil) is a quintessential coastal delicacy. Sun-dried on the shores of Mumbai, these fish develop a crispy texture and a pungent, distinctive aroma that's beloved across Maharashtra and beyond.",
    howWePickTheBest: ["Fresh Bombil sourced daily from licensed Mumbai fishermen","Dried on traditional bamboo racks under direct sunlight","No chemicals or artificial drying agents used","Vacuum packed to preserve freshness"],
    howToUse: "Deep fry till golden and serve as a side dish, or crumble into curries for added depth.",
    shelfLife: "4 months in an airtight container in a cool, dry place.",
    variants: [{ label: "150 g", price: 210, mrp: 250 }, { label: "300 g", price: 400, mrp: 480 }],
    slides: ["🐟", "🐟", "🐟"],
  },
  {
    id: 3,  name: "Dry Anchovies [Netholi]",  category: "Anchovies",   origin: "Kerala Coast, India", originType: "Locally Sourced",
    desc: "Tiny fish packed with calcium and deep sea flavour", weight: "250 g", price: 180, mrp: 220, rating: 4, reviews: 76,  emoji: "🐠", bg: "#F0FFF4",
    description: "Netholi (Anchovies) are tiny powerhouses of nutrition. Sun-dried on the Malabar coast, these small fish are an excellent source of calcium and omega-3 fatty acids, making them as nutritious as they are delicious.",
    howWePickTheBest: ["Only fresh-catch anchovies are selected","Washed and sun-dried within hours of catch","Sorted by size for uniform drying","FSSAI certified facility"],
    howToUse: "Dry roast and grind into chutney powder, or use whole in coconut-based curries and sambar.",
    shelfLife: "5 months in an airtight container away from moisture.",
    variants: [{ label: "250 g", price: 180, mrp: 220 }, { label: "500 g", price: 340, mrp: 420 }],
    slides: ["🐠", "🐠", "🐠"],
  },
  {
    id: 4,  name: "Dry Sardines [Mathi]",     category: "Sardines",    origin: "Kollam, Kerala",      originType: "Locally Sourced",
    desc: "Rich in omega-3, traditionally sun-dried on the coast", weight: "300 g", price: 160, mrp: 200, rating: 4, reviews: 112, emoji: "🐡", bg: "#FFF0F3",
    description: "Mathi (Sardines) are a staple of Kerala coastal cuisine. These omega-3 rich fish are traditionally sun-dried and used in iconic dishes like Mathi Curry and Kappa Meen.",
    howWePickTheBest: ["Freshly caught sardines from Kollam fishing harbour","Gutted, cleaned, and sun-dried traditionally","No added salt beyond natural brine","Quality tested before packaging"],
    howToUse: "Soak for 20 minutes and cook in spicy coconut curry, or shallow fry with onions and chillies.",
    shelfLife: "5 months in a cool, dry airtight container.",
    variants: [{ label: "300 g", price: 160, mrp: 200 }, { label: "600 g", price: 300, mrp: 380 }],
    slides: ["🐡", "🐡", "🐡"],
  },
  {
    id: 5,  name: "Dry Tuna [Sura]",          category: "Tuna",        origin: "Sri Lanka (Imported)", originType: "Imported",
    desc: "Premium quality dried tuna with meaty texture", weight: "200 g", price: 480, mrp: 560, rating: 5, reviews: 59,  emoji: "🐟", bg: "#F5F0FF",
    description: "Premium Sri Lankan sun-dried tuna with a firm, meaty texture. This is the go-to ingredient for authentic South Indian fish curries and Maldivian-style preparations.",
    howWePickTheBest: ["Imported from certified Sri Lankan suppliers","Skipjack tuna — the preferred variety for drying","Dried using traditional rope-hanging method","Lab tested for quality and safety"],
    howToUse: "Break into chunks and cook in tamarind-based gravy, or flake into rice dishes.",
    shelfLife: "8 months in vacuum sealed packaging. Refrigerate after opening.",
    variants: [{ label: "200 g", price: 480, mrp: 560 }, { label: "500 g", price: 1100, mrp: 1300 }],
    slides: ["🐟", "🐟", "🐟"],
  },
  {
    id: 6,  name: "Dry Squid [Kanava]",       category: "Squid",       origin: "Kochi, Kerala",       originType: "Locally Sourced",
    desc: "Tender squid rings dried to perfection", weight: "150 g", price: 390, mrp: 450, rating: 4, reviews: 43,  emoji: "🦑", bg: "#FFFBEA",
    description: "Kochi-sourced squid cleaned, sliced into rings, and sun-dried to create a chewy, intensely flavourful ingredient. A favourite in Kerala and Goa coastal cooking.",
    howWePickTheBest: ["Fresh squid cleaned same-day as catch","Sliced to uniform rings for even drying","Salt-cured lightly before sun drying","No artificial tenderisers used"],
    howToUse: "Rehydrate in warm water for 30 minutes. Stir-fry with coconut oil and spices, or add to seafood curries.",
    shelfLife: "4 months in an airtight container.",
    variants: [{ label: "150 g", price: 390, mrp: 450 }, { label: "350 g", price: 850, mrp: 1000 }],
    slides: ["🦑", "🦑", "🦑"],
  },
  {
    id: 7,  name: "Dry Mackerel [Bangda]",    category: "Mackerel",    origin: "Mangalore, Karnataka", originType: "Locally Sourced",
    desc: "Bold flavoured mackerel, staple of coastal kitchens", weight: "300 g", price: 240, mrp: 290, rating: 4, reviews: 87,  emoji: "🐟", bg: "#E6F7FF",
    description: "Bangda (Indian Mackerel) from Mangalore has a bold, robust flavour that's the backbone of Konkani and Goan cuisine. Sun-dried whole or split, it delivers maximum taste.",
    howWePickTheBest: ["Sourced from Mangalore's Old Port fish market","Split and salted before traditional sun drying","Checked for uniform drying and proper salt balance","Packed same-day as production"],
    howToUse: "Grill lightly or add to coconut milk curry. Also delicious in rice-based one-pot dishes.",
    shelfLife: "5 months in a cool, dry place.",
    variants: [{ label: "300 g", price: 240, mrp: 290 }, { label: "700 g", price: 520, mrp: 640 }],
    slides: ["🐟", "🐟", "🐟"],
  },
  {
    id: 8,  name: "King Prawns Dried",        category: "Prawns",      origin: "Thailand (Imported)",  originType: "Imported",
    desc: "Large imported prawns, perfect for curries & stir-fries", weight: "200 g", price: 650, mrp: 780, rating: 5, reviews: 38,  emoji: "🦐", bg: "#FFF4E6",
    description: "Premium Thai King Prawns sun-dried and vacuum packed for maximum freshness. Their large size and meaty texture make them the ideal premium ingredient for biryani, curries, and seafood pasta.",
    howWePickTheBest: ["Grade-A Tiger Prawns from certified Thai farms","Peeled, deveined, and sun-dried within 4 hours of harvest","Vacuum sealed immediately after drying","Import certified and lab tested"],
    howToUse: "Soak for 20–25 minutes. Use in biryani, prawn masala, pasta, or Asian stir-fries.",
    shelfLife: "12 months vacuum sealed. 45 days refrigerated after opening.",
    variants: [{ label: "200 g", price: 650, mrp: 780 }, { label: "500 g", price: 1500, mrp: 1800 }],
    slides: ["🦐", "🦐", "🦐"],
  },
  {
    id: 9,  name: "Coastal Combo Pack",       category: "Combo Packs", origin: "Kerala & Karnataka",   originType: "Locally Sourced",
    desc: "Assorted dry fish pack — prawns, sardines & anchovies", weight: "500 g", price: 520, mrp: 650, rating: 5, reviews: 201, emoji: "🎁", bg: "#F0FFF4",
    description: "Our bestselling combo brings together three coastal favourites — Dry Prawns, Sardines, and Anchovies — in one value pack. Perfect for those who love variety in their coastal cooking.",
    howWePickTheBest: ["Each variety sourced from its best coastal region","All three products freshly packed to order","No mixing of old and new stock","Gift-ready sealed packaging"],
    howToUse: "Use each variety as per individual recipes. See enclosed recipe card for three quick-cook ideas.",
    shelfLife: "5 months for all three varieties. Refrigerate after opening individual packs.",
    variants: [{ label: "500 g (mixed)", price: 520, mrp: 650 }, { label: "1 kg (mixed)", price: 980, mrp: 1250 }],
    slides: ["🎁", "🎁", "🎁"],
  },
  {
    id: 10, name: "Baby Anchovies [Poovan]",  category: "Anchovies",   origin: "Kozhikode, Kerala",    originType: "Locally Sourced",
    desc: "Miniature anchovies ideal for chutneys and rice dishes", weight: "200 g", price: 150, mrp: 180, rating: 3, reviews: 55,  emoji: "🐠", bg: "#FFF0F3",
    description: "Baby anchovies (Poovan) are the tiniest variety of dry fish and are incredibly flavourful. A staple in North Kerala homes, they are used to make spicy chutneys and mixed into plain rice.",
    howWePickTheBest: ["Only the smallest grade anchovies selected","Washed in clean water and sun-dried for 2 days","No added colouring or chemicals","Packed fresh from Kozhikode processing unit"],
    howToUse: "Dry roast and grind into chutney with coconut, or temper in mustard oil and serve with rice.",
    shelfLife: "4 months in an airtight container away from sunlight.",
    variants: [{ label: "200 g", price: 150, mrp: 180 }, { label: "400 g", price: 280, mrp: 340 }],
    slides: ["🐠", "🐠", "🐠"],
  },
  {
    id: 11, name: "Premium Tuna Chunks",      category: "Tuna",        origin: "Maldives (Imported)",  originType: "Imported",
    desc: "Thick-cut tuna pieces with a smoky dry-cured finish", weight: "250 g", price: 580, mrp: 700, rating: 5, reviews: 29,  emoji: "🐟", bg: "#F5F0FF",
    description: "Maldivian-style thick-cut tuna chunks, dry-cured and smoked before sun drying. This premium product has a deep smoky flavour profile that elevates any dish it's added to.",
    howWePickTheBest: ["Skipjack tuna from certified Maldivian suppliers","Cured in natural salt brine, then cold-smoked","Thick-cut at 3–4cm for maximum bite","Import certified and batch tested"],
    howToUse: "Flake into coconut-based curries or use as a topping on rice porridge. Also pairs beautifully with lemon and olive oil.",
    shelfLife: "10 months vacuum sealed. Best consumed within 60 days of opening.",
    variants: [{ label: "250 g", price: 580, mrp: 700 }, { label: "600 g", price: 1300, mrp: 1600 }],
    slides: ["🐟", "🐟", "🐟"],
  },
  {
    id: 12, name: "Mixed Seafood Combo",      category: "Combo Packs", origin: "Multiple Coastal Regions", originType: "Locally Sourced",
    desc: "6-variety dry fish pack for the ultimate coastal feast", weight: "750 g", price: 890, mrp: 1100, rating: 5, reviews: 172, emoji: "🎁", bg: "#E8F4FD",
    description: "Six coastal favourites in one box — Prawns, Bombay Duck, Anchovies, Sardines, Mackerel, and Squid. The ultimate gift for dry fish lovers or a full pantry restocking solution.",
    howWePickTheBest: ["Six distinct varieties from their best regional sources","Each variety individually vacuum-sealed","Production date printed on each inner pack","Premium gift box packaging available on request"],
    howToUse: "Each variety comes with a recipe suggestion label. Explore six different coastal preparations from one box.",
    shelfLife: "5–6 months depending on variety. See individual inner packs for specific dates.",
    variants: [{ label: "750 g (6-pack)", price: 890, mrp: 1100 }, { label: "1.5 kg (6-pack)", price: 1650, mrp: 2100 }],
    slides: ["🎁", "🎁", "🎁"],
  },
];

const discount = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

// ── Product Card ───────────────────────────────────────────────────────────
function ProductCard({ product, qty, onAdd, onInc, onDec, onCardClick }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col cursor-pointer"
      onClick={() => onCardClick(product)}
    >
      <div className="relative" style={{ background: product.bg, height: 200 }}>
        <div className="absolute inset-0 flex items-center justify-center text-8xl select-none">
          {product.emoji}
        </div>
        {discount(product.price, product.mrp) > 0 && (
          <span className="absolute top-3 left-3 bg-[#E07B39] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {discount(product.price, product.mrp)}% OFF
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
          {product.originType === "Locally Sourced" ? <LocalIcon /> : <ImportIcon />}
          <span>{product.originType}</span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-snug">{product.name}</h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{product.desc}</p>
        <p className="text-xs text-gray-400">{product.weight}</p>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => <StarIcon key={i} filled={i < product.rating} />)}
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="text-base font-extrabold text-gray-900">₹{product.price}</span>
            <span className="text-xs text-gray-400 line-through ml-1.5">₹{product.mrp}</span>
          </div>

          {qty === 0 ? (
            <button
              onClick={e => { e.stopPropagation(); onAdd(); }}
              className="bg-[#1A3A5C] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#142d47] transition-colors"
            >
              Add
            </button>
          ) : (
            <div
              className="flex items-center gap-2 bg-[#1A3A5C] rounded-full px-2 py-1"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={onDec} className="text-white hover:text-[#E07B39] transition-colors"><MinusIcon /></button>
              <span className="text-white text-sm font-bold w-4 text-center">{qty}</span>
              <button onClick={onInc} className="text-white hover:text-[#E07B39] transition-colors"><PlusIcon /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ProductGrid ────────────────────────────────────────────────────────────
// Props:
//   products      — array of products to display
//   cart          — { [id]: qty }
//   onAdd/Inc/Dec — cart handlers
//   onProductClick— (product) => void  ← opens detail page
export default function ProductGrid({
  products = PRODUCTS,
  cart = {},
  onAdd,
  onInc,
  onDec,
  onProductClick = () => {},
}) {
  const [localCart, setLocalCart] = useState({});

  const isControlled = typeof onAdd === "function";
  const activeCart   = isControlled ? cart : localCart;
  const handleAdd    = isControlled ? onAdd  : id => setLocalCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const handleInc    = isControlled ? onInc  : id => setLocalCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const handleDec    = isControlled ? onDec  : id => setLocalCart(c => { const n=(c[id]||1)-1; return n<=0?{...c,[id]:0}:{...c,[id]:n}; });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          qty={activeCart[p.id] || 0}
          onAdd={() => handleAdd(p.id)}
          onInc={() => handleInc(p.id)}
          onDec={() => handleDec(p.id)}
          onCardClick={onProductClick}
        />
      ))}
    </div>
  );
}