import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Search, X, User } from "lucide-react";
import { CartIcon } from "./CartIcon";
import { cartService } from "@/services/cart.service";
import { authService } from "@/services/auth.service";

export function DesktopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cartCount, setCartCount] = useState(0);

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

  useEffect(() => {
    fetchCartCount();
    window.addEventListener("cart-updated", fetchCartCount);
    return () => window.removeEventListener("cart-updated", fetchCartCount);
  }, []);

  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/" },
    { label: "Green AI", path: "/" },
    { label: "Impact Tracker", path: "/" },
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
          <div className="bg-[#bcf1ad] text-[#25521f] text-[14px] px-3 py-1 rounded-sm whitespace-nowrap cursor-default">
            Green Points: 1,250
          </div>

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
            <User size={20} />
            {location.pathname === "/profile" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#25521f]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
