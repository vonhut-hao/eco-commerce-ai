import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Search, X } from "lucide-react";
import { CartIcon } from "./CartIcon";

export function DesktopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

          <CartIcon count={3} />

          {/* Account icon */}
          <button
            onClick={() => {
              if (location.pathname === "/profile") {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate("/signin");
              }
            }}
            className={`cursor-pointer relative transition-colors pb-1 ${
              location.pathname === "/profile" ? "text-[#25521f]" : "text-[#42493e] hover:text-[#25521f]"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8V8M0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0V16" fill={location.pathname === "/profile" ? "#25521f" : "#42493E"} />
            </svg>
            {location.pathname === "/profile" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#25521f]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
