import { useState, useRef } from "react";
import { X, Camera, Eye, EyeOff } from "lucide-react";
import { UserProfile, CreateOrUpdateProfile } from "@/services/profile.service";

export function EditProfilePanel({
  profile,
  onSave,
  onCancel,
}: {
  profile: UserProfile;
  onSave: (updated: CreateOrUpdateProfile) => Promise<void> | void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    fullName: profile.fullName || "",
    phoneNumber: profile.phoneNumber || "",
    avatarUrl: profile.avatarUrl || "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [apiError, setApiError] = useState<{ field: string; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const passwordMismatch = !!confirmPassword && confirmPassword !== newPassword;
  const canSave = !!form.fullName && !passwordMismatch && !isLoading;

  const handleSave = async () => {
    if (!canSave) return;
    setApiError(null);
    setIsLoading(true);
    
    try {
      await onSave(form);
    } catch (err: any) {
      const msg = err.message || "Something went wrong. Please try again.";
      if (msg.toLowerCase().includes("phone number")) {
        setApiError({ field: "phoneNumber", message: "Please enter a valid phone number (e.g., 0xxxxxxxxx or 84xxxxxxxxx)." });
      } else if (msg.toLowerCase().includes("blank") || msg.toLowerCase().includes("empty")) {
        setApiError({ field: "fullName", message: "Full Name cannot be left empty." });
      } else {
        setApiError({ field: "general", message: msg });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const initial = profile.userName ? profile.userName.charAt(0).toUpperCase() : "U";

  // Dummy password strength calculator for the placeholder
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    if (pass.length < 6) return 1;
    if (pass.length < 10) return 2;
    return 3;
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 md:flex md:items-center md:justify-center"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="fixed z-50 bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center pointer-events-none">
        <div className="bg-white rounded-t-2xl md:rounded-xl shadow-2xl w-full md:w-[480px] max-h-[90vh] overflow-y-auto pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e3de] sticky top-0 bg-white z-10">
            <h3 className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[18px]">
              Edit Profile
            </h3>
            <button
              onClick={onCancel}
              className="text-[#6b7280] hover:text-[#1a1c19] transition-colors p-1 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-5 flex flex-col gap-6">
            {apiError?.field === "general" && (
              <div className="bg-[#fcedeb] border border-[#f5b8b1] text-[#ba1a1a] px-4 py-3 rounded-md text-[13px]">
                {apiError.message}
              </div>
            )}

            {/* Avatar selector (Placeholder UI) */}
            <div className="flex flex-col gap-3">
              <span className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[13px] tracking-[1.2px] uppercase">
                Avatar
              </span>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full shrink-0 relative overflow-hidden shadow-sm">
                  {form.avatarUrl ? (
                    <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#8fbf8a] to-[#3d7035]" />
                      <span className="absolute inset-0 flex items-center justify-center text-white font-['Nimbus_Sans',sans-serif] font-bold text-2xl select-none">
                        {initial}
                      </span>
                    </>
                  )}
                  {/* Always-visible Camera Overlay matching design */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer absolute inset-0 bg-black/30 flex items-center justify-center opacity-100 transition-opacity"
                  >
                    <Camera size={20} className="text-white" />
                  </button>
                </div>
                <div className="text-[12px] text-[#6b7280]">
                  Click the camera icon to upload a new avatar.<br />
                  <span className="italic">(Feature coming soon)</span>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[13px] tracking-[1.2px] uppercase">
                Full Name
              </label>
              <input
                value={form.fullName}
                onChange={(e) => {
                  setForm((f) => ({ ...f, fullName: e.target.value }));
                  if (apiError?.field === "fullName") setApiError(null);
                }}
                placeholder="Nguyễn Văn A"
                className={`w-full border px-4 py-3 text-[15px] outline-none transition-colors bg-white rounded-sm ${
                  apiError?.field === "fullName"
                    ? "border-[#ba1a1a] text-[#ba1a1a] focus:border-[#ba1a1a]"
                    : "border-[#c2c9bb] text-[#1a1c19] placeholder-[#6b7280] focus:border-[#25521f]"
                }`}
              />
              {apiError?.field === "fullName" && (
                <p className="text-[#ba1a1a] text-[12px]">{apiError.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[13px] tracking-[1.2px] uppercase">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => {
                  setForm((f) => ({ ...f, phoneNumber: e.target.value }));
                  if (apiError?.field === "phoneNumber") setApiError(null);
                }}
                placeholder="038 xxx xxxx"
                className={`w-full border px-4 py-3 text-[15px] outline-none transition-colors bg-white rounded-sm ${
                  apiError?.field === "phoneNumber"
                    ? "border-[#ba1a1a] text-[#ba1a1a] focus:border-[#ba1a1a]"
                    : "border-[#c2c9bb] text-[#1a1c19] placeholder-[#6b7280] focus:border-[#25521f]"
                }`}
              />
              {apiError?.field === "phoneNumber" && (
                <p className="text-[#ba1a1a] text-[12px]">{apiError.message}</p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#e2e3de]" />

            {/* Change Password (Placeholder UI) */}
            <div className="flex flex-col gap-4">
              <span className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[13px] tracking-[1.2px] uppercase">
                Change Password{" "}
                <span className="text-[#6b7280] normal-case tracking-normal font-normal">
                  (optional - coming soon)
                </span>
              </span>

              {/* Current password */}
              <div className="flex flex-col gap-2">
                <label className="text-[#42493e] text-[13px]">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-[#c2c9bb] pl-4 pr-10 py-3 text-[15px] text-[#1a1c19] placeholder-[#6b7280] outline-none focus:border-[#25521f] transition-colors bg-white rounded-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#42493e] hover:text-[#25521f] transition-colors"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
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
                    className="w-full border border-[#c2c9bb] pl-4 pr-10 py-3 text-[15px] text-[#1a1c19] placeholder-[#6b7280] outline-none focus:border-[#25521f] transition-colors bg-white rounded-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#42493e] hover:text-[#25521f] transition-colors"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength Indicator */}
                {newPassword.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 flex gap-1 h-1.5">
                      <div className={`flex-1 rounded-full ${strength >= 1 ? 'bg-[#ba1a1a]' : 'bg-[#e2e3de]'}`} />
                      <div className={`flex-1 rounded-full ${strength >= 2 ? 'bg-[#d4a76a]' : 'bg-[#e2e3de]'}`} />
                      <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-[#25521f]' : 'bg-[#e2e3de]'}`} />
                    </div>
                    <span className="text-[10px] text-[#6b7280] w-12 text-right">
                      {strength === 1 ? 'Weak' : strength === 2 ? 'Medium' : strength === 3 ? 'Strong' : ''}
                    </span>
                  </div>
                )}
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
                    className={`w-full border pl-4 pr-10 py-3 text-[15px] placeholder-[#6b7280] outline-none transition-colors bg-white rounded-sm ${
                      passwordMismatch
                        ? "border-[#ba1a1a] text-[#ba1a1a]"
                        : "border-[#c2c9bb] text-[#1a1c19] focus:border-[#25521f]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#42493e] hover:text-[#25521f] transition-colors"
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
            <div className="flex flex-col gap-3 pb-2 mt-2">
              <button
                onClick={handleSave}
                disabled={!canSave}
                className="cursor-pointer w-full bg-[#25521f] text-white font-['Nimbus_Sans',sans-serif] font-bold text-[13px] tracking-widest uppercase py-3 rounded-sm hover:bg-[#1e4219] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "SAVING..." : "SAVE CHANGES"}
              </button>
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="cursor-pointer w-full border border-[#c2c9bb] text-[#42493e] font-['Nimbus_Sans',sans-serif] font-bold text-[13px] tracking-widest uppercase py-3 rounded-sm hover:bg-[#fafaf5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
