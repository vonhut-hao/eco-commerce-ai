import { useState } from "react";
import { Leaf, TrendingDown, Award, BarChart2, ShoppingBag, Droplets, Wind, TreePine } from "lucide-react";

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
  { name: "Personal Care", co2: 0.85, pct: 26, color: "#3d6b35" },
  { name: "Home & Kitchen", co2: 0.72, pct: 22, color: "#5a8a51" },
  { name: "Fashion",        co2: 0.60, pct: 18, color: "#78a86e" },
  { name: "Food & Beverage",co2: 0.58, pct: 18, color: "#96c690" },
  { name: "Other",          co2: 0.52, pct: 16, color: "#b5e0b0" },
];

const ECO_MILESTONES = [
  { label: "Eco Starter",  req: 0,    pts: 0,    icon: "🌱" },
  { label: "Green Friend", req: 500,  pts: 500,  icon: "🌿" },
  { label: "Green Champion",req: 1000,pts: 1000, icon: "🌳" },
  { label: "Eco Guard",    req: 3000, pts: 3000, icon: "🏆" },
];

function StatCard({ icon: Icon, label, value, sub, color = "#25521f" }: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  color?: string;
}) {
  return (
    <div className="bg-white border border-[#e2e3de] rounded-xl p-5 flex flex-col gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon size={20} style={{ color }} strokeWidth={1.8} />
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

function MonthlyCarbonChart() {
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
                <span className="text-[#1a1c19] text-[11px]">{cat.pct}%</span>
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

function MilestoneTracker() {
  const currentPts = 1250;
  const currentIdx = ECO_MILESTONES.filter((m) => currentPts >= m.req).length - 1;
  const next = ECO_MILESTONES[currentIdx + 1];
  const pct = next ? Math.round(((currentPts - ECO_MILESTONES[currentIdx].req) / (next.req - ECO_MILESTONES[currentIdx].req)) * 100) : 100;

  return (
    <div className="bg-white border border-[#e2e3de] rounded-xl p-5 flex flex-col gap-5">
      <div>
        <h3 className="text-[#1a1c19] text-[16px]" style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}>
          Hành trình Eco
        </h3>
        <p className="text-[#6b7280] text-[12px]">Tích lũy điểm xanh để mở cấp bậc mới</p>
      </div>

      {/* Milestone steps */}
      <div className="flex items-center gap-0">
        {ECO_MILESTONES.map((m, i) => {
          const done = currentPts >= m.req;
          const active = i === currentIdx;
          return (
            <div key={m.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[18px] transition-all ${
                  done ? "bg-[#f0f7ee] ring-2 ring-[#25521f]" : "bg-[#f5f5f0] opacity-50"
                }`}>
                  {m.icon}
                </div>
                <span className={`text-[9px] text-center leading-tight max-w-[60px] ${active ? "text-[#25521f]" : "text-[#6b7280]"}`}>
                  {m.label}
                </span>
                {m.req > 0 && (
                  <span className="text-[9px] text-[#9ca3af]">{m.req.toLocaleString()} pts</span>
                )}
              </div>
              {i < ECO_MILESTONES.length - 1 && (
                <div className="flex-1 h-0.5 mb-6 mx-1" style={{ background: currentPts >= ECO_MILESTONES[i + 1].req ? "#25521f" : "#e2e3de" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress to next */}
      {next && (
        <div className="flex flex-col gap-2 bg-[#f7faf5] rounded-lg p-3">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#42493e]">Tiến độ đến <span className="text-[#25521f]">{next.label}</span></span>
            <span className="text-[#6b7280]">{currentPts.toLocaleString()} / {next.req.toLocaleString()} pts</span>
          </div>
          <div className="h-2 bg-[#e2e3de] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#3d6b35] to-[#6db85f] rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[#25521f] text-[11px]">Còn {(next.req - currentPts).toLocaleString()} điểm nữa để lên cấp {next.icon}</p>
        </div>
      )}
    </div>
  );
}

function EcoTips({ onNavigate }: { onNavigate: (p: string) => void }) {
  const tips = [
    { icon: "🛒", title: "Mua sản phẩm Carbon thấp", desc: "Ưu tiên sản phẩm có carbon index < 0.3kg/đơn vị", action: "Khám phá", page: "shop" },
    { icon: "♻️", title: "Chọn bao bì tái chế", desc: "Tìm sản phẩm có chứng nhận BIODEGRADABLE hoặc ZERO PLASTIC", action: "Lọc ngay", page: "shop" },
    { icon: "🌱", title: "Tích lũy Green Points", desc: "Mỗi giao dịch đều tích điểm — lên cấp để nhận ưu đãi đặc biệt", action: "Xem profile", page: "profile" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[#1a1c19] text-[18px]" style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}>
        Gợi ý cải thiện tác động
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip) => (
          <div key={tip.title} className="bg-white border border-[#e2e3de] rounded-xl p-5 flex flex-col gap-3">
            <span className="text-[28px]">{tip.icon}</span>
            <div className="flex flex-col gap-1 flex-1">
              <p className="text-[#1a1c19] text-[14px]" style={{ fontFamily: "'Nimbus Sans', sans-serif", fontWeight: 700 }}>
                {tip.title}
              </p>
              <p className="text-[#6b7280] text-[12px] leading-[18px]">{tip.desc}</p>
            </div>
            <button
              onClick={() => onNavigate(tip.page)}
              className="text-[#25521f] text-[12px] tracking-widest uppercase border border-[#25521f] px-4 py-2 rounded-full hover:bg-[#f0f7ee] transition-colors self-start"
            >
              {tip.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ImpactPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const totalCO2 = 10.4;
  const avgVN = 3.5;
  const pctBetter = Math.round((1 - totalCO2 / (avgVN * 7)) * 100);

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
                {totalCO2}
              </span>
              <span className="text-[#42493e] text-[18px]">kg CO₂e</span>
            </div>
            <p className="text-[#25521f] text-[13px] italic">
              Tương đương trồng {Math.ceil(totalCO2 / 5)} cây xanh 🌳
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-[320px]">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#25521f]">Với GreenLife: {totalCO2} kg</span>
              </div>
              <div className="h-3 bg-[#25521f]/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#25521f] rounded-full" style={{ width: `${Math.min((totalCO2 / (avgVN * 7)) * 100, 100)}%` }} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#6b5d3f]">Người dùng thông thường: {(avgVN * 7).toFixed(1)} kg</span>
              </div>
              <div className="h-3 bg-[#6b5d3f]/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#6b5d3f] rounded-full w-full" />
              </div>
            </div>
            <p className="text-[#25521f] text-[13px]">
              Bạn thải ít hơn {pctBetter}% so với trung bình!
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={TrendingDown} label="CO₂ tiết kiệm" value={`${totalCO2} kg`} sub="CO₂e tổng cộng" />
          <StatCard icon={Award}       label="Green Points"   value="1,250"              sub="pts tích lũy"    color="#6b5d3f" />
          <StatCard icon={ShoppingBag} label="Đơn hàng Xanh"  value="3"                 sub="giao dịch"       color="#3d6b35" />
          <StatCard icon={TreePine}    label="Cây tương đương" value={`${Math.ceil(totalCO2 / 5)}`} sub="cây đã trồng"  color="#2e7d32" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <MonthlyCarbonChart />
          <CategoryBreakdown />
        </div>

        {/* Milestone tracker */}
        <MilestoneTracker />

        {/* Eco tips */}
        <EcoTips onNavigate={onNavigate} />

      </div>
    </main>
  );
}
