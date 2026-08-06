import { useState, useRef, useEffect } from "react";
import { X, RefreshCw, Send, Leaf, Minus, Headphones, Image as ImageIcon, Loader2 } from "lucide-react";
import svgPaths from "../../imports/ProductDetail2/svg-oqupvr7hg1";
import { chatWithAi, createOrGetConversation, getMessagesByConversation, sendMessage as sendLiveMessage, ChatMessage as ApiChatMessage } from "../../api/chat";
import { Client } from "@stomp/stompjs";
import { useAuthStore } from "../../store/authStore";
import imageCompression from 'browser-image-compression';
import { profileApi } from "../../api/profile";

interface Message {
  id: string;
  role: "bot" | "user" | "admin";
  content: string;
  time?: string;
  fileUrl?: string;
}

// ─── AI tab data ─────────────────────────────────────────────────────────────
const LEARN_MORE_RESPONSE = `Detailed information about Bamboo Toothbrush Set 🌍

Bamboo vs Regular Plastic:
• Emitted CO2: 0.3kg vs 1.8kg → 83% saved
• Decomposition time: 6 months vs 400+ years
• Plastic saved: ~1.5kg/person/year

Sustainably harvested bamboo handle from Moso forest, soft BPA-free bristles, 100% recycled paper packaging.

Would you like to calculate your personal carbon footprint? 🌿`;

// Removed mock getAIResponse and getAdminResponse

const now = () => new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

function formatTime(val: any) {
  if (!val) return ''
  try {
    let d: Date
    if (Array.isArray(val)) {
      d = new Date(val[0], val[1] - 1, val[2], val[3], val[4], val[5] || 0)
    } else {
      d = new Date(val)
    }
    if (isNaN(d.getTime())) return ''
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  } catch(e) {
    return ''
  }
}

const INITIAL_AI: Message[] = [
  { id: "ai-1", role: "bot", content: "Hello! I am the AI assistant for GreenLife 🌿" },
  { id: "ai-2", role: "bot", content: "I specialize in consulting on carbon indices and environmental impacts of products. How can I help you?" },
];

const INITIAL_ADMIN: Message[] = [
  { id: "adm-1", role: "admin", content: "Hello! I am a GreenLife support agent 👋", time: now() },
  { id: "adm-2", role: "admin", content: "I can assist you with orders, returns, or any other inquiries. How can I help you?", time: now() },
];

const renderMarkdown = (text: string) => {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (trimmed === '---') {
      return <hr key={i} className="my-3 border-t border-[#e2e3de]" />;
    }

    let isHeading = false;
    let isBullet = false;
    let lineContent = line;

    if (trimmed.startsWith('### ')) {
      isHeading = true;
      lineContent = trimmed.substring(4);
    } else if (trimmed.startsWith('## ')) {
      isHeading = true;
      lineContent = trimmed.substring(3);
    } else if (trimmed.startsWith('# ')) {
      isHeading = true;
      lineContent = trimmed.substring(2);
    } else if (trimmed.match(/^(\d+\.|-|\*)\s/)) {
      isBullet = true;
      lineContent = trimmed.replace(/^(\d+\.|-|\*)\s/, '');
    }
    
    const parsedLine = lineContent.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={j} className="italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });

    if (isHeading) {
      return (
        <div key={i} className="font-bold text-[14px] mt-2 mb-1 text-[#1a1c19]">
          {parsedLine}
        </div>
      );
    }

    if (isBullet) {
      return (
        <li key={i} className="ml-4 list-disc marker:text-[#274f4f] mt-1">
          {parsedLine}
        </li>
      );
    }

    return (
      <span key={i}>
        {parsedLine}
        <br />
      </span>
    );
  });
};

export type ChatbotIntent = {
  triggerId: number;
  mode?: "ai" | "admin";
  autoSendPrompt?: string;
  prefillMessage?: string;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function AIChatbot({ chatIntent, activeProductId }: { chatIntent?: ChatbotIntent; activeProductId?: number | null }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "admin">("ai");

  const [aiMessages, setAiMessages] = useState<Message[]>(INITIAL_AI);
  const [adminMessages, setAdminMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { user } = useAuthStore();
  const [conversationId, setConversationId] = useState<number | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === "admin" && user) {
      if (user.roles?.includes("ADMIN") || user.roles?.includes("ROLE_ADMIN")) {
        setAdminMessages([{ id: "admin-sys", role: "admin", content: "You are logged in with an Admin account. This chat window is for customers. Please log in with a User account to test or go to the Admin Dashboard.", time: now() }]);
        return;
      }

      let active = true;
      createOrGetConversation(user.id).then(conv => {
        if (!active) return;
        setConversationId(conv.id);
        getMessagesByConversation(conv.id, user.id).then(msgs => {
          if (!active) return;
          const mapped: Message[] = msgs.map(m => ({
            id: m.id.toString(),
            role: m.senderId === user.id ? "user" : "admin",
            content: m.content,
            time: formatTime(m.createdAt),
            fileUrl: m.fileUrl
          }));
          setAdminMessages(mapped);
        });

        const client = new Client({
          brokerURL: 'ws://localhost:8080/ws',
          onConnect: () => {
            client.subscribe(`/topic/conversation/${conv.id}`, (msg) => {
              const newMsg: ApiChatMessage = JSON.parse(msg.body);
              setAdminMessages(prev => {
                if (prev.find(m => m.id === newMsg.id.toString())) return prev;
                
                // If the message is from us, try to replace the optimistic tmp message
                if (newMsg.senderId === user.id) {
                  const tmpIndex = prev.findIndex(m => m.role === "user" && m.id.length > 10 && m.content === newMsg.content);
                  if (tmpIndex !== -1) {
                    const copy = [...prev];
                    copy[tmpIndex] = {
                      id: newMsg.id.toString(),
                      role: "user",
                      content: newMsg.content,
                      time: formatTime(newMsg.createdAt),
                      fileUrl: newMsg.fileUrl
                    };
                    return copy;
                  }
                }

                return [...prev, {
                  id: newMsg.id.toString(),
                  role: newMsg.senderId === user.id ? "user" : "admin",
                  content: newMsg.content,
                  time: formatTime(newMsg.createdAt),
                  fileUrl: newMsg.fileUrl
                }];
              });
            });
          },
        });
        client.activate();
        stompClientRef.current = client;
      }).catch(() => {
        if (active) {
          setAdminMessages([{ id: "err", role: "admin", content: "Connection error or you are not logged in.", time: now() }]);
        }
      });

      return () => {
        active = false;
        stompClientRef.current?.deactivate();
      };
    }
  }, [activeTab, user]);

  const [scrolled, setScrolled] = useState(false);
  const [hoveringBtn, setHoveringBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, adminMessages, isTyping]);



  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [chatOpen, activeTab]);



  const handleSend = async (customText?: string, imageUrl?: string, overrideTab?: "ai" | "admin") => {
    const text = customText !== undefined ? customText : input.trim();
    if ((!text && !imageUrl) || isTyping) return;
    
    const msgId = Date.now().toString();
    const currentTab = overrideTab || activeTab;

    if (currentTab === "ai") {
      setAiMessages((prev) => [...prev, { id: msgId, role: "user", content: text }]);
      setInput("");
      setIsTyping(true);

      const productId = activeProductId || undefined;

      try {
        const res = await chatWithAi({ message: text, productId });
        setAiMessages((prev) => [...prev, { id: msgId + "r", role: "bot", content: res.reply }]);
      } catch (error) {
        setAiMessages((prev) => [...prev, { id: msgId + "r", role: "bot", content: "Sorry, AI is busy. Please try again later." }]);
      } finally {
        setIsTyping(false);
      }
    } else {
      if (!conversationId) {
        setAdminMessages(prev => [...prev, { id: msgId, role: "admin", content: "Please log in to chat directly.", time: now() }]);
        return;
      }
      
      const tmpId = Date.now().toString();
      setAdminMessages((prev) => [...prev, { id: tmpId, role: "user", content: text, time: now(), fileUrl: imageUrl }]);
      if (customText === undefined) setInput("");
      setIsTyping(false);

      const sendContent = text || "[Image]";

      sendLiveMessage({ conversationId, content: sendContent, senderId: user!.id, fileUrl: imageUrl }).then((res) => {
        setAdminMessages(prev => {
          if (prev.find(m => m.id === res.id.toString())) {
            return prev.filter(m => m.id !== tmpId);
          }
          return prev.map(m => m.id === tmpId ? {
            id: res.id.toString(),
            role: "user",
            content: res.content,
            time: formatTime(res.createdAt),
            fileUrl: res.fileUrl
          } : m);
        });
      }).catch(() => {
        setAdminMessages(prev => [...prev, { id: tmpId + "err", role: "admin", content: "Send error.", time: now() }]);
      });
    }
  };

  useEffect(() => {
    if (chatIntent && chatIntent.triggerId > 0) {
      const isPlainToggle = !chatIntent.mode && !chatIntent.autoSendPrompt && !chatIntent.prefillMessage;
      if (isPlainToggle) {
        setChatOpen(prev => !prev);
      } else {
        setChatOpen(true);
      }
      
      if (chatIntent.mode) setActiveTab(chatIntent.mode);
      if (chatIntent.prefillMessage) setInput(chatIntent.prefillMessage);
      
      if (chatIntent.autoSendPrompt) {
        setTimeout(() => {
          handleSend(chatIntent.autoSendPrompt, undefined, chatIntent.mode || "ai");
        }, 100);
      }
    }
  }, [chatIntent]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    setIsUploadingImage(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/webp'
      };
      const compressedFile = await imageCompression(file, options);
      const url = await profileApi.uploadFile(compressedFile);
      handleSend(input.trim(), url);
      setInput("");
    } catch (err) {
      setAdminMessages(prev => [...prev, { id: Date.now().toString(), role: "admin", content: "Failed to upload image, please try again.", time: now() }]);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (activeTab === "ai") { setAiMessages(INITIAL_AI); }
    else { 
      if (conversationId && user) {
        getMessagesByConversation(conversationId, user.id).then(msgs => {
          const mapped: Message[] = msgs.map(m => ({
            id: m.id.toString(),
            role: m.senderId === user.id ? "user" : "admin",
            content: m.content,
            time: formatTime(m.createdAt)
          }));
          setAdminMessages(mapped);
        });
      }
    }
    setIsTyping(false);
  };

  const messages = activeTab === "ai" ? aiMessages : adminMessages;

  return (
    <div className="fixed bottom-[76px] md:bottom-6 right-4 z-50 flex flex-col items-end gap-3">


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
                <button onClick={handleReset} className="text-white/50 hover:text-white transition-colors p-1.5 rounded" title="Refresh">
                  <RefreshCw size={14} />
                </button>
                <button onClick={() => setChatOpen(false)} className="text-white/50 hover:text-white transition-colors p-1.5 rounded" title="Minimize">
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
                    : <><Headphones size={12} />Support</>
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
                <span className="text-[#25521f] text-[11px]">Support agent is online</span>
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
                      {msg.fileUrl && (
                        <div className="mb-2">
                          <img src={msg.fileUrl} alt="attachment" className="max-w-full rounded-lg" style={{ maxHeight: "150px", objectFit: "contain" }} />
                        </div>
                      )}
                      {msg.content !== "[Image]" ? (activeTab === "ai" ? renderMarkdown(msg.content) : msg.content) : ""}
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
              {activeTab === "admin" && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage || !conversationId}
                    className="text-gray-400 hover:text-[#274f4f] transition-colors disabled:opacity-30 p-1"
                    title="Send image"
                  >
                    {isUploadingImage ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                  </button>
                </>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isUploadingImage && handleSend()}
                placeholder={activeTab === "ai" ? "Ask about carbon, products..." : "Type a support message..."}
                className="flex-1 text-[13px] text-gray-700 outline-none placeholder-gray-400 bg-transparent min-w-0"
                disabled={isUploadingImage}
              />
              <button
                onClick={() => handleSend()}
                disabled={(!input.trim() && !isUploadingImage) || isTyping || isUploadingImage}
                className={`transition-colors disabled:opacity-30 p-1 ${input.trim() ? "text-[#274f4f]" : "text-gray-300 hover:text-[#274f4f]"}`}
              >
                <Send size={17} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center leading-tight">
              {activeTab === "ai"
                ? "AI information is for reference only"
                : "Online support 8:00 – 22:00 daily"
              }
            </p>
          </div>
        </div>
      )}

      {/* Floating button — shrinks when scrolled, expands on hover or when chat is open */}
      {(() => {
        const shrink = scrolled && !chatOpen && !hoveringBtn;
        return (
          <button
            onClick={() => setChatOpen(!chatOpen)}
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
              {chatOpen ? (
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
