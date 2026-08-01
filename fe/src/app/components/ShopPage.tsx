import { useState, useMemo } from "react";
import {
  Search, SlidersHorizontal, X, ChevronDown, GitCompare,
  ArrowUpDown, Check,
} from "lucide-react";
import { ProductCard } from "./ProductCard";

import imgBamboo from "../../imports/Homepage/df364685721837b1c94e206231a2459a5567c713.png";
import imgTote from "../../imports/Homepage/2453e361fa67829ce12b4285c2cd0104c9033f4f.png";
import imgWrap from "../../imports/Homepage/de82f55d7406d552cc2b88ec09decae36ead1bb4.png";
import imgStraw from "../../imports/Homepage/82c9e0aa20b494988973cc4813a0de140208caec.png";
import imgBowl from "../../imports/Homepage/cd13fcef5220de430ddfa2f32fe3d9c43d945ae1.png";
import imgRel1 from "../../imports/ProductDetail2/661ae1dc3261c06fd40d7850808050bb043597e2.png";
import imgRel2 from "../../imports/ProductDetail2/2ccdd5009814ec649a2b510e35fa65e10486e35f.png";
import imgRel3 from "../../imports/ProductDetail2/ca87ed92ba3631ba5fd1a530c128e1b26d267b2f.png";
import imgRel4 from "../../imports/ProductDetail2/50c1e0310cec1ec9c5b44ca1743c6ba3a6722a7a.png";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  priceLabel: string;
  carbonIndex: number;
  carbonLabel: string;
  rating: number;
  reviews: number;
  stock: number;
  img: string;
  badge: string;
  certifications: string[];
  material: string;
  decomposition: string;
  greenPoints: number;
  description: string;
};

export const ALL_PRODUCTS: Product[] = [
  {
    id: 1, name: "Bamboo Toothbrush Set (Pack of 4)", category: "Personal Care",
    price: 149000, priceLabel: "149.000 VND", carbonIndex: 0.3, carbonLabel: "0.3 kg",
    rating: 4.8, reviews: 127, stock: 52, img: imgBamboo,
    badge: "BIODEGRADABLE", certifications: ["BIODEGRADABLE", "BPA FREE"],
    material: "Moso Bamboo", decomposition: "~6 months", greenPoints: 15,
    description: "Biodegradable bamboo handles with BPA-free bristles, compostable packaging.",
  },
  {
    id: 2, name: "Organic Cotton Tote Bag", category: "Fashion",
    price: 180000, priceLabel: "180.000 VND", carbonIndex: 0.2, carbonLabel: "0.2 kg",
    rating: 4.6, reviews: 89, stock: 120, img: imgTote,
    badge: "100% ORGANIC", certifications: ["100% ORGANIC", "COMPOSTABLE"],
    material: "Organic Cotton", decomposition: "~5 months", greenPoints: 18,
    description: "Certified organic cotton tote, durable and washable for everyday use.",
  },
  {
    id: 3, name: "Beeswax Food Wraps (Set of 3)", category: "Home & Kitchen",
    price: 120000, priceLabel: "120.000 VND", carbonIndex: 0.3, carbonLabel: "0.3 kg",
    rating: 4.5, reviews: 64, stock: 88, img: imgWrap,
    badge: "ZERO PLASTIC", certifications: ["ZERO PLASTIC", "BIODEGRADABLE"],
    material: "Beeswax + Cotton", decomposition: "~1 year", greenPoints: 12,
    description: "Reusable, washable food wraps made from beeswax and organic cotton.",
  },
  {
    id: 4, name: "Reusable Steel Straw Kit", category: "Food & Beverage",
    price: 95000, priceLabel: "95.000 VND", carbonIndex: 0.1, carbonLabel: "0.1 kg",
    rating: 4.9, reviews: 203, stock: 200, img: imgStraw,
    badge: "85% RECYCLABLE", certifications: ["RECYCLABLE", "BPA FREE"],
    material: "Stainless Steel", decomposition: "Recyclable", greenPoints: 10,
    description: "Set of 8 reusable straws with cleaning brushes and carry pouch.",
  },
  {
    id: 5, name: "Natural Coconut Bowl Set", category: "Home & Kitchen",
    price: 320000, priceLabel: "320.000 VND", carbonIndex: 0.4, carbonLabel: "0.4 kg",
    rating: 4.7, reviews: 51, stock: 35, img: imgBowl,
    badge: "BIODEGRADABLE", certifications: ["BIODEGRADABLE", "100% NATURAL"],
    material: "Coconut Shell", decomposition: "~2 years", greenPoints: 32,
    description: "Handcrafted coconut shell bowls, each unique. Great for smoothie bowls.",
  },
  {
    id: 6, name: "Natural Hemp Soap Bar", category: "Personal Care",
    price: 85000, priceLabel: "85.000 VND", carbonIndex: 0.15, carbonLabel: "0.15 kg",
    rating: 4.6, reviews: 72, stock: 145, img: imgRel1,
    badge: "100% NATURAL", certifications: ["100% NATURAL", "BIODEGRADABLE"],
    material: "Hemp Oil", decomposition: "~3 months", greenPoints: 9,
    description: "Cold-pressed hemp soap with essential oils, zero synthetic chemicals.",
  },
  {
    id: 7, name: "Insulated Steel Bottle (500ml)", category: "Travel",
    price: 420000, priceLabel: "420.000 VND", carbonIndex: 0.8, carbonLabel: "0.8 kg",
    rating: 4.9, reviews: 315, stock: 67, img: imgRel2,
    badge: "RECYCLABLE", certifications: ["RECYCLABLE", "BPA FREE"],
    material: "Stainless Steel", decomposition: "Recyclable", greenPoints: 42,
    description: "Double-wall vacuum insulated bottle, keeps drinks cold 24h, hot 12h.",
  },
  {
    id: 8, name: "Wooden Paddle Brush", category: "Personal Care",
    price: 210000, priceLabel: "210.000 VND", carbonIndex: 0.25, carbonLabel: "0.25 kg",
    rating: 4.4, reviews: 38, stock: 29, img: imgRel3,
    badge: "FSC CERTIFIED", certifications: ["FSC CERTIFIED", "BIODEGRADABLE"],
    material: "FSC Beech Wood", decomposition: "~3 years", greenPoints: 21,
    description: "Sustainably sourced beech wood brush with natural boar bristle blend.",
  },
  {
    id: 9, name: "Cotton Produce Bags (6-pack)", category: "Home & Kitchen",
    price: 125000, priceLabel: "125.000 VND", carbonIndex: 0.12, carbonLabel: "0.12 kg",
    rating: 4.7, reviews: 156, stock: 98, img: imgRel4,
    badge: "100% ORGANIC", certifications: ["100% ORGANIC", "COMPOSTABLE"],
    material: "Organic Cotton", decomposition: "~6 months", greenPoints: 13,
    description: "Lightweight mesh bags for plastic-free grocery shopping.",
  },
  {
    id: 10, name: "Seed Paper Notebook A5", category: "Office",
    price: 95000, priceLabel: "95.000 VND", carbonIndex: 0.18, carbonLabel: "0.18 kg",
    rating: 4.3, reviews: 27, stock: 75, img: imgBamboo,
    badge: "PLANTABLE", certifications: ["BIODEGRADABLE", "PLANTABLE"],
    material: "Recycled + Seed Paper", decomposition: "Plant it!", greenPoints: 10,
    description: "When you're done writing, plant the cover to grow wildflowers.",
  },
  {
    id: 11, name: "Hemp Canvas Backpack", category: "Fashion",
    price: 680000, priceLabel: "680.000 VND", carbonIndex: 0.6, carbonLabel: "0.6 kg",
    rating: 4.5, reviews: 44, stock: 18, img: imgTote,
    badge: "SUSTAINABLE", certifications: ["SUSTAINABLE", "DURABLE"],
    material: "Hemp Canvas", decomposition: "~2 years", greenPoints: 68,
    description: "Durable 20L hemp backpack, naturally water-resistant, no plastic lining.",
  },
  {
    id: 12, name: "Natural Hemp Dog Collar", category: "Pet",
    price: 165000, priceLabel: "165.000 VND", carbonIndex: 0.2, carbonLabel: "0.2 kg",
    rating: 4.6, reviews: 33, stock: 42, img: imgRel1,
    badge: "PET SAFE", certifications: ["PET SAFE", "BIODEGRADABLE"],
    material: "Hemp Rope", decomposition: "~1 year", greenPoints: 17,
    description: "Natural hemp dog collar, gentle on skin, adjustable, available in all sizes.",
  },
];

const CATEGORIES = ["All", "Home & Kitchen", "Personal Care", "Fashion", "Food & Beverage", "Office", "Travel", "Pet"];
const SORT_OPTIONS = [
  { value: "default",     label: "Mặc định" },
  { value: "price_asc",   label: "Giá tăng dần" },
  { value: "price_desc",  label: "Giá giảm dần" },
  { value: "carbon_asc",  label: "Carbon thấp nhất" },
  { value: "rating_desc", label: "Đánh giá cao nhất" },
  { value: "newest",      label: "Mới nhất" },
];
const CERTS = ["BIODEGRADABLE", "BPA FREE", "100% ORGANIC", "RECYCLABLE", "ZERO PLASTIC", "FSC CERTIFIED", "PLANTABLE"];

// ─── Compare Bar ──────────────────────────────────────────────────────────────
function CompareBar({
  items,
  onRemove,
  onCompare,
  onClear,
}: {
  items: Product[];
  onRemove: (id: number) => void;
  onCompare: () => void;
  onClear: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="fixed bottom-[64px] md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-[#dbe3d3] shadow-[0_-4px_24px_rgba(0,0,0,0.10)]">
      {/* Mobile: 2-row layout */}
      <div className="md:hidden px-4 pt-2.5 pb-2 flex flex-col gap-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <GitCompare size={15} className="text-[#25521f] shrink-0" />
          <span className="text-[#42493e] text-[12px] shrink-0">So sánh ({items.length}/3):</span>
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-1 bg-[#f0f7ee] border border-[#c2c9bb] rounded-full px-2.5 py-0.5 shrink-0">
              <span className="text-[#1a1c19] text-[11px] max-w-[90px] truncate">{p.name}</span>
              <button onClick={() => onRemove(p.id)} className="text-[#6b7280] hover:text-[#ba1a1a]">
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClear} className="flex-1 text-[12px] text-[#6b7280] border border-[#dde8d8] rounded-full py-1.5 hover:bg-[#f5f9f3] transition-colors">
            Xóa tất cả
          </button>
          <button
            onClick={onCompare}
            disabled={items.length < 2}
            className="flex-1 bg-[#25521f] text-white text-[12px] tracking-wide py-1.5 rounded-full disabled:opacity-40 hover:bg-[#1e4219] transition-colors"
          >
            So sánh ngay
          </button>
        </div>
      </div>

      {/* Desktop: single row, padding-right to clear chatbot button */}
      <div className="hidden md:flex items-center gap-4 px-16 pr-24 py-3">
        <GitCompare size={18} className="text-[#25521f] shrink-0" />
        <span className="text-[#42493e] text-[13px] shrink-0">So sánh ({items.length}/3):</span>
        <div className="flex items-center gap-2 overflow-x-auto flex-1">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-1.5 bg-[#f0f7ee] border border-[#c2c9bb] rounded-full px-3 py-1 shrink-0">
              <span className="text-[#1a1c19] text-[12px] max-w-[120px] truncate">{p.name}</span>
              <button onClick={() => onRemove(p.id)} className="text-[#6b7280] hover:text-[#ba1a1a]">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onClear} className="text-[13px] text-[#6b7280] hover:text-[#42493e] underline">Xóa</button>
          <button
            onClick={onCompare}
            disabled={items.length < 2}
            className="bg-[#25521f] text-white text-[12px] tracking-widest uppercase px-5 py-2 rounded-full disabled:opacity-40 hover:bg-[#1e4219] transition-colors"
          >
            So sánh
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Compare Modal ─────────────────────────────────────────────────────────────
function CompareModal({ items, onClose }: { items: Product[]; onClose: () => void }) {
  const fields: { label: string; key: keyof Product }[] = [
    { label: "Giá", key: "priceLabel" },
    { label: "Carbon Index", key: "carbonLabel" },
    { label: "Đánh giá", key: "rating" },
    { label: "Vật liệu", key: "material" },
    { label: "Phân hủy", key: "decomposition" },
    { label: "Green Points", key: "greenPoints" },
    { label: "Tồn kho", key: "stock" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[900px] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e3de] sticky top-0 bg-white z-10">
          <h3 className="text-[#1a1c19] text-[18px] font-['Nimbus_Sans:Bold',sans-serif]">So sánh sản phẩm</h3>
          <button onClick={onClose} className="text-[#6b7280] hover:text-[#1a1c19] p-1"><X size={20} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e3de]">
                <th className="text-left px-6 py-3 text-[#6b7280] text-[11px] tracking-widest uppercase w-[140px]">Thuộc tính</th>
                {items.map((p) => (
                  <th key={p.id} className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#e2e3de]">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[#1a1c19] text-[13px] leading-tight max-w-[140px]">{p.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((f, i) => (
                <tr key={f.key} className={i % 2 === 0 ? "bg-[#fafaf5]" : "bg-white"}>
                  <td className="px-6 py-3 text-[#6b7280] text-[12px] tracking-wide uppercase">{f.label}</td>
                  {items.map((p) => {
                    const val = p[f.key];
                    const isCarbon = f.key === "carbonLabel";
                    const isBest = isCarbon && items.every((op) => op.carbonIndex >= p.carbonIndex);
                    return (
                      <td key={p.id} className={`px-4 py-3 text-center text-[14px] ${isBest ? "text-[#25521f] font-bold" : "text-[#1a1c19]"}`}>
                        {f.key === "rating" ? `${val} ⭐` : f.key === "greenPoints" ? `+${val} pts` : String(val)}
                        {isBest && <span className="ml-1 text-[10px] text-[#25521f]">✓ thấp nhất</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t border-[#e2e3de]">
                <td className="px-6 py-3" />
                {items.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center">
                    <button className="bg-gradient-to-r from-[#3d6b35] to-[#25521f] text-white text-[11px] tracking-widest uppercase px-4 py-2 rounded-full hover:shadow-md transition-all">
                      Thêm vào giỏ
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Panel ──────────────────────────────────────────────────────────────
function FilterPanel({
  selectedCats,
  setSelectedCats,
  priceRange,
  setPriceRange,
  carbonFilter,
  setCarbonFilter,
  selectedCerts,
  setSelectedCerts,
  onClose,
}: {
  selectedCats: string[];
  setSelectedCats: (v: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  carbonFilter: string;
  setCarbonFilter: (v: string) => void;
  selectedCerts: string[];
  setSelectedCerts: (v: string[]) => void;
  onClose?: () => void;
}) {
  const toggleCat = (cat: string) =>
    setSelectedCats(selectedCats.includes(cat) ? selectedCats.filter((c) => c !== cat) : [...selectedCats, cat]);
  const toggleCert = (cert: string) =>
    setSelectedCerts(selectedCerts.includes(cert) ? selectedCerts.filter((c) => c !== cert) : [...selectedCerts, cert]);

  return (
    <div className="flex flex-col gap-6">
      {onClose && (
        <div className="flex items-center justify-between pb-2 border-b border-[#e2e3de]">
          <h3 className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[16px]">Bộ lọc</h3>
          <button onClick={onClose}><X size={18} className="text-[#6b7280]" /></button>
        </div>
      )}

      {/* Categories */}
      <div className="flex flex-col gap-3">
        <h4 className="text-[#1a1c19] text-[11px] tracking-widest uppercase font-['Nimbus_Sans:Bold',sans-serif]">Danh mục</h4>
        {CATEGORIES.filter((c) => c !== "All").map((cat) => (
          <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCats.includes(cat) ? "bg-[#25521f] border-[#25521f]" : "border-[#c2c9bb] group-hover:border-[#25521f]"}`}>
              {selectedCats.includes(cat) && <Check size={10} className="text-white" />}
            </div>
            <input type="checkbox" className="hidden" checked={selectedCats.includes(cat)} onChange={() => toggleCat(cat)} />
            <span className="text-[#42493e] text-[13px]">{cat}</span>
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <h4 className="text-[#1a1c19] text-[11px] tracking-widest uppercase font-['Nimbus_Sans:Bold',sans-serif]">Khoảng giá (VND)</h4>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            placeholder="0"
            className="w-full border border-[#c2c9bb] rounded px-3 py-2 text-[13px] outline-none focus:border-[#25521f] text-[#1a1c19]"
          />
          <span className="text-[#6b7280] text-[12px] shrink-0">–</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            placeholder="1000000"
            className="w-full border border-[#c2c9bb] rounded px-3 py-2 text-[13px] outline-none focus:border-[#25521f] text-[#1a1c19]"
          />
        </div>
      </div>

      {/* Carbon Index */}
      <div className="flex flex-col gap-3">
        <h4 className="text-[#1a1c19] text-[11px] tracking-widest uppercase font-['Nimbus_Sans:Bold',sans-serif]">Chỉ số Carbon</h4>
        {[
          { value: "all", label: "Tất cả" },
          { value: "low", label: "Thấp (< 0.3 kg)" },
          { value: "mid", label: "Trung bình (0.3–0.6 kg)" },
          { value: "high", label: "Cao (> 0.6 kg)" },
        ].map((opt) => (
          <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${carbonFilter === opt.value ? "border-[#25521f]" : "border-[#c2c9bb]"}`}>
              {carbonFilter === opt.value && <div className="w-2 h-2 rounded-full bg-[#25521f]" />}
            </div>
            <span className="text-[#42493e] text-[13px]">{opt.label}</span>
            <input type="radio" className="hidden" checked={carbonFilter === opt.value} onChange={() => setCarbonFilter(opt.value)} />
          </label>
        ))}
      </div>

      {/* Certifications */}
      <div className="flex flex-col gap-3">
        <h4 className="text-[#1a1c19] text-[11px] tracking-widest uppercase font-['Nimbus_Sans:Bold',sans-serif]">Chứng nhận</h4>
        {CERTS.map((cert) => (
          <label key={cert} className="flex items-center gap-2.5 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCerts.includes(cert) ? "bg-[#25521f] border-[#25521f]" : "border-[#c2c9bb] group-hover:border-[#25521f]"}`}>
              {selectedCerts.includes(cert) && <Check size={10} className="text-white" />}
            </div>
            <input type="checkbox" className="hidden" checked={selectedCerts.includes(cert)} onChange={() => toggleCert(cert)} />
            <span className="text-[#42493e] text-[12px]">{cert}</span>
          </label>
        ))}
      </div>

      <button
        onClick={() => {
          setSelectedCats([]);
          setPriceRange([0, 1000000]);
          setCarbonFilter("all");
          setSelectedCerts([]);
        }}
        className="text-[#6b7280] text-[12px] underline self-start hover:text-[#42493e]"
      >
        Xóa tất cả bộ lọc
      </button>
    </div>
  );
}

// ─── ShopPage ─────────────────────────────────────────────────────────────────
export function ShopPage({
  onNavigate,
  onAddToCart,
  onWishlist,
  wishlistIds,
}: {
  onNavigate: (page: string) => void;
  onAddToCart: (p: Product) => void;
  onWishlist: (p: Product) => void;
  wishlistIds: number[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [carbonFilter, setCarbonFilter] = useState("all");
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const [showFilter, setShowFilter] = useState(false);
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const activeFilterCount = selectedCats.length + selectedCerts.length +
    (carbonFilter !== "all" ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000000 ? 1 : 0);

  const filtered = useMemo(() => {
    let products = ALL_PRODUCTS;
    if (search.trim()) {
      const q = search.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.material.toLowerCase().includes(q));
    }
    if (selectedCats.length > 0) products = products.filter((p) => selectedCats.includes(p.category));
    if (priceRange[0] > 0) products = products.filter((p) => p.price >= priceRange[0]);
    if (priceRange[1] < 1000000) products = products.filter((p) => p.price <= priceRange[1]);
    if (carbonFilter === "low") products = products.filter((p) => p.carbonIndex < 0.3);
    if (carbonFilter === "mid") products = products.filter((p) => p.carbonIndex >= 0.3 && p.carbonIndex <= 0.6);
    if (carbonFilter === "high") products = products.filter((p) => p.carbonIndex > 0.6);
    if (selectedCerts.length > 0) products = products.filter((p) => selectedCerts.some((c) => p.certifications.includes(c)));
    switch (sortBy) {
      case "price_asc":   return [...products].sort((a, b) => a.price - b.price);
      case "price_desc":  return [...products].sort((a, b) => b.price - a.price);
      case "carbon_asc":  return [...products].sort((a, b) => a.carbonIndex - b.carbonIndex);
      case "rating_desc": return [...products].sort((a, b) => b.rating - a.rating);
      default: return products;
    }
  }, [search, selectedCats, priceRange, carbonFilter, selectedCerts, sortBy]);

  const toggleCompare = (p: Product) => {
    if (compareItems.find((c) => c.id === p.id)) {
      setCompareItems((prev) => prev.filter((c) => c.id !== p.id));
    } else if (compareItems.length < 3) {
      setCompareItems((prev) => [...prev, p]);
    }
  };

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Mặc định";

  return (
    <main className="flex-1 pb-[120px] md:pb-20">
      {/* Top bar */}
      <div className="border-b border-[#dbe3d3] bg-white/60 backdrop-blur-sm sticky top-[56px] md:top-[80px] z-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-3 flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 flex items-center bg-white border border-[#c2c9bb] rounded-md px-3 gap-2 h-9">
            <Search size={14} className="text-[#9ca3af] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm xanh..."
              className="flex-1 text-[13px] text-gray-700 outline-none placeholder-[#9ca3af] bg-transparent"
            />
            {search && <button onClick={() => setSearch("")}><X size={13} className="text-[#9ca3af]" /></button>}
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilter(true)}
            className={`flex items-center gap-1.5 border px-3 py-2 rounded-md text-[12px] transition-colors ${activeFilterCount > 0 ? "border-[#25521f] text-[#25521f] bg-[#f0f7ee]" : "border-[#c2c9bb] text-[#42493e] hover:border-[#25521f]"}`}
          >
            <SlidersHorizontal size={14} />
            <span>Lọc{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}</span>
          </button>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSort((v) => !v)}
              className="flex items-center gap-1.5 border border-[#c2c9bb] px-3 py-2 rounded-md text-[12px] text-[#42493e] hover:border-[#25521f] transition-colors"
            >
              <ArrowUpDown size={13} />
              <span className="hidden md:inline">{sortLabel}</span>
              <ChevronDown size={12} />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#c2c9bb] rounded-md shadow-lg z-30 w-[180px] py-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                    className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#f0f7ee] transition-colors ${sortBy === opt.value ? "text-[#25521f] font-medium" : "text-[#42493e]"}`}
                  >
                    {sortBy === opt.value && <Check size={12} className="inline mr-1" />}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showSort && <div className="fixed inset-0 z-20" onClick={() => setShowSort(false)} />}

      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-6 flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-[220px] shrink-0">
          <FilterPanel
            selectedCats={selectedCats} setSelectedCats={setSelectedCats}
            priceRange={priceRange} setPriceRange={setPriceRange}
            carbonFilter={carbonFilter} setCarbonFilter={setCarbonFilter}
            selectedCerts={selectedCerts} setSelectedCerts={setSelectedCerts}
          />
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#6b7280] text-[13px]">{filtered.length} sản phẩm</p>
            {compareItems.length > 0 && (
              <span className="text-[#25521f] text-[12px] flex items-center gap-1">
                <GitCompare size={13} /> Đã chọn {compareItems.length} để so sánh
              </span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-[#f0f7ee] flex items-center justify-center">
                <Search size={24} className="text-[#25521f]" />
              </div>
              <p className="text-[#42493e] text-[16px]">Không tìm thấy sản phẩm phù hợp</p>
              <button
                onClick={() => { setSearch(""); setSelectedCats([]); setCarbonFilter("all"); setSelectedCerts([]); setPriceRange([0, 1000000]); }}
                className="text-[#25521f] underline text-[13px]"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={onAddToCart}
                  onWishlist={onWishlist}
                  wishlisted={wishlistIds.includes(p.id)}
                  compareSelected={compareItems.some((c) => c.id === p.id)}
                  onToggleCompare={toggleCompare}
                  onNavigate={() => onNavigate("product")}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {showFilter && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowFilter(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="p-5">
              <FilterPanel
                selectedCats={selectedCats} setSelectedCats={setSelectedCats}
                priceRange={priceRange} setPriceRange={setPriceRange}
                carbonFilter={carbonFilter} setCarbonFilter={setCarbonFilter}
                selectedCerts={selectedCerts} setSelectedCerts={setSelectedCerts}
                onClose={() => setShowFilter(false)}
              />
              <button
                onClick={() => setShowFilter(false)}
                className="mt-4 w-full bg-[#25521f] text-white text-[13px] tracking-widest uppercase py-3 rounded-full"
              >
                Xem {filtered.length} sản phẩm
              </button>
            </div>
          </div>
        </>
      )}

      {/* Compare bar */}
      <CompareBar
        items={compareItems}
        onRemove={(id) => setCompareItems((prev) => prev.filter((p) => p.id !== id))}
        onCompare={() => setShowCompare(true)}
        onClear={() => setCompareItems([])}
      />

      {/* Compare modal */}
      {showCompare && <CompareModal items={compareItems} onClose={() => setShowCompare(false)} />}
    </main>
  );
}
