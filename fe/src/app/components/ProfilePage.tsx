import { useState, useRef } from "react";
import { MapPin, CreditCard, Bell, LogOut, Leaf, X, Camera, Eye, EyeOff, Star, MessageSquarePlus, ChevronRight } from "lucide-react";
import { toast } from "./Toast";
import { ProductCard } from "./ProductCard";
import { ALL_PRODUCTS } from "./ShopPage";
import type { Product } from "./ShopPage";

type OrderProduct = { name: string; reviewed: boolean };
type Order = {
  id: string;
  date: string;
  deliveredDate: string | null;
  price: string;
  pts: string;
  co2e: string;
  status: "DELIVERED" | "SHIPPING" | "PROCESSING" | "CANCELLED";
  products: OrderProduct[];
  reviewDeadlineDays: number | null; // null = expired
};

const orders: Order[] = [
  {
    id: "#GL-9402", date: "Jul 20, 2026", deliveredDate: "Jul 22, 2026",
    price: "2,000,000 VND", pts: "+120 pts", co2e: "CO2e 1.2kg",
    status: "DELIVERED", reviewDeadlineDays: 6,
    products: [
      { name: "Bamboo Toothbrush Set (Pack of 4)", reviewed: false },
      { name: "Insulated Steel Bottle (500ml)", reviewed: true },
    ],
  },
  {
    id: "#GL-9311", date: "Jul 10, 2026", deliveredDate: "Jul 13, 2026",
    price: "843,000 VND", pts: "+45 pts", co2e: "CO2e 0.4kg",
    status: "DELIVERED", reviewDeadlineDays: null,
    products: [
      { name: "Organic Cotton Tote Bag", reviewed: false },
    ],
  },
  {
    id: "#GL-9288", date: "Jul 28, 2026", deliveredDate: null,
    price: "3,744,000 VND", pts: "+210 pts", co2e: "CO2e 2.1kg",
    status: "SHIPPING", reviewDeadlineDays: null,
    products: [
      { name: "Natural Coconut Bowl Set", reviewed: false },
      { name: "Hemp Canvas Backpack", reviewed: false },
    ],
  },
];

const preferences = [
  { label: "SHIPPING ADDRESSES",    icon: MapPin,     danger: false },
  { label: "PAYMENT METHODS",       icon: CreditCard, danger: false },
  { label: "NOTIFICATION SETTINGS", icon: Bell,       danger: false },
  { label: "LOGOUT",                icon: LogOut,     danger: true  },
];

const AVATAR_GRADIENTS = [
  { from: "#8fbf8a", to: "#3d7035" },
  { from: "#7eb8d4", to: "#1e5a8a" },
  { from: "#d4a76a", to: "#8a5a1e" },
  { from: "#c47eb8", to: "#6a1e8a" },
  { from: "#d47e7e", to: "#8a1e1e" },
  { from: "#7ed4c4", to: "#1e8a7a" },
];

type ProfileData = {
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarIndex: number;
  avatarInitial: string;
};

// ─── Edit Profile Modal/Panel ──────────────────────────────────────────────
function EditProfilePanel({
  data,
  onSave,
  onCancel,
}: {
  data: ProfileData;
  onSave: (updated: ProfileData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...data });
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const passwordMismatch = !!confirmPassword && confirmPassword !== newPassword;
  const canSave = !!form.fullName && !passwordMismatch;

  const handleSave = () => {
    if (!canSave) return;
    onSave(form);
  };

  const grad = AVATAR_GRADIENTS[form.avatarIndex];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 md:flex md:items-center md:justify-center"
        onClick={onCancel}
      />

      {/* Panel — bottom sheet on mobile, centered modal on desktop */}
      <div className="fixed z-50 bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center pointer-events-none">
      <div className="bg-white rounded-t-2xl md:rounded-xl shadow-2xl w-full md:w-[480px] max-h-[90vh] overflow-y-auto pointer-events-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e3de] sticky top-0 bg-white z-10">
          <h3 className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[18px]">Edit Profile</h3>
          <button onClick={onCancel} className="text-[#6b7280] hover:text-[#1a1c19] transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-6">

          {/* Avatar selector */}
          <div className="flex flex-col gap-3">
            <span className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[13px] tracking-[1.2px] uppercase">
              Avatar
            </span>
            <div className="flex items-center gap-4">
              {/* Current avatar preview */}
              <div className="w-16 h-16 rounded-xl shrink-0 relative overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-white font-['Nimbus_Sans:Bold',sans-serif] text-2xl select-none">
                  {form.avatarInitial || form.username?.[0]?.toUpperCase() || "U"}
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Camera size={16} className="text-white" />
                </button>
              </div>
              {/* Color swatches */}
              <div className="flex gap-2 flex-wrap">
                {AVATAR_GRADIENTS.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setForm((f) => ({ ...f, avatarIndex: i }))}
                    className={`w-8 h-8 rounded-lg transition-all ${form.avatarIndex === i ? "ring-2 ring-[#25521f] ring-offset-1 scale-110" : "hover:scale-105"}`}
                    style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                  />
                ))}
              </div>
            </div>
            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
            {/* Initial letter input */}
            <div className="flex items-center gap-3">
              <span className="text-[#6b7280] text-[13px] shrink-0">Display initial:</span>
              <input
                maxLength={1}
                value={form.avatarInitial}
                onChange={(e) => setForm((f) => ({ ...f, avatarInitial: e.target.value.toUpperCase() }))}
                placeholder={form.username?.[0]?.toUpperCase() || "S"}
                className="w-12 border border-[#c2c9bb] text-center py-1.5 text-[16px] text-[#1a1c19] outline-none focus:border-[#25521f] transition-colors bg-white rounded-sm"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[13px] tracking-[1.2px] uppercase">
              Full Name
            </label>
            <input
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="Nguyễn Văn A"
              className="w-full border border-[#c2c9bb] px-4 py-3 text-[15px] text-[#1a1c19] placeholder-[#6b7280] outline-none focus:border-[#25521f] transition-colors bg-white"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[13px] tracking-[1.2px] uppercase">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
              placeholder="+84 xxx xxx xxx"
              className="w-full border border-[#c2c9bb] px-4 py-3 text-[15px] text-[#1a1c19] placeholder-[#6b7280] outline-none focus:border-[#25521f] transition-colors bg-white"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-[#e2e3de]" />

          {/* Change Password */}
          <div className="flex flex-col gap-4">
            <span className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[13px] tracking-[1.2px] uppercase">
              Change Password <span className="text-[#6b7280] normal-case tracking-normal font-normal">(optional)</span>
            </span>
            {/* New password */}
            <div className="flex flex-col gap-2">
              <label className="text-[#42493e] text-[13px]">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-[#c2c9bb] pl-4 pr-10 py-3 text-[15px] text-[#1a1c19] placeholder-[#6b7280] outline-none focus:border-[#25521f] transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#42493e] hover:text-[#25521f] transition-colors"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {/* Confirm password */}
            <div className="flex flex-col gap-2">
              <label className="text-[#42493e] text-[13px]">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full border pl-4 pr-10 py-3 text-[15px] placeholder-[#6b7280] outline-none transition-colors bg-white ${
                    passwordMismatch ? "border-[#ba1a1a] text-[#ba1a1a]" : "border-[#c2c9bb] text-[#1a1c19] focus:border-[#25521f]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#42493e] hover:text-[#25521f] transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordMismatch && (
                <p className="text-[#ba1a1a] text-[12px]">Passwords do not match</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pb-2">
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="w-full bg-[#25521f] text-white font-['Nimbus_Sans:Bold',sans-serif] text-[13px] tracking-widest uppercase py-3 rounded-sm hover:bg-[#1e4219] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              SAVE CHANGES
            </button>
            <button
              onClick={onCancel}
              className="w-full border border-[#c2c9bb] text-[#42493e] font-['Nimbus_Sans:Bold',sans-serif] text-[13px] tracking-widest uppercase py-3 rounded-sm hover:bg-[#fafaf5] transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

// ─── User Info Card ────────────────────────────────────────────────────────
function UserInfoCard() {
  const [profile, setProfile] = useState<ProfileData>({
    username: "shame",
    email: "shame@example.com",
    fullName: "",
    phoneNumber: "",
    avatarIndex: 0,
    avatarInitial: "S",
  });
  const [editing, setEditing] = useState(false);

  const grad = AVATAR_GRADIENTS[profile.avatarIndex];
  const initial = profile.avatarInitial || profile.username?.[0]?.toUpperCase() || "U";

  const handleSave = (updated: ProfileData) => {
    setProfile(updated);
    setEditing(false);
  };

  return (
    <>
      {/* ── Mobile layout: centered column ── */}
      <div className="flex flex-col gap-5 md:hidden">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 relative shadow-md">
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }} />
            <span className="absolute inset-0 flex items-center justify-center text-white font-['Nimbus_Sans:Bold',sans-serif] text-3xl select-none">{initial}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[20px] leading-tight">{profile.fullName || profile.username}</h2>
            {profile.fullName && <p className="text-[#6b7280] text-[13px]">@{profile.username}</p>}
            <span className="inline-flex items-center gap-1 bg-[#f1deb8] text-[#6f6143] text-[11px] px-2.5 py-0.5 rounded-full w-fit tracking-wide mt-0.5">
              <Leaf size={10} /> GREEN CHAMPION
            </span>
          </div>
        </div>
        <div className="bg-[#fafaf5] rounded-lg border border-[#e2e3de] divide-y divide-[#e2e3de]">
          <div className="flex items-center justify-between px-4 py-2.5 gap-3">
            <span className="text-[#6b7280] text-[11px] tracking-widest uppercase shrink-0">Email</span>
            <span className="text-[#1a1c19] text-[13px] text-right truncate">{profile.email}</span>
          </div>
          {profile.phoneNumber && (
            <div className="flex items-center justify-between px-4 py-2.5 gap-3">
              <span className="text-[#6b7280] text-[11px] tracking-widest uppercase shrink-0">Phone</span>
              <span className="text-[#1a1c19] text-[13px] text-right">{profile.phoneNumber}</span>
            </div>
          )}
        </div>
        <button onClick={() => setEditing(true)} className="w-full bg-[#25521f] text-white text-[13px] tracking-widest uppercase py-2.5 rounded-full hover:bg-[#1e4219] transition-colors">
          Edit Profile
        </button>
      </div>

      {/* ── Desktop layout: Figma design ── */}
      <div className="hidden md:flex items-center gap-6">
        {/* Avatar — circle */}
        <div className="w-[170px] h-[170px] rounded-full overflow-hidden shrink-0 relative shadow-lg">
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }} />
          <span className="absolute inset-0 flex items-center justify-center text-white font-['Nimbus_Sans:Bold',sans-serif] text-[80px] select-none">{initial}</span>
        </div>

        {/* Info block */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {/* Name + badge */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[26px] leading-tight">
                {profile.fullName || profile.username}
              </h2>
              <span className="inline-flex items-center gap-1 bg-[#f1deb8] text-[#6f6143] text-[11px] px-2.5 py-0.5 rounded-full tracking-[0.275px]">
                <Leaf size={10} /> GREEN CHAMPION
              </span>
            </div>
            <p className="text-[#6b7280] text-[14px]">@{profile.username}</p>
          </div>

          {/* Stats row */}
          <div className="flex items-start">
            <div className="flex flex-col gap-0.5 pr-6 border-r border-[#e2e3de]">
              <span className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[20px] leading-tight">1,250</span>
              <span className="text-[#6b7280] text-[12px]">Green Points</span>
            </div>
            <div className="flex flex-col gap-0.5 px-6 border-r border-[#e2e3de]">
              <span className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[20px] leading-tight">32.4kg</span>
              <span className="text-[#6b7280] text-[12px]">CO2e Saved</span>
            </div>
            <div className="flex flex-col gap-0.5 pl-6">
              <span className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[20px] leading-tight">3</span>
              <span className="text-[#6b7280] text-[12px]">Orders</span>
            </div>
          </div>

          {/* Contact + Edit button row */}
          <div className="flex items-center gap-0 flex-wrap">
            <span className="text-[#6b7280] text-[13px]">{profile.email}</span>
            {profile.phoneNumber && (
              <>
                <span className="text-[#e2e3de] px-2.5">·</span>
                <span className="text-[#6b7280] text-[13px]">{profile.phoneNumber}</span>
              </>
            )}
            <div className="pl-5">
              <button
                onClick={() => setEditing(true)}
                className="bg-transparent border border-[#c2c9bb] text-[#42493e] text-[13px] tracking-[1.3px] uppercase px-6 py-[5px] rounded-full hover:border-[#25521f] hover:text-[#25521f] transition-colors whitespace-nowrap"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <EditProfilePanel
          data={profile}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}
    </>
  );
}

// ─── Green Impact Metrics ──────────────────────────────────────────────────
function GreenImpactMetrics() {
  const current = 1250;
  const target = 3000;
  const progress = Math.round((current / target) * 100);

  const stats = [
    { label: "Green Points",    value: "1,250",    unit: "pts",      color: "#25521f" },
    { label: "CO₂ tiết kiệm",  value: "32.4",     unit: "kg CO₂e",  color: "#3d6b35" },
    { label: "Đơn hàng xanh",  value: "3",        unit: "đơn",      color: "#6b5d3f" },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #e8f5e4 0%, #f0f9ec 50%, #e3f0df 100%)",
        border: "1px solid #cce0c6",
      }}
    >
      <div className="p-5 md:p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[#42493e] text-[11px] tracking-[1.4px] uppercase mb-1">Hành trình Eco của bạn</p>
            <h3
              className="text-[#1a1c19] text-[18px]"
              style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}
            >
              Green Impact Metrics
            </h3>
          </div>
          <span className="text-2xl select-none">🌱</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-3 md:p-4 flex flex-col gap-1"
              style={{ border: "1px solid rgba(255,255,255,0.8)" }}
            >
              <p className="text-[#6b7280] text-[10px] tracking-[1.2px] uppercase">{s.label}</p>
              <p
                className="leading-tight"
                style={{ fontFamily: "'Liberation Mono', monospace", fontWeight: 700, fontSize: "20px", color: s.color }}
              >
                {s.value}
              </p>
              <p className="text-[#6b7280] text-[11px]">{s.unit}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#42493e]">Tiến độ đến <span className="text-[#25521f] font-medium">Eco Guard</span></span>
            <span className="text-[#6b7280]">{progress}% — còn {(target - current).toLocaleString()} pts</span>
          </div>
          <div className="h-2.5 bg-[#c8dfc4]/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3d6b35] to-[#6db85f] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Status badge helper ────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Order["status"] }) {
  const map: Record<Order["status"], { label: string; cls: string }> = {
    DELIVERED:  { label: "Đã giao",      cls: "bg-[#d4eddb] text-[#1e5e2e]" },
    SHIPPING:   { label: "Đang giao",    cls: "bg-[#ddeeff] text-[#1a4f8a]" },
    PROCESSING: { label: "Đang xử lý",  cls: "bg-[#fff3cd] text-[#856404]" },
    CANCELLED:  { label: "Đã hủy",      cls: "bg-[#fde8e8] text-[#ba1a1a]" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full tracking-wide uppercase font-medium ${cls}`}>
      {label}
    </span>
  );
}

// ─── Review Modal ───────────────────────────────────────────────────────────
function ReviewModal({
  productName,
  orderId,
  onClose,
}: {
  productName: string;
  orderId: string;
  onClose: (submitted: boolean) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = rating > 0 && text.trim().length >= 10;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Cảm ơn bạn!", "Đánh giá đã được ghi nhận và đang chờ duyệt.");
      onClose(true);
    }, 800);
  };

  const LABELS = ["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={() => onClose(false)} />
      <div className="fixed z-50 bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center pointer-events-none">
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:w-[480px] max-h-[90vh] overflow-y-auto pointer-events-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e3de] sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              <MessageSquarePlus size={18} className="text-[#25521f]" />
              <h3 className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[17px]">Đánh giá sản phẩm</h3>
            </div>
            <button onClick={() => onClose(false)} className="text-[#6b7280] hover:text-[#1a1c19] p-1 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Product info */}
            <div className="bg-[#f7faf5] rounded-xl px-4 py-3 flex flex-col gap-0.5">
              <p className="text-[#6b7280] text-[11px] tracking-widest uppercase">Sản phẩm</p>
              <p className="text-[#1a1c19] text-[14px] font-['Nimbus_Sans:Bold',sans-serif]">{productName}</p>
              <p className="text-[#6b7280] text-[12px]">Đơn hàng {orderId}</p>
            </div>

            {/* Star rating */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[13px] tracking-[1.2px] uppercase">
                Xếp hạng tổng thể
              </label>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      size={28}
                      fill={(hover || rating) >= s ? "#6B5D3F" : "none"}
                      className="text-[#6b5d3f] transition-all"
                    />
                  </button>
                ))}
                {(hover || rating) > 0 && (
                  <span className="text-[#6b5d3f] text-[13px] ml-1">{LABELS[hover || rating]}</span>
                )}
              </div>
            </div>

            {/* Review text */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[13px] tracking-[1.2px] uppercase">
                Nhận xét chi tiết
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Chia sẻ trải nghiệm thực tế của bạn — chất lượng, độ bền, tác động môi trường..."
                rows={4}
                className="border border-[#c2c9bb] rounded-xl px-4 py-3 text-[14px] text-[#1a1c19] placeholder-[#9ca3af] outline-none focus:border-[#25521f] resize-none bg-white transition-colors"
              />
              <p className="text-[#9ca3af] text-[11px] text-right">{text.length} ký tự {text.length < 10 && text.length > 0 && "· Tối thiểu 10 ký tự"}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pb-2">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="w-full bg-gradient-to-r from-[#3d6b35] to-[#25521f] text-white font-['Nimbus_Sans:Bold',sans-serif] text-[13px] tracking-widest uppercase py-3.5 rounded-full disabled:opacity-40 hover:shadow-md transition-all"
              >
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
              <button
                onClick={() => onClose(false)}
                className="w-full border border-[#c2c9bb] text-[#42493e] text-[13px] tracking-widest uppercase py-3 rounded-full hover:bg-[#fafaf5] transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Order History ─────────────────────────────────────────────────────────
function OrderHistory() {
  const [orderData, setOrderData] = useState(orders);
  const [reviewTarget, setReviewTarget] = useState<{ orderId: string; productName: string } | null>(null);

  const handleReviewClose = (submitted: boolean, orderId: string, productName: string) => {
    if (submitted) {
      setOrderData((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, products: o.products.map((p) => p.name === productName ? { ...p, reviewed: true } : p) }
            : o
        )
      );
    }
    setReviewTarget(null);
  };

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[22px] md:text-[28px]">
        Lịch sử mua hàng
      </h2>

      <div className="flex flex-col gap-4">
        {orderData.map((order) => (
          <div key={order.id} className="border border-[#e2e3de] rounded-xl overflow-hidden">
            {/* Order header */}
            <div className="bg-[#fafaf5] px-4 py-3 flex items-center justify-between gap-3 flex-wrap border-b border-[#e2e3de]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#1a1c19] text-[14px] font-['Nimbus_Sans:Bold',sans-serif]">{order.id}</span>
                <StatusBadge status={order.status} />
                <span className="bg-[#f0f0eb] text-[#6b7280] text-[11px] px-2 py-0.5 rounded-full">{order.co2e}</span>
              </div>
              <div className="flex flex-col items-end gap-0">
                <span className="text-[#1a1c19] text-[14px] font-['Nimbus_Sans:Bold',sans-serif]">{order.price}</span>
                <span className="text-[#25521f] text-[11px]">{order.pts}</span>
              </div>
            </div>

            {/* Order body: products + review buttons */}
            <div className="px-4 py-3 flex flex-col gap-2">
              <p className="text-[#6b7280] text-[11px]">
                Đặt ngày {order.date}
                {order.deliveredDate && ` · Nhận hàng ${order.deliveredDate}`}
              </p>
              {order.products.map((p) => {
                const canReview = order.status === "DELIVERED" && !p.reviewed && order.reviewDeadlineDays !== null;
                const expired = order.status === "DELIVERED" && !p.reviewed && order.reviewDeadlineDays === null;
                return (
                  <div key={p.name} className="flex items-center justify-between gap-3 py-2 border-t border-[#f0f0eb] first:border-t-0">
                    <p className="text-[#42493e] text-[13px] flex-1">{p.name}</p>
                    {p.reviewed && (
                      <span className="flex items-center gap-1 text-[#25521f] text-[11px] shrink-0">
                        <Star size={11} fill="#25521f" className="text-[#25521f]" /> Đã đánh giá
                      </span>
                    )}
                    {canReview && (
                      <button
                        onClick={() => setReviewTarget({ orderId: order.id, productName: p.name })}
                        className="flex items-center gap-1.5 text-[#25521f] text-[12px] border border-[#25521f] px-3 py-1.5 rounded-full hover:bg-[#f0f7ee] transition-colors shrink-0"
                      >
                        <Star size={12} strokeWidth={1.8} /> Đánh giá
                        {order.reviewDeadlineDays && (
                          <span className="text-[10px] text-[#6b7280]">· còn {order.reviewDeadlineDays} ngày</span>
                        )}
                      </button>
                    )}
                    {expired && (
                      <span className="text-[#9ca3af] text-[11px] shrink-0">Hết hạn đánh giá</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button className="flex items-center justify-center gap-1 text-[#25521f] text-[13px] tracking-widest uppercase self-center hover:underline transition-all py-2">
        XEM TẤT CẢ ĐƠN HÀNG
        <span className="text-base leading-none">→</span>
      </button>

      {reviewTarget && (
        <ReviewModal
          productName={reviewTarget.productName}
          orderId={reviewTarget.orderId}
          onClose={(submitted) => handleReviewClose(submitted, reviewTarget.orderId, reviewTarget.productName)}
        />
      )}
    </section>
  );
}

// ─── Wishlist Section ──────────────────────────────────────────────────────
function WishlistSection({
  wishlistIds,
  onWishlist,
  onAddToCart,
  onNavigate,
}: {
  wishlistIds: number[];
  onWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onNavigate: (p: string) => void;
}) {
  const items = ALL_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[#6b7280] text-[11px] tracking-[1.4px] uppercase mb-1">Đã lưu</p>
          <h2
            className="text-[#1a1c19] text-[22px] md:text-[28px]"
            style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}
          >
            Danh sách yêu thích
          </h2>
        </div>
        {items.length > 0 && (
          <span className="text-[#6b7280] text-[13px]">{items.length} sản phẩm</span>
        )}
      </div>

      {items.length === 0 ? (
        <div
          className="rounded-2xl p-10 flex flex-col items-center gap-4 text-center"
          style={{ background: "rgba(255,255,255,0.75)", border: "1px solid #dde8d8", backdropFilter: "blur(8px)" }}
        >
          <span className="text-4xl select-none">🌿</span>
          <p className="text-[#42493e] text-[15px]">Chưa có sản phẩm nào được lưu</p>
          <button
            onClick={() => onNavigate("shop")}
            className="text-[#25521f] text-[13px] border-b border-[#25521f] hover:opacity-70 transition-opacity"
          >
            Khám phá cửa hàng →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wishlisted
              onWishlist={onWishlist}
              onAddToCart={onAddToCart}
              onNavigate={() => onNavigate("product")}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Account Preferences ───────────────────────────────────────────────────
function AccountPreferences({ onNavigate }: { onNavigate: (p: string) => void }) {
  const rows = [
    { label: "Địa chỉ giao hàng",    sublabel: "Quản lý địa chỉ đã lưu",      icon: MapPin,     danger: false },
    { label: "Phương thức thanh toán", sublabel: "Thẻ và ví điện tử",           icon: CreditCard, danger: false },
    { label: "Cài đặt thông báo",     sublabel: "Email, push và tin nhắn",      icon: Bell,       danger: false },
    { label: "Đăng xuất",             sublabel: "Thoát khỏi tài khoản này",     icon: LogOut,     danger: true  },
  ];

  return (
    <section className="flex flex-col gap-5">
      <div>
        <p className="text-[#6b7280] text-[11px] tracking-[1.4px] uppercase mb-1">Tài khoản</p>
        <h2
          className="text-[#1a1c19] text-[22px] md:text-[28px]"
          style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}
        >
          Cài đặt
        </h2>
      </div>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.75)", border: "1px solid #dde8d8", backdropFilter: "blur(8px)" }}
      >
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <button
              key={row.label}
              onClick={() => { if (row.danger) onNavigate("signin"); }}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-[#f5f9f3] active:bg-[#eef6eb] transition-colors text-left ${
                i < rows.length - 1 ? "border-b border-[#e8f0e4]" : ""
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  row.danger ? "bg-[#fff0f0]" : "bg-[#f0f7ee]"
                }`}
              >
                <Icon size={16} color={row.danger ? "#ba1a1a" : "#3d6b35"} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px]"
                  style={{ color: row.danger ? "#ba1a1a" : "#1a1c19", fontWeight: 500 }}
                >
                  {row.label}
                </p>
                <p className="text-[12px] text-[#6b7280]">{row.sublabel}</p>
              </div>
              {!row.danger && <ChevronRight size={16} color="#9ca3af" />}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ─── Profile Page ──────────────────────────────────────────────────────────
export function ProfilePage({
  onNavigate,
  wishlistIds = [],
  onWishlist,
  onAddToCart,
}: {
  onNavigate: (p: string) => void;
  wishlistIds?: number[];
  onWishlist?: (p: Product) => void;
  onAddToCart?: (p: Product) => void;
}) {
  return (
    <main className="flex-1 pb-20 md:pb-0">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-8 md:py-12 flex flex-col gap-10 md:gap-12">

        <UserInfoCard />
        <GreenImpactMetrics />

        <div className="border-t border-[#dde8d8]" />

        <OrderHistory />

        <div className="border-t border-[#dde8d8]" />

        <WishlistSection
          wishlistIds={wishlistIds}
          onWishlist={onWishlist ?? (() => {})}
          onAddToCart={onAddToCart ?? (() => {})}
          onNavigate={onNavigate}
        />

        <div className="border-t border-[#dde8d8]" />

        <AccountPreferences onNavigate={onNavigate} />
      </div>
    </main>
  );
}
