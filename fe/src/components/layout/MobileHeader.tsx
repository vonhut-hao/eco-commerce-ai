import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, X } from "lucide-react";
import { CartIcon } from "./CartIcon";

export function MobileHeader() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[#fafaf5] border-b border-[#c2c9bb] md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={() => navigate("/")}
          className="text-[#25521f] font-['Nimbus_Sans',sans-serif] font-bold text-xl"
        >
          GreenLife
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-[#42493e]"
            aria-label="Tìm kiếm"
          >
            <Search size={18} />
          </button>
          <CartIcon count={3} />
        </div>
      </div>

      {/* Collapsible search bar */}
      {searchOpen && (
        <div className="px-4 pb-3">
          <div className="flex items-center bg-white border border-[#c2c9bb] rounded-md px-3 gap-2 h-9 shadow-sm">
            <Search size={14} className="text-[#9ca3af] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Tìm kiếm sản phẩm xanh..."
              className="flex-1 text-[13px] text-gray-700 outline-none placeholder-[#9ca3af] bg-transparent"
            />
            <button onClick={() => setSearchOpen(false)} className="text-[#9ca3af] hover:text-[#42493e] transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
