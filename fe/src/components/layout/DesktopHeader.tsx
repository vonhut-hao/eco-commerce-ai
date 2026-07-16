import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Search, X } from "lucide-react";
import { CartIcon } from "./CartIcon";
import { cartService } from "@/services/cart.service";
import { authService } from "@/services/auth.service";
import { profileService } from "@/services/profile.service";

export function DesktopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cartCount, setCartCount] = useState(0);
  const [greenPoints, setGreenPoints] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const fetchCartCount = async () => {
    if (!authService.isAuthenticated()) {
      setCartCount(0);
      return;
    }
    try {
      const response = await cartService.getCart();
      const count = response.data ? response.data.reduce((acc, item) => acc + item.quantity, 0) : 0;
      setCartCount(count);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGreenPoints = async () => {
    if (!authService.isAuthenticated()) {
      setGreenPoints(null);
      setAvatarUrl(null);
      return;
    }
    try {
      const userId = authService.getUserId();
      if (userId) {
        const profile = await profileService.getProfile(userId);
        setGreenPoints(profile.greenPoints ?? 0);
        setAvatarUrl(profile.avatarUrl || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCartCount();
    window.addEventListener("cart-updated", fetchCartCount);
    return () => window.removeEventListener("cart-updated", fetchCartCount);
  }, []);

  useEffect(() => {
    fetchGreenPoints();
  }, [location.pathname]);

  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/" },
    { label: "Green AI", path: "/" },
    { label: "Impact Tracker", path: "/" },
    { label: "Chat with admin", path: "/chat-page" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fafaf5] border-b border-[#c2c9bb] hidden md:block">
      <div className="max-w-[1280px] mx-auto px-16 h-20 flex items-center">
        {/* Left – Logo */}
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer text-[#25521f] font-['Nimbus_Sans',sans-serif] font-bold text-2xl shrink-0"
        >
          GreenLife
        </button>
        {/* Centre – Nav */}
        <nav className="flex-1 flex items-center justify-center gap-6">
          {navLinks.map((link) => {
            const isActive = link.label === "Home" && location.pathname === "/";
            return (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`cursor-pointer relative text-[15px] pb-1 whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-[#25521f] font-['Nimbus_Sans',sans-serif]"
                    : "text-[#42493e] hover:text-[#1a1c19]"
                }`}
              >
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#25521f]" />
                )}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right – Green Points + search + account */}
        <div className="flex items-center gap-4 shrink-0">
          {authService.isAuthenticated() && greenPoints !== null && (
            <div className="bg-[#bcf1ad] text-[#25521f] text-[14px] px-3 py-1 rounded-sm whitespace-nowrap cursor-default">
              Green Points: {greenPoints.toLocaleString()}
            </div>
          )}

          {/* Search */}
          {searchOpen ? (
            <div className="flex items-center bg-white border border-[#c2c9bb] rounded-sm px-3 gap-2 h-10 w-[240px] shadow-sm">
              <Search size={14} className="text-[#9ca3af] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Tìm kiếm sản phẩm xanh..."
                className="flex-1 text-[14px] text-gray-700 outline-none placeholder-[#9ca3af] bg-transparent"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="cursor-pointer text-[#9ca3af] hover:text-[#42493e] transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="cursor-pointer text-[#42493e] hover:text-[#25521f] transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search size={18} />
            </button>
          )}

          <div onClick={() => navigate("/cart")} className="cursor-pointer">
            <CartIcon count={cartCount} />
          </div>

          {/* Account icon */}
          <button
            onClick={() => {
              if (location.pathname === "/profile") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else if (authService.isAuthenticated()) {
                navigate("/profile");
              } else {
                navigate("/signin");
              }
            }}
            className={`cursor-pointer relative transition-colors pb-1 flex items-center justify-center ${
              location.pathname === "/profile" ? "text-[#25521f]" : "text-[#42493e] hover:text-[#25521f]"
            }`}
            aria-label="User Profile"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-[#c2c9bb]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8fbf8a] to-[#3d7035] flex items-center justify-center text-white text-sm font-bold shadow-xs select-none">
                {authService.isAuthenticated()
                  ? (authService.getUsername()?.charAt(0).toUpperCase() || "U")
                  : "U"}
              </div>
            )}
            {location.pathname === "/profile" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#25521f]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
