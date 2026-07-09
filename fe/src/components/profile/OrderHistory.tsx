import { useState, useEffect } from "react";
import { orderService, OrderResponse } from "@/services/order.service";
import { authService } from "@/services/auth.service";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export function OrderHistory() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const userId = authService.getUserId();
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await orderService.listUserOrders(userId);
      setOrders(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[22px] md:text-[28px]">
        Order History
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <Loader2 className="animate-spin text-[#25521f]" size={24} />
          <span className="text-xs text-[#737b6c]">Fetching purchase records...</span>
        </div>
      ) : error ? (
        <div className="text-center py-6 border border-red-200 bg-red-50 rounded-md p-4">
          <p className="text-xs text-red-600 font-semibold">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 border border-[#c2c9bb] bg-white rounded-md p-6">
          <p className="text-sm text-[#737b6c] italic">You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col divide-y divide-[#e2e3de]">
            {paginatedOrders.map((order) => {
              // Calculate points earned (1 point per 20,000 VND)
              const pts = Math.floor(order.totalAmount / 20000);
              // Calculate total carbon footprint saved (sum of item line footprints)
              const co2e = order.orderItems?.reduce((acc, item) => acc + item.lineCarbonFootprint, 0) || 0;

              return (
                <div key={order.id} className="flex items-center justify-between py-4 gap-3">
                  {/* Left: ID + status + CO2e + date */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#1a1c19] text-[14px] font-['Nimbus_Sans',sans-serif] font-bold">
                        Order #{order.id}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-sm tracking-wide uppercase font-semibold ${
                        order.status === "COMPLETED"
                          ? "bg-[#d4eddb] text-[#1e5e2e]"
                          : order.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {order.status}
                      </span>
                      {co2e > 0 && (
                        <span className="bg-[#f0f0eb] text-[#6b7280] text-[11px] px-2 py-0.5 rounded-sm">
                          Saved {co2e.toFixed(1)}kg CO2
                        </span>
                      )}
                    </div>
                    {/* List item summary */}
                    <span className="text-xs text-[#737b6c] max-w-md truncate">
                      {order.orderItems?.map(item => `${item.productName} (x${item.quantity})`).join(", ")}
                    </span>
                  </div>

                  {/* Right: price + points */}
                  <div className="flex flex-col items-end gap-0.5 shrink-0 text-right">
                    <span className="text-[#1a1c19] text-[14px] font-['Nimbus_Sans',sans-serif] font-bold">
                      {order.totalAmount.toLocaleString("vi-VN")} VND
                    </span>
                    <span className="text-[#25521f] text-[12px] font-semibold">+{pts} GP</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 border border-[#c2c9bb] rounded-md text-[#42493e] disabled:opacity-40 hover:bg-[#bcf1ad]/20 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-[#737b6c] font-semibold">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 border border-[#c2c9bb] rounded-md text-[#42493e] disabled:opacity-40 hover:bg-[#bcf1ad]/20 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
