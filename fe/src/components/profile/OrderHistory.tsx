const orders = [
  { id: "#GL-9402", date: "Oct 12, 2024", price: "2,000,000 VND", pts: "+120 pts", co2e: "CO2e 1.2kg" },
  { id: "#GL-9311", date: "Sep 28, 2024", price: "843,000 VND",   pts: "+45 pts",  co2e: "CO2e 0.4kg" },
  { id: "#GL-9288", date: "Sep 05, 2024", price: "3,744,000 VND", pts: "+210 pts", co2e: "CO2e 2.1kg" },
];

export function OrderHistory() {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[22px] md:text-[28px]">
        Lịch sử mua hàng
      </h2>
      <div className="flex flex-col divide-y divide-[#e2e3de]">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between py-4 gap-3"
          >
            {/* Left: ID + DELIVERED badge + CO2e tag + date */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#1a1c19] text-[14px] font-['Nimbus_Sans',sans-serif] font-bold">
                  {order.id}
                </span>
                <span className="bg-[#d4eddb] text-[#1e5e2e] text-[10px] px-2 py-0.5 rounded-sm tracking-wide uppercase">
                  DELIVERED
                </span>
                <span className="bg-[#f0f0eb] text-[#6b7280] text-[11px] px-2 py-0.5 rounded-sm">
                  {order.co2e}
                </span>
              </div>
              <span className="text-[#6b7280] text-[12px]">{order.date}</span>
            </div>

            {/* Right: price on top, pts below */}
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <span className="text-[#1a1c19] text-[14px] font-['Nimbus_Sans',sans-serif] font-bold">
                {order.price}
              </span>
              <span className="text-[#25521f] text-[12px]">{order.pts}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="cursor-pointer flex items-center justify-center gap-1 text-[#25521f] text-[13px] tracking-widest uppercase self-center hover:underline transition-all py-2">
        VIEW ALL ORDERS
        <span className="text-base leading-none">→</span>
      </button>
    </section>
  );
}
