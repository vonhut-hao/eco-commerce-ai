import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { productService, ProductSimpleResponse } from "@/services/product.service";
import { cartService } from "@/services/cart.service";
import { authService } from "@/services/auth.service";
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function ShopPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductSimpleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.listProducts(page, pageSize);
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    const userId = authService.getUserId();
    if (!userId) {
      navigate("/signin");
      return;
    }
    try {
      await cartService.addToCart(productId, 1, userId);
      alert("Added to cart successfully!");
      // Simple window reload or event dispatch to trigger header refresh
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err: any) {
      alert(err.message || "Failed to add to cart");
    }
  };

  return (
    <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-16 py-8">
      {/* Banner */}
      <div className="bg-[#bcf1ad]/30 rounded-lg p-8 md:p-12 mb-8 flex flex-col justify-center border border-[#c2c9bb]">
        <span className="text-[#25521f] text-sm font-semibold tracking-wider uppercase mb-2">Sustainable Living</span>
        <h1 className="text-3xl md:text-5xl font-['Nimbus_Sans',sans-serif] font-bold text-[#1a1c19] mb-4">
          Eco-Friendly Curation
        </h1>
        <p className="text-base text-[#42493e] max-w-xl">
          Empowering conscious living through products that are good for you and gentle on the planet. Earn green points with every purchase.
        </p>
      </div>

      {/* Grid Header */}
      <div className="flex items-center justify-between border-b border-[#c2c9bb] pb-4 mb-6">
        <h2 className="text-xl font-bold text-[#1a1c19]">All Products</h2>
        <span className="text-sm text-[#42493e]">Showing {products.length} items</span>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-[#25521f]" size={36} />
          <p className="text-sm text-[#42493e]">Fetching curated selections...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-[#25521f] text-white rounded-sm text-sm hover:bg-[#1a1c19] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#42493e] font-semibold">No eco-friendly products found.</p>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="bg-white border border-[#c2c9bb] rounded-md overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
              >
                {/* Image */}
                <div className="aspect-square bg-[#fafaf5] relative overflow-hidden flex items-center justify-center p-4 border-b border-[#c2c9bb]/50">
                  <img
                    src={product.mainImage || "/placeholder-product.png"}
                    alt={product.name}
                    className="object-contain max-h-full max-w-full transition-transform group-hover:scale-105 duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                  {product.greenPoints > 0 && (
                    <div className="absolute top-2 left-2 bg-[#bcf1ad] text-[#25521f] text-xs font-bold px-2 py-0.5 rounded-sm">
                      +{product.greenPoints} Points
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1a1c19] line-clamp-2 min-h-[40px] mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-[#1a1c19]">
                        {product.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-[#25521f] text-base">
                      {product.price.toLocaleString("vi-VN")} VND
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, product.id)}
                      className="p-2 bg-[#fafaf5] border border-[#c2c9bb] text-[#42493e] hover:bg-[#25521f] hover:text-white hover:border-[#25521f] rounded-md transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 border border-[#c2c9bb] rounded-md text-[#42493e] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#bcf1ad]/20 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-[#42493e] font-semibold">
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 border border-[#c2c9bb] rounded-md text-[#42493e] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#bcf1ad]/20 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
