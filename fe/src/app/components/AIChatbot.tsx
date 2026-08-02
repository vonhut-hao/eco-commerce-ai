import { useState, useRef, useEffect } from "react";
import { X, RefreshCw, Send, Leaf, Minus, Headphones } from "lucide-react";
import svgPaths from "../../imports/ProductDetail2/svg-oqupvr7hg1";

interface Message {
  id: string;
  role: "bot" | "user" | "admin";
  content: string;
  time?: string;
}

// ─── AI tab data ─────────────────────────────────────────────────────────────
const LEARN_MORE_RESPONSE = `Thông tin chi tiết về Bamboo Toothbrush Set 🌍

Bamboo vs Nhựa thông thường:
• CO2 thải ra: 0.3kg vs 1.8kg → tiết kiệm 83%
• Thời gian phân hủy: 6 tháng vs 400+ năm
• Nhựa tiết kiệm: ~1.5kg/người/năm

Tay cầm tre thu hoạch bền vững từ rừng Moso, lông bàn chải BPA-free mềm mại, bao bì giấy tái chế 100%.

Bạn có muốn tính toán carbon footprint cá nhân không? 🌿`;

const BOT_RESPONSES: Record<string, string> = {
  default: "Cảm ơn câu hỏi của Anh/Chị! Tôi có thể giúp bạn tìm hiểu thêm về sản phẩm hoặc tác động môi trường. Bạn có câu hỏi gì khác không? 🌿",
  price: "Bamboo Toothbrush Set (Pack of 4) hiện có giá 149.000 VND. Đây là mức giá rất hợp lý so với giá trị môi trường mà sản phẩm mang lại! 💚",
  carbon: "Bamboo Toothbrush chỉ thải ra 0.3kg CO2/sản phẩm, trong khi bàn chải nhựa thông thường thải ra đến 1.8kg CO2. Đó là mức giảm 83% lượng khí thải! 🌍",
  bamboo: "Tre là vật liệu tuyệt vời: kháng khuẩn tự nhiên, phân hủy sinh học 100%, phát triển nhanh không cần thuốc trừ sâu. 🎋",
  shipping: "Chúng tôi giao hàng toàn quốc trong 2–5 ngày làm việc. Đơn hàng trên 200.000 VND được miễn phí vận chuyển! 🚚",
  review: "Sản phẩm được đánh giá 4.8/5 từ 127 khách hàng. Hầu hết đều khen ngợi độ bền, thiết kế và tác động tích cực đến môi trường. ⭐",
  carbon_calc: "Nếu bạn dùng 1 bàn chải/quý = 4 bàn chải/năm.\nVới nhựa: 4 × 1.8kg = 7.2kg CO2/năm\nVới tre: 4 × 0.3kg = 1.2kg CO2/năm\n→ Bạn tiết kiệm 6kg CO2 mỗi năm! 🌱",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("giá") || lower.includes("bao nhiêu")) return BOT_RESPONSES.price;
  if (lower.includes("carbon") || lower.includes("co2") || lower.includes("khí thải")) return BOT_RESPONSES.carbon;
  if (lower.includes("bamboo") || lower.includes("tre")) return BOT_RESPONSES.bamboo;
  if (lower.includes("giao hàng") || lower.includes("ship")) return BOT_RESPONSES.shipping;
  if (lower.includes("đánh giá") || lower.includes("review") || lower.includes("sao")) return BOT_RESPONSES.review;
  if (lower.includes("tính") || lower.includes("footprint") || lower.includes("calc")) return BOT_RESPONSES.carbon_calc;
  return BOT_RESPONSES.default;
}

// ─── Admin tab data ───────────────────────────────────────────────────────────
const ADMIN_RESPONSES: [RegExp, string][] = [
  [/đơn hàng|order/i, "Anh/Chị cho em mã đơn hàng (ví dụ #GL-9402) để em kiểm tra trạng thái nhanh nhất ạ!"],
  [/hoàn tiền|refund|đổi trả/i, "Em hiểu ạ! Chính sách đổi trả của GreenLife là 30 ngày kể từ ngày nhận hàng. Anh/Chị có thể cho em biết lý do đổi/trả để em hỗ trợ cụ thể hơn không ạ?"],
  [/giao hàng|ship|vận chuyển/i, "Thời gian giao hàng tiêu chuẩn là 2–5 ngày làm việc. Đơn hàng trên 200.000 VND miễn phí vận chuyển. Anh/Chị cần kiểm tra đơn hàng cụ thể nào không ạ?"],
  [/mã giảm giá|voucher|coupon|discount/i, "Hiện tại GreenLife đang có chương trình GREENWEEK giảm 15% cho đơn từ 500.000 VND. Anh/Chị muốn em gửi thêm thông tin về các ưu đãi không ạ?"],
  [/sản phẩm|hàng|stock|còn/i, "Em sẽ kiểm tra tình trạng kho cho Anh/Chị ngay ạ! Anh/Chị đang quan tâm đến sản phẩm nào ạ?"],
  [/cảm ơn|thank/i, "Cảm ơn Anh/Chị đã tin tưởng GreenLife! Chúc Anh/Chị một ngày xanh và ý nghĩa 🌿"],
];

function getAdminResponse(input: string): string {
  for (const [pattern, reply] of ADMIN_RESPONSES) {
    if (pattern.test(input)) return reply;
  }
  return "Em đã ghi nhận câu hỏi của Anh/Chị. Đội hỗ trợ sẽ phản hồi trong vòng 5–10 phút trong giờ làm việc (8:00–22:00). Anh/Chị có cần hỗ trợ thêm gì không ạ? 😊";
}

const now = () => new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

const INITIAL_AI: Message[] = [
  { id: "ai-1", role: "bot", content: "Xin chào! Em là trợ lý AI của GreenLife 🌿" },
  { id: "ai-2", role: "bot", content: "Em chuyên tư vấn về chỉ số carbon và tác động môi trường của sản phẩm. Anh/Chị cần hỏi gì ạ?" },
];

const INITIAL_ADMIN: Message[] = [
  { id: "adm-1", role: "admin", content: "Xin chào Anh/Chị! Em là nhân viên hỗ trợ GreenLife 👋", time: now() },
  { id: "adm-2", role: "admin", content: "Em có thể hỗ trợ Anh/Chị về đơn hàng, đổi trả, hoặc bất kỳ thắc mắc nào khác. Anh/Chị cần giúp gì ạ?", time: now() },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function AIChatbot({ openTrigger = 0 }: { openTrigger?: number }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [widgetVisible, setWidgetVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<"ai" | "admin">("ai");

  const [aiMessages, setAiMessages] = useState<Message[]>(INITIAL_AI);
  const [adminMessages, setAdminMessages] = useState<Message[]>(INITIAL_ADMIN);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [idle, setIdle] = useState(false);
  const [hoveringBtn, setHoveringBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleActivity = () => setIdle(true);
    window.addEventListener("scroll", handleActivity, { passive: true });
    window.addEventListener("mousedown", handleActivity);
    return () => {
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, adminMessages, isTyping]);

  useEffect(() => {
    if (openTrigger > 0) {
      setChatOpen(true);
      setWidgetVisible(false);
    }
  }, [openTrigger]);

  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [chatOpen, activeTab]);

  const handleLearnMore = () => {
    setWidgetVisible(false);
    setChatOpen(true);
    setActiveTab("ai");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setAiMessages((prev) => [...prev, { id: Date.now().toString(), role: "bot", content: LEARN_MORE_RESPONSE }]);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const text = input.trim();
    const msgId = Date.now().toString();

    if (activeTab === "ai") {
      setAiMessages((prev) => [...prev, { id: msgId, role: "user", content: text }]);
      setInput("");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setAiMessages((prev) => [...prev, { id: msgId + "r", role: "bot", content: getAIResponse(text) }]);
      }, 800 + Math.random() * 600);
    } else {
      setAdminMessages((prev) => [...prev, { id: msgId, role: "user", content: text, time: now() }]);
      setInput("");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setAdminMessages((prev) => [...prev, { id: msgId + "r", role: "admin", content: getAdminResponse(text), time: now() }]);
      }, 1200 + Math.random() * 800);
    }
  };

  const handleReset = () => {
    if (activeTab === "ai") { setAiMessages(INITIAL_AI); }
    else { setAdminMessages(INITIAL_ADMIN); }
    setIsTyping(false);
  };

  const messages = activeTab === "ai" ? aiMessages : adminMessages;

  return (
    <div className="fixed bottom-[76px] md:bottom-6 right-4 z-50 flex flex-col items-end gap-3">

      {/* Pre-chat widget */}
      {widgetVisible && !chatOpen && (
        <div className="relative bg-[#406767] rounded-2xl p-6 w-[300px] shadow-2xl flex flex-col gap-4">
          <button
            onClick={() => setWidgetVisible(false)}
            className="absolute top-3 right-3 text-[#bae4e3]/70 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
          <div className="flex gap-3 items-start">
            <div className="shrink-0 mt-0.5 text-[#a5cece]">
              <svg width="17" height="17" viewBox="0 0 16.9955 16.9923" fill="none">
                <path d={svgPaths.p12cee600} fill="#A5CECE" />
              </svg>
            </div>
            <p className="text-[#bae4e3] text-[14px] leading-[22px]">
              Bạn có biết chuyển sang bàn chải tre giúp tiết kiệm{" "}
              <span className="font-bold underline">1.5kg nhựa</span> mỗi năm không?
            </p>
          </div>
          <div className="bg-[#274f4f] rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between text-[#bae4e3]/80 text-[11px] uppercase tracking-wider">
              <span>Tác động CO2</span>
              <span>Tiết kiệm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#bae4e3] text-[14px] font-bold">Bamboo vs Nhựa</span>
              <span className="text-[#c1eaea] text-[14px] font-bold">-83%</span>
            </div>
          </div>
          <button
            onClick={handleLearnMore}
            className="bg-[#c1eaea] text-[#002020] py-2 rounded-sm text-center text-[13px] tracking-[0.1em] uppercase font-medium hover:bg-[#a8dada] transition-colors"
          >
            LEARN MORE
          </button>
        </div>
      )}

      {/* Full chat panel */}
      {chatOpen && (
        <div
          className="bg-white rounded-2xl shadow-2xl w-[320px] md:w-[380px] flex flex-col overflow-hidden"
          style={{ height: "500px" }}
        >
          {/* Header */}
          <div className="bg-[#274f4f] px-4 pt-3.5 pb-0 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#c1eaea] flex items-center justify-center shrink-0">
                  <Leaf size={16} className="text-[#274f4f]" />
                </div>
                <span className="text-white text-[15px] font-semibold">GreenLife</span>
              </div>
              <div className="flex gap-0.5">
                <button onClick={handleReset} className="text-white/50 hover:text-white transition-colors p-1.5 rounded" title="Làm mới">
                  <RefreshCw size={14} />
                </button>
                <button onClick={() => setChatOpen(false)} className="text-white/50 hover:text-white transition-colors p-1.5 rounded" title="Thu nhỏ">
                  <Minus size={14} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0">
              {(["ai", "admin"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setIsTyping(false); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] tracking-wide transition-all border-b-2"
                  style={{
                    color: activeTab === tab ? "#c1eaea" : "rgba(193,234,234,0.45)",
                    borderColor: activeTab === tab ? "#c1eaea" : "transparent",
                  }}
                >
                  {tab === "ai"
                    ? <><Leaf size={12} />AI Carbon</>
                    : <><Headphones size={12} />Hỗ trợ</>
                  }
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#fafafa]">
            {/* Admin status bar */}
            {activeTab === "admin" && (
              <div className="flex items-center gap-2 bg-[#f0f7ee] rounded-xl px-3 py-2 border border-[#dde8d8]">
                <div className="w-2 h-2 rounded-full bg-[#25521f] shrink-0" />
                <span className="text-[#25521f] text-[11px]">Nhân viên hỗ trợ đang trực tuyến</span>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isAdmin = msg.role === "admin";
              return (
                <div key={msg.id} className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"} items-end`}>
                  {!isUser && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: isAdmin ? "#e8f5e4" : "#c1eaea" }}
                    >
                      {isAdmin
                        ? <Headphones size={12} className="text-[#25521f]" />
                        : <Leaf size={12} className="text-[#274f4f]" />
                      }
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5" style={{ maxWidth: "78%", alignItems: isUser ? "flex-end" : "flex-start" }}>
                    <div
                      className="px-3 py-2.5 text-[13px] leading-relaxed whitespace-pre-line"
                      style={{
                        background: isUser ? "#25521f" : "#fff",
                        color: isUser ? "#fff" : "#1a1c19",
                        borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                        border: isUser ? "none" : "1px solid #eef2eb",
                      }}
                    >
                      {msg.content}
                    </div>
                    {msg.time && !isUser && (
                      <span className="text-[10px] text-[#9ca3af] px-1">{msg.time}</span>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 items-end">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: activeTab === "admin" ? "#e8f5e4" : "#c1eaea" }}
                >
                  {activeTab === "admin"
                    ? <Headphones size={12} className="text-[#25521f]" />
                    : <Leaf size={12} className="text-[#274f4f]" />
                  }
                </div>
                <div className="bg-white border border-[#eef2eb] px-4 py-3 flex gap-1.5 items-center" style={{ borderRadius: "4px 18px 18px 18px" }}>
                  {[0, 160, 320].map((d) => (
                    <div key={d} className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#eef2eb] bg-white px-4 py-3 shrink-0">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={activeTab === "ai" ? "Hỏi về carbon, sản phẩm..." : "Nhập tin nhắn hỗ trợ..."}
                className="flex-1 text-[13px] text-gray-700 outline-none placeholder-gray-400 bg-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="text-gray-300 hover:text-[#274f4f] transition-colors disabled:opacity-30"
              >
                <Send size={17} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center leading-tight">
              {activeTab === "ai"
                ? "Thông tin AI chỉ mang tính tham khảo"
                : "Hỗ trợ trực tuyến 8:00 – 22:00 hàng ngày"
              }
            </p>
          </div>
        </div>
      )}

      {/* Floating button — shrinks when idle, expands on hover or when chat is open */}
      {(() => {
        const shrink = idle && !chatOpen && !widgetVisible && !hoveringBtn;
        return (
          <button
            onClick={() => {
              if (chatOpen) { setChatOpen(false); }
              else { setWidgetVisible((v) => !v); }
            }}
            onMouseEnter={() => setHoveringBtn(true)}
            onMouseLeave={() => setHoveringBtn(false)}
            aria-label="Chat GreenLife"
            style={{
              width: shrink ? "12px" : "56px",
              height: shrink ? "12px" : "56px",
              borderRadius: shrink ? "50%" : "12px",
              opacity: shrink ? 0.55 : 1,
              transform: shrink ? "translateX(8px)" : "translateX(0)",
              overflow: "hidden",
              transition: "width 300ms ease, height 300ms ease, border-radius 300ms ease, opacity 300ms ease, transform 300ms ease",
              background: "#274f4f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: shrink ? "0 2px 8px rgba(0,0,0,0.2)" : "0 8px 24px rgba(0,0,0,0.25)",
              flexShrink: 0,
              cursor: "pointer",
              border: "none",
            }}
          >
            <span
              style={{
                opacity: shrink ? 0 : 1,
                transition: "opacity 200ms ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {chatOpen || widgetVisible ? (
                <svg width="18.667" height="18.667" viewBox="0 0 18.6667 18.6667" fill="none">
                  <path d={svgPaths.p2e1eae40} fill="white" />
                </svg>
              ) : (
                <Leaf size={24} color="white" />
              )}
            </span>
          </button>
        );
      })()}
    </div>
  );
}
