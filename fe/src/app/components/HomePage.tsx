import { useState, useEffect } from "react";
import { ArrowRight, TreePine } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ALL_PRODUCTS } from "./ShopPage";
import type { Product } from "./ShopPage";
import { useAuthStore } from "../../store/authStore";
import { statisticsApi } from "../../api/statistics";

import imgHero1 from "../../imports/Homepage/ad594a362ca9f01e32ef654ed2558bf212d42c6b.png";
import imgHero2 from "../../imports/Homepage/f6aed8954f7b8995c083ee7f5fa9a423fd3feff0.png";
import imgHero3 from "../../imports/Homepage/fd3c27e888c95fc4c471ae218112f085bb1204c6.png";
import imgHero4 from "../../imports/Homepage/cb597c14aa466186896b0278899817127b88c8ab.png";

const CATEGORIES = ["All", "Home & Kitchen", "Personal Care", "Fashion", "Food & Beverage", "Office", "Travel", "Pet"];

// ─── Hero ──────────────────────────────────────────────────────────────────
function HeroSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <section className="max-w-[1280px] mx-auto w-full px-4 md:px-16 py-12 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">
      {/* Left */}
      <div className="flex flex-col gap-8 flex-1 min-w-0">
        <div className="flex flex-col gap-4">
          <h1
            className="text-[#1a1c19] text-[40px] md:text-[56px] leading-[1.1] tracking-[-0.96px]"
            style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}
          >
            Curated for<br />the planet.<br />
            <span className="text-[#25521f]">Made for you.</span>
          </h1>
          <p className="text-[#42493e] text-[17px] md:text-[18px] leading-[28px] max-w-[480px]">
            Discover sustainable products with transparent carbon footprints. Every purchase earns Green Points toward a healthier world.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => onNavigate("shop")}
            className="bg-gradient-to-r from-[#3d6b35] to-[#25521f] text-white text-[14px] tracking-[1.6px] uppercase px-8 py-4 rounded-full shadow-md shadow-[#25521f]/25 hover:shadow-lg hover:from-[#356030] hover:to-[#1e4219] transition-all active:scale-[0.98]"
          >
            SHOP SUSTAINABLE
          </button>
          <button
            onClick={() => onNavigate("impact")}
            className="flex items-center gap-1.5 text-[#25521f] text-[14px] hover:underline transition-all"
          >
            My Impact <ArrowRight size={14} />
          </button>
        </div>
        {/* Trust bar */}
        <div className="flex items-center gap-6 pt-2 border-t border-[#e2e3de] flex-wrap">
          {["12,000+ Eco Products", "CO₂ Tracked Shipping", "Green Points Rewards"].map((t) => (
            <span key={t} className="text-[#6b7280] text-[13px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3d6b35] inline-block shrink-0" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Right — 2×2 image grid */}
      <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-3 shrink-0 w-[400px] h-[480px]">
        <div className="row-span-2 rounded-2xl overflow-hidden border border-[#dde8d8] shadow-sm">
          <img src={imgHero1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="rounded-2xl overflow-hidden border border-[#dde8d8] shadow-sm">
          <img src={imgHero2} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl overflow-hidden border border-[#dde8d8] shadow-sm">
            <img src={imgHero3} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#dde8d8] shadow-sm">
            <img src={imgHero4} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Mobile single hero image */}
      <div className="md:hidden w-full h-[220px] rounded-2xl overflow-hidden border border-[#dde8d8] shadow-sm">
        <img src={imgHero1} alt="" className="w-full h-full object-cover" />
      </div>
    </section>
  );
}

// ─── Category Chips ────────────────────────────────────────────────────────
function CategoryStrip({ active, setActive }: { active: string; setActive: (v: string) => void }) {
  return (
    <div className="border-t border-b border-[#dbe3d3] bg-white/55 backdrop-blur-sm">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-3.5">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`shrink-0 px-5 py-2 rounded-full text-[13px] transition-all whitespace-nowrap ${
                active === cat
                  ? "bg-[#25521f] text-white shadow-sm shadow-[#25521f]/25"
                  : "bg-white/70 border border-[#dde8d8] text-[#42493e] hover:border-[#25521f] hover:text-[#25521f] backdrop-blur-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Trending Section ──────────────────────────────────────────────────────
function TrendingSection({
  onNavigate,
  activeCategory,
  onAddToCart,
  wishlistIds,
  onWishlist,
  products = ALL_PRODUCTS,
}: {
  onNavigate: (p: string, id?: number) => void;
  activeCategory: string;
  onAddToCart: (p: Product) => void;
  wishlistIds: number[];
  onWishlist: (p: Product) => void;
  products?: Product[];
}) {
  const TRENDING = products.slice(0, 5);
  const displayProducts = activeCategory === "All"
    ? TRENDING
    : products.filter((p) => p.category === activeCategory).slice(0, 5);

  const display = displayProducts.length ? displayProducts : TRENDING;

  return (
    <section className="max-w-[1280px] mx-auto w-full px-4 md:px-16 py-10 md:py-12 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[#6b7280] text-[11px] tracking-[1.4px] uppercase">Xu hướng</span>
          <h2
            className="text-[#1a1c19] text-[24px] md:text-[32px]"
            style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}
          >
            Trending Sustainable Picks
          </h2>
        </div>
        <button
          onClick={() => onNavigate("shop")}
          className="text-[#25521f] text-[13px] border-b border-[#25521f] hover:opacity-70 transition-opacity whitespace-nowrap hidden md:block"
        >
          View All Products
        </button>
      </div>

      {/* Desktop: row 1 = 2 featured cards, row 2 = 3 equal cards */}
      <div className="hidden md:flex md:flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {display.slice(0, 2).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              featured
              onNavigate={(id) => onNavigate("product", id)}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
              wishlisted={wishlistIds.includes(p.id)}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {display.slice(2, 5).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onNavigate={(id) => onNavigate("product", id)}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
              wishlisted={wishlistIds.includes(p.id)}
            />
          ))}
        </div>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden flex gap-3 overflow-x-auto pb-2">
        {display.map((p) => (
          <div key={p.id} className="shrink-0 w-[200px]">
            <ProductCard
              product={p}
              onNavigate={(id) => onNavigate("product", id)}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
              wishlisted={wishlistIds.includes(p.id)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => onNavigate("shop")}
        className="md:hidden text-[#25521f] text-[13px] tracking-widest uppercase border border-[#25521f] py-3 rounded-full hover:bg-[#f0f7ee] transition-colors"
      >
        View All Shop →
      </button>
    </section>
  );
}

// ─── Impact Banner ─────────────────────────────────────────────────────────
function ImpactBanner({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [current, setCurrent] = useState(0);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  useEffect(() => {
    if (isAuthenticated) {
      const d = new Date();
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
      statisticsApi.getMonthlyCarbonIndex(dateStr).then(val => {
        // Match exact rounding sequence from ImpactPage
        const totalCO2 = Number(val.toFixed(1));
        const standardCO2 = Number((totalCO2 * 2.5).toFixed(1));
        const savedCO2 = Number((standardCO2 - totalCO2).toFixed(1));
        setCurrent(savedCO2);
      }).catch(console.error);
    }
  }, [isAuthenticated]);

  const target = 5;
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <section className="bg-gradient-to-r from-[#e7f2e1] via-[#eef6e9] to-[#d7edcd] border-t border-b border-[#cfe0c4]">
      <div className="max-w-[720px] mx-auto px-4 md:px-16 py-10 flex flex-col items-center gap-4 text-center">
        <p className="text-[#6b7280] text-[11px] tracking-[1.4px] uppercase">Your Shopping Impact this Month</p>

        <div className="flex items-baseline gap-2">
          <span
            className="text-[#1a1c19] text-[48px] leading-tight"
            style={{ fontFamily: "'Liberation Mono', monospace", fontWeight: 700 }}
          >
            {current}kg
          </span>
          <span className="text-[#42493e] text-[16px]">CO₂ saved</span>
        </div>

        <p className="text-[#25521f] text-[13px] italic -mt-1 flex items-center justify-center gap-1">
          Equivalent to planting {Math.ceil(current / 5)} tree{Math.ceil(current / 5) === 1 ? '' : 's'} <TreePine size={14} strokeWidth={2} />
        </p>

        <div className="w-full flex flex-col gap-2 mt-1">
          <div className="flex items-center justify-between text-[12px] text-[#6b7280]">
            <span>{pct}% of monthly goal</span>
            <span>Goal: {target}kg</span>
          </div>
          <div className="h-2.5 bg-[#c2c9bb]/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3d6b35] to-[#25521f] rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => onNavigate("impact")}
          className="text-[#25521f] text-[13px] border-b border-[#25521f] hover:opacity-70 transition-opacity mt-1"
        >
          View details →
        </button>
      </div>
    </section>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────
export function HomePage({
  onNavigate,
  onAddToCart,
  wishlistIds,
  onWishlist,
  products = ALL_PRODUCTS,
}: {
  onNavigate: (p: string, id?: number) => void;
  onAddToCart: (p: Product) => void;
  wishlistIds: number[];
  onWishlist: (p: Product) => void;
  products?: Product[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <main className="flex-1 pb-20 md:pb-0 flex flex-col">
      <HeroSection onNavigate={onNavigate} />
      <CategoryStrip active={activeCategory} setActive={setActiveCategory} />
      <TrendingSection
        onNavigate={onNavigate}
        activeCategory={activeCategory}
        onAddToCart={onAddToCart}
        wishlistIds={wishlistIds}
        onWishlist={onWishlist}
        products={products}
      />
      <ImpactBanner onNavigate={onNavigate} />
    </main>
  );
}
