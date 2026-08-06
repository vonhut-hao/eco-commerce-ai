import { useState } from 'react'
import { Icon } from './Icon'
import { GLASS, INPUT, BTN_PRIMARY, BTN_GHOST, SECTION_LABEL, PAGE_TITLE, MONO } from './ui'

interface Coupon {
  id: number; code: string; discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number; minOrderValue: number; maxUsage: number
  usedCount: number; expiredAt: string; isActive: boolean
}

const INIT: Coupon[] = [
  { id: 1, code: 'GREEN10',    discountType: 'PERCENTAGE', discountValue: 10,  minOrderValue: 200000, maxUsage: 500, usedCount: 234, expiredAt: '2026-12-31', isActive: true },
  { id: 2, code: 'ECO50K',     discountType: 'FIXED',      discountValue: 50000,  minOrderValue: 300000, maxUsage: 200, usedCount: 89,  expiredAt: '2026-09-30', isActive: true },
  { id: 3, code: 'NEWUSER15',  discountType: 'PERCENTAGE', discountValue: 15,  minOrderValue: 0,      maxUsage: 1000, usedCount: 612, expiredAt: '2026-08-31', isActive: true },
  { id: 4, code: 'FLASH20',    discountType: 'PERCENTAGE', discountValue: 20,  minOrderValue: 500000, maxUsage: 100, usedCount: 100, expiredAt: '2026-07-15', isActive: false },
  { id: 5, code: 'SUMMER100K', discountType: 'FIXED',      discountValue: 100000, minOrderValue: 800000, maxUsage: 50,  usedCount: 12,  expiredAt: '2026-10-15', isActive: true },
]
const EMPTY: Omit<Coupon, 'id' | 'usedCount'> = { code: '', discountType: 'PERCENTAGE', discountValue: 10, minOrderValue: 0, maxUsage: 100, expiredAt: '2026-12-31', isActive: true }
const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'
const LMONO = '"Liberation Mono","Courier New",monospace'

export default function Coupons() {
  const [coupons, setCoupons] = useState(INIT)
  const [modal, setModal] = useState<(Omit<Coupon,'id'|'usedCount'> & { id?: number }) | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  function openNew() { setModal({ ...EMPTY }); setIsNew(true) }
  function openEdit(c: Coupon) { setModal({ id: c.id, code: c.code, discountType: c.discountType, discountValue: c.discountValue, minOrderValue: c.minOrderValue, maxUsage: c.maxUsage, expiredAt: c.expiredAt, isActive: c.isActive }); setIsNew(false) }
  function save() {
    if (!modal) return
    isNew ? setCoupons(prev => [...prev, { ...modal, id: Date.now(), usedCount: 0 } as Coupon]) : setCoupons(prev => prev.map(c => c.id === modal.id ? { ...c, ...modal } : c))
    setModal(null)
  }

  const isExpired = (d: string) => new Date(d) < new Date()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div><p style={SECTION_LABEL}>Khuyến mãi & ưu đãi</p><h1 style={PAGE_TITLE}>Mã giảm giá</h1></div>
        <button style={BTN_PRIMARY} onClick={openNew}><Icon name="Plus" size={14} color="#fff" /> Tạo mã mới</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {coupons.map(c => {
          const expired = isExpired(c.expiredAt)
          const pct = Math.min(Math.round((c.usedCount / c.maxUsage) * 100), 100)
          const dimmed = !c.isActive || expired

          return (
            <div key={c.id} style={{ ...GLASS, padding: 20, opacity: dimmed ? 0.6 : 1, borderLeft: `4px solid ${c.isActive && !expired ? '#3d6b35' : '#d1d5db'}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ ...MONO, fontWeight: 700, fontSize: 20, color: '#1a1c19', letterSpacing: '0.05em' }}>{c.code}</div>
                  <div style={{ fontSize: 13, color: '#6b7280', fontFamily: NS, marginTop: 2 }}>
                    {c.discountType === 'PERCENTAGE' ? `Giảm ${c.discountValue}%` : `Giảm ${c.discountValue.toLocaleString('vi-VN')}đ`}
                    {c.minOrderValue > 0 && ` · Min ${(c.minOrderValue/1000).toFixed(0)}K`}
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', fontFamily: NS, borderRadius: 6, padding: '3px 8px',
                  ...(expired ? { background: '#f5f5f0', color: '#6b7280', border: '1px solid #e0e0d8' } : c.isActive ? { background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba' } : { background: '#f5f5f0', color: '#6b7280', border: '1px solid #e0e0d8' }),
                }}>
                  {expired ? 'HẾT HẠN' : c.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>Đã dùng: {c.usedCount}/{c.maxUsage}</span>
                  <span style={{ ...MONO, fontSize: 11, color: '#3d6b35', fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: '#eef2eb', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(to right,#3d6b35,#5a9448)', borderRadius: 999, transition: 'width 400ms' }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>
                  Hết hạn: {new Date(c.expiredAt).toLocaleDateString('vi-VN')}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(c)} style={{ width: 30, height: 30, background: '#f0f7ee', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Pencil" size={13} color="#3d6b35" /></button>
                  <button onClick={() => setDeleteId(c.id)} style={{ width: 30, height: 30, background: '#fff0f0', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Trash2" size={13} color="#ba1a1a" /></button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #dde8d8', width: '100%', maxWidth: 440, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 18px', borderBottom: '1px solid #eef2eb' }}>
              <h2 style={{ fontFamily: NS, fontWeight: 700, fontSize: 18, color: '#1a1c19', margin: 0 }}>{isNew ? 'Tạo mã giảm giá' : 'Chỉnh sửa mã'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 20 }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Mã giảm giá *</label>
                <input value={modal.code} onChange={e => setModal({ ...modal, code: e.target.value.toUpperCase() })} placeholder="VD: GREEN10"
                  style={{ ...INPUT, fontFamily: LMONO, fontWeight: 700, fontSize: 16, letterSpacing: '0.05em' }}
                  onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                  onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Loại giảm giá</label>
                  <select value={modal.discountType} onChange={e => setModal({ ...modal, discountType: e.target.value as 'PERCENTAGE' | 'FIXED' })} style={{ ...INPUT, cursor: 'pointer' }}>
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED">Số tiền cố định</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Giá trị {modal.discountType === 'PERCENTAGE' ? '(%)' : '(VNĐ)'}</label>
                  <input type="number" value={modal.discountValue} onChange={e => setModal({ ...modal, discountValue: +e.target.value })}
                    style={{ ...INPUT, fontFamily: LMONO }}
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Đơn tối thiểu (VNĐ)</label>
                  <input type="number" value={modal.minOrderValue} onChange={e => setModal({ ...modal, minOrderValue: +e.target.value })}
                    style={{ ...INPUT, fontFamily: LMONO }}
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Số lượt tối đa</label>
                  <input type="number" value={modal.maxUsage} onChange={e => setModal({ ...modal, maxUsage: +e.target.value })}
                    style={{ ...INPUT, fontFamily: LMONO }}
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Ngày hết hạn</label>
                <input type="date" value={modal.expiredAt} onChange={e => setModal({ ...modal, expiredAt: e.target.value })}
                  style={INPUT}
                  onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                  onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={modal.isActive} onChange={e => setModal({ ...modal, isActive: e.target.checked })} style={{ accentColor: '#3d6b35', width: 16, height: 16 }} />
                <span style={{ fontSize: 14, color: '#1a1c19', fontFamily: NS }}>Kích hoạt ngay</span>
              </label>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eef2eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={BTN_GHOST}>Hủy</button>
              <button onClick={save} disabled={!modal.code} style={{ ...BTN_PRIMARY, opacity: !modal.code ? 0.5 : 1 }}>{isNew ? 'Tạo mã' : 'Lưu thay đổi'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 340, textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Icon name="Trash2" size={22} color="#ba1a1a" /></div>
            <h3 style={{ fontFamily: NS, fontWeight: 700, fontSize: 17, color: '#1a1c19', margin: '0 0 8px' }}>Xóa mã giảm giá?</h3>
            <p style={{ fontSize: 13, color: '#6b7280', fontFamily: NS, margin: '0 0 22px' }}>Thao tác này không thể hoàn tác.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ ...BTN_GHOST, flex: 1, justifyContent: 'center' }}>Hủy</button>
              <button onClick={() => { setCoupons(prev => prev.filter(c => c.id !== deleteId)); setDeleteId(null) }} style={{ flex: 1, background: '#ba1a1a', color: '#fff', border: 'none', borderRadius: 999, padding: '9px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: NS }}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
