// Shared design tokens & style helpers

export const GLASS = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(8px)',
  borderRadius: 16,
  border: '1px solid #dde8d8',
  boxShadow: '0 1px 8px rgba(37,82,31,0.06), inset 0 0 0 1px rgba(255,255,255,0.55)',
} as const

export const GLASS_SM = {
  ...GLASS,
  borderRadius: 12,
} as const

export const INPUT = {
  background: '#ffffff',
  border: '1px solid #dde8d8',
  borderRadius: 12,
  padding: '10px 14px',
  fontSize: 14,
  color: '#1a1c19',
  outline: 'none',
  width: '100%',
  fontFamily: '"Nimbus Sans","Helvetica Neue",Arial,sans-serif',
} as const

export const BTN_PRIMARY = {
  background: 'linear-gradient(to right, #3d6b35, #25521f)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 999,
  padding: '8px 20px',
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.5px',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(37,82,31,0.25)',
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  fontFamily: '"Nimbus Sans","Helvetica Neue",Arial,sans-serif',
} as const

export const BTN_GHOST = {
  background: '#ffffff',
  color: '#42493e',
  border: '1px solid #dde8d8',
  borderRadius: 999,
  padding: '8px 20px',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: '"Nimbus Sans","Helvetica Neue",Arial,sans-serif',
} as const

export const SECTION_LABEL: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: '1.4px',
  textTransform: 'uppercase',
  color: '#6b7280',
  marginBottom: 4,
  fontFamily: '"Nimbus Sans","Helvetica Neue",Arial,sans-serif',
}

export const PAGE_TITLE: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: '#1a1c19',
  margin: 0,
  fontFamily: '"Nimbus Sans","Helvetica Neue",Arial,sans-serif',
}

export const MONO: React.CSSProperties = {
  fontFamily: '"Liberation Mono","Courier New",monospace',
}

export const TH: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 16px',
  fontSize: 10,
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
  color: '#6b7280',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  background: '#f5f9f3',
  fontFamily: '"Nimbus Sans","Helvetica Neue",Arial,sans-serif',
}

export const TD: React.CSSProperties = {
  padding: '13px 16px',
  fontSize: 14,
  color: '#42493e',
  borderBottom: '1px solid #eef2eb',
  verticalAlign: 'middle',
}

// Badge styles
export const badge = (variant: 'success' | 'info' | 'warning' | 'danger' | 'neutral'): React.CSSProperties => {
  const map = {
    success: { background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba' },
    info:    { background: '#e8f0ff', color: '#3b4fd4', border: '1px solid #c5d0f5' },
    warning: { background: '#fdf6ec', color: '#6f6143', border: '1px solid #e8d8ae' },
    danger:  { background: '#fff0f0', color: '#ba1a1a', border: '1px solid #f5c2c2' },
    neutral: { background: '#f5f5f0', color: '#6b7280', border: '1px solid #e0e0d8' },
  }
  return {
    ...map[variant],
    borderRadius: 999,
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 600,
    display: 'inline-block',
    whiteSpace: 'nowrap' as const,
    fontFamily: '"Nimbus Sans","Helvetica Neue",Arial,sans-serif',
  }
}
