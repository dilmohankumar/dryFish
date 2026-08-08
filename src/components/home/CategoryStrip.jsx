// Row of circular category shortcuts, shown directly under the main navbar —
// mirrors the "Nuts & Seeds / Chocolate & Sweets / Snacks…" row on nuts.com.
export default function CategoryStrip({ categories, onSelect }) {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-start sm:justify-center gap-5 sm:gap-10 overflow-x-auto py-3 sm:py-5 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => onSelect(cat)}
              className="flex flex-col items-center gap-2 flex-shrink-0 group w-16 sm:w-24"
            >
              <span
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl sm:text-4xl overflow-hidden group-hover:scale-105 transition-all"
                style={{ background: cat.bg || "#F5EDE0" }}
              >
                {cat.image
                  ? <img src={cat.image} alt="" className="w-full h-full object-cover" />
                  : cat.emoji}
              </span>
              <span className="text-[11px] sm:text-sm font-bold text-gray-900 text-center leading-tight group-hover:text-[#E07B39] transition-colors">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
