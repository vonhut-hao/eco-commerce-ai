import { useState, useEffect } from 'react'
import { Icon } from './Icon'
import { GLASS, BTN_PRIMARY, BTN_GHOST, SECTION_LABEL, PAGE_TITLE, TH, TD, MONO } from './ui'
import { ordersApi, OrderBE } from '../../../api/orders'
import { toast } from '../Toast'

type Status = 'Pending' | 'Delivering' | 'Completed' | 'Cancelled'
const ALL_STATUS: Status[] = ['Pending','Delivering','Completed','Cancelled']

const STATUS_MAP: Record<string, Status> = {
  PENDING: 'Pending',
  DELIVERY: 'Delivering',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
}

const REVERSE_STATUS: Record<Status, string> = {
  'Pending': 'PENDING',
  'Delivering': 'DELIVERY',
  'Completed': 'COMPLETED',
  'Cancelled': 'CANCELLED'
}

const statusStyle: Record<Status, React.CSSProperties> = {
  'Pending': { background: '#fdf6ec', color: '#6f6143', border: '1px solid #e8d8ae' },
  'Delivering':    { background: '#efe8ff', color: '#6b35a3', border: '1px solid #d0b8f5' },
  'Completed':      { background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba' },
  'Cancelled':       { background: '#fff0f0', color: '#ba1a1a', border: '1px solid #f5c2c2' },
}

const ERROR_MESSAGES: Record<string, string> = {
  "Order is already completed": "Order is already completed and cannot be changed.",
  "Order is currently in delivery": "Order is currently in delivery and cannot be reverted or cancelled.",
  "Order cannot be cancelled in its current status": "Order is already cancelled and cannot be changed."
};

const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'

export default function Orders() {
  const [orders, setOrders] = useState<OrderBE[]>([])
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [detail, setDetail] = useState<OrderBE | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Trạng thái cho modal xác nhận
  const [confirmDialog, setConfirmDialog] = useState<{ id: number, status: Status } | null>(null)

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
    const s = STATUS_MAP[o.status] || 'Pending';
    const ms = filter === 'all' || s === filter;
    const mq = String(o.id).includes(search) || (o.username || '').toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  function handleStatusChange(id: number, status: Status) {
    setConfirmDialog({ id, status });
  }

  async function updateStatus(id: number, status: Status) {
    setConfirmDialog(null);
    try {
      setLoading(true);
      await ordersApi.updateOrderStatus(id, REVERSE_STATUS[status]);
      await fetchOrders();
      toast.success('Update successful', 'Order status has been changed.');
    } catch (error: any) {
      console.error(error);
      const backendMsg = error.response?.data?.detail || error.response?.data?.message;
      const msg = backendMsg ? (ERROR_MESSAGES[backendMsg] || backendMsg) : 'An error occurred, cannot update status.';
      toast.error('Cannot update', msg);
    } finally {
      setLoading(false);
    }
  }

  function printOrder(o: OrderBE) {
    ordersApi.viewInvoice(o.id).catch((err) => {
      console.error(err);
      toast.error('Error', 'Cannot load invoice. Please check your browser popup blocker settings.');
    });
  }

  function formatCarbon(o: OrderBE) {
    return o.orderItems.reduce((acc, i) => acc + (i.lineCarbonFootprint || 0) * i.quantity, 0).toFixed(2);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={SECTION_LABEL}>Sales Management</p>
          <h1 style={PAGE_TITLE}>Orders</h1>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Icon name="Search" size={14} color="#6b7280" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order ID, customer..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.70)', border: '1px solid #dde8d8', borderRadius: 999, padding: '8px 16px 8px 40px', fontSize: 14, color: '#1a1c19', fontFamily: NS, outline: 'none', backdropFilter: 'blur(8px)' }} />
        </div>
        {(['all', ...ALL_STATUS] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            background: filter === s ? 'linear-gradient(to right,#3d6b35,#25521f)' : 'rgba(255,255,255,0.70)',
            color: filter === s ? '#fff' : '#42493e',
            border: '1px solid #dde8d8',
            borderRadius: 999, padding: '7px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            fontFamily: NS, backdropFilter: 'blur(8px)',
          }}>{s === 'all' ? 'All' : s}</button>
        ))}
      </div>

      <div style={GLASS}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Order ID','Customer','Order Date','Total Amount','Green Points','CO₂','Status',''].map(h => (
                  <th key={h} style={{ ...TH, textAlign: h === 'Total Amount' || h === 'Green Points' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const s = STATUS_MAP[o.status] || 'Pending';
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
                  <td style={{ ...TD, textAlign: 'right', ...MONO, fontWeight: 600 }}>{o.totalAmount.toLocaleString('vi-VN')}đ</td>
                  <td style={{ ...TD, textAlign: 'right', ...MONO, fontWeight: 600, color: '#3d6b35' }}>{o.totalGreenPoints || 0} pt</td>
                  <td style={{ ...TD, ...MONO, color: '#6b7280' }}>{formatCarbon(o)} kg</td>
                  <td style={TD}>
                    <select value={s} onChange={e => handleStatusChange(o.id, e.target.value as Status)} disabled={loading}
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
        <div style={{ padding: '10px 16px', fontSize: 12, color: '#6b7280', fontFamily: NS, borderTop: '1px solid #eef2eb' }}>{filtered.length} orders</div>
      </div>

      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #dde8d8', width: '100%', maxWidth: 480, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 18px', borderBottom: '1px solid #eef2eb' }}>
              <div>
                <span style={{ ...MONO, fontWeight: 700, color: '#3d6b35', fontSize: 15 }}>#{detail.id}</span>
                <p style={{ ...SECTION_LABEL, margin: '2px 0 0' }}>{new Date(detail.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              <button onClick={() => setDetail(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 20 }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['Customer', detail.username], ['Payment Method', detail.paymentMethodName], ['Payment Status', detail.paymentStatus], ['Status', '']].map(([lbl, val]) => {
                  const s = STATUS_MAP[detail.status] || 'Pending';
                  return (
                  <div key={lbl} style={{ background: '#f5f9f3', borderRadius: 10, padding: '10px 14px' }}>
                    <p style={{ ...SECTION_LABEL, margin: '0 0 4px', fontSize: 10 }}>{lbl}</p>
                    {lbl === 'Status' ? (
                      <select value={s} onChange={e => handleStatusChange(detail.id, e.target.value as Status)} disabled={loading}
                        style={{ ...statusStyle[s], borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: NS }}>
                        {ALL_STATUS.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    ) : <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1c19', fontFamily: NS }}>{val}</span>}
                  </div>
                )})}
              </div>
              <div>
                <p style={{ ...SECTION_LABEL, fontSize: 10, marginBottom: 8 }}>Products</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {detail.orderItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f5f9f3', borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {item.mainImage && <img src={item.mainImage} alt={item.productName} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1c19', fontFamily: NS }}>{item.productName}</div>
                          <div style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>CO₂: {(item.lineCarbonFootprint || 0) * item.quantity}kg · x{item.quantity}</div>
                        </div>
                      </div>
                      <span style={{ ...MONO, fontSize: 13, fontWeight: 700, color: '#1a1c19' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                    </div>
                  ))}
                </div>
              </div>
              {(() => {
                const discount = detail.discountValue || 0;
                const rawSubtotal = detail.orderItems?.reduce((sum, item) => sum + (item.price || 0), 0) || ((detail.totalAmount || 0) + discount);
                const shipping = rawSubtotal > 0 && rawSubtotal < 200000 ? 30000 : 0;

                return (
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #eef2eb', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#3d6b35', fontFamily: NS }}>🌿 Carbon: <strong>{formatCarbon(detail)} kg CO₂</strong></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#3d6b35', fontFamily: NS }}><Icon name="Award" size={14} color="#3d6b35" /> Green Points: <strong>+{detail.totalGreenPoints || 0} pt</strong></span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, minWidth: 260, background: '#f5f9f3', padding: '16px 20px', borderRadius: 12, border: '1px solid #e2e3de' }}>
                      <div style={{ display: 'flex', justify: 'space-between', width: '100%', fontSize: 13, color: '#6b7280' }}>
                        <span>Total products:</span>
                        <span style={{ color: '#1a1c19', fontWeight: 500 }}>{rawSubtotal.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div style={{ display: 'flex', justify: 'space-between', width: '100%', fontSize: 13, color: '#6b7280' }}>
                        <span>Shipping fee:</span>
                        <span style={{ color: '#1a1c19', fontWeight: 500 }}>{shipping === 0 ? 'Free' : `${shipping.toLocaleString('vi-VN')}đ`}</span>
                      </div>
                      {discount > 0 && (
                        <div style={{ display: 'flex', justify: 'space-between', width: '100%', fontSize: 13, color: '#6b7280' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="Tag" size={12} color="#6b7280" /> Discount code:</span>
                          <span style={{ color: '#25521f', fontWeight: 500 }}>- {discount.toLocaleString('vi-VN')}đ</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid #e2e3de', paddingTop: 10, marginTop: 4, alignItems: 'center' }}>
                        <span style={{ fontSize: 14, color: '#1a1c19' }}>Grand total:</span>
                        <span style={{ ...MONO, fontSize: 18, fontWeight: 700, color: '#1a1c19' }}>{detail.totalAmount.toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eef2eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => printOrder(detail)} style={{ ...BTN_GHOST, display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="Printer" size={13} color="#42493e" /> Print order</button>
              <button onClick={() => setDetail(null)} style={BTN_PRIMARY}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px', width: '100%', maxWidth: 320, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 16, fontFamily: NS, color: '#1a1c19' }}>Confirm change</h3>
            <p style={{ margin: '0 0 24px', fontSize: 14, fontFamily: NS, color: '#6b7280', lineHeight: 1.5 }}>
              Are you sure you want to change order #{confirmDialog.id} to status <strong>{confirmDialog.status}</strong>?
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmDialog(null)} style={BTN_GHOST}>Cancel</button>
              <button onClick={() => updateStatus(confirmDialog.id, confirmDialog.status)} style={BTN_PRIMARY}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
