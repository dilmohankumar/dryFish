import PromoGrid from "../components/home/PromoGrid";
import CategoryStrip from "../components/home/CategoryStrip";
import HeroBanner from "../components/home/HeroBanner";
import ScallopDivider from "../components/home/ScallopDivider";
import ProductCarousel from "../components/home/ProductCarousel";
import TrustBar from "../components/home/TrustBar";
import CustomizeSection from "../components/home/CustomizeSection";
import Testimonials from "../components/home/Testimonials";
import FeaturedIn from "../components/home/FeaturedIn";
import ShopByType from "../components/home/ShopByType";
import BrandStory from "../components/home/BrandStory";
import { PRODUCTS } from "./productGrid";
import { NAV_CATEGORIES, TRUST_POINTS, CATCH_TYPES, TESTIMONIALS, FEATURED_IN } from "../data/homeData";

// ─────────────────────────────────────────────────────────────────────────────
// Home — storefront landing page, laid out to match the current nuts.com flow:
// promo grid → category circles → amber "greatest hits" + carousel → trust
// → customize → testimonials → press → shop by type → combos → brand story.
// Driven by DEMO data for now; click behaviour is wired via StoreLayout.
// ─────────────────────────────────────────────────────────────────────────────
export default function Home({
  cart = {},
  onInc = () => {},
  onDec = () => {},
  onFirstAdd = () => {},
  onProductClick = () => {},
  onShopNow = () => {},
  onCategorySelect = () => {},
}) {
  const bestsellers = PRODUCTS.filter((p) => p.bestseller);
  const AMBER = "#F0A63C";

  return (
    <div className="flex-1 min-w-0 w-full bg-white">
      {/* 1. Promo grid hero (large left + 2 stacked right) */}
      <PromoGrid onShopNow={onShopNow} />

      {/* 2. Circular category shortcuts */}
      <CategoryStrip categories={NAV_CATEGORIES} onSelect={onCategorySelect} />

      {/* 3. Amber block: "Don't Overthink It" + best sellers */}
      <ScallopDivider baseColor={AMBER} bumpColor="#ffffff" bumpsAt="top" />
      <div className="bg-[#F0A63C]">
        <HeroBanner onShopNow={onShopNow} />
        <ProductCarousel
          title="Explore Greatest Hits"
          subtitle="The Dry Catch our customers never order just once"
          products={bestsellers}
          cart={cart}
          onInc={onInc}
          onDec={onDec}
          onFirstAdd={onFirstAdd}
          onProductClick={onProductClick}
          onViewAll={onShopNow}
          viewAllLabel="View All"
          onOrange
        />
      </div>

      <TrustBar points={TRUST_POINTS} />

      <CustomizeSection onCustomize={onShopNow} />

      <Testimonials testimonials={TESTIMONIALS} />

      <FeaturedIn mentions={FEATURED_IN} />

      <ShopByType types={CATCH_TYPES} onSelect={onCategorySelect} onExploreMore={onShopNow} />

      <BrandStory onShopNow={onShopNow} />
    </div>
  );
}
