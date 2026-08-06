import { useState } from 'react'
import { Icon } from './Icon'
import { GLASS, BTN_PRIMARY, BTN_GHOST, SECTION_LABEL, PAGE_TITLE, TH, TD, MONO } from './ui'

type Status = 'Chờ xác nhận' | 'Đang xử lý' | 'Đang giao' | 'Đã giao' | 'Đã hủy'

interface Order {
  id: string; customer: string; email: string; address: string
  items: { name: string; qty: number; price: number; carbon: number }[]
  total: number; payment: string; status: Status; date: string; carbonTotal: number
}

const ORDERS: Order[] = [
  { id: 'ORD-2847', customer: 'Nguyễn Thị Lan', email: 'lan.nt@gmail.com', address: '123 Nguyễn Huệ, Q1, TP.HCM', items: [{ name: 'Insulated Steel Bottle', qty: 1, price: 420000, carbon: 0.8 },{ name: 'Bamboo Toothbrush Set', qty: 2, price: 149000, carbon: 0.3 }], total: 718000, payment: 'Chuyển khoản', status: 'Đang giao', date: '01/08/2026', carbonTotal: 1.4 },
  { id: 'ORD-2846', customer: 'Trần Văn Minh', email: 'minh.tv@yahoo.com', address: '45 Lê Lợi, Q3, TP.HCM', items: [{ name: 'Organic Cotton Tote Bag', qty: 1, price: 180000, carbon: 0.2 }], total: 180000, payment: 'Tiền mặt', status: 'Chờ xác nhận', date: '01/08/2026', carbonTotal: 0.2 },
  { id: 'ORD-2845', customer: 'Phạm Thu Hà', email: 'ha.pt@gmail.com', address: '78 Trần Hưng Đạo, Q5, TP.HCM', items: [{ name: 'Natural Coconut Bowl Set', qty: 1, price: 320000, carbon: 0.4 },{ name: 'Beeswax Food Wraps', qty: 2, price: 120000, carbon: 0.2 },{ name: 'Hemp Soap Bar', qty: 1, price: 85000, carbon: 0.15 }], total: 645000, payment: 'Ví MoMo', status: 'Đã giao', date: '31/07/2026', carbonTotal: 0.95 },
  { id: 'ORD-2844', customer: 'Lê Hoàng Nam', email: 'nam.lh@gmail.com', address: '12 Đinh Tiên Hoàng, Q Bình Thạnh', items: [{ name: 'Reusable Steel Straw Kit', qty: 3, price: 95000, carbon: 0.1 }], total: 285000, payment: 'Tiền mặt', status: 'Đã hủy', date: '31/07/2026', carbonTotal: 0.3 },
  { id: 'ORD-2843', customer: 'Võ Thị Bích', email: 'bich.vt@gmail.com', address: '56 Nguyễn Đình Chiểu, Q3', items: [{ name: 'Hemp Canvas Backpack', qty: 1, price: 680000, carbon: 0.6 }], total: 680000, payment: 'Chuyển khoản', status: 'Đang giao', date: '30/07/2026', carbonTotal: 0.6 },
  { id: 'ORD-2842', customer: 'Đỗ Minh Tuấn', email: 'tuan.dm@gmail.com', address: '90 Cộng Hòa, Q Tân Bình', items: [{ name: 'Bamboo Toothbrush Set', qty: 4, price: 149000, carbon: 0.3 },{ name: 'Natural Hemp Soap Bar', qty: 2, price: 85000, carbon: 0.15 }], total: 766000, payment: 'Ví ZaloPay', status: 'Đang xử lý', date: '30/07/2026', carbonTotal: 1.5 },
]

const ALL_STATUS: Status[] = ['Chờ xác nhận','Đang xử lý','Đang giao','Đã giao','Đã hủy']
const statusStyle: Record<Status, React.CSSProperties> = {
  'Chờ xác nhận': { background: '#fdf6ec', color: '#6f6143', border: '1px solid #e8d8ae' },
  'Đang xử lý':   { background: '#e8f0ff', color: '#3b4fd4', border: '1px solid #c5d0f5' },
  'Đang giao':    { background: '#efe8ff', color: '#6b35a3', border: '1px solid #d0b8f5' },
  'Đã giao':      { background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba' },
  'Đã hủy':       { background: '#fff0f0', color: '#ba1a1a', border: '1px solid #f5c2c2' },
}
const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'

export default function Orders() {
  const [orders, setOrders] = useState(ORDERS)
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [detail, setDetail] = useState<Order | null>(null)
  const [search, setSearch] = useState('')

  const filtered = orders.filter(o => {
    const ms = filter === 'all' || o.status === filter
    const mq = o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase())
    return ms && mq
  })

  function updateStatus(id: string, status: Status) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (detail?.id === id) setDetail(d => d ? { ...d, status } : d)
  }

  function printOrder(o: Order) {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<html><head><title>Đơn hàng #${o.id}</title><style>body{font-family:sans-serif;padding:32px;max-width:600px;margin:auto}h2{color:#25521f}table{width:100%;border-collapse:collapse}th,td{border:1px solid #dde8d8;padding:8px 12px}th{background:#f5f9f3;font-size:12px}.total{font-weight:bold;color:#25521f;font-size:16px}</style></head><body><h2>🌱 GreenLife — Đơn hàng #${o.id}</h2><p><strong>Khách hàng:</strong> ${o.customer}</p><p><strong>Địa chỉ:</strong> ${o.address}</p><p><strong>Ngày đặt:</strong> ${o.date} · <strong>Thanh toán:</strong> ${o.payment}</p><table><thead><tr><th>Sản phẩm</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead><tbody>${o.items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${i.price.toLocaleString('vi-VN')}đ</td><td>${(i.price*i.qty).toLocaleString('vi-VN')}đ</td></tr>`).join('')}</tbody></table><p class="total" style="text-align:right;margin-top:12px">Tổng: ${o.total.toLocaleString('vi-VN')}đ</p><p style="color:#3d6b35;font-size:12px">🌿 Carbon Footprint: ${o.carbonTotal} kg CO₂</p></body></html>`)
    win.document.close()
    win.print()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div><p style={SECTION_LABEL}>Quản lý bán hàng</p><h1 style={PAGE_TITLE}>Đơn hàng</h1></div>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Icon name="Search" size={14} color="#6b7280" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm đơn hàng, khách hàng..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.70)', border: '1px solid #dde8d8', borderRadius: 999, padding: '8px 16px 8px 40px', fontSize: 14, color: '#1a1c19', fontFamily: NS, outline: 'none', backdropFilter: 'blur(8px)' }} />
        </div>
        {(['all', ...ALL_STATUS] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            background: filter === s ? 'linear-gradient(to right,#3d6b35,#25521f)' : 'rgba(255,255,255,0.70)',
            color: filter === s ? '#fff' : '#42493e',
            border: '1px solid #dde8d8',
            borderRadius: 999, padding: '7px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            fontFamily: NS, backdropFilter: 'blur(8px)',
          }}>{s === 'all' ? 'Tất cả' : s}</button>
        ))}
      </div>

      <div style={GLASS}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Mã đơn','Khách hàng','Ngày đặt','Tổng tiền','CO₂','Trạng thái',''].map(h => (
                  <th key={h} style={{ ...TH, textAlign: h === 'Tổng tiền' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ transition: 'background 120ms' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafff8'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <td style={TD}><span style={{ ...MONO, fontWeight: 700, color: '#3d6b35', fontSize: 13 }}>#{o.id}</span></td>
                  <td style={TD}>
                    <div style={{ fontWeight: 500, color: '#1a1c19', fontFamily: NS }}>{o.customer}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>{o.email}</div>
                  </td>
                  <td style={{ ...TD, color: '#6b7280', fontFamily: NS }}>{o.date}</td>
                  <td style={{ ...TD, textAlign: 'right', ...MONO, fontWeight: 600 }}>{o.total.toLocaleString('vi-VN')}đ</td>
                  <td style={{ ...TD, ...MONO, color: '#6b7280' }}>{o.carbonTotal} kg</td>
                  <td style={TD}>
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value as Status)}
                      style={{ ...statusStyle[o.status], borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: NS }}>
                      {ALL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={TD}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button onClick={() => setDetail(o)} style={{ width: 32, height: 32, background: '#f0f7ee', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Eye" size={14} color="#3d6b35" /></button>
                      <button onClick={() => printOrder(o)} style={{ width: 32, height: 32, background: '#f5f5f0', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Printer" size={14} color="#6b7280" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', fontSize: 12, color: '#6b7280', fontFamily: NS, borderTop: '1px solid #eef2eb' }}>{filtered.length} đơn hàng</div>
      </div>

      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #dde8d8', width: '100%', maxWidth: 480, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 18px', borderBottom: '1px solid #eef2eb' }}>
              <div>
                <span style={{ ...MONO, fontWeight: 700, color: '#3d6b35', fontSize: 15 }}>#{detail.id}</span>
                <p style={{ ...SECTION_LABEL, margin: '2px 0 0' }}>{detail.date}</p>
              </div>
              <button onClick={() => setDetail(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 20 }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['Khách hàng', detail.customer], ['Địa chỉ', detail.address], ['Thanh toán', detail.payment], ['Trạng thái', '']].map(([lbl, val]) => (
                  <div key={lbl} style={{ background: '#f5f9f3', borderRadius: 10, padding: '10px 14px' }}>
                    <p style={{ ...SECTION_LABEL, margin: '0 0 4px', fontSize: 10 }}>{lbl}</p>
                    {lbl === 'Trạng thái' ? (
                      <select value={detail.status} onChange={e => updateStatus(detail.id, e.target.value as Status)}
                        style={{ ...statusStyle[detail.status], borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: NS }}>
                        {ALL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1c19', fontFamily: NS }}>{val}</span>}
                  </div>
                ))}
              </div>
              <div>
                <p style={{ ...SECTION_LABEL, fontSize: 10, marginBottom: 8 }}>Sản phẩm</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {detail.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f5f9f3', borderRadius: 10, padding: '10px 14px' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1c19', fontFamily: NS }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>CO₂: {item.carbon * item.qty}kg · x{item.qty}</div>
                      </div>
                      <span style={{ ...MONO, fontSize: 13, fontWeight: 700, color: '#1a1c19' }}>{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #eef2eb' }}>
                <span style={{ fontSize: 13, color: '#3d6b35', fontFamily: NS }}>🌿 Carbon: <strong>{detail.carbonTotal} kg CO₂</strong></span>
                <span style={{ ...MONO, fontSize: 18, fontWeight: 700, color: '#1a1c19' }}>{detail.total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eef2eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => printOrder(detail)} style={{ ...BTN_GHOST, display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="Printer" size={13} color="#42493e" /> In đơn</button>
              <button onClick={() => setDetail(null)} style={BTN_PRIMARY}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
