import { MapPin, CreditCard, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { authService } from "@/services/auth.service";

const preferences = [
  { label: "SHIPPING ADDRESSES",    icon: MapPin,     danger: false },
  { label: "PAYMENT METHODS",       icon: CreditCard, danger: false },
  { label: "NOTIFICATION SETTINGS", icon: Bell,       danger: false },
  { label: "LOGOUT",                icon: LogOut,     danger: true  },
];

export function AccountPreferences() {
  const navigate = useNavigate();

  const handleClick = (label: string) => {
    if (label === "LOGOUT") {
      authService.logout();
      navigate("/signin");
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[22px] md:text-[28px]">
        Account Preferences
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {preferences.map((pref) => {
          const Icon = pref.icon;
          return (
            <button
              key={pref.label}
              onClick={() => handleClick(pref.label)}
              className="cursor-pointer bg-white border border-[#c2c9bb] rounded-md p-5 flex flex-col gap-3 text-left hover:shadow-md hover:border-[#a2c9a0] transition-all active:scale-[0.98]"
            >
              <Icon
                size={20}
                color={pref.danger ? "#ba1a1a" : "#42493e"}
                strokeWidth={1.8}
              />
              <span
                className="text-[11px] tracking-widest uppercase font-['Nimbus_Sans',sans-serif] font-bold"
                style={{ color: pref.danger ? "#ba1a1a" : "#42493e" }}
              >
                {pref.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
