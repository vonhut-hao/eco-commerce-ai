import { useState } from "react";
import { useNavigate } from "react-router";
import svgPaths from "@/assets/icons/svg-paths";
import { authService } from "@/services/auth.service";

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

const trustIndicators = [
  { label: "ECO-CERTIFIED PRODUCTS",    viewBox: "0 0 22 21", path: "p13774060" as const, w: 22, h: 21 },
  { label: "TRANSPARENT SUPPLY CHAIN",  viewBox: "0 0 22 15", path: "p3e801e80" as const, w: 22, h: 15 },
  { label: "CARBON-TRACKED SHIPPING",   viewBox: "0 0 22 16", path: "p146eb80" as const,  w: 22, h: 16 },
];

export default function SignInPage() {
  const navigate = useNavigate();
  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const handleSubmit = async () => {
    if (!username || !password) return;
    setLoading(true);
    setError("");
    try {
      await authService.login({ username, password });
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fafaf5]">

      {/* ── Left Panel ─────────────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col justify-between p-16 bg-[#fafaf5] relative overflow-hidden shrink-0" style={{ width: "55%", maxWidth: 704 }}>
        <div className="absolute top-[-128px] right-[-128px] w-64 h-64 bg-[#e8e8e4] rounded-xl blur-[32px] opacity-50 pointer-events-none" />

        {/* Logo */}
        <button onClick={() => navigate("/")} className="text-[#25521f] font-['Nimbus_Sans',sans-serif] font-bold text-[40px] leading-[56px] self-start cursor-pointer">
          GreenLife
        </button>

        {/* Heading + description */}
        <div className="flex flex-col gap-6 max-w-[512px]">
          <h1 className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[48px] tracking-[-0.96px] leading-[60px]">
            Welcome Back to<br />Conscious Living
          </h1>
          <p className="text-[#42493e] text-[18px] leading-[29px]">
            Sign in to continue your sustainable journey. Track your green impact, manage orders, and discover eco-friendly products.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="border-t border-[rgba(194,201,187,0.3)] pt-6">
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 max-w-[512px]">
            {trustIndicators.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <svg width={item.w} height={item.h} viewBox={item.viewBox} fill="none" className="shrink-0">
                  <path d={svgPaths[item.path]} fill="#42493E" />
                </svg>
                <span className="text-[#42493e] text-[12px] tracking-[1.2px] uppercase leading-[16px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ────────────────────────────────────────────────────── */}
      <div className="flex-1 bg-white flex flex-col md:border-l border-[rgba(194,201,187,0.3)]">

        {/* Mobile logo header */}
        <button
          onClick={() => navigate("/")}
          className="md:hidden w-full text-left text-[#25521f] font-['Nimbus_Sans',sans-serif] font-bold text-xl px-6 py-3 border-b border-[#c2c9bb] cursor-pointer"
        >
          GreenLife
        </button>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto flex md:items-center md:justify-center p-6">
        <div className="w-full max-w-[448px] flex flex-col gap-6 pt-[50px] pb-8 md:py-8">

          {/* Heading */}
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-[#25521f] font-['Nimbus_Sans',sans-serif] font-bold text-[32px] leading-[40px]">Sign in</h2>
            <p className="text-[#42493e] text-[16px] leading-[24px]">Enter your credentials to access your account.</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[4px] text-[14px]">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-5">

            {/* USERNAME OR EMAIL */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[14px] tracking-[1.3px] uppercase">
                Username or email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d={svgPaths.p85bff00} fill="#42493E" />
                  </svg>
                </span>
                <input
                  id="signin-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="johndoe"
                  className="w-full border border-[#c2c9bb] pl-10 pr-4 py-3 text-[16px] text-[#1a1c19] placeholder-[#6b7280] outline-none focus:border-[#25521f] transition-colors bg-white"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-2">
              <label className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[14px] tracking-[1.3px] uppercase">
                PASSWORD
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg width="16" height="21" viewBox="0 0 16 21" fill="none">
                    <path d={svgPaths.p12930f00} fill="#42493E" />
                  </svg>
                </span>
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full border border-[#c2c9bb] pl-10 pr-10 py-3 text-[16px] text-[#1a1c19] placeholder-[#6b7280] outline-none focus:border-[#25521f] transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#42493e] hover:text-[#25521f] transition-colors cursor-pointer"
                >
                  <svg width="18" height="16" viewBox="0 0 18.3333 16.5" fill="none">
                    <path d={svgPaths.pf0742c0} fill="#42493E" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="signin-submit"
              onClick={handleSubmit}
              disabled={!username || !password || loading}
              className="w-full bg-[#3d6b35] text-white font-['Nimbus_Sans',sans-serif] font-bold text-[14px] tracking-[0.7px] py-3 rounded-[4px] hover:bg-[#25521f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading ? "Signing In…" : "Sign In"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#c2c9bb]" />
              <span className="text-[#42493e] text-[14px] shrink-0">or continue with</span>
              <div className="flex-1 h-px bg-[#c2c9bb]" />
            </div>

            {/* Google */}
            <button
              id="signin-google"
              onClick={() => authService.googleLogin()}
              className="w-full border border-[#c2c9bb] flex items-center justify-center gap-2 py-3 rounded-[4px] hover:bg-[#fafaf5] transition-colors cursor-pointer"
            >
              <GoogleIcon />
              <span className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[14px] tracking-[0.7px]">Google</span>
            </button>
          </div>

          {/* Create account link */}
          <p className="text-center text-[#42493e] text-[14px] leading-[21px]">
            Don't have an account?{" "}
            <button onClick={() => navigate("/signup")} className="text-[#25521f] underline hover:text-[#1e4219] transition-colors cursor-pointer">
              Create Account
            </button>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
