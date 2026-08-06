import { useState, useEffect, useCallback } from 'react'
import { Icon } from './Icon'
import { GLASS, SECTION_LABEL, PAGE_TITLE, TH, TD, BTN_PRIMARY, BTN_GHOST, MONO } from './ui'
import { adminUserApi, mapAdminUserBeToFe, UserFE } from '../../../api/users'

const MOCK_USERS: UserFE[] = [
  { id: 1, username: 'nguyenlan',  email: 'lan.nt@gmail.com',    fullName: 'Nguyễn Thị Lan',  phone: '0901234567', greenPoints: 1250, totalCarbon: 4.2, orders: 18, isEnabled: true,  role: 'USER',  joined: '15/01/2026' },
  { id: 2, username: 'tranminh',   email: 'minh.tv@yahoo.com',   fullName: 'Trần Văn Minh',   phone: '0912345678', greenPoints: 580,  totalCarbon: 2.1, orders:  7, isEnabled: true,  role: 'USER',  joined: '03/03/2026' },
  { id: 3, username: 'phamha',     email: 'ha.pt@gmail.com',     fullName: 'Phạm Thu Hà',     phone: '0923456789', greenPoints: 2100, totalCarbon: 7.8, orders: 31, isEnabled: true,  role: 'USER',  joined: '22/11/2025' },
  { id: 4, username: 'lenam',      email: 'nam.lh@gmail.com',    fullName: 'Lê Hoàng Nam',    phone: '0934567890', greenPoints: 90,   totalCarbon: 0.3, orders:  1, isEnabled: false, role: 'USER',  joined: '10/07/2026' },
  { id: 5, username: 'vobich',     email: 'bich.vt@gmail.com',   fullName: 'Võ Thị Bích',     phone: '0945678901', greenPoints: 750,  totalCarbon: 3.0, orders: 12, isEnabled: true,  role: 'USER',  joined: '08/04/2026' },
  { id: 6, username: 'admin',      email: 'admin@greenlife.vn',  fullName: 'Admin GreenLife', phone: '0956789012', greenPoints: 0,    totalCarbon: 0,   orders:  0, isEnabled: true,  role: 'ADMIN', joined: '01/01/2025' },
  { id: 7, username: 'dominhtu',   email: 'tuan.dm@gmail.com',   fullName: 'Đỗ Minh Tuấn',    phone: '0967890123', greenPoints: 420,  totalCarbon: 1.5, orders:  5, isEnabled: true,  role: 'USER',  joined: '20/05/2026' },
]

const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'

export default function Users() {
  const [users, setUsers] = useState<UserFE[]>(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<UserFE | null>(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<{ total: number; active: number } | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const pageData = await adminUserApi.getUsers(search)
      if (pageData && pageData.content) {
        const mapped = pageData.content.map(mapAdminUserBeToFe)
        setUsers(mapped)
      }
      const statsData = await adminUserApi.getUserStats()
      if (statsData) {
        setStats({ total: statsData.totalUsers, active: statsData.activeUsers })
      }
    } catch {
      // Fallback to local mock filtering when backend identity API is unavailable or unauthenticated
      setUsers(MOCK_USERS.filter(u =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase())
      ))
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchUsers])

  async function toggleEnabled(id: number, currentStatus: boolean) {
    try {
      const updated = await adminUserApi.updateUserStatus(id, !currentStatus)
      if (updated) {
        const mapped = mapAdminUserBeToFe(updated)
        setUsers(prev => prev.map(u => u.id === id ? mapped : u))
        if (detail?.id === id) setDetail(mapped)
        return
      }
    } catch {
      // Fallback to local state update if offline
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isEnabled: !u.isEnabled } : u))
    if (detail?.id === id) setDetail(d => d ? { ...d, isEnabled: !d.isEnabled } : d)
  }

  const totalCount = stats ? stats.total : users.length
  const activeCount = stats ? stats.active : users.filter(u => u.isEnabled).length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div><p style={SECTION_LABEL}>Quản lý tài khoản</p><h1 style={PAGE_TITLE}>Người dùng</h1></div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid #dde8d8', borderRadius: 12, padding: '8px 16px', fontSize: 13, color: '#42493e', fontFamily: NS }}>
            Tổng: <strong style={{ color: '#1a1c19' }}>{totalCount}</strong> · Hoạt động: <strong style={{ color: '#25521f' }}>{activeCount}</strong>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: 300, marginBottom: 16 }}>
        <Icon name="Search" size={14} color="#6b7280" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm người dùng..."
          style={{ width: '100%', background: 'rgba(255,255,255,0.70)', border: '1px solid #dde8d8', borderRadius: 999, padding: '8px 16px 8px 40px', fontSize: 14, color: '#1a1c19', fontFamily: NS, outline: 'none', backdropFilter: 'blur(8px)' }} />
      </div>

      <div style={GLASS}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Người dùng','Liên hệ','Đơn hàng','Green Points','CO₂','Vai trò','Trạng thái',''].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ ...TD, textAlign: 'center', padding: '30px 0', color: '#6b7280', fontFamily: NS }}>
                    Đang tải dữ liệu người dùng...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ ...TD, textAlign: 'center', padding: '30px 0', color: '#6b7280', fontFamily: NS }}>
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} style={{ transition: 'background 120ms' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafff8'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={TD}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 999, background: '#e8f5e4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#3d6b35', flexShrink: 0, fontFamily: NS }}>
                          {u.fullName ? u.fullName[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: '#1a1c19', fontSize: 14, fontFamily: NS }}>{u.fullName}</div>
                          <div style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>@{u.username} · {u.joined}</div>
                        </div>
                      </div>
                    </td>
                    <td style={TD}>
                      <div style={{ fontSize: 13, color: '#42493e', fontFamily: NS }}>{u.email}</div>
                      <div style={{ ...MONO, fontSize: 11, color: '#6b7280' }}>{u.phone}</div>
                    </td>
                    <td style={{ ...TD, ...MONO, fontWeight: 600, color: '#1a1c19' }}>{u.orders}</td>
                    <td style={TD}>
                      <span style={{ fontSize: 12, fontWeight: 600, background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba', borderRadius: 999, padding: '3px 10px', fontFamily: NS }}>
                        🌿 {u.greenPoints.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ ...TD, ...MONO, color: '#6b7280' }}>{u.totalCarbon} kg</td>
                    <td style={TD}>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', background: u.role === 'ADMIN' ? '#25521f' : '#f5f5f0', color: u.role === 'ADMIN' ? '#fff' : '#6b7280', border: `1px solid ${u.role === 'ADMIN' ? '#25521f' : '#e0e0d8'}`, borderRadius: 6, padding: '3px 8px', fontFamily: NS }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={TD}>
                      <button onClick={() => u.role !== 'ADMIN' && toggleEnabled(u.id, u.isEnabled)} disabled={u.role === 'ADMIN'}
                        style={{ position: 'relative', width: 36, height: 20, borderRadius: 999, border: 'none', cursor: u.role === 'ADMIN' ? 'not-allowed' : 'pointer', background: u.isEnabled ? '#3d6b35' : '#d1d5db', opacity: u.role === 'ADMIN' ? 0.4 : 1, transition: 'background 200ms', padding: 0 }}>
                        <span style={{ position: 'absolute', top: 2, left: u.isEnabled ? 18 : 2, width: 16, height: 16, borderRadius: 999, background: '#fff', transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      </button>
                    </td>
                    <td style={TD}>
                      <button onClick={() => setDetail(u)} style={{ width: 32, height: 32, background: '#f0f7ee', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Eye" size={14} color="#3d6b35" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', fontSize: 12, color: '#6b7280', fontFamily: NS, borderTop: '1px solid #eef2eb' }}>{users.length} người dùng</div>
      </div>

      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #dde8d8', width: '100%', maxWidth: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 18px', borderBottom: '1px solid #eef2eb' }}>
              <h2 style={{ fontFamily: NS, fontWeight: 700, fontSize: 18, color: '#1a1c19', margin: 0 }}>Chi tiết người dùng</h2>
              <button onClick={() => setDetail(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 20 }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 999, background: '#e8f5e4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#3d6b35', fontFamily: NS }}>
                  {detail.fullName ? detail.fullName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#1a1c19', fontFamily: NS }}>{detail.fullName}</div>
                  <div style={{ fontSize: 13, color: '#6b7280', fontFamily: NS }}>@{detail.username}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, background: detail.role === 'ADMIN' ? '#25521f' : '#f5f5f0', color: detail.role === 'ADMIN' ? '#fff' : '#6b7280', borderRadius: 6, padding: '2px 8px', fontFamily: NS, marginTop: 4, display: 'inline-block' }}>{detail.role}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[['Email', detail.email],['Điện thoại', detail.phone],['Tham gia', detail.joined],['Đơn hàng', String(detail.orders)],['Green Points', `🌿 ${detail.greenPoints.toLocaleString()}`],['Carbon tích lũy', `${detail.totalCarbon} kg CO₂`]].map(([lbl, val]) => (
                  <div key={lbl} style={{ background: '#f5f9f3', borderRadius: 10, padding: '10px 14px' }}>
                    <p style={{ ...SECTION_LABEL, margin: '0 0 4px', fontSize: 10 }}>{lbl}</p>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1c19', fontFamily: NS }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eef2eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {detail.role !== 'ADMIN' && (
                <button onClick={() => toggleEnabled(detail.id, detail.isEnabled)} style={{
                  ...BTN_GHOST,
                  color: detail.isEnabled ? '#ba1a1a' : '#3d6b35',
                  borderColor: detail.isEnabled ? '#f5c2c2' : '#c2deba',
                }}>
                  {detail.isEnabled ? '🔒 Khóa tài khoản' : '🔓 Mở khóa'}
                </button>
              )}
              <button onClick={() => setDetail(null)} style={BTN_PRIMARY}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
