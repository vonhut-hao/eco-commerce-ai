import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, MapPin, CreditCard, Banknote, Smartphone, ArrowRight, Package, Leaf } from "lucide-react";
import { CartItem, useCartStore } from "../../store/cartStore";
import { ordersApi } from "../../api/orders";
import { paymentApi, PaymentMethodResponse } from "../../api/payment";
import { useAuthStore } from "../../store/authStore";
import { toast } from "./Toast";
type Step = "address" | "payment" | "confirm";

function fmt(n: number) { return n.toLocaleString("vi-VN") + " VND"; }

const PROVINCES = [
  "TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng",
  "Bình Dương", "Đồng Nai", "Khánh Hòa", "Thừa Thiên Huế", "Quảng Nam",
];

// ─── Step Indicator ────────────────────────────────────────────────────────────
function StepBar({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "address", label: "Địa chỉ" },
    { key: "payment", label: "Thanh toán" },
    { key: "confirm", label: "Xác nhận" },
  ];
  const idx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] transition-colors ${done ? "bg-[#25521f] text-white" : active ? "bg-[#25521f] text-white ring-4 ring-[#25521f]/20" : "border-2 border-[#c2c9bb] text-[#6b7280]"}`}>
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-[11px] whitespace-nowrap ${active ? "text-[#25521f] font-medium" : "text-[#6b7280]"}`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-16 md:w-24 mx-1 mb-5 transition-colors ${i < idx ? "bg-[#25521f]" : "bg-[#e2e3de]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Address Step ──────────────────────────────────────────────────────────────
function AddressStep({
  onNext,
  savedAddress,
  onSave,
}: {
  onNext: () => void;
  savedAddress: AddressForm | null;
  onSave: (form: AddressForm) => void;
}) {
  const [form, setForm] = useState<AddressForm>(
    savedAddress ?? { name: "", phone: "", province: "", address: "", note: "" }
  );
  const [showProvince, setShowProvince] = useState(false);

  const set = (key: keyof AddressForm, v: string) => setForm((f) => ({ ...f, [key]: v }));
  const valid = form.name && form.phone && form.province && form.address;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={18} className="text-[#25521f]" />
        <h2 className="font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19] text-[20px]">Địa chỉ giao hàng</h2>
      </div>

      <Field label="Họ và tên *">
        <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nguyễn Văn An" className={inputCls} />
      </Field>

      <Field label="Số điện thoại *">
        <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="0912 345 678" className={inputCls} />
      </Field>

      <Field label="Tỉnh / Thành phố *">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProvince((v) => !v)}
            className={`${inputCls} flex items-center justify-between text-left`}
          >
            <span className={form.province ? "text-[#1a1c19]" : "text-[#9ca3af]"}>{form.province || "Chọn tỉnh / thành phố"}</span>
            <ChevronDown size={15} className="text-[#6b7280] shrink-0" />
          </button>
          {showProvince && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#c2c9bb] rounded-xl shadow-lg z-20 max-h-[200px] overflow-y-auto py-1">
              {PROVINCES.map((p) => (
                <button
                  key={p}
                  onClick={() => { set("province", p); setShowProvince(false); }}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#1a1c19] hover:bg-[#f0f7ee] transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </Field>

      <Field label="Địa chỉ cụ thể *">
        <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Số nhà, tên đường, phường/xã, quận/huyện" className={inputCls} />
      </Field>

      <Field label="Ghi chú (tùy chọn)">
        <textarea
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
          placeholder="Hướng dẫn giao hàng..."
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </Field>

      <button
        disabled={!valid}
        onClick={() => { onSave(form); onNext(); }}
        className="w-full bg-gradient-to-r from-[#3d6b35] to-[#25521f] text-white text-[13px] tracking-widest uppercase py-3.5 rounded-full shadow-md disabled:opacity-40 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
      >
        Tiếp tục <ArrowRight size={14} />
      </button>
    </div>
  );
}

// ─── Payment Step ──────────────────────────────────────────────────────────────
type AddressForm = { name: string; phone: string; province: string; address: string; note: string };

const PAYMENT_META: Record<string, { label: string; desc: string; Icon: React.ElementType; color: string }> = {
  COD: { label: "Thanh toán khi nhận hàng", desc: "Trả tiền mặt khi shipper giao tới", Icon: Banknote, color: "#42493e" },
  BANK_TRANSFER: { label: "Chuyển khoản ngân hàng", desc: "Chuyển khoản qua QR / số tài khoản", Icon: CreditCard, color: "#1d4ed8" },
  MOMO: { label: "Ví MoMo", desc: "Quét mã QR MoMo để thanh toán", Icon: Smartphone, color: "#a21caf" },
  ZALOPAY: { label: "ZaloPay", desc: "Thanh toán qua ứng dụng ZaloPay", Icon: Smartphone, color: "#0284c7" },
};

function PaymentStep({ onNext, onBack, total, methods }: { onNext: (method: PaymentMethodResponse) => void; onBack: () => void; total: number; methods: PaymentMethodResponse[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(methods.length > 0 ? methods[0].id : null);

  const [loading, setLoading] = useState(false);
  
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard size={18} className="text-[#25521f]" />
        <h2 className="font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19] text-[20px]">Phương thức thanh toán</h2>
      </div>

      <div className="flex flex-col gap-3">
        {methods.map((method) => {
          const meta = PAYMENT_META[method.methodName] || { label: method.methodName, desc: "Phương thức thanh toán", Icon: CreditCard, color: "#42493e" };
          const Icon = meta.Icon;
          const active = selectedId === method.id;
          return (
            <button
              key={method.id}
              onClick={() => setSelectedId(method.id)}
              className={`flex items-center gap-4 border rounded-xl p-4 text-left transition-all ${active ? "border-[#25521f] bg-[#f0f7ee]" : "border-[#c2c9bb] hover:border-[#42493e]"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-[#25521f]" : "bg-[#f4f4ef]"}`}>
                <Icon size={18} color={active ? "white" : meta.color} />
              </div>
              <div className="flex-1">
                <p className={`text-[14px] ${active ? "text-[#25521f] font-medium" : "text-[#1a1c19]"}`}>{meta.label}</p>
                <p className="text-[#6b7280] text-[12px]">{meta.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "border-[#25521f]" : "border-[#c2c9bb]"}`}>
                {active && <div className="w-2.5 h-2.5 rounded-full bg-[#25521f]" />}
              </div>
            </button>
          );
        })}
      </div>

      {methods.find(m => m.id === selectedId)?.methodName === "BANK_TRANSFER" && (
        <div className="bg-[#f0f7ee] border border-[#c2c9bb] rounded-xl p-4 flex flex-col gap-2 text-[13px] text-[#42493e]">
          <p className="font-medium text-[#1a1c19]">Thông tin chuyển khoản Ngân hàng:</p>
          <p>Ngân hàng: <span className="font-medium">Vietcombank</span></p>
          <p>Số TK: <span className="font-medium">1234567890</span></p>
          <p>Tên TK: <span className="font-medium">GREENLIFE COMPANY</span></p>
          <p>Nội dung: <span className="font-medium">Tên + SDT</span></p>
        </div>
      )}

      {methods.find(m => m.id === selectedId)?.methodName === "MOMO" && (
        <div className="bg-[#fdf4ff] border border-[#f5d0fe] rounded-xl p-4 flex flex-col gap-2 text-[13px] text-[#701a75]">
          <p className="font-medium text-[#4a044e]">Thông tin thanh toán MoMo:</p>
          <p>Số điện thoại: <span className="font-medium">0912 345 678</span></p>
          <p>Người nhận: <span className="font-medium">GREENLIFE COMPANY</span></p>
          <p>Nội dung: <span className="font-medium">Tên + SDT</span></p>
        </div>
      )}

      {methods.find(m => m.id === selectedId)?.methodName === "ZALOPAY" && (
        <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-4 flex flex-col gap-2 text-[13px] text-[#0369a1]">
          <p className="font-medium text-[#0c4a6e]">Thông tin thanh toán ZaloPay:</p>
          <p>Số điện thoại: <span className="font-medium">0912 345 678</span></p>
          <p>Người nhận: <span className="font-medium">GREENLIFE COMPANY</span></p>
          <p>Nội dung: <span className="font-medium">Tên + SDT</span></p>
        </div>
      )}

      <div className="border-t border-[#e2e3de] pt-4 flex justify-between items-center">
        <span className="text-[#6b7280] text-[13px]">Tổng thanh toán</span>
        <span className="font-['Nimbus_Sans:Bold',sans-serif] text-[#25521f] text-[20px]">{fmt(total)}</span>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} disabled={loading} className="flex-1 border border-[#c2c9bb] text-[#42493e] text-[13px] tracking-widest uppercase py-3 rounded-full hover:bg-[#fafaf5] transition-colors disabled:opacity-50">
          Quay lại
        </button>
        <button
          onClick={async () => {
            if (!selectedId) return;
            setLoading(true);
            const method = methods.find(m => m.id === selectedId);
            if (method) await onNext(method);
            setLoading(false);
          }}
          disabled={loading || !selectedId}
          className="flex-1 bg-gradient-to-r from-[#3d6b35] to-[#25521f] text-white text-[13px] tracking-widest uppercase py-3 rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Đặt hàng"}
        </button>
      </div>
    </div>
  );
}

// ─── Confirm Step ──────────────────────────────────────────────────────────────
function ConfirmStep({
  orderId,
  address,
  paymentMethod,
  total,
  co2,
  greenPts,
  onContinue,
}: {
  orderId: string;
  address: AddressForm;
  paymentMethod: PaymentMethodResponse | null;
  total: number;
  co2: number;
  greenPts: number;
  onContinue: () => void;
}) {
  const payLabel = paymentMethod ? (PAYMENT_META[paymentMethod.methodName]?.label || paymentMethod.methodName) : "";
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-[#f0f7ee] flex items-center justify-center shadow-md">
        <Check size={36} className="text-[#25521f]" strokeWidth={2.5} />
      </div>
      <div>
        <h2 className="font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19] text-[24px] mb-1">Đặt hàng thành công!</h2>
        <p className="text-[#6b7280] text-[14px]">Cảm ơn bạn đã mua hàng tại GreenLife 🌿</p>
      </div>

      <div className="w-full bg-white/80 border border-[#e2e3de] rounded-2xl p-5 flex flex-col gap-3 text-left">
        <div className="flex justify-between text-[13px]">
          <span className="text-[#6b7280]">Mã đơn hàng</span>
          <span className="font-medium text-[#1a1c19]">{orderId}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-[#6b7280]">Giao tới</span>
          <span className="text-[#1a1c19] text-right max-w-[200px]">{address.name} · {address.address}, {address.province}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-[#6b7280]">Thanh toán</span>
          <span className="text-[#1a1c19]">{payLabel}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-[#6b7280]">Tổng tiền</span>
          <span className="font-['Nimbus_Sans:Bold',sans-serif] text-[#25521f]">{fmt(total)}</span>
        </div>
        <div className="border-t border-[#e2e3de] pt-3">
          <div className="bg-[#f0f7ee] rounded-xl p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Leaf size={13} className="text-[#25521f]" />
              <span className="text-[#25521f] text-[12px] font-medium">Tác động xanh của đơn hàng</span>
            </div>
            <div className="flex justify-between text-[12px] text-[#42493e]">
              <span>Carbon footprint</span><span className="font-medium">{co2.toFixed(2)} kg CO₂</span>
            </div>
            <div className="flex justify-between text-[12px] text-[#42493e]">
              <span>Green Points tích lũy</span><span className="font-medium text-[#25521f]">+{greenPts} pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#f0f7ee] border border-[#c2c9bb] rounded-xl p-4 flex items-center gap-3">
        <Package size={18} className="text-[#25521f] shrink-0" />
        <div className="text-left">
          <p className="text-[#1a1c19] text-[13px] font-medium">Dự kiến giao hàng: 3–5 ngày làm việc</p>
          <p className="text-[#6b7280] text-[11px]">Bạn sẽ nhận được email xác nhận và cập nhật trạng thái.</p>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-[#3d6b35] to-[#25521f] text-white text-[13px] tracking-widest uppercase py-3.5 rounded-full shadow-md hover:shadow-lg transition-all"
      >
        Tiếp tục mua sắm
      </button>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const inputCls = "w-full border border-[#c2c9bb] rounded-xl px-4 py-3 text-[14px] text-[#1a1c19] placeholder-[#9ca3af] outline-none focus:border-[#25521f] transition-colors bg-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-[#6b7280] tracking-wide">{label}</label>
      {children}
    </div>
  );
}

// ─── Checkout Page ─────────────────────────────────────────────────────────────
export function CheckoutPage({
  items,
  onNavigate,
}: {
  items: CartItem[];
  onNavigate: (page: string) => void;
}) {
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<AddressForm | null>(null);
  const [payMethod, setPayMethod] = useState<PaymentMethodResponse | null>(null);
  const [methods, setMethods] = useState<PaymentMethodResponse[]>([]);
  const [orderId, setOrderId] = useState(() => "#GL-" + Math.floor(9000 + Math.random() * 9000));
  const { isAuthenticated } = useAuthStore();
  const { clearCart, appliedCoupon } = useCartStore();

  useEffect(() => {
    paymentApi.getActiveMethods().then(res => setMethods(res)).catch(console.error);
  }, []);

  const currentSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = appliedCoupon
    ? appliedCoupon.discountType === "PERCENTAGE"
      ? Math.min(Math.round(currentSubtotal * appliedCoupon.discountValue / 100), appliedCoupon.maxDiscountAmount || Infinity)
      : appliedCoupon.discountValue
    : 0;
  const shipping = currentSubtotal > 0 && currentSubtotal < 200000 ? 30000 : 0;
  const currentTotal = currentSubtotal > 0 ? currentSubtotal - discount + shipping : 0;
  const currentCo2 = items.reduce((s, i) => s + i.carbonIndex * i.quantity, 0);
  const currentGreenPts = items.reduce((s, i) => s + (i.greenPoints || 0) * i.quantity, 0);

  const summaryRef = useRef({ total: 0, co2: 0, greenPts: 0 });
  if (items.length > 0) {
    summaryRef.current = { total: currentTotal, co2: currentCo2, greenPts: currentGreenPts };
  }
  const { total, co2, greenPts } = summaryRef.current;

  // If not authenticated, we could force login
  if (!isAuthenticated) {
    return (
      <main className="flex-1 pb-20 md:pb-0 flex items-center justify-center">
        <div className="text-center py-20">
          <h2 className="text-[20px] font-['Nimbus_Sans:Bold',sans-serif] mb-4">Vui lòng đăng nhập</h2>
          <p className="text-[#6b7280] mb-6">Bạn cần đăng nhập để tiến hành đặt hàng.</p>
          <button
            onClick={() => onNavigate("signin")}
            className="bg-[#25521f] text-white px-8 py-3 rounded-full hover:bg-[#1e4219] transition-colors"
          >
            Đăng nhập ngay
          </button>
        </div>
      </main>
    );
  }

  const handlePlaceOrder = async (method: PaymentMethodResponse) => {
    setPayMethod(method);
    try {
      const res = await ordersApi.createOrder({
        paymentMethodId: method.id, 
        status: "PENDING",
        promotionId: appliedCoupon?.id
      });
      if (res && res.id) {
        setOrderId("#GL-" + res.id);
      }
      clearCart();
      setStep("confirm");
    } catch (e) {
      console.error("Failed to place order", e);
      // BUG FIX: Do NOT proceed to confirm step if placing order fails!
      toast.error("Thất bại", "Không thể đặt hàng, vui lòng thử lại.");
    }
  };

  return (
    <main className="flex-1 pb-20 md:pb-0">
      <div className="max-w-[680px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <StepBar current={step} />

        {step === "address" && (
          <AddressStep
            savedAddress={address}
            onSave={(form) => setAddress(form)}
            onNext={() => setStep("payment")}
          />
        )}

        {step === "payment" && (
          <PaymentStep
            total={total}
            methods={methods}
            onBack={() => setStep("address")}
            onNext={handlePlaceOrder}
          />
        )}

        {step === "confirm" && address && (
          <ConfirmStep
            orderId={orderId}
            address={address}
            paymentMethod={payMethod}
            total={total}
            co2={co2}
            greenPts={greenPts}
            onContinue={() => onNavigate("shop")}
          />
        )}
      </div>
    </main>
  );
}
