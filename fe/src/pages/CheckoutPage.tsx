import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { cartService, CartItemResponse } from "@/services/cart.service";
import { orderService } from "@/services/order.service";
import { authService } from "@/services/auth.service";
import { Loader2, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"default" | "cod">("default");

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
    try {
      const response = await cartService.getCart();
      setCartItems(response.data || []);
      if (response.data.length === 0) {
        navigate("/cart");
      }
    } catch (err) {
      setError("Failed to fetch cart elements.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      // paymentMethodId = null uses the backend default active method
      await orderService.placeOrder(null);
      alert("Order placed successfully! Thank you for purchasing sustainably.");
      window.dispatchEvent(new Event("cart-updated"));
      navigate("/orders");
    } catch (err: any) {
      alert(err.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const pointsEarned = Math.floor(totalAmount / 20000);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-[#25521f]" size={40} />
        <p className="text-sm text-[#42493e]">Setting up your checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-12 text-center">
        <p className="text-red-600 font-semibold mb-6">{error}</p>
        <button
          onClick={fetchCart}
          className="px-4 py-2 bg-[#25521f] text-white rounded-sm text-sm hover:bg-[#1a1c19] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }


  return (
    <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-16 py-8 bg-[#fafaf5]">
      {/* Back button */}
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737b6c] hover:text-[#25521f] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={14} /> Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Columns – Checkout Details */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-['Nimbus_Sans',sans-serif] font-bold text-[#1a1c19] mb-2">Checkout</h1>
            <p className="text-sm text-[#737b6c]">Complete your purchase to earn green points.</p>
          </div>

          {/* Shipping Address Mock */}
          <div className="bg-white border border-[#c2c9bb] rounded-md p-6">
            <h3 className="font-bold text-sm text-[#1a1c19] uppercase tracking-wider mb-4 border-b border-[#c2c9bb]/40 pb-2">
              Shipping Address
            </h3>
            <div className="text-sm text-[#42493e] flex flex-col gap-1">
              <span className="font-bold text-[#1a1c19]">John Doe</span>
              <span>(+84) 906543210</span>
              <span>123 Green Avenue, Eco City, District 1, Ho Chi Minh City</span>
              <span className="text-xs text-[#25521f] font-semibold mt-2 flex items-center gap-1.5">
                <CheckCircle2 size={12} /> Default Address
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-[#c2c9bb] rounded-md p-6">
            <h3 className="font-bold text-sm text-[#1a1c19] uppercase tracking-wider mb-4 border-b border-[#c2c9bb]/40 pb-2">
              Payment Method
            </h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 border border-[#c2c9bb] rounded-md p-4 bg-[#fafaf5] cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "default"}
                  onChange={() => setPaymentMethod("default")}
                  className="accent-[#25521f]"
                />
                <div className="text-sm">
                  <span className="font-bold block text-[#1a1c19]">GreenLife Wallet / Linked Account</span>
                  <span className="text-xs text-[#737b6c]">Pay securely with your default linked balance.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 border border-[#c2c9bb]/50 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-[#25521f]"
                />
                <div className="text-sm">
                  <span className="font-bold block text-[#1a1c19]">Cash On Delivery (COD)</span>
                  <span className="text-xs text-[#737b6c]">Pay in cash on package arrival.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column – Billing summary */}
        <div className="bg-white border border-[#c2c9bb] rounded-md p-6 h-fit flex flex-col gap-6">
          <h3 className="font-bold text-sm text-[#1a1c19] uppercase tracking-wider pb-4 border-b border-[#c2c9bb]/40">
            Billing Summary
          </h3>

          {/* Items Summary list */}
          <div className="flex flex-col gap-3 text-xs max-h-[160px] overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-[#42493e]">
                <span className="line-clamp-1 flex-1 pr-4">{item.productName} (x{item.quantity})</span>
                <span className="font-semibold">{(item.price * item.quantity).toLocaleString("vi-VN")} VND</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#c2c9bb]/40" />

          {/* Pricing detail */}
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between text-[#42493e]">
              <span>Subtotal</span>
              <span className="font-bold text-[#1a1c19]">{totalAmount.toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="flex justify-between text-[#42493e]">
              <span>Shipping Fee</span>
              <span className="text-xs text-[#25521f] font-semibold">FREE</span>
            </div>
            <div className="border-t border-[#c2c9bb]/40 my-2" />
            <div className="flex justify-between font-bold text-base text-[#25521f]">
              <span>Total Payment</span>
              <span>{totalAmount.toLocaleString("vi-VN")} VND</span>
            </div>
          </div>

          <div className="bg-[#bcf1ad]/30 border border-[#bcf1ad] text-[#25521f] text-xs font-semibold p-3.5 rounded-sm flex items-center gap-2">
            <ShieldCheck size={18} />
            <span>You will earn +{pointsEarned} Green Points with this checkout.</span>
          </div>

          <button
            disabled={placingOrder}
            onClick={handlePlaceOrder}
            className="w-full h-12 bg-[#25521f] text-white hover:bg-[#1a1c19] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
          >
            {placingOrder ? (
              <>
                <Loader2 className="animate-spin" size={14} /> Placing Order...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
