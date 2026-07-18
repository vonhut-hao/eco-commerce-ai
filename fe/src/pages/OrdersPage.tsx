import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { orderService, OrderResponse } from "@/services/order.service";
import { authService } from "@/services/auth.service";
import { formatImageUrl } from "@/utils/image";
import { Loader2, ShoppingBag, ChevronDown, ChevronUp, PackageCheck } from "lucide-react";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const userId = authService.getUserId();
    if (!userId) {
      navigate("/signin");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.listOrders();
      setOrders(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load orders history");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-[#25521f]" size={40} />
        <p className="text-sm text-[#42493e]">Loading orders history...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-16 py-8 bg-[#fafaf5]">
      <h1 className="text-3xl font-['Nimbus_Sans',sans-serif] font-bold text-[#1a1c19] mb-8">
        Your Order History
      </h1>

      {error ? (
        <div className="text-center py-12 bg-white border border-[#c2c9bb] rounded-md p-6">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-[#25521f] text-white rounded-sm text-sm hover:bg-[#1a1c19] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#c2c9bb] rounded-md p-8 flex flex-col items-center">
          <ShoppingBag size={48} className="text-[#c2c9bb] mb-4" />
          <p className="text-lg font-semibold text-[#42493e] mb-2">No orders placed yet.</p>
          <p className="text-sm text-[#737b6c] mb-6 max-w-sm">
            Once you make a purchase, your orders list and tracking status will show up here.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#25521f] text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#1a1c19] transition-colors cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <div
                key={order.id}
                className="bg-white border border-[#c2c9bb] rounded-md overflow-hidden"
              >
                {/* Order Summary Header */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-[#eff2eb] flex items-center justify-center text-[#25521f]">
                      <PackageCheck size={20} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#1a1c19]">Order #{order.id}</span>
                      <span className="text-xs text-[#737b6c] block mt-0.5">
                        Status:{" "}
                        <span
                          className={`font-semibold capitalize ${
                            order.status === "COMPLETED"
                              ? "text-[#25521f]"
                              : order.status === "PENDING"
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}
                        >
                          {order.status.toLowerCase()}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-end md:self-auto">
                    <div className="text-right">
                      <span className="text-xs text-[#737b6c] block">Total Amount</span>
                      <span className="text-sm font-bold text-[#25521f]">
                        {order.totalAmount.toLocaleString("vi-VN")} VND
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Details Section */}
                {isExpanded && (
                  <div className="border-t border-[#c2c9bb]/40 bg-[#fafaf5]/40 p-4 md:p-6">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#42493e] mb-4">
                      Items In Order
                    </h4>
                    <div className="flex flex-col gap-4">
                      {order.orderItems?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm text-[#42493e]"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-white border border-[#c2c9bb]/35 rounded-sm p-1.5 flex items-center justify-center">
                              <img
                                src={formatImageUrl(item.mainImage) || "/placeholder-product.png"}
                                alt={item.productName}
                                className="object-contain max-h-full max-w-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200";
                                }}
                              />
                            </div>
                            <div>
                              <span className="font-bold text-[#1a1c19] line-clamp-1">
                                {item.productName}
                              </span>
                              <span className="text-xs text-[#737b6c]">
                                Quantity: {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-[#1a1c19]">
                              {item.price.toLocaleString("vi-VN")} VND
                            </span>
                            <span className="text-[10px] text-[#25521f] block font-semibold mt-0.5">
                              Saved {item.lineCarbonFootprint.toFixed(1)}kg CO2
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
