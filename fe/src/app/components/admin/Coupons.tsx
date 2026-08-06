import { useState, useEffect } from 'react'
import { Icon } from './Icon'
import { GLASS, INPUT, BTN_PRIMARY, BTN_GHOST, SECTION_LABEL, PAGE_TITLE, MONO } from './ui'
import { promotionsApi, Promotion, PromotionRequest } from '../../../api/promotions'

const EMPTY: PromotionRequest = { 
  code: '', name: '', discountType: 'PERCENTAGE', discountValue: 10, 
  minOrderValue: 0, usageLimit: 100, usedCount: 0, 
  startDate: new Date().toISOString().slice(0, 16), 
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), 
  isActive: true 
}

const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'
const LMONO = '"Liberation Mono","Courier New",monospace'

export default function Coupons() {
  const [coupons, setCoupons] = useState<Promotion[]>([])
  const [modal, setModal] = useState<(PromotionRequest & { id?: number }) | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await promotionsApi.getAll()
      setCoupons(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function openNew() { 
    setModal({ ...EMPTY, startDate: new Date().toISOString().slice(0, 16), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16) })
    setIsNew(true) 
  }

  function openEdit(c: Promotion) { 
    setModal({ 
      id: c.id, code: c.code, name: c.name, description: c.description || '', 
      discountType: c.discountType, discountValue: c.discountValue, 
      minOrderValue: c.minOrderValue, usageLimit: c.usageLimit, usedCount: c.usedCount,
      startDate: c.startDate ? c.startDate.slice(0, 16) : '', 
      endDate: c.endDate ? c.endDate.slice(0, 16) : '', 
      isActive: c.isActive 
    })
    setIsNew(false) 
  }

  async function save() {
    if (!modal) return
    try {
      // Ensure required fields
      const dataToSave = {
        ...modal,
        name: modal.name || modal.code,
        startDate: new Date(modal.startDate).toISOString(),
        endDate: new Date(modal.endDate).toISOString(),
      }
      
      if (isNew) {
        await promotionsApi.create(dataToSave)
      } else {
        await promotionsApi.update(modal.id!, dataToSave)
      }
      load()
      setModal(null)
    } catch (e) {
      console.error(e)
    }
  }

  const isExpired = (d: string) => new Date(d) < new Date()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div><p style={SECTION_LABEL}>Khuyến mãi & ưu đãi</p><h1 style={PAGE_TITLE}>Mã giảm giá</h1></div>
        <button style={BTN_PRIMARY} onClick={openNew}><Icon name="Plus" size={14} color="#fff" /> Tạo mã mới</button>
      </div>

      {loading ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>Đang tải...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {coupons.map(c => {
            const expired = isExpired(c.endDate)
            const pct = Math.min(Math.round(((c.usedCount || 0) / (c.usageLimit || 1)) * 100), 100)
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

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>Đã dùng: {c.usedCount}/{c.usageLimit}</span>
                    <span style={{ ...MONO, fontSize: 11, color: '#3d6b35', fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 5, background: '#eef2eb', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(to right,#3d6b35,#5a9448)', borderRadius: 999, transition: 'width 400ms' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>
                    Hết hạn: {new Date(c.endDate).toLocaleDateString('vi-VN')}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(c)} style={{ width: 30, height: 30, background: '#f0f7ee', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Pencil" size={13} color="#3d6b35" /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

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
                  <select value={modal.discountType} onChange={e => setModal({ ...modal, discountType: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT' })} style={{ ...INPUT, cursor: 'pointer' }}>
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED_AMOUNT">Số tiền cố định</option>
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
                  <input type="number" value={modal.usageLimit} onChange={e => setModal({ ...modal, usageLimit: +e.target.value })}
                    style={{ ...INPUT, fontFamily: LMONO }}
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Ngày bắt đầu</label>
                  <input type="datetime-local" value={modal.startDate} onChange={e => setModal({ ...modal, startDate: e.target.value })}
                    style={INPUT}
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Ngày hết hạn</label>
                  <input type="datetime-local" value={modal.endDate} onChange={e => setModal({ ...modal, endDate: e.target.value })}
                    style={INPUT}
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
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
    </div>
  )
}
