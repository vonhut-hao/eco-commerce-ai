import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { cartService, CartItemResponse } from "@/services/cart.service";
import { authService } from "@/services/auth.service";
import { Trash2, Plus, Minus, ArrowLeft, Loader2, CreditCard } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const userId = authService.getUserId();
    if (!userId) {
      navigate("/signin");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.getCart();
      setCartItems(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (item: CartItemResponse, newQuantity: number) => {
    if (newQuantity <= 0) return;
    const userId = authService.getUserId();
    if (!userId) return;

    try {
      await cartService.updateQuantity(item.id, item.productId, newQuantity, userId);
      fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err: any) {
      alert(err.message || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    try {
      await cartService.removeFromCart(itemId);
      fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err: any) {
      alert(err.message || "Failed to remove item");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const greenPointsEstimation = cartItems.reduce((acc, item) => acc + (item.greenPoints || 0) * item.quantity, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-[#25521f]" size={40} />
        <p className="text-sm text-[#42493e]">Loading your GreenLife cart...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-16 py-8 bg-[#fafaf5]">
      <h1 className="text-3xl font-['Nimbus_Sans',sans-serif] font-bold text-[#1a1c19] mb-8">
        Your Shopping Cart
      </h1>

      {error ? (
        <div className="text-center py-12 bg-white border border-[#c2c9bb] rounded-md p-6">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchCart}
            className="px-4 py-2 bg-[#25521f] text-white rounded-sm text-sm hover:bg-[#1a1c19] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#c2c9bb] rounded-md p-8 flex flex-col items-center">
          <p className="text-lg font-semibold text-[#42493e] mb-4">Your cart is currently empty.</p>
          <p className="text-sm text-[#737b6c] mb-6 max-w-sm">
            Looks like you haven't added any sustainable selections yet. Check out our curated catalog!
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25521f] text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#1a1c19] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#c2c9bb] rounded-md p-4 flex gap-4 items-center justify-between"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-16 w-16 bg-[#fafaf5] rounded-sm border border-[#c2c9bb]/40 flex items-center justify-center p-2">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200"
                      alt={item.productName}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1a1c19] line-clamp-1">{item.productName}</h3>
                    <span className="text-xs text-[#737b6c] block mt-1">
                      {item.price.toLocaleString("vi-VN")} VND
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6">
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between border border-[#c2c9bb] rounded-sm h-8 w-24 bg-[#fafaf5]">
                    <button
                      disabled={item.quantity <= 1}
                      onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                      className="w-8 h-full flex items-center justify-center text-[#42493e] hover:bg-gray-100 disabled:opacity-30"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-bold text-[#1a1c19]">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      className="w-8 h-full flex items-center justify-center text-[#42493e] hover:bg-gray-100"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Price subtotal */}
                  <span className="text-sm font-bold text-[#25521f] min-w-[100px] text-right">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-[#737b6c] hover:text-red-600 transition-colors p-1.5"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white border border-[#c2c9bb] rounded-md p-6 h-fit flex flex-col gap-6">
            <h2 className="font-bold text-lg text-[#1a1c19] pb-4 border-b border-[#c2c9bb]/40">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-[#42493e]">
                <span>Subtotal</span>
                <span className="font-bold text-[#1a1c19]">
                  {subtotal.toLocaleString("vi-VN")} VND
                </span>
              </div>
              <div className="flex justify-between text-[#42493e]">
                <span>Shipping</span>
                <span className="text-xs text-[#25521f] font-semibold">FREE</span>
              </div>
              <div className="border-t border-[#c2c9bb]/40 my-2" />
              <div className="flex justify-between text-[#25521f] font-semibold">
                <span>Total Points Est.</span>
                <span>+{greenPointsEstimation} GP</span>
              </div>
            </div>

            <div className="bg-[#eff2eb] border border-[#c2c9bb] rounded-sm p-4 text-xs text-[#42493e]">
              <span className="font-bold block uppercase mb-1">Impact Check</span>
              You save approximately {(cartItems.length * 1.5).toFixed(1)}kg CO2 emissions with this order!
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full h-12 bg-[#25521f] text-white hover:bg-[#1a1c19] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard size={14} /> Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
