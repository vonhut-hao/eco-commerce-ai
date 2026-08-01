import { useState, useRef, useEffect } from "react";
import {
  Search,
  Home,
  ShoppingBag,
  Leaf,
  BarChart2,
  User,
  Star,
  Plus,
  Minus,
  ChevronRight,
  X,
} from "lucide-react";
import svgPaths from "../imports/ProductDetail2/svg-oqupvr7hg1";
import imgPrimary from "../imports/ProductDetail2/d98ac9c365901557807efc5288e118488e837d30.png";
import imgThumb1 from "../imports/ProductDetail2/216f26d6776c3bc25b08f4a2fc1a9379b936c8f6.png";
import imgThumb2 from "../imports/ProductDetail2/500cb84cb3311510ee21f4b4f07293aa58527802.png";
import imgThumb3 from "../imports/ProductDetail2/d676d1e4513ae183577337dd633cacf4df304944.png";
import imgThumb4 from "../imports/ProductDetail2/45e21f35a448272b3d6c4d80ab24fd03cfec6002.png";
import { AIChatbot } from "./components/AIChatbot";
import { ProfilePage } from "./components/ProfilePage";
import { SignUpPage } from "./components/SignUpPage";
import { SignInPage } from "./components/SignInPage";
import { ToastContainer, toast } from "./components/Toast";
import { GreenLifeBrand } from "./components/GreenLifeBrand";
import { HomePage } from "./components/HomePage";
import { ShopPage, ALL_PRODUCTS } from "./components/ShopPage";
import type { Product } from "./components/ShopPage";
import { productsApi, mapProductBeToFe } from "../api/products";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { ProductCard } from "./components/ProductCard";
import { CartPage } from "./components/CartPage";
import type { CartItem } from "./components/CartPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { ImpactPage } from "./components/ImpactPage";
import { useAuthStore } from "../store/authStore";

export type Page = "home" | "shop" | "product" | "cart" | "checkout" | "profile" | "signup" | "signin" | "impact";

const mainDisplayImages = [imgPrimary, imgThumb2, imgThumb3, imgThumb4];
const thumbnails = [imgThumb1, imgThumb2, imgThumb3, imgThumb4];

// Use products 6-9 from ALL_PRODUCTS but override with ProductDetail2 images for consistency
const relatedProductIds = [5, 6, 7, 8]; // Natural Coconut Bowl, Hemp Soap, Steel Bottle, Wooden Brush

type Tab = "description" | "sustainability" | "reviews";

// ─── Cart icon (SVG from Figma) ────────────────────────────────────────────
function CartIcon({ count, onClick }: { count: number; onClick?: () => void }) {
  return (
    <button className="relative text-[#42493e]" onClick={onClick}>
      <svg width="20" height="20" viewBox="0 0 19.9815 20" fill="none">
        <path d={svgPaths.pb5c2400} fill="#42493E" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-[#ba1a1a] text-white text-[9px] min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center leading-none">
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Mobile Header ─────────────────────────────────────────────────────────
function MobileHeader({
  searchOpen,
  setSearchOpen,
  onNavigate,
  cartCount,
}: {
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  onNavigate: (page: Page) => void;
  cartCount: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRef.current?.value.trim()) {
      setSearchOpen(false);
      onNavigate("shop");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fafaf5]/80 backdrop-blur-md border-b border-[#dbe3d3] md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        <GreenLifeBrand onClick={() => onNavigate("home")} textSize="text-xl" iconSize={20} />
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-[#42493e]"
            aria-label="Tìm kiếm"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d={svgPaths.p8a35e00} fill="#42493E" />
            </svg>
          </button>
          <CartIcon count={cartCount} onClick={() => onNavigate("cart")} />
        </div>
      </div>

      {searchOpen && (
        <div className="px-4 pb-3">
          <div className="flex items-center bg-white border border-[#c2c9bb] rounded-full px-3 gap-2 h-9 shadow-sm">
            <Search size={14} className="text-[#9ca3af] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Tìm kiếm sản phẩm xanh..."
              className="flex-1 text-[13px] text-gray-700 outline-none placeholder-[#9ca3af] bg-transparent"
              onKeyDown={handleSearch}
            />
            <button onClick={() => setSearchOpen(false)} className="text-[#9ca3af] hover:text-[#42493e] transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Desktop Header ────────────────────────────────────────────────────────
function DesktopHeader({
  searchOpen,
  setSearchOpen,
  onNavigate,
  activePage,
  cartCount,
  onOpenChatbot,
}: {
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  onNavigate: (page: Page) => void;
  activePage: Page;
  cartCount: number;
  onOpenChatbot: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchOpen(false);
      onNavigate("shop");
    }
  };

  const navLinks = [
    { label: "Home",           page: "home" as Page,   action: () => onNavigate("home") },
    { label: "Shop",           page: "shop" as Page,   action: () => onNavigate("shop") },
    { label: "Green AI",       page: "home" as Page,   action: onOpenChatbot },
    { label: "Impact Tracker", page: "impact" as Page, action: () => onNavigate("impact") },
  ];

  return (
    <header className="sticky top-0 z-40 hidden md:block">
      {/* Main bar */}
      <div className="bg-[#fafaf5]/80 backdrop-blur-md border-b border-[#dbe3d3]">
        <div className="max-w-[1280px] mx-auto px-16 h-20 flex items-center">
          <GreenLifeBrand onClick={() => onNavigate("home")} textSize="text-2xl" iconSize={26} />

          <nav className="flex-1 flex items-center justify-center gap-6">
            {navLinks.map((link) => {
              const isActive = activePage === link.page && link.label !== "Green AI";
              return (
                <button
                  key={link.label}
                  onClick={link.action}
                  className={`relative text-[15px] pb-1 whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-[#25521f] font-['Nimbus_Sans:Regular',sans-serif]"
                      : "text-[#42493e] hover:text-[#1a1c19]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#25521f]" />
                  )}
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-gradient-to-r from-[#bcf1ad] to-[#8fd97a] text-[#1e4219] text-[14px] px-3 py-1 rounded-full shadow-sm shadow-[#3d6b35]/20 whitespace-nowrap">
              Green Points: 1,250
            </div>

            {/* Search icon — always in place, dropdown opens below */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`transition-colors ${searchOpen ? "text-[#25521f]" : "text-[#42493e] hover:text-[#25521f]"}`}
              aria-label="Tìm kiếm"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d={svgPaths.p8a35e00} fill={searchOpen ? "#25521f" : "#42493E"} />
              </svg>
            </button>

            <CartIcon count={cartCount} onClick={() => onNavigate("cart")} />

            <button
              onClick={() => onNavigate(activePage === "profile" ? "profile" : "signin")}
              className={`relative transition-colors pb-1 ${
                activePage === "profile" ? "text-[#25521f]" : "text-[#42493e] hover:text-[#25521f]"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d={svgPaths.p33ced450} fill={activePage === "profile" ? "#25521f" : "#42493E"} />
              </svg>
              {activePage === "profile" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#25521f]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search dropdown panel — slides under the nav bar */}
      {searchOpen && (
        <>
          {/* Backdrop to close */}
          <div
            className="fixed inset-0 top-20 z-30"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative z-40 bg-[#fafaf5]/95 backdrop-blur-md border-b border-[#dbe3d3] shadow-lg">
            <div className="max-w-[1280px] mx-auto px-16 py-4 flex items-center gap-3">
              <div className="flex items-center bg-white border border-[#c2c9bb] rounded-full px-4 gap-2 h-11 shadow-sm flex-1 max-w-[600px]">
                <Search size={15} className="text-[#9ca3af] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm xanh... (Enter để tìm)"
                  className="flex-1 text-[14px] text-gray-700 outline-none placeholder-[#9ca3af] bg-transparent"
                  onKeyDown={handleSearch}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-[#9ca3af] hover:text-[#42493e] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <span className="text-[#6b7280] text-[13px]">Nhấn Enter hoặc</span>
              <button
                onClick={() => { setSearchOpen(false); onNavigate("shop"); }}
                className="text-[#25521f] text-[13px] border border-[#25521f] px-4 py-2 rounded-full hover:bg-[#f0f7ee] transition-colors whitespace-nowrap"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

// ─── Breadcrumb ────────────────────────────────────────────────────────────
function Breadcrumb() {
  return (
    <nav className="hidden md:flex items-center gap-1 text-[13px]">
      {["HOME", "PERSONAL CARE"].map((item) => (
        <span key={item} className="flex items-center gap-1">
          <button className="text-[#42493e] font-['Nimbus_Sans:Bold',sans-serif] tracking-wide hover:text-[#25521f] transition-colors">
            {item}
          </button>
          <svg width="4" height="7" viewBox="0 0 4.31667 7" fill="none">
            <path d={svgPaths.p35022f90} fill="#42493E" />
          </svg>
        </span>
      ))}
      <span className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] tracking-wide">
        BAMBOO TOOTHBRUSH SET
      </span>
    </nav>
  );
}

// ─── Product Gallery ───────────────────────────────────────────────────────
function ProductGallery({
  selectedThumb,
  onThumbSelect,
}: {
  selectedThumb: number;
  onThumbSelect: (i: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-full md:col-span-7">
      <div className="bg-[#eeeee9] rounded-md overflow-hidden aspect-[4/3] md:aspect-auto md:h-[491px]">
        <img
          key={selectedThumb}
          src={mainDisplayImages[selectedThumb]}
          alt="Bamboo Toothbrush Set"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {thumbnails.map((thumb, i) => (
          <button
            key={i}
            onClick={() => onThumbSelect(i)}
            className={`aspect-square bg-[#eeeee9] rounded-md overflow-hidden border-2 transition-all ${
              selectedThumb === i
                ? "border-[#25521f] scale-[0.97]"
                : "border-[#c2c9bb] hover:border-[#42493e]"
            }`}
          >
            <img
              src={thumb}
              alt={`Góc nhìn ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Sustainability Badges ─────────────────────────────────────────────────
function SustainabilityBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {["100% BIODEGRADABLE", "BPA FREE", "COMPOSTABLE PACKAGING"].map((b) => (
        <span key={b} className="bg-[#f1deb8] text-[#6f6143] text-[13px] px-3 py-1 rounded-full tracking-tight uppercase">
          {b}
        </span>
      ))}
    </div>
  );
}

// ─── Carbon Footprint Card ─────────────────────────────────────────────────
function CarbonFootprintCard() {
  return (
    <div className="bg-[#f4f4ef] border border-[#c2c9bb] rounded-md p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-[#42493e] text-[13px] tracking-widest uppercase font-['Nimbus_Sans:Bold',sans-serif]">
          CARBON FOOTPRINT
        </span>
        <span className="text-[#25521f] text-[14px] font-['Liberation_Mono:Bold',monospace] font-bold">
          0.3kg CO2 / unit
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="relative bg-[#e2e3de] h-6 rounded-xl overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 bg-[#25521f] w-[16%]" />
          <div className="absolute inset-0 flex items-center px-4 justify-end">
            <span className="text-[10px] font-['Nimbus_Sans:Bold',sans-serif] text-[#42493e]">
              YOUR CHOICE: 0.3kg
            </span>
          </div>
        </div>
        <div className="relative bg-[#6b5d3f] h-6 rounded-xl overflow-hidden opacity-60">
          <div className="absolute inset-0 flex items-center px-4">
            <span className="text-[10px] font-['Nimbus_Sans:Bold',sans-serif] text-white">
              CONVENTIONAL PLASTIC: 1.8kg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Product Info ──────────────────────────────────────────────────────────
function ProductInfo({ quantity, onQtyChange, onNavigate }: {
  quantity: number;
  onQtyChange: (q: number) => void;
  onNavigate: (page: Page) => void;
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    toast.success("Added to cart!", "Bamboo Toothbrush Set has been added to your cart.");
  };

  return (
    <div className="flex flex-col gap-5 w-full md:col-span-5">
      <div className="flex flex-col gap-2">
        <h1 className="font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19] text-3xl md:text-[48px] md:leading-[56px] tracking-tight">
          Bamboo Toothbrush<br className="hidden md:block" /> Set (Pack of 4)
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-[#25521f] font-['Nimbus_Sans:Bold',sans-serif] text-xl md:text-2xl">
            149.000 VND
          </span>
          <div className="flex items-center gap-1">
            <svg width="15" height="14" viewBox="0 0 15 14.25" fill="none">
              <path d={svgPaths.p389def00} fill="#6B5D3F" />
            </svg>
            <span className="text-[#6b5d3f] text-[14px]">4.8 (127 reviews)</span>
          </div>
        </div>
      </div>

      <p className="text-[#42493e] text-[15px] leading-[26px]">
        Biodegradable bamboo handles with BPA-free bristles. Each brush is
        individually wrapped in compostable packaging. A simple step towards a
        zero-waste lifestyle.
      </p>

      <CarbonFootprintCard />
      <SustainabilityBadges />

      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[#c2c9bb] rounded-full bg-[#fafaf5] h-11 overflow-hidden">
            <button
              onClick={() => onQtyChange(Math.max(1, quantity - 1))}
              className="px-4 text-[#1a1c19] hover:bg-[#eeeee9] h-full transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-[15px] font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19]">
              {quantity}
            </span>
            <button
              onClick={() => onQtyChange(quantity + 1)}
              className="px-4 text-[#1a1c19] hover:bg-[#eeeee9] h-full transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex-1 h-11 rounded-full text-[13px] tracking-widest uppercase font-['Nimbus_Sans:Regular',sans-serif] transition-all ${
              addedToCart
                ? "bg-[#42493e] text-white"
                : "bg-gradient-to-r from-[#3d6b35] to-[#25521f] text-white shadow-md shadow-[#25521f]/25 hover:shadow-lg active:scale-[0.98]"
            }`}
          >
            {addedToCart ? "ADDED ✓" : "ADD TO CART"}
          </button>
        </div>

        <button
          onClick={() => setWishlisted((w) => !w)}
          className={`w-full h-11 rounded-full border text-[13px] tracking-widest uppercase font-['Nimbus_Sans:Regular',sans-serif] flex items-center justify-center gap-2 transition-all ${
            wishlisted
              ? "border-[#25521f] text-[#25521f] bg-[#f0f7ee]"
              : "border-[#6b5d3f] text-[#6b5d3f] hover:bg-[#faf7f2]"
          }`}
        >
          <svg width="15" height="13.76" viewBox="0 0 15 13.7625" fill="none" className="shrink-0">
            <path
              d={svgPaths.pb031200}
              fill={wishlisted ? "#25521f" : "none"}
              stroke={wishlisted ? "#25521f" : "#6b5d3f"}
              strokeWidth={wishlisted ? 0 : 0.8}
            />
          </svg>
          {wishlisted ? "SAVED TO WISHLIST" : "ADD TO WISHLIST"}
        </button>
      </div>
    </div>
  );
}

// ─── Tabs Section ──────────────────────────────────────────────────────────
function TabsSection({ activeTab, onTabChange }: { activeTab: Tab; onTabChange: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "description",   label: "DESCRIPTION" },
    { key: "sustainability", label: "SUSTAINABILITY INFO" },
    { key: "reviews",       label: "REVIEWS (127)" },
  ];

  return (
    <section className="w-full flex flex-col gap-6 border-t border-[#c2c9bb] pt-12">
      <div className="relative border-b border-[#c2c9bb] overflow-x-auto">
        <div className="flex gap-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`pb-4 text-[14px] tracking-widest uppercase relative transition-colors ${
                activeTab === tab.key
                  ? "text-[#25521f] font-['Nimbus_Sans:Bold',sans-serif]"
                  : "text-[#42493e] hover:text-[#1a1c19]"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#25521f]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "description" && (
        <div className="flex flex-col gap-6 max-w-[768px]">
          <p className="text-[#42493e] text-[15px] leading-[26px]">
            Designed for the eco-conscious consumer, our Bamboo Toothbrush Set
            combines minimalist aesthetics with high-performance dental care. The
            ergonomic handle is crafted from sustainably harvested Moso bamboo,
            a fast-growing grass that requires no pesticides or fertilizers.
          </p>
          <ul className="flex flex-col gap-3">
            {[
              "Water-resistant bamboo handle naturally antimicrobial.",
              "Soft, medium BPA-free nylon bristles for gentle cleaning.",
              "Packaged in a 100% recycled paper box, zero plastic.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-4">
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none" className="shrink-0 mt-0.5">
                  <path d={svgPaths.p3c38b80} fill="#25521F" />
                </svg>
                <span className="text-[#42493e] text-[15px] leading-[24px]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "sustainability" && (
        <div className="flex flex-col gap-4 max-w-[768px]">
          <p className="text-[#42493e] text-[15px] leading-[26px]">
            Every GreenLife product is evaluated on its full lifecycle impact.
            Our Bamboo Toothbrush Set achieves an 83% reduction in carbon
            footprint compared to conventional plastic alternatives.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Carbon Footprint", value: "0.3kg CO2/unit" },
              { label: "Decomposition",    value: "~6 months" },
              { label: "Plastic Saved",    value: "1.5kg/year" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#f4f4ef] border border-[#c2c9bb] rounded-md p-4">
                <div className="text-[#42493e] text-[11px] tracking-widest uppercase mb-1">{stat.label}</div>
                <div className="text-[#25521f] font-bold text-[16px] font-['Liberation_Mono:Bold',monospace]">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="flex flex-col gap-5 max-w-[768px]">
          <div className="flex items-center gap-3">
            <span className="text-[#1a1c19] text-4xl font-['Nimbus_Sans:Bold',sans-serif]">4.8</span>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={16} fill={s <= 4 ? "#6B5D3F" : "none"} className="text-[#6b5d3f]" />
                ))}
              </div>
              <span className="text-[#6b5d3f] text-[13px]">127 reviews</span>
            </div>
          </div>
          {[
            { name: "Minh T.", rating: 5, text: "Sản phẩm rất tốt, cảm giác cầm chắc tay, lông bàn chải mềm vừa phải. Rất hài lòng!" },
            { name: "Lan N.",  rating: 5, text: "Đóng gói rất cẩn thận và thân thiện môi trường. Sẽ mua lại lần sau." },
            { name: "Thanh H.", rating: 4, text: "Chất lượng ổn, giá hợp lý. Tay cầm tre đẹp và tự nhiên." },
          ].map((review) => (
            <div key={review.name} className="border-b border-[#e2e3de] pb-4 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#25521f] rounded-full flex items-center justify-center text-white text-[12px] font-bold">
                  {review.name[0]}
                </div>
                <div>
                  <div className="text-[#1a1c19] text-[14px] font-medium">{review.name}</div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={11} fill={s <= review.rating ? "#6B5D3F" : "none"} className="text-[#6b5d3f]" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#42493e] text-[14px] leading-[22px]">{review.text}</p>
            </div>
          ))}

          {/* Write review only available from Order History after delivery */}
          <div className="flex items-center gap-3 bg-[#fafaf5] border border-[#e2e3de] rounded-xl px-5 py-4">
            <Star size={18} className="text-[#6b5d3f] shrink-0" strokeWidth={1.5} />
            <p className="text-[#6b7280] text-[13px] leading-[20px]">
              Bạn đã mua sản phẩm này?{" "}
              <span className="text-[#25521f]">Đánh giá từ trang Lịch sử mua hàng</span>{" "}
              trong vòng 14 ngày kể từ khi nhận hàng.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Related Products ──────────────────────────────────────────────────────
function RelatedProducts({
  onNavigate,
  onAddToCart,
  wishlistIds,
  onWishlist,
  products = ALL_PRODUCTS,
}: {
  onNavigate: (p: Page, id?: number) => void;
  onAddToCart: (p: Product) => void;
  wishlistIds: number[];
  onWishlist: (p: Product) => void;
  products?: Product[];
}) {
  const allProds = products && products.length > 0 ? products : ALL_PRODUCTS;
  const prods = allProds.filter((p) => relatedProductIds.includes(p.id));

  return (
    <section className="w-full flex flex-col gap-8 pt-16 md:pt-24">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[#6b5d3f] text-[11px] tracking-[1.4px] uppercase">Curated Selections</span>
          <h2
            className="text-[#1a1c19] text-2xl md:text-[32px]"
            style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}
          >
            You might also like
          </h2>
        </div>
        <button
          onClick={() => onNavigate("shop")}
          className="text-[#25521f] text-[13px] border-b border-[#25521f] pb-0.5 hover:opacity-70 transition-opacity hidden md:block"
        >
          View All Shop
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {prods.map((p) => (
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

      <button
        onClick={() => onNavigate("shop")}
        className="md:hidden flex items-center justify-center gap-2 text-[#25521f] text-[13px] tracking-widest uppercase border border-[#25521f] py-3 rounded-full hover:bg-[#f0f7ee] transition-colors"
      >
        View All Shop <ChevronRight size={14} />
      </button>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#eaf0e3] to-[#dde5d4] border-t border-[#dbe3d3] w-full">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          <div className="flex flex-col gap-4">
            <GreenLifeBrand textSize="text-xl" iconSize={20} />
            <p className="text-[#42493e] text-[14px] leading-[22px] max-w-[200px]">
              Empowering conscious living through curated sustainable products.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[#1a1c19] text-[13px] tracking-widest uppercase">SUSTAINABILITY</h4>
            <ul className="flex flex-col gap-2">
              {["Green Points Policy", "Carbon Calculator", "Recycling Guide"].map((item) => (
                <li key={item} className="text-[#42493e] text-[14px] opacity-90 cursor-pointer hover:text-[#25521f] transition-colors">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:block" />
          <div className="flex flex-col gap-4">
            <h4 className="text-[#1a1c19] text-[13px] tracking-widest uppercase">NEWSLETTER</h4>
            <div className="flex flex-col gap-2">
              <div className="bg-[#fafaf5] border border-[#c2c9bb] rounded-full px-4 py-3">
                <input type="email" placeholder="email@address.com" className="w-full bg-transparent text-[#6b7280] text-[14px] outline-none" />
              </div>
              <button className="bg-[#25521f] text-white text-[13px] tracking-widest uppercase py-2.5 rounded-full hover:bg-[#1e4219] transition-colors">
                JOIN THE MOVEMENT
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-[#c2c9bb] mt-10 pt-6 text-center">
          <p className="text-[#42493e] text-[13px] opacity-70">© 2026 GreenLife. Powered by sustainable hosting.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Bottom Nav (mobile only) ──────────────────────────────────────────────
function BottomNav({
  activePage,
  onNavigate,
  onOpenChatbot,
}: {
  activePage: Page;
  onNavigate: (p: Page) => void;
  onOpenChatbot: () => void;
}) {
  const items = [
    { key: "home",    label: "Home",     icon: Home,        action: () => onNavigate("home") },
    { key: "shop",    label: "Shop",     icon: ShoppingBag, action: () => onNavigate("shop") },
    { key: "greenai", label: "Green AI", icon: Leaf,        action: onOpenChatbot },
    { key: "impact",  label: "Impact",   icon: BarChart2,   action: () => onNavigate("impact") },
    { key: "me",      label: "Tôi",      icon: User,        action: () => onNavigate(activePage === "profile" ? "profile" : "signin") },
  ];

  const activeKey = activePage === "profile" ? "me"
    : activePage === "shop" ? "shop"
    : activePage === "impact" ? "impact"
    : activePage === "home" ? "home"
    : "";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fafaf5]/85 backdrop-blur-md border-t border-[#dbe3d3] md:hidden safe-bottom">
      <div className="flex">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;
          return (
            <button
              key={item.key}
              onClick={item.action}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${
                isActive ? "text-[#25521f]" : "text-[#6b7280]"
              }`}
            >
              <Icon size={21} strokeWidth={isActive ? 2.2 : 1.6} />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Decorative Background ─────────────────────────────────────────────────
function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[#f5f8f1] via-[#fafaf5] to-[#eff4ea] overflow-hidden">
      <div className="absolute -top-48 -left-40 w-[520px] h-[520px] rounded-full bg-[#3d6b35]/[0.06] blur-3xl" />
      <div className="absolute top-1/3 -right-56 w-[560px] h-[560px] rounded-full bg-[#bcf1ad]/[0.18] blur-3xl" />
      <svg className="absolute -top-8 -left-6 w-56 h-56 text-[#3d6b35] opacity-[0.07]" viewBox="0 0 100 100" fill="none">
        <path d="M50 95 C50 60 20 45 15 15 C45 25 55 55 50 95 Z" fill="currentColor" />
        <path d="M50 95 C50 55 80 40 88 12 C58 22 45 52 50 95 Z" fill="currentColor" />
        <path d="M50 95 L50 40" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute top-24 right-4 w-72 h-72 text-[#25521f] opacity-[0.05] rotate-[18deg]" viewBox="0 0 100 100" fill="none">
        <path d="M50 95 C50 60 20 45 15 15 C45 25 55 55 50 95 Z" fill="currentColor" />
        <path d="M50 95 C50 55 80 40 88 12 C58 22 45 52 50 95 Z" fill="currentColor" />
        <path d="M50 95 L50 40" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-8 left-8 w-64 h-64 text-[#3d6b35] opacity-[0.05] -rotate-[24deg]" viewBox="0 0 100 100" fill="none">
        <path d="M50 95 C50 60 20 45 15 15 C45 25 55 55 50 95 Z" fill="currentColor" />
        <path d="M50 95 C50 55 80 40 88 12 C58 22 45 52 50 95 Z" fill="currentColor" />
        <path d="M50 95 L50 40" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activePage, setActivePage] = useState<Page>("home");
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeProductId, setActiveProductId] = useState<number>(1);

  useEffect(() => {
    productsApi.getProducts(0, 100).then(res => {
      const fetched = res.content.map(mapProductBeToFe);
      if (fetched.length > 0) {
        setProducts(fetched);
      }
    }).catch(err => {
      console.error("Failed to fetch products", err);
    }).finally(() => {
      setLoadingProducts(false);
    });
  }, []);

  // Cart & wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  // Chatbot control — increment a counter so useEffect in AIChatbot fires each time
  const [chatbotTrigger, setChatbotTrigger] = useState(0);

  const setToken = useAuthStore(state => state.setToken);

  useEffect(() => {
    // Handle OAuth2 redirect from backend (e.g. /oauth2/callback#token=...)
    if (window.location.pathname === "/oauth2/callback") {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get("token");
      if (token) {
        setToken(token);
        toast.success("Welcome back!", "Signed in with Google successfully");
      }
      window.history.replaceState({}, document.title, "/");
      setActivePage("home");
    }
  }, [setToken]);

  const navigate = (page: Page, productId?: number) => {
    setActivePage(page);
    if (productId) setActiveProductId(productId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openChatbot = () => {
    setChatbotTrigger((n) => n + 1);
  };

  // Cart helpers
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success("Thêm vào giỏ!", `${product.name} đã được thêm vào giỏ hàng.`);
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCartItems((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const toggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  // Auth pages render standalone (no app shell)
  if (activePage === "signup") return <SignUpPage onNavigate={navigate} />;
  if (activePage === "signin") return <SignInPage onNavigate={navigate} />;

  return (
    <div className="min-h-screen flex flex-col relative">
      <AppBackground />
      <ToastContainer />
      <MobileHeader
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onNavigate={navigate}
        cartCount={cartCount}
      />
      <DesktopHeader
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onNavigate={navigate}
        activePage={activePage}
        cartCount={cartCount}
        onOpenChatbot={openChatbot}
      />

      {activePage === "home" && (
        <HomePage
          onNavigate={navigate}
          onAddToCart={addToCart}
          wishlistIds={wishlistIds}
          onWishlist={toggleWishlist}
          products={products}
        />
      )}

      {activePage === "shop" && (
        <ShopPage
          onNavigate={navigate}
          onAddToCart={addToCart}
          onWishlist={toggleWishlist}
          wishlistIds={wishlistIds}
          products={products}
        />
      )}

      {activePage === "cart" && (
        <CartPage
          items={cartItems}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onNavigate={navigate}
        />
      )}

      {activePage === "checkout" && (
        <CheckoutPage
          items={cartItems}
          onComplete={() => { setCartItems([]); navigate("home"); }}
          onNavigate={navigate}
        />
      )}

      {activePage === "impact" && (
        <ImpactPage onNavigate={navigate} />
      )}

      {activePage === "profile" && (
        <ProfilePage
          onNavigate={navigate}
          wishlistIds={wishlistIds}
          onWishlist={toggleWishlist}
          onAddToCart={addToCart}
        />
      )}

      {activePage === "product" && (
        <main className="flex-1 pb-20 md:pb-0">
          <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-6 md:py-12 flex flex-col gap-8 md:gap-10">
            <ProductDetailPage
              productId={activeProductId}
              onNavigate={navigate}
              onAddToCart={addToCart}
              wishlistIds={wishlistIds}
              onWishlist={toggleWishlist}
            />
            <RelatedProducts
              onNavigate={navigate}
              onAddToCart={addToCart}
              wishlistIds={wishlistIds}
              onWishlist={toggleWishlist}
              products={products}
            />
          </div>
        </main>
      )}

      <Footer />
      <BottomNav activePage={activePage} onNavigate={navigate} onOpenChatbot={openChatbot} />
      <AIChatbot openTrigger={chatbotTrigger} />
    </div>
  );
}
