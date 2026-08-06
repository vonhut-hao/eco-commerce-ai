import { useState } from 'react'
import { Icon } from './Icon'
import { useAuthStore } from '../../../store/authStore'
import { useCartStore } from '../../../store/cartStore'
import logo from '../../../imports/rmbg-logo.png'
import logoIcon from '../../../imports/rmbg-logo-only.png'
import Dashboard from './Dashboard'
import Products from './Products'
import Orders from './Orders'
import UsersPage from './Users'
import Categories from './Categories'
import Coupons from './Coupons'
import Reviews from './Reviews'
import Banners from './Banners'
import Chat from './Chat'

type Page = 'dashboard' | 'products' | 'orders' | 'users' | 'categories' | 'coupons' | 'reviews' | 'banners' | 'chat'

const NAV: { id: Page; label: string; icon: Parameters<typeof Icon>[0]['name'] }[] = [
  { id: 'dashboard',  label: 'Thống kê',   icon: 'BarChart2'   },
  { id: 'products',   label: 'Sản phẩm',   icon: 'Package'     },
  { id: 'orders',     label: 'Đơn hàng',   icon: 'ShoppingBag' },
  { id: 'users',      label: 'Người dùng', icon: 'Users'       },
  { id: 'categories', label: 'Danh mục',   icon: 'Layers'      },
  { id: 'coupons',    label: 'Mã giảm giá',icon: 'Tag'         },
  { id: 'reviews',    label: 'Đánh giá',   icon: 'Star'        },
  { id: 'banners',    label: 'Banner',     icon: 'Image'       },
  { id: 'chat',       label: 'Chat',       icon: 'MessageCircle' },
]

const CHAT_UNREAD = 3

const getInitialPage = (): Page => {
  const hash = window.location.hash.replace('#', '') as Page;
  return NAV.some(n => n.id === hash) ? hash : 'dashboard';
};

export function AdminPanel({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [page, setPage] = useState<Page>(getInitialPage)
  const [collapsed, setCollapsed] = useState(false)
  
  // Sync hash when page changes
  useState(() => {
    const handleHashChange = () => setPage(getInitialPage());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  });
  
  const handleSetPage = (newPage: Page) => {
    setPage(newPage);
    window.location.hash = newPage;
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, #f5f8f1 0%, #fafaf5 50%, #f3f6ee 100%)' }}>
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside style={{
        width: collapsed ? 64 : 228, background: '#1e4519', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        transition: 'width 280ms cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden',
        boxShadow: '2px 0 16px rgba(0,0,0,0.12)',
      }}>
        {/* Logo area */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: collapsed ? '18px 0' : '18px 20px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          minHeight: 68, overflow: 'hidden',
        }}>
          {collapsed ? (
            <img
              src={logoIcon}
              alt="GreenLife"
              style={{ height: 30, width: 30, objectFit: 'contain', flexShrink: 0, filter: 'brightness(0) invert(1)' }}
            />
          ) : (
            <>
              <img src={logo} alt="GreenLife" style={{ height: 28, width: 'auto', flexShrink: 0, filter: 'brightness(0) invert(1)' }} />
              <div style={{ fontSize: 9, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#8ab87a', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Admin
              </div>
            </>
          )}
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 22, height: 22, borderRadius: 999, background: '#2d5c27',
          border: '1px solid rgba(255,255,255,0.18)',
          position: 'absolute', left: collapsed ? 53 : 217, top: 58, zIndex: 10,
          cursor: 'pointer', transition: 'left 280ms cubic-bezier(0.4,0,0.2,1)',
        }}>
          <Icon name={collapsed ? 'ChevronRight' : 'ChevronLeft'} size={11} color="#b8d9a0" />
        </button>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV.map(({ id, label, icon }) => {
            const active = page === id
            return (
              <button key={id} onClick={() => handleSetPage(id)} title={collapsed ? label : undefined} style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 10, padding: collapsed ? '10px 0' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textAlign: 'left',
                borderRadius: 10, marginBottom: 2, cursor: 'pointer', border: 'none',
                background: active ? 'rgba(255,255,255,0.13)' : 'transparent',
                color: active ? '#ffffff' : '#8fba7a',
                fontSize: 14, fontWeight: active ? 600 : 400,
                fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
                transition: 'background 150ms, color 150ms',
                whiteSpace: 'nowrap', overflow: 'hidden',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <Icon name={icon} size={16} color={active ? '#ffffff' : '#7aab68'} />
                {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
                {id === 'chat' && CHAT_UNREAD > 0 && (
                  collapsed
                    ? <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: 999, background: '#e5534b' }} />
                    : <span style={{ background: '#e5534b', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 7px' }}>{CHAT_UNREAD}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Admin footer */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: collapsed ? '14px 0' : '14px 16px',
          display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 999, background: '#2d5c27',
            border: '1.5px solid rgba(163,204,132,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontWeight: 700, fontSize: 12, color: '#c8e8b0',
            fontFamily: 'Inter, sans-serif',
          }}>A</div>
          {!collapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#e8f5e4', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>Admin</div>
              <div style={{ fontSize: 10, color: '#8ab87a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Inter, sans-serif' }}>admin@greenlife.vn</div>
            </div>
          )}
          {!collapsed && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => onNavigate && onNavigate("home")}
                title="Về Cửa hàng"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <Icon name="Home" size={13} color="#8ab87a" />
              </button>
              <button 
                onClick={() => {
                  useAuthStore.getState().logout()
                  useCartStore.getState().clearCart()
                  if (onNavigate) onNavigate("home")
                }}
                title="Đăng xuất"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <Icon name="LogOut" size={13} color="#8ab87a" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <header style={{
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #dde8d8', padding: '0 28px', height: 58,
          display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, zIndex: 5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9ca3af', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              GreenLife
            </span>
            <span style={{ color: '#d1d5db', fontSize: 12 }}>/</span>
            <span style={{ fontSize: 13, color: '#25521f', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              {NAV.find(n => n.id === page)?.label}
            </span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: 11, background: '#e8f5e4', color: '#25521f',
              border: '1px solid #c2deba', borderRadius: 999, padding: '4px 14px',
              fontWeight: 600, letterSpacing: '0.3px', fontFamily: 'Inter, sans-serif',
            }}>
              Admin Panel
            </span>
            <div style={{
              width: 30, height: 30, borderRadius: 999, background: '#e8f5e4',
              border: '1.5px solid #c2deba',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#25521f', fontFamily: 'Inter, sans-serif',
            }}>A</div>
          </div>
        </header>

        <main style={{
          flex: 1, minHeight: 0,
          overflowY: page === 'chat' ? 'hidden' : 'auto',
          padding: page === 'chat' ? '20px 20px 20px' : '24px 28px 40px',
          display: 'flex', flexDirection: 'column',
        }}>
          {page === 'dashboard'  && <Dashboard />}
          {page === 'products'   && <Products />}
          {page === 'orders'     && <Orders />}
          {page === 'users'      && <UsersPage />}
          {page === 'categories' && <Categories />}
          {page === 'coupons'    && <Coupons />}
          {page === 'reviews'    && <Reviews />}
          {page === 'banners'    && <Banners />}
          {page === 'chat'       && <Chat />}
        </main>
      </div>
    </div>
  )
}
