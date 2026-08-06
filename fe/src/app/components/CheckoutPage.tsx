import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, MapPin, CreditCard, Banknote, Smartphone, ArrowRight, Package, Leaf } from "lucide-react";
import { CartItem, useCartStore } from "../../store/cartStore";
import { OrderBE, ordersApi } from "../../api/orders";
import { paymentApi, PaymentMethodResponse } from "../../api/payment";
import { addressesApi, AddressBE } from "../../api/addresses";
import { AddressModal } from "./AddressModal";
import { useAuthStore } from "../../store/authStore";
import { toast } from "./Toast";

type Step = "address" | "payment" | "confirm";

function fmt(n: number) { return n.toLocaleString("vi-VN") + " VND"; }

const PROVINCES = [
  "Ho Chi Minh City", "Ha Noi", "Da Nang", "Can Tho", "Hai Phong",
  "An Giang", "Binh Duong", "Binh Dinh", "Binh Thuan", "Bac Lieu",
  "Bac Giang", "Bac Kan", "Bac Ninh", "Ben Tre", "Cao Bang",
  "Dak Lak", "Dak Nong", "Dien Bien", "Dong Nai", "Dong Thap",
  "Gia Lai", "Ha Giang", "Ha Nam", "Ha Tinh", "Hai Duong",
  "Hau Giang", "Hoa Binh", "Hung Yen", "Khanh Hoa", "Kien Giang",
  "Kon Tum", "Lai Chau", "Lam Dong", "Lang Son", "Lao Cai",
  "Long An", "Nam Dinh", "Nghe An", "Ninh Binh", "Ninh Thuan",
  "Phu Tho", "Phu Yen", "Quang Binh", "Quang Nam", "Quang Ngai",
  "Quang Ninh", "Quang Tri", "Soc Trang", "Son La", "Tay Ninh",
  "Thai Binh", "Thai Nguyen", "Thanh Hoa", "Thua Thien Hue", "Tien Giang",
  "Tra Vinh", "Tuyen Quang", "Vinh Long", "Vinh Phuc", "Yen Bai", "Ba Ria - Vung Tau"
];

function extractProvince(fullAddr: string): string {
  if (!fullAddr) return "Ho Chi Minh City";
  const lower = fullAddr.toLowerCase();

  for (const p of PROVINCES) {
    if (lower.includes(p.toLowerCase())) {
      return p;
    }
  }

  if (lower.includes("hồ chí minh") || lower.includes("hcm") || lower.includes("sài gòn") || lower.includes("saigon")) return "Ho Chi Minh City";
  if (lower.includes("hà nội") || lower.includes("hanoi") || lower.includes("hn")) return "Ha Noi";
  if (lower.includes("đà nẵng") || lower.includes("danang")) return "Da Nang";
  if (lower.includes("cần thơ") || lower.includes("cantho")) return "Can Tho";
  if (lower.includes("hải phòng") || lower.includes("haiphong")) return "Hai Phong";
  if (lower.includes("bình dương")) return "Binh Duong";
  if (lower.includes("đồng nai")) return "Dong Nai";
  if (lower.includes("khánh hòa") || lower.includes("nha trang")) return "Khanh Hoa";
  if (lower.includes("huế") || lower.includes("thừa thiên")) return "Thua Thien Hue";
  if (lower.includes("quảng nam") || lower.includes("hội an")) return "Quang Nam";
  if (lower.includes("bà rịa") || lower.includes("vũng tàu")) return "Ba Ria - Vung Tau";
  if (lower.includes("lâm đồng") || lower.includes("đà lạt") || lower.includes("dalat")) return "Lam Dong";

  const parts = fullAddr.split(",").map(s => s.trim()).filter(Boolean);
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    const matchLast = PROVINCES.find(p => p.toLowerCase() === lastPart.toLowerCase());
    if (matchLast) return matchLast;
    if (lastPart.length > 2) return lastPart;
  }

  return "Ho Chi Minh City";
}

// ─── Step Indicator ────────────────────────────────────────────────────────────
function StepBar({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "address", label: "Address" },
    { key: "payment", label: "Payment" },
    { key: "confirm", label: "Confirmation" },
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
  const [modalOpen, setModalOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<AddressBE[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<number | undefined>();

  useEffect(() => {
    addressesApi.getUserAddresses().then(list => {
      setSavedAddresses(list);
      if (!savedAddress && list.length > 0) {
        const def = list.find(a => a.isDefault) || list[0];
        applyAddress(def);
      }
    }).catch(console.error);
  }, []);

  const applyAddress = (addr: AddressBE) => {
    setSelectedAddrId(addr.id);
    const matchedProvince = extractProvince(addr.fullAddress);
    setForm({
      name: addr.recipientName,
      phone: addr.phoneNumber,
      province: matchedProvince,
      address: addr.fullAddress,
      note: form.note || ""
    });
  };

  const set = (key: keyof AddressForm, v: string) => setForm((f) => ({ ...f, [key]: v }));
  const valid = form.name && form.phone && form.province && form.address;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-[#25521f]" />
          <h2 className="font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19] text-[20px]">Shipping Address</h2>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="text-[#25521f] text-[13px] border border-[#25521f] px-3.5 py-1.5 rounded-full hover:bg-[#f0f7ee] transition-colors"
        >
          {savedAddresses.length > 0 ? "Address Book" : "+ Add New Address"}
        </button>
      </div>

      {savedAddresses.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-[12px] text-[#6b7280] tracking-wide">Select from saved addresses:</label>
          <div className="grid grid-cols-1 gap-2">
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => applyAddress(addr)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                  selectedAddrId === addr.id ? "border-[#25521f] bg-[#f0f7ee]" : "border-[#c2c9bb] bg-white hover:border-[#6b7280]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#1a1c19]">
                    <span>{addr.recipientName}</span>
                    <span className="text-[#6b7280]">({addr.phoneNumber})</span>
                    {addr.isDefault && (
                      <span className="bg-[#25521f] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#42493e] mt-0.5 line-clamp-1">{addr.fullAddress}</p>
                </div>
                {selectedAddrId === addr.id && <Check size={16} className="text-[#25521f] shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        </div>
      )}

      <Field label="Full Name *">
        <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="John Doe" className={inputCls} />
      </Field>

      <Field label="Phone Number *">
        <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 (555) 000-0000" className={inputCls} />
      </Field>

      <Field label="City / Province *">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProvince((v) => !v)}
            className={`${inputCls} flex items-center justify-between text-left`}
          >
            <span className={form.province ? "text-[#1a1c19]" : "text-[#9ca3af]"}>{form.province || "Select city / province"}</span>
            <ChevronDown size={15} className="text-[#6b7280] shrink-0" />
          </button>
          {showProvince && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#c2c9bb] rounded-xl shadow-lg z-20 max-h-[200px] overflow-y-auto py-1">
              {Array.from(new Set([...PROVINCES, ...(form.province ? [form.province] : [])])).map((p) => (
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

      <Field label="Street Address *">
        <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="House number, street name, district/ward" className={inputCls} />
      </Field>

      <Field label="Delivery Notes (optional)">
        <textarea
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
          placeholder="Special delivery instructions..."
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </Field>

      <button
        disabled={!valid}
        onClick={() => { onSave(form); onNext(); }}
        className="w-full bg-gradient-to-r from-[#3d6b35] to-[#25521f] text-white text-[13px] tracking-widest uppercase py-3.5 rounded-full shadow-md disabled:opacity-40 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
      >
        Continue <ArrowRight size={14} />
      </button>

      <AddressModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          addressesApi.getUserAddresses().then((list) => {
            setSavedAddresses(list);
            if (list.length > 0) {
              const currentStillExists = list.find((a) => a.id === selectedAddrId);
              if (!currentStillExists) {
                const def = list.find((a) => a.isDefault) || list[0];
                applyAddress(def);
              }
            }
          }).catch(console.error);
        }}
        selectedAddressId={selectedAddrId}
        onSelectAddress={(addr) => {
          applyAddress(addr);
          setModalOpen(false);
        }}
      />
    </div>
  );
}

// ─── Payment Step ──────────────────────────────────────────────────────────────
type AddressForm = { name: string; phone: string; province: string; address: string; note: string };

const PAYMENT_META: Record<string, { label: string; desc: string; Icon: React.ElementType; color: string }> = {
  COD: { label: "Cash on Delivery", desc: "Pay in cash when delivered by courier", Icon: Banknote, color: "#42493e" },
  BANK_TRANSFER: { label: "Bank Transfer", desc: "Transfer via QR code / bank account", Icon: CreditCard, color: "#1d4ed8" },
  MOMO: { label: "MoMo E-Wallet", desc: "Scan MoMo QR code to pay", Icon: Smartphone, color: "#a21caf" },
  ZALOPAY: { label: "ZaloPay", desc: "Pay via ZaloPay application", Icon: Smartphone, color: "#0284c7" },
};

function PaymentStep({ onNext, onBack, total, methods }: { onNext: (method: PaymentMethodResponse) => void; onBack: () => void; total: number; methods: PaymentMethodResponse[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(methods.length > 0 ? methods[0].id : null);

  const [loading, setLoading] = useState(false);
  
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard size={18} className="text-[#25521f]" />
        <h2 className="font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19] text-[20px]">Payment Method</h2>
      </div>

      <div className="flex flex-col gap-3">
        {methods.map((method) => {
          const meta = PAYMENT_META[method.methodName] || { label: method.methodName, desc: "Payment Method", Icon: CreditCard, color: "#42493e" };
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
          <p className="font-medium text-[#1a1c19]">Bank Transfer Information:</p>
          <p>Bank: <span className="font-medium">Vietcombank</span></p>
          <p>Account No: <span className="font-medium">1234567890</span></p>
          <p>Account Name: <span className="font-medium">GREENLIFE COMPANY</span></p>
          <p>Reference: <span className="font-medium">Name + Phone</span></p>
        </div>
      )}

      {methods.find(m => m.id === selectedId)?.methodName === "MOMO" && (
        <div className="bg-[#fdf4ff] border border-[#f5d0fe] rounded-xl p-4 flex flex-col gap-2 text-[13px] text-[#701a75]">
          <p className="font-medium text-[#4a044e]">MoMo Payment Details:</p>
          <p>Phone Number: <span className="font-medium">+1 (555) 000-0000</span></p>
          <p>Recipient: <span className="font-medium">GREENLIFE COMPANY</span></p>
          <p>Reference: <span className="font-medium">Name + Phone</span></p>
        </div>
      )}

      {methods.find(m => m.id === selectedId)?.methodName === "ZALOPAY" && (
        <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-4 flex flex-col gap-2 text-[13px] text-[#0369a1]">
          <p className="font-medium text-[#0c4a6e]">ZaloPay Payment Details:</p>
          <p>Phone Number: <span className="font-medium">+1 (555) 000-0000</span></p>
          <p>Recipient: <span className="font-medium">GREENLIFE COMPANY</span></p>
          <p>Reference: <span className="font-medium">Name + Phone</span></p>
        </div>
      )}

      <div className="border-t border-[#e2e3de] pt-4 flex justify-between items-center">
        <span className="text-[#6b7280] text-[13px]">Total Payment</span>
        <span className="font-['Nimbus_Sans:Bold',sans-serif] text-[#25521f] text-[20px]">{fmt(total)}</span>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} disabled={loading} className="flex-1 border border-[#c2c9bb] text-[#42493e] text-[13px] tracking-widest uppercase py-3 rounded-full hover:bg-[#fafaf5] transition-colors disabled:opacity-50">
          Back
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
          {loading ? "Processing..." : "Place Order"}
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
        <h2 className="font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19] text-[24px] mb-1">Order Placed Successfully!</h2>
        <p className="text-[#6b7280] text-[14px]">Thank you for shopping at GreenLife 🌿</p>
      </div>

      <div className="w-full bg-white/80 border border-[#e2e3de] rounded-2xl p-5 flex flex-col gap-3 text-left">
        <div className="flex justify-between text-[13px]">
          <span className="text-[#6b7280]">Order ID</span>
          <span className="font-medium text-[#1a1c19]">{orderId}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-[#6b7280]">Deliver to</span>
          <span className="text-[#1a1c19] text-right max-w-[200px]">{address.name} · {address.address}, {address.province}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-[#6b7280]">Payment Method</span>
          <span className="text-[#1a1c19]">{payLabel}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-[#6b7280]">Total Amount</span>
          <span className="font-['Nimbus_Sans:Bold',sans-serif] text-[#25521f]">{fmt(total)}</span>
        </div>
        <div className="border-t border-[#e2e3de] pt-3">
          <div className="bg-[#f0f7ee] rounded-xl p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Leaf size={13} className="text-[#25521f]" />
              <span className="text-[#25521f] text-[12px] font-medium">Green Impact of this Order</span>
            </div>
            <div className="flex justify-between text-[12px] text-[#42493e]">
              <span>Carbon footprint</span><span className="font-medium">{co2.toFixed(2)} kg CO₂</span>
            </div>
            <div className="flex justify-between text-[12px] text-[#42493e]">
              <span>Green Points earned</span><span className="font-medium text-[#25521f]">+{greenPts} pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#f0f7ee] border border-[#c2c9bb] rounded-xl p-4 flex items-center gap-3">
        <Package size={18} className="text-[#25521f] shrink-0" />
        <div className="text-left">
          <p className="text-[#1a1c19] text-[13px] font-medium">Estimated delivery: 3–5 business days</p>
          <p className="text-[#6b7280] text-[11px]">You will receive a confirmation email and status updates.</p>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-[#3d6b35] to-[#25521f] text-white text-[13px] tracking-widest uppercase py-3.5 rounded-full shadow-md hover:shadow-lg transition-all"
      >
        Continue Shopping
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
  const { clearCart, appliedCoupon, setAppliedCoupon } = useCartStore();

  const [userOrders, setUserOrders] = useState<OrderBE[]>([]);

  useEffect(() => {
    paymentApi.getActiveMethods().then(res => setMethods(res)).catch(console.error);
    if (isAuthenticated) {
      ordersApi.getOrders().then(list => {
        setUserOrders(list);
        if (appliedCoupon) {
          const alreadyUsed = list.some(o => o.promotionId != null && Number(o.promotionId) === Number(appliedCoupon.id) && o.status !== 'CANCELLED');
          if (alreadyUsed) {
            toast.info("Notice", `Coupon code ${appliedCoupon.code} was previously used on your account and has been removed.`);
            setAppliedCoupon(null);
          }
        }
      }).catch(console.error);
    }
  }, [isAuthenticated, appliedCoupon?.id]);

  const currentSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const isPromotionValid = (coupon: typeof appliedCoupon, subtotal: number): boolean => {
    if (!coupon) return false;
    if (coupon.isActive === false) return false;
    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) return false;
    if (coupon.endDate && new Date(coupon.endDate) < now) return false;
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) return false;
    if (coupon.usageLimit != null && coupon.usedCount != null && coupon.usedCount >= coupon.usageLimit) return false;
    if (!coupon.discountValue || coupon.discountValue <= 0) return false;
    const alreadyUsed = userOrders.some(o => o.promotionId != null && Number(o.promotionId) === Number(coupon.id) && o.status !== 'CANCELLED');
    if (alreadyUsed) return false;
    return true;
  };

  const validCoupon = isPromotionValid(appliedCoupon, currentSubtotal) ? appliedCoupon : null;

  const discount = validCoupon
    ? validCoupon.discountType === "PERCENTAGE"
      ? Math.min(Math.round(currentSubtotal * validCoupon.discountValue / 100), validCoupon.maxDiscountAmount || Infinity)
      : validCoupon.discountValue
    : 0;
  const shipping = currentSubtotal > 0 && currentSubtotal < 200000 ? 30000 : 0;
  const currentTotal = currentSubtotal > 0 ? Math.max(0, currentSubtotal - discount + shipping) : 0;
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
          <h2 className="text-[20px] font-[#Nimbus_Sans:Bold',sans-serif] mb-4">Please Sign In</h2>
          <p className="text-[#6b7280] mb-6">You need to sign in to place an order.</p>
          <button
            onClick={() => onNavigate("signin")}
            className="bg-[#25521f] text-white px-8 py-3 rounded-full hover:bg-[#1e4219] transition-colors"
          >
            Sign In Now
          </button>
        </div>
      </main>
    );
  }

  const handlePlaceOrder = async (method: PaymentMethodResponse) => {
    setPayMethod(method);

    // If a coupon is applied, verify against order history to prevent placing order with used promo
    if (appliedCoupon) {
      try {
        const userOrders = await ordersApi.getOrders();
        const alreadyUsed = userOrders.some(o => o.promotionId != null && Number(o.promotionId) === Number(appliedCoupon.id) && o.status !== 'CANCELLED');
        if (alreadyUsed) {
          setAppliedCoupon(null);
          toast.error("Cannot Place Order", `Coupon code ${appliedCoupon.code} has already been used on your account.`);
          return; // Strictly stop checkout!
        }
      } catch (err) {
        console.error("Failed to verify promotion usage", err);
      }
    }

    const promoId = validCoupon?.id;
    try {
      const res = await ordersApi.createOrder({
        paymentMethodId: method.id, 
        status: "PENDING",
        promotionId: promoId
      });
      if (res && res.id) {
        setOrderId("#GL-" + res.id);
        if (address) {
          try {
            const savedOrderAddresses = JSON.parse(localStorage.getItem('orderAddresses') || '{}');
            savedOrderAddresses[res.id] = {
              name: address.name,
              phone: address.phone,
              address: `${address.address}, ${address.province}`
            };
            localStorage.setItem('orderAddresses', JSON.stringify(savedOrderAddresses));
          } catch (err) {
            console.error("Failed to save order address locally", err);
          }
        }
      }
      clearCart();
      setStep("confirm");
    } catch (e: any) {
      console.error("Failed to place order", e);
      const errDetail = e.response?.data?.detail || e.response?.data?.message || "";
      if (errDetail.toLowerCase().includes("promotion") || errDetail.toLowerCase().includes("mã giảm giá")) {
        setAppliedCoupon(null);
      }
      toast.error("Order Failed", errDetail || "Failed to place order. Please try again.");
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
