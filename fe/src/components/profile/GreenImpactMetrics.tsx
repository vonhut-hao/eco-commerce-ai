import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { profileService, UserProfile } from "@/services/profile.service";

export function GreenImpactMetrics() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const userId = authService.getUserId();
    if (userId) {
      profileService.getProfile(userId).then(setProfile).catch(console.error);
    }
  }, []);

  const current = profile?.greenPoints ?? 0;
  const target = 3000;
  const progress = Math.min(100, Math.round((current / target) * 100));
  const carbonOffset = profile?.totalCarbonIndex ?? 0.0;
  const equivalentTrees = Math.round(carbonOffset / 15.0); // 15kg CO2 offset per tree

  return (
    <div className="bg-white border border-[#c2c9bb] rounded-md p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[17px]">
          Green Impact Metrics
        </h3>
        <p className="text-[#6b7280] text-[13px]">Your contributions to a sustainable future.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 border-b border-[#e2e3de] pb-4">
        {/* Accumulated Points */}
        <div className="flex flex-col gap-1">
          <span className="text-[#6b7280] text-[10px] tracking-widest uppercase">
            Accumulated Points
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[#1a1c19] font-['Liberation_Mono',monospace] font-bold text-[26px] leading-tight">
              {current.toLocaleString()}
            </span>
            <span className="text-[#42493e] text-[13px]">pts</span>
          </div>
        </div>
        {/* Carbon Offset */}
        <div className="flex flex-col gap-1">
          <span className="text-[#6b7280] text-[10px] tracking-widest uppercase">
            Total Carbon Offset
          </span>
          <span className="text-[#1a1c19] font-['Liberation_Mono',monospace] font-bold text-[18px] leading-tight">
            Saved {carbonOffset.toFixed(1)} kg CO2e
          </span>
          <span className="text-[#25521f] text-[11px] italic">
            Equivalent to planting {equivalentTrees} {equivalentTrees === 1 ? "tree" : "trees"}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-[#6b7280]">
          <span>Progress to Eco Guard</span>
          <span>{target.toLocaleString()} pts</span>
        </div>
        <div className="h-2 bg-[#e2e3de] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#25521f] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
