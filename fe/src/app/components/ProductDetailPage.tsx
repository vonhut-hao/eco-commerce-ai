import { useState, useEffect } from "react";
import { Star, Plus, Minus } from "lucide-react";
import { productsApi, ProductBE } from "../../api/products";
import type { Page } from "../App";
import type { Product } from "./ShopPage";
import { toast } from "./Toast";
import svgPaths from "../../imports/ProductDetail2/svg-oqupvr7hg1";

type Tab = "description" | "sustainability" | "reviews";

export function ProductDetailPage({
  productId,
  onNavigate,
  onAddToCart,
  wishlistIds,
  onWishlist,
}: {
  productId: number;
  onNavigate: (page: Page) => void;
  onAddToCart: (p: Product) => void;
  wishlistIds: number[];
  onWishlist: (p: Product) => void;
}) {
  const [product, setProduct] = useState<ProductBE | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    productsApi.getProductById(productId)
      .then(res => {
        setProduct(res);
        setQuantity(1);
        setSelectedThumb(0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return <div className="py-32 text-center text-[#42493e]">Loading product details...</div>;
  }

  if (!product) {
    return <div className="py-32 text-center text-[#ba1a1a]">Product not found</div>;
  }

  const images = [product.mainImage];
  if (product.subImages) {
    try {
      const parsed = JSON.parse(product.subImages);
      if (Array.isArray(parsed)) images.push(...parsed);
    } catch (e) {
      // ignore
    }
  }
  
  // Pad images if less than 4 for gallery layout
  while (images.length < 4 && images.length > 0) {
    images.push(images[0]);
  }

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    // Convert BE product to FE Product type for cart
    const p: Product = {
      id: product.id,
      name: product.name,
      category: product.categories?.[0]?.name || "N/A",
      price: product.price,
      priceLabel: `${product.price.toLocaleString("vi-VN")} VND`,
      carbonIndex: product.carbonIndex,
      carbonLabel: `${product.carbonIndex} kg`,
      rating: product.avgRating || 0,
      reviews: product.comments?.length || 0,
      stock: product.stock,
      img: product.mainImage || "",
      badge: product.ecoFriendliness || "ECO",
      certifications: product.greenCertificates?.map(c => c.name) || [],
      material: product.materials?.map(m => m.name).join(", ") || "",
      decomposition: "~6 months",
      greenPoints: product.greenPoints,
      description: product.description,
    };
    // Add multiple quantity
    for(let i=0; i<quantity; i++) {
      onAddToCart(p);
    }
  };

  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* Breadcrumb */}
      <nav className="hidden md:flex items-center gap-1 text-[13px]">
        {["HOME", (product.categories?.[0]?.name || "SHOP").toUpperCase()].map((item) => (
          <span key={item} className="flex items-center gap-1">
            <button onClick={() => onNavigate("shop")} className="text-[#42493e] font-['Nimbus_Sans:Bold',sans-serif] tracking-wide hover:text-[#25521f] transition-colors">
              {item}
            </button>
            <svg width="4" height="7" viewBox="0 0 4.31667 7" fill="none">
              <path d={svgPaths.p35022f90} fill="#42493E" />
            </svg>
          </span>
        ))}
        <span className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] tracking-wide uppercase">
          {product.name}
        </span>
      </nav>

      <section className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-10">
        {/* Gallery */}
        <div className="flex flex-col gap-4 w-full md:col-span-7">
          <div className="bg-[#eeeee9] rounded-md overflow-hidden aspect-[4/3] md:aspect-auto md:h-[491px]">
            <img src={images[selectedThumb]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {images.slice(0, 4).map((thumb, i) => (
              <button
                key={i}
                onClick={() => setSelectedThumb(i)}
                className={`aspect-square bg-[#eeeee9] rounded-md overflow-hidden border-2 transition-all ${
                  selectedThumb === i ? "border-[#25521f] scale-[0.97]" : "border-[#c2c9bb] hover:border-[#42493e]"
                }`}
              >
                <img src={thumb} alt={`Góc nhìn ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5 w-full md:col-span-5">
          <div className="flex flex-col gap-2">
            <h1 className="font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19] text-3xl md:text-[40px] md:leading-[48px] tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-[#25521f] font-['Nimbus_Sans:Bold',sans-serif] text-xl md:text-2xl">
                {(product.price || 0).toLocaleString("vi-VN")} VND
              </span>
              <div className="flex items-center gap-1">
                <svg width="15" height="14" viewBox="0 0 15 14.25" fill="none">
                  <path d={svgPaths.p389def00} fill="#6B5D3F" />
                </svg>
                <span className="text-[#6b5d3f] text-[14px]">
                  {(product.avgRating || 0).toFixed(1)} ({product.comments?.length || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          <p className="text-[#42493e] text-[15px] leading-[26px]">
            {product.description}
          </p>

          <div className="bg-[#f4f4ef] border border-[#c2c9bb] rounded-md p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[#42493e] text-[13px] tracking-widest uppercase font-['Nimbus_Sans:Bold',sans-serif]">
                CARBON FOOTPRINT
              </span>
              <span className="text-[#25521f] text-[14px] font-['Liberation_Mono:Bold',monospace] font-bold">
                {product.carbonIndex || 0} kg CO2 / unit
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="relative bg-[#e2e3de] h-6 rounded-xl overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-[#25521f]" style={{ width: `${Math.min(100, ((product.carbonIndex || 0) / 2.0) * 100)}%` }} />
                <div className="absolute inset-0 flex items-center px-4 justify-end">
                  <span className="text-[10px] font-['Nimbus_Sans:Bold',sans-serif] text-[#42493e]">
                    YOUR CHOICE: {product.carbonIndex || 0}kg
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.greenCertificates?.map(c => (
              <span key={c.id} className="bg-[#f1deb8] text-[#6f6143] text-[13px] px-3 py-1 rounded-full tracking-tight uppercase">
                {c.name}
              </span>
            ))}
            {product.ecoFriendliness && (
              <span className="bg-[#f1deb8] text-[#6f6143] text-[13px] px-3 py-1 rounded-full tracking-tight uppercase">
                {product.ecoFriendliness}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#c2c9bb] rounded-full bg-[#fafaf5] h-11 overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-[#1a1c19] hover:bg-[#eeeee9] h-full transition-colors">
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-[15px] font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19]">
                  {quantity}
                </span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-[#1a1c19] hover:bg-[#eeeee9] h-full transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 h-11 rounded-full text-[13px] tracking-widest uppercase font-['Nimbus_Sans:Regular',sans-serif] transition-all ${
                  addedToCart ? "bg-[#42493e] text-white" : "bg-gradient-to-r from-[#3d6b35] to-[#25521f] text-white shadow-md shadow-[#25521f]/25 hover:shadow-lg active:scale-[0.98]"
                }`}
              >
                {addedToCart ? "ADDED ✓" : "ADD TO CART"}
              </button>
            </div>
            
            <button
              onClick={() => onWishlist(product as any)}
              className={`w-full h-11 rounded-full border text-[13px] tracking-widest uppercase font-['Nimbus_Sans:Regular',sans-serif] flex items-center justify-center gap-2 transition-all ${
                isWishlisted ? "border-[#25521f] text-[#25521f] bg-[#f0f7ee]" : "border-[#6b5d3f] text-[#6b5d3f] hover:bg-[#faf7f2]"
              }`}
            >
              <svg width="15" height="13.76" viewBox="0 0 15 13.7625" fill="none" className="shrink-0">
                <path d={svgPaths.pb031200} fill={isWishlisted ? "#25521f" : "none"} stroke={isWishlisted ? "#25521f" : "#6b5d3f"} strokeWidth={isWishlisted ? 0 : 0.8} />
              </svg>
              {isWishlisted ? "SAVED TO WISHLIST" : "ADD TO WISHLIST"}
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="w-full flex flex-col gap-6 border-t border-[#c2c9bb] pt-12">
        <div className="relative border-b border-[#c2c9bb] overflow-x-auto">
          <div className="flex gap-8 min-w-max">
            {[
              { key: "description", label: "DESCRIPTION" },
              { key: "sustainability", label: "SUSTAINABILITY INFO" },
              { key: "reviews", label: `REVIEWS (${product.comments?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as Tab)}
                className={`pb-4 text-[14px] tracking-widest uppercase relative transition-colors ${
                  activeTab === tab.key ? "text-[#25521f] font-['Nimbus_Sans:Bold',sans-serif]" : "text-[#42493e] hover:text-[#1a1c19]"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#25521f]" />}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "description" && (
          <div className="flex flex-col gap-6 max-w-[768px]">
            <p className="text-[#42493e] text-[15px] leading-[26px]">
              {product.description}
            </p>
          </div>
        )}

        {activeTab === "sustainability" && (
          <div className="flex flex-col gap-4 max-w-[768px]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#f4f4ef] border border-[#c2c9bb] rounded-md p-4">
                <div className="text-[#42493e] text-[11px] tracking-widest uppercase mb-1">Carbon Footprint</div>
                <div className="text-[#25521f] font-bold text-[16px] font-['Liberation_Mono:Bold',monospace]">{product.carbonIndex || 0} kg CO2</div>
              </div>
              <div className="bg-[#f4f4ef] border border-[#c2c9bb] rounded-md p-4">
                <div className="text-[#42493e] text-[11px] tracking-widest uppercase mb-1">Green Points</div>
                <div className="text-[#25521f] font-bold text-[16px] font-['Liberation_Mono:Bold',monospace]">+{product.greenPoints || 0}</div>
              </div>
              <div className="bg-[#f4f4ef] border border-[#c2c9bb] rounded-md p-4">
                <div className="text-[#42493e] text-[11px] tracking-widest uppercase mb-1">Materials</div>
                <div className="text-[#25521f] font-bold text-[16px] font-['Liberation_Mono:Bold',monospace]">
                  {product.materials?.map(m => m.name).join(", ") || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="flex flex-col gap-5 max-w-[768px]">
            <div className="flex items-center gap-3">
              <span className="text-[#1a1c19] text-4xl font-['Nimbus_Sans:Bold',sans-serif]">{(product.avgRating || 0).toFixed(1)}</span>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={16} fill={s <= Math.round(product.avgRating || 0) ? "#6B5D3F" : "none"} className="text-[#6b5d3f]" />
                  ))}
                </div>
                <span className="text-[#6b5d3f] text-[13px]">{product.comments?.length || 0} reviews</span>
              </div>
            </div>
            {product.comments?.map((review) => (
              <div key={review.id} className="border-b border-[#e2e3de] pb-4 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#25521f] rounded-full flex items-center justify-center text-white text-[12px] font-bold">
                    {review.user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="text-[#1a1c19] text-[14px] font-medium">{review.user?.email || "Anonymous"}</div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={11} fill={s <= review.rating ? "#6B5D3F" : "none"} className="text-[#6b5d3f]" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[#42493e] text-[14px] leading-[22px]">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
