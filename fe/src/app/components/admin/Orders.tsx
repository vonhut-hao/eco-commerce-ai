import { useState, useEffect } from 'react'
import { Icon } from './Icon'
import { GLASS, BTN_PRIMARY, BTN_GHOST, SECTION_LABEL, PAGE_TITLE, TH, TD, MONO } from './ui'
import { ordersApi, OrderBE } from '../../../api/orders'

type Status = 'Ch? xác nh?n' | 'Ðang giao' | 'Ð? giao' | 'Ð? h?y'
const ALL_STATUS: Status[] = ['Ch? xác nh?n','Ðang giao','Ð? giao','Ð? h?y']

const STATUS_MAP: Record<string, Status> = {
  PENDING: 'Ch? xác nh?n',
  DELIVERY: 'Ðang giao',
  COMPLETED: 'Ð? giao',
  CANCELLED: 'Ð? h?y'
}

const REVERSE_STATUS: Record<Status, string> = {
  'Ch? xác nh?n': 'PENDING',
  'Ðang giao': 'DELIVERY',
  'Ð? giao': 'COMPLETED',
  'Ð? h?y': 'CANCELLED'
}

const statusStyle: Record<Status, React.CSSProperties> = {
  'Ch? xác nh?n': { background: '#fdf6ec', color: '#6f6143', border: '1px solid #e8d8ae' },
  'Ðang giao':    { background: '#efe8ff', color: '#6b35a3', border: '1px solid #d0b8f5' },
  'Ð? giao':      { background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba' },
  'Ð? h?y':       { background: '#fff0f0', color: '#ba1a1a', border: '1px solid #f5c2c2' },
}
const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'

export default function Orders() {
  const [orders, setOrders] = useState<OrderBE[]>([])
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [detail, setDetail] = useState<OrderBE | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    try {
      const res = await ordersApi.getOrdersAdmin();
      setOrders(res);
      if (detail) {
        setDetail(res.find(o => o.id === detail.id) || null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter(o => {
    const s = STATUS_MAP[o.status] || 'Ch? xác nh?n';
    const ms = filter === 'all' || s === filter;
    const mq = String(o.id).includes(search) || (o.username || '').toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  async function updateStatus(id: number, status: Status) {
    if (!confirm('B?n có ch?c mu?n ð?i tr?ng thái ðõn hàng này?')) return;
    try {
      setLoading(true);
      await ordersApi.updateOrderStatus(id, REVERSE_STATUS[status]);
      await fetchOrders();
    } catch (error) {
      console.error(error);
      alert('L?i c?p nh?t tr?ng thái, có th? ðõn hàng ð? ? tr?ng thái không th? thay ð?i.');
    } finally {
      setLoading(false);
    }
  }

  function printOrder(o: OrderBE) {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write('<html><body><h2>Ðõn hàng #' + o.id + '</h2><p>Khách: ' + o.username + '</p></body></html>')
    win.document.close()
    win.print()
  }

  function formatCarbon(o: OrderBE) {
    return o.orderItems.reduce((acc, i) => acc + (i.lineCarbonFootprint || 0) * i.quantity, 0).toFixed(2);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={SECTION_LABEL}>Qu?n l? bán hàng</p>
          <h1 style={PAGE_TITLE}>Ðõn hàng</h1>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Icon name="Search" size={14} color="#6b7280" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="T?m m? ðõn, khách hàng..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.70)', border: '1px solid #dde8d8', borderRadius: 999, padding: '8px 16px 8px 40px', fontSize: 14, color: '#1a1c19', fontFamily: NS, outline: 'none', backdropFilter: 'blur(8px)' }} />
        </div>
        {(['all', ...ALL_STATUS] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            background: filter === s ? 'linear-gradient(to right,#3d6b35,#25521f)' : 'rgba(255,255,255,0.70)',
            color: filter === s ? '#fff' : '#42493e',
            border: '1px solid #dde8d8',
            borderRadius: 999, padding: '7px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            fontFamily: NS, backdropFilter: 'blur(8px)',
          }}>{s === 'all' ? 'T?t c?' : s}</button>
        ))}
      </div>

      <div style={GLASS}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['M? ðõn','Khách hàng','Ngày ð?t','T?ng ti?n','CO?','Tr?ng thái',''].map(h => (
                  <th key={h} style={{ ...TH, textAlign: h === 'T?ng ti?n' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const s = STATUS_MAP[o.status] || 'Ch? xác nh?n';
                return (
                <tr key={o.id} style={{ transition: 'background 120ms' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafff8'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <td style={TD}><span style={{ ...MONO, fontWeight: 700, color: '#3d6b35', fontSize: 13 }}>#{o.id}</span></td>
                  <td style={TD}>
                    <div style={{ fontWeight: 500, color: '#1a1c19', fontFamily: NS }}>{o.username}</div>
                  </td>
                  <td style={{ ...TD, color: '#6b7280', fontFamily: NS }}>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td style={{ ...TD, textAlign: 'right', ...MONO, fontWeight: 600 }}>{o.totalAmount.toLocaleString('vi-VN')}ð</td>
                  <td style={{ ...TD, ...MONO, color: '#6b7280' }}>{formatCarbon(o)} kg</td>
                  <td style={TD}>
                    <select value={s} onChange={e => updateStatus(o.id, e.target.value as Status)} disabled={loading}
                      style={{ ...statusStyle[s], borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: NS }}>
                      {ALL_STATUS.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </td>
                  <td style={TD}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button onClick={() => setDetail(o)} style={{ width: 32, height: 32, background: '#f0f7ee', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Eye" size={14} color="#3d6b35" /></button>
                      <button onClick={() => printOrder(o)} style={{ width: 32, height: 32, background: '#f5f5f0', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Printer" size={14} color="#6b7280" /></button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', fontSize: 12, color: '#6b7280', fontFamily: NS, borderTop: '1px solid #eef2eb' }}>{filtered.length} ðõn hàng</div>
      </div>

      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #dde8d8', width: '100%', maxWidth: 480, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 18px', borderBottom: '1px solid #eef2eb' }}>
              <div>
                <span style={{ ...MONO, fontWeight: 700, color: '#3d6b35', fontSize: 15 }}>#{detail.id}</span>
                <p style={{ ...SECTION_LABEL, margin: '2px 0 0' }}>{new Date(detail.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              <button onClick={() => setDetail(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 20 }}>?</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['Khách hàng', detail.username], ['Phýõng th?c', detail.paymentMethodName], ['Thanh toán', detail.paymentStatus], ['Tr?ng thái', '']].map(([lbl, val]) => {
                  const s = STATUS_MAP[detail.status] || 'Ch? xác nh?n';
                  return (
                  <div key={lbl} style={{ background: '#f5f9f3', borderRadius: 10, padding: '10px 14px' }}>
                    <p style={{ ...SECTION_LABEL, margin: '0 0 4px', fontSize: 10 }}>{lbl}</p>
                    {lbl === 'Tr?ng thái' ? (
                      <select value={s} onChange={e => updateStatus(detail.id, e.target.value as Status)} disabled={loading}
                        style={{ ...statusStyle[s], borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: NS }}>
                        {ALL_STATUS.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    ) : <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1c19', fontFamily: NS }}>{val}</span>}
                  </div>
                )})}
              </div>
              <div>
                <p style={{ ...SECTION_LABEL, fontSize: 10, marginBottom: 8 }}>S?n ph?m</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {detail.orderItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f5f9f3', borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {item.mainImage && <img src={item.mainImage} alt={item.productName} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1c19', fontFamily: NS }}>{item.productName}</div>
                          <div style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>CO?: {(item.lineCarbonFootprint || 0) * item.quantity}kg · x{item.quantity}</div>
                        </div>
                      </div>
                      <span style={{ ...MONO, fontSize: 13, fontWeight: 700, color: '#1a1c19' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}ð</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #eef2eb' }}>
                <span style={{ fontSize: 13, color: '#3d6b35', fontFamily: NS }}>?? Carbon: <strong>{formatCarbon(detail)} kg CO?</strong></span>
                <span style={{ ...MONO, fontSize: 18, fontWeight: 700, color: '#1a1c19' }}>{detail.totalAmount.toLocaleString('vi-VN')}ð</span>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eef2eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => printOrder(detail)} style={{ ...BTN_GHOST, display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="Printer" size={13} color="#42493e" /> In ðõn</button>
              <button onClick={() => setDetail(null)} style={BTN_PRIMARY}>Ðóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

