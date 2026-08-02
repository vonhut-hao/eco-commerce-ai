import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
};

// ─── Global event bus ─────────────────────────────────────────────────────
const TOAST_EVENT = "gl:toast";

export function toast(type: ToastType, title: string, message?: string) {
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, { detail: { type, title, message } })
  );
}
toast.success = (title: string, message?: string) => toast("success", title, message);
toast.error   = (title: string, message?: string) => toast("error",   title, message);
toast.info    = (title: string, message?: string) => toast("info",    title, message);

// ─── Styles per type ──────────────────────────────────────────────────────
const STYLES: Record<ToastType, { bg: string; border: string; iconColor: string; Icon: typeof CheckCircle }> = {
  success: {
    bg: "#f0faf2",
    border: "#a8d5b5",
    iconColor: "#25521f",
    Icon: CheckCircle,
  },
  error: {
    bg: "#fff5f5",
    border: "#f5b8b8",
    iconColor: "#ba1a1a",
    Icon: XCircle,
  },
  info: {
    bg: "#fafaf5",
    border: "#c2c9bb",
    iconColor: "#42493e",
    Icon: Info,
  },
};

// ─── Single Toast ─────────────────────────────────────────────────────────
function ToastCard({
  item,
  onRemove,
}: {
  item: ToastItem;
  onRemove: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { bg, border, iconColor, Icon } = STYLES[item.type];

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onRemove(item.id), 350);
  }, [item.id, onRemove]);

  useEffect(() => {
    // Slide in
    const t1 = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after 2.5s
    const t2 = setTimeout(() => dismiss(), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [dismiss]);

  return (
    <div
      className="flex items-start gap-3 w-[300px] max-w-[calc(100vw-32px)] rounded-xl shadow-lg shadow-black/5 px-4 py-3 border transition-all duration-300 ease-out pointer-events-auto"
      style={{
        backgroundColor: bg,
        borderColor: border,
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving ? "translateX(0)" : "translateX(24px)",
      }}
    >
      <Icon size={18} strokeWidth={2} color={iconColor} className="shrink-0 mt-0.5" />
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p
          className="text-[#1a1c19] text-[14px] leading-snug font-['Nimbus_Sans:Bold',sans-serif]"
        >
          {item.title}
        </p>
        {item.message && (
          <p className="text-[#42493e] text-[13px] leading-snug">{item.message}</p>
        )}
      </div>
      <button
        onClick={dismiss}
        className="shrink-0 text-[#6b7280] hover:text-[#1a1c19] transition-colors mt-0.5"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { type, title, message } = (e as CustomEvent).detail;
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => {
        const next = [...prev, { id, type, title, message }];
        return next.slice(-3); // Keep only the latest 3 toasts
      });
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none">
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} onRemove={remove} />
      ))}
    </div>
  );
}
