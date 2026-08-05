import { useState, useRef, useEffect } from "react";
import { MapPin, CreditCard, Bell, LogOut, Leaf, X, Camera, Eye, EyeOff, Star, MessageSquarePlus, ChevronRight, Sprout, TrendingDown, Award, Trophy } from "lucide-react";
import { toast } from "./Toast";
import { ProductCard } from "./ProductCard";
import { ALL_PRODUCTS } from "./ShopPage";
import type { Product } from "./ShopPage";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { profileApi, UserProfileResponse } from "../../api/profile";
import { ordersApi, OrderResponse } from "../../api/orders";
import imageCompression from 'browser-image-compression';
import { getTier, ECO_TIERS } from "./ImpactPage";

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
  avatarUrl: string;
};

// ─── Edit Profile Modal/Panel ──────────────────────────────────────────────
function EditProfilePanel({
  data,
  isLocalProvider,
  onSave,
  onCancel,
}: {
  data: ProfileData;
  isLocalProvider: boolean;
  onSave: (updated: ProfileData, pw?: { old: string, new: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...data });
  const [oldPassword, setOldPassword]         = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld]                 = useState(false);
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const passwordMismatch = !!confirmPassword && confirmPassword !== newPassword;
  const canSave = !!form.fullName && !passwordMismatch && !uploadingAvatar;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Lỗi", "Kích thước ảnh không được vượt quá 5MB.");
      return;
    }

    try {
      setUploadingAvatar(true);
      
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.8
      };
      
      const compressedFile = await imageCompression(file, options);
      const url = await profileApi.uploadFile(compressedFile);
      setForm((f) => ({ ...f, avatarUrl: url, avatarInitial: "" }));
    } catch (err: any) {
      toast.error("Lỗi", err.response?.data?.message || "Không thể upload ảnh, vui lòng thử lại sau.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = () => {
    if (!canSave) return;
    if (oldPassword && newPassword && !passwordMismatch) {
       onSave(form, { old: oldPassword, new: newPassword });
    } else {
       onSave(form);
    }
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
                {form.avatarUrl?.startsWith("http") && !form.avatarInitial ? (
                  <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-['Nimbus_Sans:Bold',sans-serif] text-2xl select-none">
                      {form.avatarInitial || form.fullName?.[0]?.toUpperCase() || form.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  </>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity disabled:opacity-100 disabled:bg-black/50"
                >
                  {uploadingAvatar ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Camera size={16} className="text-white" />
                  )}
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
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
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
          {isLocalProvider && <div className="border-t border-[#e2e3de]" />}

          {/* Change Password */}
          {isLocalProvider && (
          <div className="flex flex-col gap-4">
            <span className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[13px] tracking-[1.2px] uppercase">
              Change Password <span className="text-[#6b7280] normal-case tracking-normal font-normal">(optional)</span>
            </span>
            {/* Old password */}
            <div className="flex flex-col gap-2">
              <label className="text-[#42493e] text-[13px]">Old Password</label>
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-[#c2c9bb] pl-4 pr-10 py-3 text-[15px] text-[#1a1c19] placeholder-[#6b7280] outline-none focus:border-[#25521f] transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#42493e] hover:text-[#25521f] transition-colors"
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
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
          )}

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
function UserInfoCard({ profile, ordersCount, onUpdateProfile }: { profile: UserProfileResponse | null, ordersCount: number, onUpdateProfile: (p: UserProfileResponse) => void }) {
  const [editing, setEditing] = useState(false);
  const [isLocalProvider, setIsLocalProvider] = useState(false);

  useEffect(() => {
    if (profile?.email) {
      import('../../api/auth').then(({ authApi }) => {
        authApi.checkProvider(profile.email).then((res) => {
          setIsLocalProvider(res.data);
        }).catch(() => setIsLocalProvider(false));
      });
    }
  }, [profile?.email]);

  if (!profile) return <div className="h-40 animate-pulse bg-gray-100 rounded-2xl" />;

  const grad = AVATAR_GRADIENTS[Math.abs(profile.userId) % AVATAR_GRADIENTS.length];
  const isImageAvatar = profile.avatarUrl?.startsWith("http");
  const initial = isImageAvatar ? (profile.fullName?.[0] || profile.userName?.[0] || "U").toUpperCase() : (profile.avatarUrl || profile.fullName?.[0] || profile.userName?.[0] || "U").toUpperCase();

  const handleSave = async (updated: ProfileData, pw?: { old: string, new: string }) => {
    try {
      if (pw) {
        const { authApi } = await import('../../api/auth');
        await authApi.changePassword({ oldPassword: pw.old, newPassword: pw.new });
      }

      const res = await profileApi.updateProfile({
        fullName: updated.fullName,
        phoneNumber: updated.phoneNumber,
        avatarUrl: updated.avatarInitial || updated.avatarUrl,
      });
      onUpdateProfile(res);
      setEditing(false);
      toast.success("Thành công", pw ? "Cập nhật hồ sơ và mật khẩu thành công" : "Cập nhật hồ sơ thành công");
    } catch (err) {
      toast.error("Lỗi", "Không thể cập nhật hồ sơ. Vui lòng kiểm tra lại mật khẩu cũ.");
    }
  };

  const profileData: ProfileData = {
    username: profile.userName,
    email: profile.email,
    fullName: profile.fullName || "",
    phoneNumber: profile.phoneNumber || "",
    avatarIndex: Math.abs(profile.userId) % AVATAR_GRADIENTS.length,
    avatarInitial: isImageAvatar ? "" : initial,
    avatarUrl: profile.avatarUrl || "",
  };

  return (
    <>
      {/* ── Mobile layout: centered column ── */}
      <div className="flex flex-col gap-5 md:hidden">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 relative shadow-md">
            {isImageAvatar ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }} />
                <span className="absolute inset-0 flex items-center justify-center text-white font-['Nimbus_Sans:Bold',sans-serif] text-3xl select-none">{initial}</span>
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[20px] leading-tight">{profile.fullName || profile.userName}</h2>
            {profile.fullName && <p className="text-[#6b7280] text-[13px]">@{profile.userName}</p>}
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
          {isImageAvatar ? (
            <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <>
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }} />
              <span className="absolute inset-0 flex items-center justify-center text-white font-['Nimbus_Sans:Bold',sans-serif] text-[80px] select-none">{initial}</span>
            </>
          )}
        </div>

        {/* Info block */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {/* Name + badge */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[26px] leading-tight">
                {profile.fullName || profile.userName}
              </h2>
              {(() => {
                const tier = getTier(profile.greenPoints || 0);
                const TierIcon = tier.Icon;
                return (
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full tracking-[0.275px] font-medium"
                    style={{ background: tier.bg, color: tier.color }}
                  >
                    <TierIcon size={10} strokeWidth={2} />
                    {tier.label.toUpperCase()}
                  </span>
                );
              })()}
            </div>
            <p className="text-[#6b7280] text-[14px]">@{profile.userName}</p>
          </div>

          {/* Stats row */}
          <div className="flex items-start">
            <div className="flex flex-col gap-0.5 pr-6 border-r border-[#e2e3de]">
              <span className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[20px] leading-tight">{profile.greenPoints || 0}</span>
              <span className="text-[#6b7280] text-[12px]">Green Points</span>
            </div>
            <div className="flex flex-col gap-0.5 px-6 border-r border-[#e2e3de]">
              <span className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[20px] leading-tight">{profile.totalCarbonIndex ? profile.totalCarbonIndex.toFixed(1) : "0"}kg</span>
              <span className="text-[#6b7280] text-[12px]">CO2e Saved</span>
            </div>
            <div className="flex flex-col gap-0.5 pl-6">
              <span className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[20px] leading-tight">{ordersCount}</span>
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
          data={profileData}
          isLocalProvider={isLocalProvider}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}
    </>
  );
}

// ─── Green Impact Metrics ──────────────────────────────────────────────────
function GreenImpactMetrics({ profile, ordersCount }: { profile: UserProfileResponse | null, ordersCount: number }) {
  const pts = profile?.greenPoints || 0;
  const tier = getTier(pts);
  const TierIcon = tier.Icon;
  const currentIdx = ECO_TIERS.findIndex((t) => t.label === tier.label);
  const next = ECO_TIERS[currentIdx + 1];
  const pct = next
    ? Math.round(((pts - ECO_TIERS[currentIdx].req) / (next.req - ECO_TIERS[currentIdx].req)) * 100)
    : 100;

  return (
    <div className="bg-white/70 border border-[#e2e3de] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-[#e2e3de]">
        <div className="flex items-center gap-2">
          <Sprout size={14} className="text-[#25521f]" />
          <span className="text-[#42493e] text-[11px] tracking-[1.4px] uppercase">Hành trình Eco của bạn</span>
        </div>
        {/* Dynamic tier badge */}
        <span
          className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-medium"
          style={{ background: tier.bg, color: tier.color }}
        >
          <TierIcon size={11} strokeWidth={2} />
          {tier.label}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-[#e2e3de]">
        {/* Green Points */}
        <div className="px-5 py-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 mb-1">
            <Award size={12} className="text-[#25521f]" />
            <span className="text-[#6b7280] text-[10px] tracking-[1.2px] uppercase">Green Points</span>
          </div>
          <span
            className="text-[#25521f] leading-tight"
            style={{ fontFamily: "'Liberation Mono', monospace", fontWeight: 700, fontSize: "22px" }}
          >
            {(profile?.greenPoints || 0).toLocaleString()}
          </span>
          <span className="text-[#6b7280] text-[11px]">pts</span>
        </div>

        {/* CO2e */}
        <div className="px-5 py-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown size={12} className="text-[#3d6b35]" />
            <span className="text-[#6b7280] text-[10px] tracking-[1.2px] uppercase">CO₂ tiết kiệm</span>
          </div>
          <span
            className="text-[#3d6b35] leading-tight"
            style={{ fontFamily: "'Liberation Mono', monospace", fontWeight: 700, fontSize: "22px" }}
          >
            {profile?.totalCarbonIndex ? profile.totalCarbonIndex.toFixed(1) : "0"}
          </span>
          <span className="text-[#6b7280] text-[11px]">kg CO₂e</span>
        </div>

        {/* Orders */}
        <div className="px-5 py-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 mb-1">
            <Leaf size={12} className="text-[#6b5d3f]" />
            <span className="text-[#6b7280] text-[10px] tracking-[1.2px] uppercase">Đơn hàng xanh</span>
          </div>
          <span
            className="text-[#6b5d3f] leading-tight"
            style={{ fontFamily: "'Liberation Mono', monospace", fontWeight: 700, fontSize: "22px" }}
          >
            {ordersCount}
          </span>
          <span className="text-[#6b7280] text-[11px]">đơn</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-4 border-t border-[#e2e3de] flex flex-col gap-2">
        {next ? (
          <>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#42493e]">
                Tiến độ đến{" "}
                <span style={{ color: next.color, fontWeight: 600 }}>{next.label}</span>
              </span>
              <span className="text-[#6b7280]">{pct}% — còn {(next.req - pts).toLocaleString()} pts</span>
            </div>
            <div className="h-2 bg-[#e2e3de] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3d6b35] to-[#6db85f] rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-[12px] text-[#7c3aed] font-medium text-center">Bạn đã đạt cấp bậc cao nhất!</p>
        )}
      </div>
    </div>
  );
}

// ─── Status badge helper ────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    COMPLETED:  { label: "Đã giao",      cls: "bg-[#d4eddb] text-[#1e5e2e]" },
    SHIPPING:   { label: "Đang giao",    cls: "bg-[#ddeeff] text-[#1a4f8a]" },
    PROCESSING: { label: "Đang xử lý",  cls: "bg-[#fff3cd] text-[#856404]" },
    CANCELLED:  { label: "Đã hủy",      cls: "bg-[#fde8e8] text-[#ba1a1a]" },
  };
  const badge = map[status] || { label: status, cls: "bg-gray-100 text-gray-800" };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full tracking-wide uppercase font-medium ${badge.cls}`}>
      {badge.label}
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

// ─── Order History ─────────────────────────────────────────────────────
const ORDER_STATUS_TABS = [
  { key: "ALL",       label: "Tất cả" },
  { key: "PENDING",   label: "Chờ xác nhận" },
  { key: "SHIPPING",  label: "Đang giao" },
  { key: "COMPLETED", label: "Hoàn thành" },
  { key: "REVIEW",    label: "Chờ đánh giá" },
  { key: "CANCELLED", label: "Đã hủy" },
];

function OrderHistory({ orders, onOpenChatbot }: { orders: OrderResponse[], onOpenChatbot?: () => void }) {
  const [reviewTarget, setReviewTarget] = useState<{ orderId: number; productName: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleReviewClose = (submitted: boolean, orderId: number, productName: string) => {
    if (submitted) {
      // In a real app we would call a review API here and update the order state
    }
    setReviewTarget(null);
  };

  // Filter logic
  const isAwaitingReview = (order: OrderResponse) =>
    order.status === 'COMPLETED' && order.id === 9991; // id 9991 is within review window

  const filteredOrders = orders.filter(order => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "REVIEW") return isAwaitingReview(order);
    return order.status === statusFilter;
  });

  // Count per tab
  const countFor = (key: string) => {
    if (key === "ALL") return orders.length;
    if (key === "REVIEW") return orders.filter(isAwaitingReview).length;
    return orders.filter(o => o.status === key).length;
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Sub-tab bar */}
      <div className="-mx-4 md:mx-0 px-4 md:px-0 border-b border-[#e2e3de] mb-5">
        <div className="flex gap-0 overflow-x-auto scrollbar-none">
          {ORDER_STATUS_TABS.map((tab) => {
            const cnt = countFor(tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-[12px] tracking-wide border-b-2 transition-all whitespace-nowrap ${
                  statusFilter === tab.key
                    ? "border-[#25521f] text-[#25521f] font-medium"
                    : "border-transparent text-[#6b7280] hover:text-[#42493e]"
                }`}
              >
                {tab.label}
                {cnt > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      statusFilter === tab.key
                        ? "bg-[#25521f] text-white"
                        : "bg-[#f0f0eb] text-[#6b7280]"
                    }`}
                  >
                    {cnt}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Order list */}
      <div className="flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f0f0eb] flex items-center justify-center">
              <Leaf size={20} className="text-[#9ca3af]" />
            </div>
            <p className="text-[#6b7280] text-[14px]">Không có đơn hàng nào trong mục này.</p>
          </div>
        ) : filteredOrders.map((order) => {
          const totalCO2 = order.orderItems?.reduce((sum, i) => sum + (i.lineCarbonFootprint || 0), 0) || 0;
          const estPts = Math.floor((order.totalAmount || 0) / 10000);

          return (
            <div key={order.id} className="bg-white/70 border border-[#e2e3de] rounded-xl overflow-hidden p-0">
              {/* Order header */}
              <div className="bg-transparent px-5 py-3 flex items-center justify-between flex-wrap gap-3 border-b border-[#e2e3de]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-['Nimbus_Sans:Bold',sans-serif] font-bold text-[15px] text-[#1a1c19]">#GL-{order.id}</span>
                  {totalCO2 > 0 && (
                    <span className="bg-[#f0f0eb] text-[#6b7280] text-[11px] px-2.5 py-0.5 rounded-full">
                      CO2e {totalCO2.toFixed(1)}kg
                    </span>
                  )}
                  {estPts > 0 && (
                    <span className="bg-[#d4edd9] text-[#25521f] text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                      +{estPts} pts
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`${
                    order.status === 'PENDING' ? 'text-[#ea580c]' :
                    order.status === 'CANCELLED' ? 'text-[#dc2626]' :
                    order.status === 'SHIPPING' ? 'text-[#0284c7]' :
                    'text-[#25521f]'
                  } text-[12px] uppercase tracking-wide font-medium`}>
                    {order.status === 'COMPLETED' ? 'Hoàn Thành' :
                     order.status === 'PENDING' ? 'Chờ Xác Nhận' :
                     order.status === 'CANCELLED' ? 'Đã Hủy' :
                     order.status === 'SHIPPING' ? 'Đang Giao' :
                     order.status}
                  </span>
                </div>
              </div>

              {/* Order body: products */}
              <div className="px-5 py-4 flex flex-col gap-4">
                {order.orderItems?.map((p) => {
                  return (
                    <div key={p.id} className="flex gap-4">
                      <div className="w-[80px] h-[80px] md:w-[90px] md:h-[90px] shrink-0 bg-[#eeeee9] rounded-lg overflow-hidden">
                        <img src={p.mainImage} alt={p.productName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between gap-2 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-col gap-1">
                            <p className="text-[#1a1c19] text-[14px] md:text-[15px] line-clamp-2 leading-tight">{p.productName}</p>
                            <p className="text-[#6b7280] text-[12px]">x{p.quantity}</p>
                            <span className="bg-[#3d6b35] text-[#b5eaa6] text-[10px] px-1.5 py-0.5 rounded-sm self-start mt-1">
                              CO₂ {((p.lineCarbonFootprint || 0) / (p.quantity || 1)).toFixed(1)}kg{p.quantity > 1 ? "/sp" : ""}
                            </span>
                          </div>
                          <div className="flex flex-col items-end justify-center shrink-0">
                            {(p.quantity || 1) > 1 && (
                              <span className="text-[#6b7280] text-[11px] mt-1">
                                {((p.price || 0) / (p.quantity || 1)).toLocaleString()}đ/sp
                              </span>
                            )}
                            <span className="text-[#25521f] font-['Nimbus_Sans:Bold',sans-serif] text-[14px]">
                              {(p.price || 0).toLocaleString()}đ
                            </span>
                          </div>
                        </div>

                        {/* Review logic */}
                        {order.status === 'COMPLETED' && (
                          <div className="flex justify-end items-center mt-1">
                            {order.id === 9992 ? (
                              <span className="text-[#9ca3af] text-[11px]">Hết hạn đánh giá</span>
                            ) : order.id === 9994 ? (
                              <span className="flex items-center gap-1 text-[#25521f] text-[11px] shrink-0">
                                <Star size={11} fill="#25521f" className="text-[#25521f]" /> Đã đánh giá
                              </span>
                            ) : (
                              <button
                                onClick={() => setReviewTarget({ orderId: order.id, productName: p.productName })}
                                className="flex items-center gap-1.5 text-[#25521f] text-[12px] border border-[#25521f] px-4 py-1.5 rounded-full hover:bg-[#f0f7ee] transition-colors"
                              >
                                Đánh giá
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order footer: Total + Buttons */}
              <div className="bg-transparent px-5 py-4 flex flex-col gap-4 border-t border-[#e2e3de]">
                <div className="flex justify-end items-center gap-2">
                  <span className="text-[#1a1c19] text-[14px]">Thành tiền:</span>
                  <span className="text-[#25521f] text-[20px] font-['Nimbus_Sans:Bold',sans-serif]">{(order.totalAmount || 0).toLocaleString()}đ</span>
                </div>

                <div className="flex flex-col md:flex-row justify-end items-center gap-3 border-t border-[#e2e3de] pt-4 mt-2">
                  <button
                    onClick={() => { if (onOpenChatbot) onOpenChatbot(); }}
                    className="w-full md:w-auto text-[#25521f] text-[13px] tracking-widest uppercase border border-[#25521f] px-6 py-2.5 rounded-full hover:bg-[#f0f7ee] transition-colors"
                  >
                    Hỏi AI về phát thải đơn hàng
                  </button>
                  <button
                    onClick={() => { toast.info("Đang phát triển", `Mở chat admin cho đơn ${order.id}`); }}
                    className="w-full md:w-auto text-[#42493e] text-[13px] tracking-widest uppercase border border-[#c2c9bb] px-6 py-2.5 rounded-full bg-white hover:bg-[#fafaf5] transition-colors"
                  >
                    Liên hệ Admin
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {reviewTarget && (
        <ReviewModal
          productName={reviewTarget.productName}
          orderId={String(reviewTarget.orderId)}
          onClose={(submitted) => handleReviewClose(submitted, reviewTarget.orderId, reviewTarget.productName)}
        />
      )}
    </div>
  );
}

// ─── Wishlist Section ─────────────────────────────────────────────────────
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
    <div className="flex flex-col gap-5">
      {items.length === 0 ? (
        <div
          className="rounded-2xl p-10 flex flex-col items-center gap-4 text-center"
          style={{ background: "rgba(255,255,255,0.75)", border: "1px solid #dde8d8", backdropFilter: "blur(8px)" }}
        >
          <div className="w-12 h-12 rounded-full bg-[#f0f7ee] flex items-center justify-center">
            <Leaf size={20} className="text-[#9ca3af]" />
          </div>
          <p className="text-[#42493e] text-[15px]">Chưa có sản phẩm nào được lưu</p>
          <button
            onClick={() => onNavigate("shop")}
            className="text-[#25521f] text-[13px] border-b border-[#25521f] hover:opacity-70 transition-opacity"
          >
            Khám phá cửa hàng →
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-[#6b7280] text-[13px]">{items.length} sản phẩm đã lưu</span>
          </div>
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
        </>
      )}
    </div>
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
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.75)", border: "1px solid #dde8d8", backdropFilter: "blur(8px)" }}
    >
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <button
              key={row.label}
              onClick={() => { 
                if (row.danger) {
                  useAuthStore.getState().logout();
                  useCartStore.getState().clearCart();
                  onNavigate("home");
                } 
              }}
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
  );
}

// ─── Profile Page ──────────────────────────────────────────────────────────
export function ProfilePage({
  onNavigate,
  wishlistIds = [],
  onWishlist,
  onAddToCart,
  onOpenChatbot,
}: {
  onNavigate: (p: string) => void;
  wishlistIds?: number[];
  onWishlist?: (p: Product) => void;
  onAddToCart?: (p: Product) => void;
  onOpenChatbot?: () => void;
}) {
  const user = useAuthStore(s => s.user);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  
  type ProfileTab = "orders" | "wishlist" | "settings";
  const [activeTab, setActiveTab] = useState<ProfileTab>("orders");

  useEffect(() => {
    if (user?.id) {
      profileApi.getProfile(user.id).then(res => {
        setProfile(res);
        useAuthStore.getState().setAvatarUrl(res.avatarUrl || null);
      }).catch(console.error);
      ordersApi.getOrders().then(realOrders => {
        setOrders(realOrders.sort((a, b) => b.id - a.id));
      }).catch(console.error);
    }
  }, [user?.id]);

  return (
    <main className="flex-1 pb-20 md:pb-0">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-8 md:py-12 flex flex-col gap-10 md:gap-12">
        <UserInfoCard profile={profile} ordersCount={orders.length} onUpdateProfile={(p) => {
          setProfile(p);
          useAuthStore.getState().setAvatarUrl(p.avatarUrl || null);
        }} />
        <GreenImpactMetrics profile={profile} ordersCount={orders.length} />

        <div className="flex items-center gap-6 md:gap-10 border-b border-[#dde8d8] overflow-x-auto no-scrollbar">
          {(
            [
              { key: "orders", label: "Đơn mua" },
              { key: "wishlist", label: "Sản phẩm yêu thích" },
              { key: "settings", label: "Cài đặt" }
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 text-[14px] md:text-[15px] whitespace-nowrap transition-colors relative ${
                activeTab === tab.key
                  ? "text-[#25521f] font-['Nimbus_Sans:Bold',sans-serif]"
                  : "text-[#6b7280] hover:text-[#42493e]"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#25521f] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "orders" && <OrderHistory orders={orders} onOpenChatbot={onOpenChatbot} />}
          
          {activeTab === "wishlist" && (
            <WishlistSection
              wishlistIds={wishlistIds}
              onWishlist={onWishlist ?? (() => {})}
              onAddToCart={onAddToCart ?? (() => {})}
              onNavigate={onNavigate}
            />
          )}

          {activeTab === "settings" && <AccountPreferences onNavigate={onNavigate} />}
        </div>
      </div>
    </main>
  );
}
