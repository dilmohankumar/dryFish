import { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────
const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);
const ChevronLeft = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const MinusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? "text-amber-400" : "text-gray-200"}`} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);
const BackIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);
const TruckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m0 0h3l3 4v4h-3m0 0a2 2 0 11-4 0m4 0a2 2 0 01-4 0M9 17a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const SparkleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// ── Default product data — replace with props or route params ──────────────
const DEFAULT_PRODUCT = {
  id: 1,
  name: "Dry Prawns [Karandi]",
  category: "Prawns",
  origin: "Kerala Coast, India",
  originType: "Locally Sourced",
  description:
    "Hand-picked from the pristine backwaters of Kerala, these small sun-dried prawns are packed with an intense umami flavour. Traditionally dried under the sun for 3–4 days, they retain all their natural oils and nutrients. The drying process intensifies the natural sweetness and brininess, making them an essential ingredient in coastal cuisine.",
  howWePickTheBest: [
    "Sourced directly from licensed coastal fishermen",
    "Sun-dried for a minimum of 72 hours for optimal moisture removal",
    "No artificial preservatives or additives",
    "Uniform size — only medium-grade prawns selected",
    "Produce with shell damage, discolouration, or odour is rejected",
    "FSSAI certified processing and packaging unit",
  ],
  howToUse:
    "Soak in warm water for 15–20 minutes before cooking. Perfect for curries, chutneys, stir-fries, and coastal rice dishes. Can also be dry-roasted and ground into a flavour powder.",
  shelfLife:
    "Dry prawns have a shelf life of 6 months when stored in an airtight container in a cool, dry place. For extended freshness, refrigerate after opening. Avoid exposure to moisture as it can cause spoilage. Best consumed within 30 days of opening.",
  variants: [
    { label: "200 g", price: 320, mrp: 380 },
    { label: "500 g", price: 750, mrp: 900 },
    { label: "1 kg",  price: 1400, mrp: 1700 },
  ],
  rating: 4,
  reviews: 128,
  slides: ["🦐", "🦐", "🦐"],
  bg: "#FFF4E6",
};

const Stars = ({ rating }) =>
  Array.from({ length: 5 }, (_, i) => <StarIcon key={i} filled={i < rating} />);

const discount = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

// ── Peace-of-mind cards ────────────────────────────────────────────────────
const PROMISES = [
  {
    icon: <TruckIcon />,
    title: "Next Day Morning Delivery",
    desc: "Order before 11:59 PM and get next day morning delivery starting at 6 AM",
  },
  {
    icon: <SparkleIcon />,
    title: "Sun-Dried & Natural",
    desc: "Ordered naturally dried items? They are processed without any chemicals. Pure is the way to go",
  },
  {
    icon: <ShieldIcon />,
    title: "FSSAI Certified",
    desc: "Quality control for every order done by our experienced FSSAI certified team",
  },
];

// ── ProductDetail ──────────────────────────────────────────────────────────
// Props:
//   product  — product object (defaults to DEFAULT_PRODUCT)
//   onBack   — function called when back button is clicked
//   onAddToCart — function(productId, variantLabel, qty) called on add
export default function ProductDetail({
  product = DEFAULT_PRODUCT,
  onBack,
  onAddToCart,
}) {
  const [slide, setSlide] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [qty, setQty] = useState(0);
  const [added, setAdded] = useState(false);

  const variant = product.variants[selectedVariant];

  const handleAdd = () => {
    const newQty = qty === 0 ? 1 : qty;
    setQty(newQty);
    setAdded(true);
    if (onAddToCart) onAddToCart(product.id, variant.label, newQty);
    setTimeout(() => setAdded(false), 1500);
  };

  const prevSlide = () => setSlide(s => (s - 1 + product.slides.length) % product.slides.length);
  const nextSlide = () => setSlide(s => (s + 1) % product.slides.length);

  return (
    <div className="bg-white min-h-screen font-sans">

      {/* ── Breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-6 pt-5 pb-2">
        <nav className="flex items-center gap-1 text-sm text-gray-400">
          <button onClick={onBack} className="hover:text-gray-700 transition-colors flex items-center gap-1">
            <BackIcon /> Home
          </button>
          <span>›</span>
          <span className="hover:text-gray-700 cursor-pointer transition-colors">{product.category || "Dry Fish"}</span>
          <span>›</span>
          <span className="text-gray-700 font-medium truncate max-w-xs">
            {product.name.toLowerCase().replace(/\s+/g, "-")}
          </span>
        </nav>
      </div>

      {/* ── Hero: image + info ── */}
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Left — image slider */}
        <div className="relative">
          {/* Share */}
          <button className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-2 text-gray-500 hover:text-[#1A3A5C] transition-colors shadow-sm">
            <ShareIcon />
          </button>

          {/* Slide */}
          <div
            className="rounded-2xl flex items-center justify-center overflow-hidden"
            style={{ background: product.bg, minHeight: 380 }}
          >
            <span className="text-[140px] select-none">{product.slides[slide]}</span>
          </div>

          {/* Dots + arrows */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <div className="flex items-center gap-2">
              {product.slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`rounded-full transition-all ${
                    i === slide
                      ? "w-3 h-3 bg-[#1A3A5C]"
                      : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={prevSlide}
                className="border border-gray-200 rounded-lg p-2 text-gray-500 hover:border-[#1A3A5C] hover:text-[#1A3A5C] transition-colors bg-white"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="border border-gray-200 rounded-lg p-2 text-gray-500 hover:border-[#1A3A5C] hover:text-[#1A3A5C] transition-colors bg-white"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Right — product info */}
        <div className="flex flex-col gap-5">

          {/* Name */}
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{variant.label}</p>
          </div>

          {/* Origin */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-base">🌍</span>
            <span className="font-medium">{product.origin}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs bg-[#EAF1FA] text-[#1A3A5C] font-medium px-2 py-0.5 rounded-full">
              {product.originType}
            </span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-2">
            <div className="flex">{Array.from({ length: 5 }, (_, i) => <StarIcon key={i} filled={i < product.rating} />)}</div>
            <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
          </div>

          {/* Variant selector */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Weight</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedVariant(i); setQty(0); }}
                  className={`flex items-center gap-2 border rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    selectedVariant === i
                      ? "border-[#1A3A5C] bg-[#1A3A5C] text-white"
                      : "border-gray-200 text-gray-700 hover:border-[#1A3A5C]"
                  }`}
                >
                  <span>{v.label}</span>
                  <span className={selectedVariant === i ? "text-white/70" : "text-gray-400"}>
                    — ₹{v.price}
                  </span>
                  {selectedVariant === i && (
                    <span className="ml-1 bg-white/20 rounded-full p-0.5">
                      <CheckIcon />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-gray-900">₹{variant.price}</span>
            <span className="text-base text-gray-400 line-through">₹{variant.mrp}</span>
            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              {discount(variant.price, variant.mrp)}% OFF
            </span>
          </div>

          {/* Add to cart */}
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-[#1A3A5C] text-white hover:bg-[#142d47] active:scale-[0.98]"
              }`}
            >
              {added ? "✓ Added to Cart!" : "Add"}
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 bg-[#1A3A5C] rounded-2xl px-5 py-3 flex-1 justify-between">
                <button
                  onClick={() => setQty(q => Math.max(0, q - 1))}
                  className="text-white hover:text-[#E07B39] transition-colors"
                >
                  <MinusIcon />
                </button>
                <span className="text-white text-xl font-bold">{qty}</span>
                <button
                  onClick={() => {
                    setQty(q => q + 1);
                    if (onAddToCart) onAddToCart(product.id, variant.label, qty + 1);
                  }}
                  className="text-white hover:text-[#E07B39] transition-colors"
                >
                  <PlusIcon />
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Total: <span className="font-bold text-gray-800">₹{variant.price * qty}</span>
              </p>
            </div>
          )}

          {/* Delivery note */}
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
            <TruckIcon />
            <span>Free delivery · Order before 11:59 PM for next-day morning delivery</span>
          </div>
        </div>
      </div>

      {/* ── Below fold: description sections ── */}
      <div className="max-w-6xl mx-auto px-6 py-10 border-t border-gray-100 space-y-12">

        {/* Description */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>
        </section>

        {/* How We Pick The Best */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Pick The Best For You?</h2>
          <ul className="space-y-2">
            {product.howWePickTheBest.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600 text-base">
                <span className="text-gray-400 mt-0.5">–</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* How to Use */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">How To Use</h2>
          <p className="text-gray-600 leading-relaxed text-base">{product.howToUse}</p>
        </section>

        {/* Shelf Life & Storage */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Shelf Life and Storage</h2>
          <p className="text-gray-600 leading-relaxed text-base">{product.shelfLife}</p>
        </section>

        {/* Get dryfish.co — lifestyle cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Get dryfish.co</h2>
          <p className="text-gray-500 mt-1 mb-5">Meet your lifestyle needs with us</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { bg: "#EAF1FA", title: "how dryfish.co helps with your lifestyle needs",    emoji: "🐟" },
              { bg: "#1A3A5C", title: "What's right for me? Learn what fish works for a healthier you", emoji: "💡", dark: true },
              { bg: "#FFF4E6", title: "Find exactly what you need — curated dry fish for every dish",   emoji: "🎯" },
              { bg: "#E07B39", title: "Enjoyment meets convenience — kits & recipes to save time",      emoji: "🎁", dark: true },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 flex flex-col justify-between gap-3 cursor-pointer hover:scale-[1.02] transition-transform"
                style={{ background: card.bg, minHeight: 160 }}
              >
                <p className={`text-sm font-semibold leading-snug ${card.dark ? "text-white" : "text-gray-800"}`}>
                  {card.title}
                </p>
                <span className="text-3xl">{card.emoji}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Peace of Mind */}
        <section className="pb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">dryfish.co with Peace of Mind</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            {PROMISES.map((p, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 text-[#1A3A5C] mb-3">
                  {p.icon}
                  <h3 className="font-bold text-gray-900 text-base">{p.title}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                <button className="mt-4 text-sm text-[#1A3A5C] font-semibold flex items-center gap-1 hover:underline">
                  Details <ChevronRight />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}