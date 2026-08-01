import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { GreenLifeBrand } from "./GreenLifeBrand";
import { authApi } from "../../api/auth";
import { toast } from "./Toast";
import svgPaths from "../../imports/SignUp/svg-fixyv1ym10";
import imgAvatar  from "../../imports/SignUp/7705565c9d1f1ad164d1a412463787770179a8c2.png";
import imgAvatar1 from "../../imports/SignUp/6432783271794e49ead071f5ad7588f1f6e1d48c.png";
import imgAvatar2 from "../../imports/SignUp/838cafac52f51d8d0fd5103a426068cfcde77550.png";

function getStrength(pwd: string): number {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 6) s++;
  if (pwd.length >= 10) s++;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Strong", "Very Strong"];
const STRENGTH_COLOR  = ["", "#ba1a1a", "#e6ac00", "#3d6b35", "#25521f"];

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d={svgPaths.p29ad9380} fill="#4285F4" />
      <path d={svgPaths.p73c0a80}  fill="#34A853" />
      <path d={svgPaths.p1f69ba00} fill="#FBBC05" />
      <path d={svgPaths.p3d0b3f00} fill="#EA4335" />
    </svg>
  );
}

export function SignUpPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [username, setUsername]               = useState("");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [agreed, setAgreed]                   = useState(false);
  const [submitted, setSubmitted]             = useState(false);
  const [errorMsg, setErrorMsg]               = useState("");

  const strength = getStrength(password);
  const confirmMismatch = !!confirmPassword && confirmPassword !== password;
  const isFormFilled = agreed && !!username && !!email && !!password && !!confirmPassword;

  const handleSubmit = async () => {
    if (!isFormFilled) return;

    if (confirmMismatch) {
      setErrorMsg("Passwords do not match");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    setSubmitted(true);
    setErrorMsg("");
    try {
      await authApi.registerNormal({ username, email, password });
      toast.success("Account created!", "Please sign in");
      onNavigate("signin");
    } catch (e: any) {
      console.error(e);
      const msg = e.response?.data?.detail || e.response?.data?.message || "Could not create account";
      setErrorMsg(msg);
      toast.error("Sign Up Failed", msg);
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#f3f7ee] via-[#fafaf5] to-[#edf3e7]">

      {/* ── Left Panel ─────────────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col justify-between p-16 bg-gradient-to-br from-[#e7f2e1] via-[#eef6e9] to-[#d7edcd] relative overflow-hidden shrink-0" style={{ width: "55%", maxWidth: 704 }}>
        <div className="absolute top-[-128px] right-[-128px] w-64 h-64 bg-[#3d6b35]/20 rounded-full blur-[64px] pointer-events-none" />

        {/* Logo */}
        <GreenLifeBrand onClick={() => onNavigate("product")} textSize="text-[40px]" iconSize={38} />

        {/* Heading + bullets */}
        <div className="flex flex-col gap-6 max-w-[512px]">
          <h1 className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[48px] tracking-[-0.96px] leading-[56px]">
            Begin Your<br />Sustainable Journey
          </h1>
          <p className="text-[#42493e] text-[18px] leading-[28px]">
            Join thousands of conscious consumers making a positive impact. Create your GreenLife account and start earning Green Points with every eco-friendly purchase.
          </p>
          <ul className="flex flex-col gap-4 pt-2">
            {[
              "Track your environmental impact",
              "Earn Green Points on every order",
              "Get personalized eco-product recommendations",
              "Access AI-powered sustainability advisor",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#3d6b35] rounded-full shrink-0" />
                <span className="text-[#42493e] text-[16px] leading-[24px]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {[imgAvatar, imgAvatar1, imgAvatar2].map((src, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#fafaf5] shrink-0"
                style={{ marginRight: i < 2 ? -16 : 0 }}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-xl bg-[#e8e8e4] border-2 border-[#fafaf5] flex items-center justify-center shrink-0">
              <span className="text-[#42493e] text-[12px]">+12k</span>
            </div>
          </div>
          <span className="text-[#42493e] text-[16px] leading-[24px]">Join 12,000+ conscious shoppers</span>
        </div>
      </div>

      {/* ── Right Panel ────────────────────────────────────────────────────── */}
      <div className="flex-1 bg-white flex flex-col md:border-l border-[rgba(194,201,187,0.3)]">

        {/* Mobile logo header — top of panel, left-aligned */}
        <button
          onClick={() => onNavigate("product")}
          className="md:hidden w-full text-left px-6 py-3 border-b border-[#c2c9bb]"
        >
          <GreenLifeBrand textSize="text-xl" iconSize={20} />
        </button>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto flex md:items-center md:justify-center p-6">
        <div className="w-full max-w-[448px] flex flex-col gap-6 pt-[50px] pb-8 md:py-8">

          {/* Heading */}
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-[#25521f] font-['Nimbus_Sans:Bold',sans-serif] text-[32px] leading-[40px]">Create Account</h2>
            <p className="text-[#42493e] text-[16px] leading-[24px]">Start your GreenLife journey today</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[#fef2f2] border border-[#f87171] rounded-[4px] text-[#b91c1c] text-[14px] text-center font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-5">

            {/* USERNAME */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[14px] tracking-[1.3px] uppercase">USERNAME</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d={svgPaths.p85bff00} fill="#42493E" />
                  </svg>
                </span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full border border-[#c2c9bb] pl-10 pr-4 py-3 text-[16px] text-[#1a1c19] placeholder-[#6b7280] outline-none focus:border-[#25521f] transition-colors bg-white"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[14px] tracking-[1.3px] uppercase">EMAIL</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                    <path d={svgPaths.p13e73800} fill="#42493E" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className={`w-full border pl-10 pr-4 py-3 text-[16px] placeholder-[#6b7280] outline-none transition-colors bg-white ${
                    email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                      ? "border-[#f87171] text-[#b91c1c] focus:border-[#f87171]"
                      : "border-[#c2c9bb] text-[#1a1c19] focus:border-[#25521f]"
                  }`}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[14px] tracking-[1.3px] uppercase">PASSWORD</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg width="16" height="21" viewBox="0 0 16 21" fill="none">
                    <path d={svgPaths.p12930f00} fill="#42493E" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-[#c2c9bb] pl-10 pr-10 py-3 text-[16px] text-[#1a1c19] placeholder-[#6b7280] outline-none focus:border-[#25521f] transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#42493e] hover:text-[#25521f] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Strength bars */}
              {password && (
                <>
                  <div className="flex gap-1 mt-0.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full transition-colors"
                        style={{ backgroundColor: i < strength ? STRENGTH_COLOR[strength] : "#e8e8e4" }}
                      />
                    ))}
                  </div>
                  <p className="text-right text-[10px] leading-[15px]" style={{ color: STRENGTH_COLOR[strength] }}>
                    {STRENGTH_LABELS[strength]}
                  </p>
                </>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[14px] tracking-[1.3px] uppercase">CONFIRM PASSWORD</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg width="16" height="21" viewBox="0 0 16 21" fill="none">
                    <path d={svgPaths.p12930f00} fill="#42493E" />
                  </svg>
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full border pl-10 pr-10 py-3 text-[16px] placeholder-[#6b7280] outline-none transition-colors bg-white ${
                    confirmMismatch
                      ? "border-[#ba1a1a] text-[#ba1a1a]"
                      : "border-[#c2c9bb] text-[#1a1c19] focus:border-[#25521f]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#42493e] hover:text-[#25521f] transition-colors"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmMismatch && (
                <p className="text-[#ba1a1a] text-[12px]">Passwords do not match</p>
              )}
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 shrink-0 accent-[#25521f] cursor-pointer rounded-sm"
              />
              <span className="text-[#42493e] text-[14px] leading-[21px]">
                I agree to the{" "}
                <span className="text-[#25521f] underline cursor-pointer">Terms of Service</span>
                {" "}and{" "}
                <span className="text-[#25521f] underline cursor-pointer">Privacy Policy</span>
              </span>
            </label>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!isFormFilled}
              className="w-full bg-[#3d6b35] text-white font-['Nimbus_Sans:Bold',sans-serif] text-[14px] tracking-[0.7px] py-3 rounded-[4px] hover:bg-[#25521f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitted ? "Creating Account…" : "Create Account"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#c2c9bb]" />
              <span className="text-[#42493e] text-[14px] shrink-0">or continue with</span>
              <div className="flex-1 h-px bg-[#c2c9bb]" />
            </div>

            {/* Google */}
            <button 
              type="button"
              onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
              className="w-full border border-[#c2c9bb] flex items-center justify-center gap-2 py-3 rounded-[4px] hover:bg-[#fafaf5] transition-colors"
            >
              <GoogleIcon />
              <span className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[14px] tracking-[0.7px]">Google</span>
            </button>
          </div>

          {/* Sign in link */}
          <p className="text-center text-[#42493e] text-[14px] leading-[21px]">
            Already have an account?{" "}
            <button onClick={() => onNavigate("signin")} className="text-[#25521f] underline hover:text-[#1e4219] transition-colors">
              Sign In
            </button>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
