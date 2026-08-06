import { useState } from 'react'
import { Icon } from './Icon'
import { GLASS, INPUT, BTN_PRIMARY, BTN_GHOST, SECTION_LABEL, PAGE_TITLE, TH, TD, badge, MONO } from './ui'

interface Product {
  id: number; name: string; category: string; price: number; stock: number
  carbonIndex: number; greenPoints: number; ecoFriendliness: string
  status: 'active' | 'deleted'; certificates: string[]
}

const INITIAL: Product[] = [
  { id: 1, name: 'Bamboo Toothbrush Set (Pack of 4)', category: 'Personal Care', price: 149000, stock: 342, carbonIndex: 0.3, greenPoints: 15, ecoFriendliness: 'BIODEGRADABLE', status: 'active', certificates: ['BIODEGRADABLE','BPA FREE'] },
  { id: 2, name: 'Organic Cotton Tote Bag', category: 'Fashion', price: 180000, stock: 215, carbonIndex: 0.2, greenPoints: 18, ecoFriendliness: '100% ORGANIC', status: 'active', certificates: ['100% ORGANIC'] },
  { id: 3, name: 'Reusable Steel Straw Kit', category: 'Food & Beverage', price: 95000, stock: 512, carbonIndex: 0.1, greenPoints: 10, ecoFriendliness: 'ZERO PLASTIC', status: 'active', certificates: ['ZERO PLASTIC','BPA FREE'] },
  { id: 4, name: 'Natural Coconut Bowl Set', category: 'Home & Kitchen', price: 320000, stock: 87, carbonIndex: 0.4, greenPoints: 32, ecoFriendliness: 'BIODEGRADABLE', status: 'active', certificates: ['BIODEGRADABLE'] },
  { id: 5, name: 'Beeswax Food Wraps (Set of 3)', category: 'Home & Kitchen', price: 120000, stock: 198, carbonIndex: 0.2, greenPoints: 12, ecoFriendliness: 'ZERO PLASTIC', status: 'active', certificates: ['ZERO PLASTIC'] },
  { id: 6, name: 'Natural Hemp Soap Bar', category: 'Personal Care', price: 85000, stock: 0, carbonIndex: 0.15, greenPoints: 9, ecoFriendliness: '100% NATURAL', status: 'active', certificates: ['100% NATURAL'] },
  { id: 7, name: 'Insulated Steel Bottle (500ml)', category: 'Travel', price: 420000, stock: 156, carbonIndex: 0.8, greenPoints: 42, ecoFriendliness: 'RECYCLABLE', status: 'active', certificates: ['RECYCLABLE'] },
  { id: 8, name: 'Hemp Canvas Backpack', category: 'Fashion', price: 680000, stock: 44, carbonIndex: 0.6, greenPoints: 68, ecoFriendliness: 'SUSTAINABLE', status: 'active', certificates: ['FSC CERTIFIED'] },
]
const EMPTY: Product = { id: 0, name: '', category: 'Personal Care', price: 0, stock: 0, carbonIndex: 0, greenPoints: 0, ecoFriendliness: 'BIODEGRADABLE', status: 'active', certificates: [] }
const ECO = ['BIODEGRADABLE','100% ORGANIC','ZERO PLASTIC','RECYCLABLE','100% NATURAL','FSC CERTIFIED','BPA FREE','SUSTAINABLE','PLANTABLE','PET SAFE']
const CATS = ['Personal Care','Fashion','Home & Kitchen','Food & Beverage','Travel','Office','Pet']
const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'
const LMONO = '"Liberation Mono","Courier New",monospace'

const carbonBadge = (v: number) => v < 0.3 ? badge('success') : v <= 0.6 ? badge('warning') : badge('danger')

export default function Products() {
  const [products, setProducts] = useState(INITIAL)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<Product | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filtered = products.filter(p => p.status === 'active' && p.name.toLowerCase().includes(search.toLowerCase()))

  function openNew() { setModal({ ...EMPTY, id: Date.now() }); setIsNew(true) }
  function openEdit(p: Product) { setModal({ ...p }); setIsNew(false) }
  function save() {
    if (!modal) return
    isNew ? setProducts(prev => [...prev, modal]) : setProducts(prev => prev.map(p => p.id === modal.id ? modal : p))
    setModal(null)
  }
  function remove(id: number) { setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'deleted' as const } : p)); setDeleteId(null) }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={SECTION_LABEL}>Quản lý kho hàng</p>
          <h1 style={PAGE_TITLE}>Sản phẩm</h1>
        </div>
        <button style={BTN_PRIMARY} onClick={openNew}><Icon name="Plus" size={14} color="#fff" /> Thêm sản phẩm</button>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: 16, position: 'relative', width: 300 }}>
        <Icon name="Search" size={14} color="#6b7280" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm sản phẩm..."
          style={{ ...INPUT, paddingLeft: 40, borderRadius: 999, background: 'rgba(255,255,255,0.70)', backdropFilter: 'blur(8px)' }} />
      </div>

      {/* Table */}
      <div style={GLASS}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Sản phẩm','Danh mục','Giá','Tồn kho','CO₂ (kg)','Eco',''].map(h => (
                  <th key={h} style={{ ...TH, textAlign: h === 'Giá' || h === 'Tồn kho' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ transition: 'background 120ms' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafff8'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <td style={TD}>
                    <div style={{ fontWeight: 500, color: '#1a1c19', fontFamily: NS, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#25521f', fontFamily: NS, marginTop: 2 }}>🌿 {p.greenPoints} pts</div>
                  </td>
                  <td style={{ ...TD, color: '#6b7280', fontFamily: NS }}>{p.category}</td>
                  <td style={{ ...TD, textAlign: 'right', ...MONO, fontWeight: 600, color: '#1a1c19' }}>{p.price.toLocaleString('vi-VN')}đ</td>
                  <td style={{ ...TD, textAlign: 'right', ...MONO, fontWeight: 600, color: p.stock === 0 ? '#ba1a1a' : '#1a1c19' }}>{p.stock}</td>
                  <td style={{ ...TD, textAlign: 'center' }}>
                    <span style={carbonBadge(p.carbonIndex)}>{p.carbonIndex}</span>
                  </td>
                  <td style={TD}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba', borderRadius: 6, padding: '3px 7px', fontFamily: NS }}>
                      {p.ecoFriendliness}
                    </span>
                  </td>
                  <td style={TD}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(p)} style={{ width: 32, height: 32, background: '#f0f7ee', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Pencil" size={14} color="#3d6b35" /></button>
                      <button onClick={() => setDeleteId(p.id)} style={{ width: 32, height: 32, background: '#fff0f0', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Trash2" size={14} color="#ba1a1a" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', fontSize: 12, color: '#6b7280', fontFamily: NS, borderTop: '1px solid #eef2eb' }}>{filtered.length} sản phẩm</div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #dde8d8', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 18px', borderBottom: '1px solid #eef2eb' }}>
              <h2 style={{ fontFamily: NS, fontWeight: 700, fontSize: 18, color: '#1a1c19', margin: 0 }}>{isNew ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 20, lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['Tên sản phẩm *','name','text'] as const].map(([label, field, type]) => (
                <div key={field}>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>{label}</label>
                  <input value={(modal as any)[field]} onChange={e => setModal({ ...modal, [field]: e.target.value })}
                    style={INPUT} onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Danh mục</label>
                  <select value={modal.category} onChange={e => setModal({ ...modal, category: e.target.value })} style={{ ...INPUT, cursor: 'pointer' }}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Eco Friendliness</label>
                  <select value={modal.ecoFriendliness} onChange={e => setModal({ ...modal, ecoFriendliness: e.target.value })} style={{ ...INPUT, cursor: 'pointer' }}>
                    {ECO.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {([['Giá (VNĐ) *','price'],['Tồn kho','stock']] as const).map(([lbl, fld]) => (
                  <div key={fld}>
                    <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>{lbl}</label>
                    <input type="number" value={(modal as any)[fld]} onChange={e => setModal({ ...modal, [fld]: +e.target.value })}
                      style={{ ...INPUT, fontFamily: LMONO }}
                      onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                      onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Carbon Index (kg CO₂) *</label>
                  <input type="number" step="0.01" value={modal.carbonIndex} onChange={e => setModal({ ...modal, carbonIndex: +e.target.value })}
                    style={{ ...INPUT, fontFamily: LMONO }}
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                  <p style={{ fontSize: 11, color: '#6b7280', fontFamily: NS, margin: '4px 0 0' }}>Thấp &lt;0.3 · Trung bình 0.3–0.6 · Cao &gt;0.6</p>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Green Points</label>
                  <input type="number" value={modal.greenPoints} onChange={e => setModal({ ...modal, greenPoints: +e.target.value })}
                    style={{ ...INPUT, fontFamily: LMONO }}
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 8 }}>Chứng nhận xanh</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ECO.map(b => (
                    <button key={b} type="button" onClick={() => {
                      const certs = modal.certificates.includes(b) ? modal.certificates.filter(c => c !== b) : [...modal.certificates, b]
                      setModal({ ...modal, certificates: certs })
                    }} style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.5px',
                      padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: NS,
                      background: modal.certificates.includes(b) ? '#25521f' : '#f5f9f3',
                      color: modal.certificates.includes(b) ? '#ffffff' : '#6b7280',
                      border: modal.certificates.includes(b) ? '1px solid #25521f' : '1px solid #dde8d8',
                    }}>{b}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eef2eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={BTN_GHOST}>Hủy</button>
              <button onClick={save} disabled={!modal.name || modal.price <= 0} style={{ ...BTN_PRIMARY, opacity: (!modal.name || modal.price <= 0) ? 0.5 : 1 }}>
                {isNew ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 360, textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="Trash2" size={22} color="#ba1a1a" />
            </div>
            <h3 style={{ fontFamily: NS, fontWeight: 700, fontSize: 17, color: '#1a1c19', margin: '0 0 8px' }}>Xóa sản phẩm?</h3>
            <p style={{ fontSize: 13, color: '#6b7280', fontFamily: NS, margin: '0 0 22px' }}>Sản phẩm sẽ bị ẩn khỏi hệ thống (soft delete).</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ ...BTN_GHOST, flex: 1, justifyContent: 'center' }}>Hủy</button>
              <button onClick={() => remove(deleteId)} style={{ flex: 1, background: '#ba1a1a', color: '#fff', border: 'none', borderRadius: 999, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: NS }}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
