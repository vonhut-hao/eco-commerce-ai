import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Home, ShoppingBag, Leaf, BarChart2, User } from "lucide-react";

const items = [
  { key: "home",    label: "Home",     icon: Home,        path: "/" },
  { key: "shop",    label: "Shop",     icon: ShoppingBag, path: "/" },
  { key: "greenai", label: "Green AI", icon: Leaf,        path: "/" },
  { key: "impact",  label: "Impact",   icon: BarChart2,   path: "/" },
  { key: "me",      label: "Tôi",      icon: User,        path: "/profile" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(() =>
    location.pathname === "/profile" ? "me" : "home"
  );

  const handleClick = (key: string, path: string) => {
    setActiveKey(key);
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fafaf5] border-t border-[#c2c9bb] md:hidden safe-bottom">
      <div className="flex">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleClick(item.key, item.path)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${
                isActive ? "text-[#25521f]" : "text-[#6b7280]"
              }`}
            >
              <Icon size={21} strokeWidth={isActive ? 2.2 : 1.6} />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
