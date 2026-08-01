import { useState } from "react";
import { Heart, ShoppingBag, Check } from "lucide-react";
import type { Product } from "./ShopPage";

export type { Product };

type ProductCardProps = {
  product: Product;
  wishlisted?: boolean;
  onWishlist?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onNavigate?: () => void;
  compareSelected?: boolean;
  onToggleCompare?: (product: Product) => void;
  featured?: boolean;
};

export function ProductCard({
  product,
  wishlisted = false,
  onWishlist,
  onAddToCart,
  onNavigate,
  compareSelected = false,
  onToggleCompare,
  featured = false,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onClick={onNavigate}
      className={`group cursor-pointer rounded-2xl overflow-hidden flex flex-col
        bg-white/75 backdrop-blur-sm
        border border-[#dde8d8]
        shadow-[0_1px_8px_rgba(37,82,31,0.06),inset_0_0_0_1px_rgba(255,255,255,0.55)]
        hover:shadow-[0_10px_36px_rgba(37,82,31,0.14),inset_0_0_0_1px_rgba(255,255,255,0.75)]
        hover:-translate-y-1
        transition-all duration-300 ease-out`}
    >
      {/* ── Image ─────────────────────────────────────────────────── */}
      <div className={`relative overflow-hidden bg-[#eef2eb] ${featured ? "aspect-[4/3]" : "aspect-square"}`}>
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
        />

        {/* Compare checkbox */}
        {onToggleCompare && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(product); }}
            className={`absolute top-3 left-3 w-5 h-5 rounded-md flex items-center justify-center transition-all backdrop-blur-sm ${
              compareSelected
                ? "bg-[#25521f] border-transparent"
                : "bg-white/75 border border-white/60 hover:border-[#25521f]"
            }`}
            title="So sánh"
          >
            {compareSelected && <Check size={11} className="text-white" />}
          </button>
        )}

        {/* Low stock indicator */}
        {product.stock <= 20 && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#fffbf0]/90 backdrop-blur-sm text-[#6f6143] text-[9px] px-2 py-1 rounded-full border border-[#f1deb8]/60">
              Còn {product.stock}
            </span>
          </div>
        )}

        {/* Eco badge */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/30 to-transparent">
          <span className="bg-[#25521f]/90 backdrop-blur-sm text-white text-[9px] tracking-widest uppercase px-2.5 py-[3px] rounded-full">
            {product.badge}
          </span>
        </div>

        {/* Wishlist */}
        {onWishlist && (
          <button
            onClick={(e) => { e.stopPropagation(); onWishlist(product); }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all backdrop-blur-sm ${
              wishlisted
                ? "bg-white/95 text-[#ba1a1a]"
                : "bg-white/70 text-[#6b7280] hover:bg-white/95 hover:text-[#ba1a1a]"
            }`}
          >
            <Heart size={13} fill={wishlisted ? "#ba1a1a" : "none"} strokeWidth={1.8} />
          </button>
        )}
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="px-4 pt-3.5 pb-4 flex flex-col gap-2 flex-1">
        <p className="text-[#6b7280] text-[10px] tracking-[1.4px] uppercase">{product.category}</p>

        <p className="text-[#1a1c19] text-[13px] md:text-[14px] leading-snug line-clamp-2 font-medium">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex gap-[2px]">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} width="9" height="9" viewBox="0 0 12 12" fill={s <= Math.round(product.rating) ? "#6B5D3F" : "none"} className="text-[#6b5d3f]">
                <path stroke="#6B5D3F" strokeWidth="1.2" d="M6 1l1.2 3.6H11L8.2 6.8l1 3.2L6 8.2 2.8 10l1-3.2L1 4.6h3.8z" />
              </svg>
            ))}
          </div>
          <span className="text-[#6b5d3f] text-[11px]">{product.rating}</span>
          <span className="text-[#9ca3af] text-[10px]">({product.reviews})</span>
        </div>

        {/* Eco pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="bg-[#e8f5e4] text-[#25521f] text-[10px] px-2 py-[3px] rounded-full font-medium">
            CO₂ {product.carbonLabel}
          </span>
          <span className="bg-[#fdf6ec] text-[#6f6143] text-[10px] px-2 py-[3px] rounded-full">
            +{product.greenPoints} pts
          </span>
        </div>

        {/* Price + add to cart */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span
            className="text-[#25521f] text-[14px] md:text-[15px]"
            style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}
          >
            {product.priceLabel}
          </span>
          {onAddToCart && (
            <button
              onClick={handleAdd}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                added
                  ? "bg-[#25521f] text-white scale-95"
                  : "bg-[#f0f7ee] text-[#25521f] hover:bg-[#25521f] hover:text-white"
              }`}
            >
              {added ? <Check size={14} /> : <ShoppingBag size={14} strokeWidth={1.8} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
