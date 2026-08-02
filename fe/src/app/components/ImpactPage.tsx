import { useState, useEffect } from "react";
import {
  Leaf, TrendingDown, Award, BarChart2, ShoppingBag,
  TreePine, Sprout, RefreshCw, ChevronRight, Wind,
  Star, Zap, Shield, Trophy,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { profileApi, UserProfileResponse } from "../../api/profile";
import { ordersApi, OrderResponse } from "../../api/orders";

// ─── Tier System (shared logic — must match ProfilePage) ──────────────────────
export const ECO_TIERS = [
  { label: "Eco Starter",    req: 0,    Icon: Sprout,  color: "#6b7280", bg: "#f3f4f6" },
  { label: "Green Friend",   req: 500,  Icon: Leaf,    color: "#3d6b35", bg: "#e8f5e4" },
  { label: "Green Champion", req: 1000, Icon: Star,    color: "#6b5d3f", bg: "#f5edd4" },
  { label: "Eco Guard",      req: 3000, Icon: Shield,  color: "#1a4f8a", bg: "#ddeeff" },
  { label: "Eco Legend",     req: 10000, Icon: Trophy, color: "#7c3aed", bg: "#f3e8ff" },
];

export function getTier(pts: number) {
  return [...ECO_TIERS].reverse().find((t) => pts >= t.req) ?? ECO_TIERS[0];
}

// ─── Chart / breakdown data (mock, would come from API) ──────────────────────
const MONTHLY_DATA = [
  { month: "T2", co2: 0.8, pts: 80 },
  { month: "T3", co2: 1.2, pts: 120 },
  { month: "T4", co2: 0.6, pts: 60 },
  { month: "T5", co2: 1.8, pts: 180 },
  { month: "T6", co2: 2.4, pts: 240 },
  { month: "T7", co2: 1.5, pts: 150 },
  { month: "T8", co2: 2.1, pts: 210 },
];

const CATEGORY_IMPACT = [
  { name: "Personal Care",   co2: 0.85, pct: 26, color: "#3d6b35" },
  { name: "Home & Kitchen",  co2: 0.72, pct: 22, color: "#5a8a51" },
  { name: "Fashion",         co2: 0.60, pct: 18, color: "#78a86e" },
  { name: "Food & Beverage", co2: 0.58, pct: 18, color: "#96c690" },
  { name: "Other",           co2: 0.52, pct: 16, color: "#b5e0b0" },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = "#25521f" }: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  color?: string;
}) {
  return (
    <div className="bg-white border border-[#e2e3de] rounded-xl p-5 flex flex-col gap-3">
      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon size={18} style={{ color }} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-[#6b7280] text-[11px] tracking-widest uppercase mb-1">{label}</p>
        <p className="text-[#1a1c19] text-[24px] leading-tight" style={{ fontFamily: "'Liberation Mono', monospace", fontWeight: 700 }}>
          {value}
        </p>
        <p className="text-[#6b7280] text-[12px] mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ─── Monthly Chart ────────────────────────────────────────────────────────────
function MonthlyCarbonChart() {
  // Mock data for the chart. In a real app, this would be `savedCO2` per month.
  const max = Math.max(...MONTHLY_DATA.map((d) => d.co2));
  return (
    <div className="bg-white border border-[#e2e3de] rounded-xl p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-[#1a1c19] text-[16px]" style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}>
          CO₂ tiết kiệm theo tháng
        </h3>
        <p className="text-[#6b7280] text-[12px]">kg CO₂e / tháng</p>
      </div>
      <div className="flex items-end gap-2 h-[120px]">
        {MONTHLY_DATA.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-[#42493e]">{d.co2}</span>
            <div
              className="w-full rounded-t-sm bg-gradient-to-t from-[#3d6b35] to-[#6db85f] min-h-[4px]"
              style={{ height: `${(d.co2 / max) * 90}px` }}
            />
            <span className="text-[10px] text-[#6b7280]">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-[#e2e3de] pt-3 flex items-center justify-between">
        <span className="text-[#6b7280] text-[12px]">Tổng 7 tháng:</span>
        <span className="text-[#25521f] text-[14px]" style={{ fontFamily: "'Liberation Mono', monospace", fontWeight: 700 }}>
          {MONTHLY_DATA.reduce((s, d) => s + d.co2, 0).toFixed(1)} kg CO₂e
        </span>
      </div>
    </div>
  );
}

// ─── Category Breakdown ───────────────────────────────────────────────────────
function CategoryBreakdown() {
  return (
    <div className="bg-white border border-[#e2e3de] rounded-xl p-5 flex flex-col gap-4">
      <h3 className="text-[#1a1c19] text-[16px]" style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}>
        Tác động theo danh mục
      </h3>
      <div className="flex flex-col gap-3">
        {CATEGORY_IMPACT.map((cat) => (
          <div key={cat.name} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[#42493e] text-[13px]">{cat.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280] text-[11px]">{cat.co2} kg CO₂</span>
                <span className="text-[#1a1c19] text-[11px] font-medium">{cat.pct}%</span>
              </div>
            </div>
            <div className="h-2 bg-[#f0f0eb] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${cat.pct}%`, background: cat.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Milestone Tracker ────────────────────────────────────────────────────────
function MilestoneTracker({ currentPts }: { currentPts: number }) {
  const currentTier = getTier(currentPts);
  const currentIdx = ECO_TIERS.findIndex((t) => t.label === currentTier.label);
  const next = ECO_TIERS[currentIdx + 1];
  const pct = next
    ? Math.round(((currentPts - ECO_TIERS[currentIdx].req) / (next.req - ECO_TIERS[currentIdx].req)) * 100)
    : 100;

  return (
    <div className="bg-white border border-[#e2e3de] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#e2e3de] flex items-center justify-between">
        <div>
          <h3 className="text-[#1a1c19] text-[16px]" style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}>
            Hành trình Eco
          </h3>
          <p className="text-[#6b7280] text-[12px]">Tích lũy điểm xanh để mở cấp bậc mới</p>
        </div>
        {/* Current tier badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
          style={{ background: currentTier.bg, color: currentTier.color }}
        >
          <currentTier.Icon size={13} strokeWidth={2} />
          {currentTier.label}
        </div>
      </div>

      {/* Tier steps */}
      <div className="px-5 py-5">
        <div className="flex items-start gap-0">
          {ECO_TIERS.map((tier, i) => {
            const done = currentPts >= tier.req;
            const active = tier.label === currentTier.label;
            const TierIcon = tier.Icon;
            return (
              <div key={tier.label} className={i < ECO_TIERS.length - 1 ? "flex items-start flex-1" : "flex items-start"}>
                <div className="flex flex-col items-center gap-1.5 shrink-0 z-10" style={{ width: "48px" }}>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      done
                        ? active
                          ? "ring-2 ring-offset-1 scale-110"
                          : ""
                        : "opacity-30"
                    }`}
                    style={done ? { background: tier.bg, ringColor: tier.color } : { background: "#f5f5f0" }}
                  >
                    <TierIcon
                      size={16}
                      strokeWidth={2}
                      style={{ color: done ? tier.color : "#9ca3af" }}
                    />
                  </div>
                  <span
                    className="text-[9px] text-center leading-tight mt-1"
                    style={{ color: active ? currentTier.color : done ? "#42493e" : "#9ca3af" }}
                  >
                    {tier.label}
                  </span>
                  {tier.req > 0 && (
                    <span className="text-[9px] text-[#b0b7b0]">{tier.req >= 1000 ? `${tier.req / 1000}k` : tier.req} pts</span>
                  )}
                </div>
                {i < ECO_TIERS.length - 1 && (
                  <div
                    className="flex-1 h-[2px] mt-[17px] -mx-2 z-0"
                    style={{ background: currentPts >= ECO_TIERS[i + 1].req ? "#3d6b35" : "#e2e3de" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress to next */}
        {next && (
          <div className="mt-4 flex flex-col gap-2 bg-[#f7faf5] rounded-lg p-3">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#42493e]">
                Tiến độ đến <span style={{ color: next.color, fontWeight: 600 }}>{next.label}</span>
              </span>
              <span className="text-[#6b7280]">{currentPts.toLocaleString()} / {next.req.toLocaleString()} pts</span>
            </div>
            <div className="h-2 bg-[#e2e3de] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: `linear-gradient(to right, #3d6b35, #6db85f)` }}
              />
            </div>
            <p className="text-[12px]" style={{ color: next.color }}>
              Còn {(next.req - currentPts).toLocaleString()} điểm nữa để đạt <strong>{next.label}</strong>
            </p>
          </div>
        )}
        {!next && (
          <div className="mt-4 bg-[#f3e8ff] rounded-lg p-3 text-center">
            <p className="text-[#7c3aed] text-[13px] font-medium">Bạn đã đạt cấp bậc cao nhất!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Eco Tips ─────────────────────────────────────────────────────────────────
function EcoTips({ onNavigate }: { onNavigate: (p: string, id?: number, cat?: string, search?: string, extra?: any) => void }) {
  const tips = [
    { Icon: ShoppingBag, title: "Mua sản phẩm Carbon thấp", desc: "Ưu tiên sản phẩm có carbon index < 0.3kg/đơn vị", action: "Khám phá", page: "shop", extra: { carbon: "low" } },
    { Icon: RefreshCw,   title: "Chọn bao bì tái chế",      desc: "Tìm sản phẩm có chứng nhận BIODEGRADABLE hoặc ZERO PLASTIC", action: "Lọc ngay", page: "shop", extra: { certs: ["BIODEGRADABLE", "ZERO PLASTIC"] } },
    { Icon: Sprout,      title: "Tích lũy Green Points",     desc: "Mỗi giao dịch đều tích điểm — lên cấp để nhận ưu đãi đặc biệt", action: "Xem profile", page: "profile" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[#1a1c19] text-[18px]" style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}>
        Gợi ý cải thiện tác động
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip) => {
          const Icon = tip.Icon;
          return (
            <div key={tip.title} className="bg-white border border-[#e2e3de] rounded-xl p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f0f7ee] flex items-center justify-center">
                <Icon size={18} className="text-[#25521f]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-[#1a1c19] text-[14px]" style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}>
                  {tip.title}
                </p>
                <p className="text-[#6b7280] text-[12px] leading-[18px]">{tip.desc}</p>
              </div>
              <button
                onClick={() => tip.extra ? onNavigate(tip.page, undefined, undefined, undefined, tip.extra) : onNavigate(tip.page)}
                className="text-[#25521f] text-[12px] tracking-widest uppercase border border-[#25521f] px-4 py-2 rounded-full hover:bg-[#f0f7ee] transition-colors self-start"
              >
                {tip.action}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function ImpactPage({ onNavigate }: { onNavigate: (p: string, id?: number, cat?: string, search?: string, extra?: any) => void }) {
  const user = useAuthStore(s => s.user);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  useEffect(() => {
    if (user?.id) {
      profileApi.getProfile(user.id).then(setProfile).catch(console.error);
      ordersApi.getOrders().then(setOrders).catch(console.error);
    }
  }, [user?.id]);

  const totalCO2   = profile?.totalCarbonIndex ? Number(profile.totalCarbonIndex.toFixed(1)) : 0;
  // Assume a typical non-eco product emits 2.5x more CO2
  // If totalCO2 is 0 (no purchases), saved is 0.
  const standardCO2 = Number((totalCO2 * 2.5).toFixed(1));
  const savedCO2 = Number((standardCO2 - totalCO2).toFixed(1));
  const greenPts   = profile?.greenPoints || 0;
  const ordersCount = orders.length;
  const pctBetter = standardCO2 > 0 ? Math.round((savedCO2 / standardCO2) * 100) : 0;
  const tier = getTier(greenPts);

  return (
    <main className="flex-1 pb-20 md:pb-0">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-8 md:py-12 flex flex-col gap-8">

        {/* Page header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <BarChart2 size={20} className="text-[#25521f]" strokeWidth={1.8} />
            <span className="text-[#6b7280] text-[11px] tracking-widest uppercase">Bảng điều khiển</span>
          </div>
          <h1 className="text-[#1a1c19] text-[28px] md:text-[36px] leading-tight" style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}>
            Tác động Môi trường của Bạn
          </h1>
          <p className="text-[#42493e] text-[15px] max-w-[560px]">
            Mỗi sản phẩm xanh bạn mua đều có ý nghĩa. Dưới đây là hành trình eco của bạn với GreenLife.
          </p>
        </div>

        {/* Hero comparison banner */}
        <div className="bg-gradient-to-r from-[#e7f2e1] via-[#eef6e9] to-[#d7edcd] border border-[#cfe0c4] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-[#42493e] text-[12px] tracking-widest uppercase">CO₂ bạn ĐÃ tiết kiệm được</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[#1a1c19] text-[48px] md:text-[56px] leading-none" style={{ fontFamily: "'Liberation Mono', monospace", fontWeight: 700 }}>
                {savedCO2}
              </span>
              <span className="text-[#42493e] text-[18px]">kg CO₂e</span>
            </div>
            <p className="text-[#25521f] text-[13px]">
              Tương đương trồng {Math.ceil(savedCO2 / 5)} cây xanh
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-[320px]">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#6b5d3f]">Phát thải nếu dùng đồ thường: {standardCO2} kg</span>
              </div>
              <div className="h-3 bg-[#6b5d3f]/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#6b5d3f] rounded-full w-full" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#25521f]">Phát thải thực tế với GreenLife: {totalCO2} kg</span>
              </div>
              <div className="h-3 bg-[#25521f]/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#25521f] rounded-full" style={{ width: `${standardCO2 > 0 ? (totalCO2 / standardCO2) * 100 : 0}%` }} />
              </div>
            </div>
            <p className="text-[#25521f] text-[13px] mt-1 font-medium">Bạn đã giảm được {pctBetter}% lượng phát thải!</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={TrendingDown} label="CO₂ tiết kiệm"    value={`${savedCO2} kg`}           sub="CO₂e tổng cộng" />
          <StatCard icon={Award}        label="Green Points"      value={greenPts.toLocaleString()}   sub="pts tích lũy"   color="#6b5d3f" />
          <StatCard icon={ShoppingBag}  label="Đơn hàng Xanh"    value={ordersCount.toString()}       sub="giao dịch"      color="#3d6b35" />
          <StatCard icon={TreePine}     label="Cây tương đương"   value={`${Math.ceil(savedCO2 / 5)}`} sub="cây đã trồng" color="#2e7d32" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <MonthlyCarbonChart />
          <CategoryBreakdown />
        </div>

        {/* Milestone tracker */}
        <MilestoneTracker currentPts={greenPts} />

        {/* Eco tips */}
        <EcoTips onNavigate={onNavigate} />

      </div>
    </main>
  );
}
