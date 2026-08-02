import { useState } from "react";
import { Minus, Plus, X, Tag, ShoppingBag, ArrowRight, Leaf, Trash2 } from "lucide-react";
import type { Product } from "./ShopPage";

import { CartItem } from "../../store/cartStore";

const COUPONS: Record<string, { type: "pct" | "fixed"; value: number; label: string }> = {
  GREEN10: { type: "pct", value: 10, label: "Giảm 10%" },
  GREENLIFE50K: { type: "fixed", value: 50000, label: "Giảm 50.000 VND" },
  ECO20: { type: "pct", value: 20, label: "Giảm 20%" },
};

function fmt(n: number) { return n.toLocaleString("vi-VN") + " VND"; }

export function CartPage({
  items,
  onUpdateQty,
  onRemove,
  onNavigate,
}: {
  items: CartItem[];
  onUpdateQty: (productId: number, qty: number) => void;
  onRemove: (productId: number) => void;
  onNavigate: (page: string) => void;
}) {
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalCO2 = items.reduce((sum, i) => sum + i.carbonIndex * i.quantity, 0);
  const totalGreenPts = items.reduce((sum, i) => sum + (i.greenPoints || 0) * i.quantity, 0);

  const coupon = appliedCoupon ? COUPONS[appliedCoupon] : null;
  const discount = coupon
    ? coupon.type === "pct"
      ? Math.round(subtotal * coupon.value / 100)
      : coupon.value
    : 0;
  const shipping = subtotal >= 200000 ? 0 : 30000;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError("");
    } else {
      setCouponError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
    }
  };

  if (items.length === 0) {
    return (
      <main className="flex-1 pb-20 md:pb-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-[#f0f7ee] flex items-center justify-center">
            <ShoppingBag size={32} className="text-[#25521f]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[#1a1c19] text-[20px] font-['Nimbus_Sans:Bold',sans-serif] mb-1">Giỏ hàng trống</p>
            <p className="text-[#6b7280] text-[14px]">Hãy khám phá và thêm sản phẩm xanh vào giỏ nhé!</p>
          </div>
          <button
            onClick={() => onNavigate("shop")}
            className="bg-gradient-to-r from-[#3d6b35] to-[#25521f] text-white text-[13px] tracking-widest uppercase px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Khám phá sản phẩm
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pb-20 md:pb-0">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-6">
          {["Giỏ hàng", "Thanh toán", "Xác nhận"].map((step, i) => (
            <span key={step} className={`flex items-center gap-2 ${i === 0 ? "text-[#25521f] font-medium" : ""}`}>
              {i > 0 && <ArrowRight size={12} />}
              {step}
            </span>
          ))}
        </div>

        <h1 className="font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19] text-[28px] md:text-[36px] mb-6">
          Giỏ hàng ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Cart items */}
          <div className="flex-1 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 bg-white/70 border border-[#e2e3de] rounded-xl p-4">
                <div
                  className="w-20 h-20 md:w-24 md:h-24 bg-[#eeeee9] rounded-lg overflow-hidden shrink-0 cursor-pointer"
                  onClick={() => onNavigate("product")}
                >
                  <img src={item.mainImage} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[#6b7280] text-[10px] uppercase tracking-wide">{item.category}</p>
                      <p className="text-[#1a1c19] text-[14px] md:text-[15px] leading-snug line-clamp-2">{item.productName}</p>
                    </div>
                    <button onClick={() => onRemove(item.productId)} className="text-[#6b7280] hover:text-[#ba1a1a] shrink-0 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-[#3d6b35] text-[#b5eaa6] text-[10px] px-1.5 py-0.5 rounded-sm">CO₂ {item.carbonIndex}kg</span>
                    <span className="text-[#25521f] text-[10px]">+{item.greenPoints || 0} pts/sản phẩm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-[#c2c9bb] rounded-lg overflow-hidden h-8">
                      <button
                        onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                        className="px-2.5 text-[#1a1c19] hover:bg-[#eeeee9] h-full transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-[13px] text-[#1a1c19]">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                        className="px-2.5 text-[#1a1c19] hover:bg-[#eeeee9] h-full transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-[#25521f] font-['Nimbus_Sans:Bold',sans-serif] text-[14px]">
                      {fmt(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <button
              onClick={() => onNavigate("shop")}
              className="flex items-center gap-2 text-[#25521f] text-[13px] hover:underline transition-all self-start"
            >
              ← Tiếp tục mua sắm
            </button>
          </div>

          {/* Order summary */}
          <div className="md:w-[340px] shrink-0">
            <div className="bg-white/80 border border-[#e2e3de] rounded-xl p-5 flex flex-col gap-4 sticky top-[100px]">
              <h2 className="font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19] text-[16px]">Tóm tắt đơn hàng</h2>

              {/* Coupon */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-[#6b7280] uppercase tracking-widest">Mã giảm giá</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#f0f7ee] border border-[#25521f]/30 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag size={13} className="text-[#25521f]" />
                      <span className="text-[#25521f] text-[13px] font-medium">{appliedCoupon}</span>
                      <span className="text-[#6b7280] text-[11px]">– {coupon?.label}</span>
                    </div>
                    <button onClick={() => { setAppliedCoupon(null); setCouponInput(""); }} className="text-[#6b7280] hover:text-[#ba1a1a]">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Nhập mã (VD: GREEN10)"
                      className="flex-1 border border-[#c2c9bb] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#25521f] text-[#1a1c19] placeholder-[#9ca3af]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 bg-[#25521f] text-white rounded-lg text-[12px] hover:bg-[#1e4219] transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[#ba1a1a] text-[11px]">{couponError}</p>}
              </div>

              {/* Summary rows */}
              <div className="flex flex-col gap-2 border-t border-[#e2e3de] pt-3">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#6b7280]">Tạm tính</span>
                  <span className="text-[#1a1c19]">{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#25521f]">Giảm giá</span>
                    <span className="text-[#25521f]">– {fmt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#6b7280]">Vận chuyển</span>
                  <span className={shipping === 0 ? "text-[#25521f]" : "text-[#1a1c19]"}>
                    {shipping === 0 ? "Miễn phí" : fmt(shipping)}
                  </span>
                </div>
                {shipping === 0 && <p className="text-[#25521f] text-[11px] italic">Đơn hàng trên 200.000 VND miễn phí vận chuyển</p>}
              </div>

              <div className="border-t border-[#e2e3de] pt-3 flex justify-between">
                <span className="font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19] text-[15px]">Tổng cộng</span>
                <span className="font-['Nimbus_Sans:Bold',sans-serif] text-[#25521f] text-[18px]">{fmt(total)}</span>
              </div>

              {/* Eco summary */}
              <div className="bg-[#f0f7ee] rounded-xl p-3 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Leaf size={13} className="text-[#25521f]" />
                  <span className="text-[#25521f] text-[12px] font-medium">Tác động môi trường</span>
                </div>
                <div className="text-[#42493e] text-[12px] flex justify-between">
                  <span>Tổng carbon footprint:</span>
                  <span className="font-medium">{totalCO2.toFixed(2)} kg CO₂</span>
                </div>
                <div className="text-[#42493e] text-[12px] flex justify-between">
                  <span>Green Points nhận được:</span>
                  <span className="font-medium text-[#25521f]">+{totalGreenPts} pts</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate("checkout")}
                className="w-full bg-gradient-to-r from-[#3d6b35] to-[#25521f] text-white text-[13px] tracking-widest uppercase py-3.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Tiến hành thanh toán
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
