interface IconProps { size?: number; color?: string; style?: React.CSSProperties }

const path = (d: string, extra?: string) =>
  (s: number, c: string, style?: React.CSSProperties) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d={d} />
      {extra && <path d={extra} />}
    </svg>
  )

const icons = {
  BarChart2:   path('M18 20V10M12 20V4M6 20v-6'),
  Package:     path('M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', 'M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12'),
  ShoppingBag: path('M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18', 'M16 10a4 4 0 0 1-8 0'),
  Users:       path('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M23 21v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 3.13a4 4 0 0 1 0 7.75'),
  Layers:      path('M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'),
  Tag:         path('M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'M7 7h.01'),
  Star:        path('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'),
  Image:       path('M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', 'M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 20'),
  ChevronLeft: path('M15 18l-6-6 6-6'),
  ChevronRight:path('M9 18l6-6-6-6'),
  Home:        path('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'),
  LogOut:      path('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9'),
  Search:      (s: number, c: string, st?: React.CSSProperties) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...st }}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Plus:        path('M12 5v14M5 12h14'),
  Pencil:      path('M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'),
  Trash2:      path('M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6', 'M10 11v6M14 11v6'),
  Eye:         path('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'),
  Printer:     path('M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2', 'M6 14h12v8H6z'),
  CheckCircle: (s: number, c: string, st?: React.CSSProperties) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...st }}>
      <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
    </svg>
  ),
  EyeOff:      path('M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94', 'M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22'),
  ToggleLeft:  (s: number, c: string, st?: React.CSSProperties) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...st }}>
      <rect x="1" y="5" width="22" height="14" rx="7" ry="7" /><circle cx="8" cy="12" r="3" />
    </svg>
  ),
  ToggleRight: (s: number, c: string, st?: React.CSSProperties) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...st }}>
      <rect x="1" y="5" width="22" height="14" rx="7" ry="7" /><circle cx="16" cy="12" r="3" />
    </svg>
  ),
  TrendingUp:  path('M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6'),
  ShoppingBagSm: path('M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18', 'M16 10a4 4 0 0 1-8 0'),
  Leaf:          path('M17 8C8 10 5.9 16.17 3.82 19.82a1 1 0 0 0 1.71 1.03C7 19 9 17 12 17c4 0 6-3 6-7 0-4-3-7-7-7S5 7 5 11c0 2.21.9 4.2 2.34 5.65'),
  MessageCircle: (s: number, c: string, st?: React.CSSProperties) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...st }}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  User:          (s: number, c: string, st?: React.CSSProperties) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...st }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Send:          path('M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z'),
  CheckCheck:    path('M17 3l-9 9-4-4M22 8l-9 9-2-2'),
}

export type IconName = keyof typeof icons

export function Icon({ name, size = 16, color = 'currentColor', style }: { name: IconName } & IconProps) {
  const render = icons[name]
  if (typeof render === 'function') return render(size, color, style)
  return null
}
