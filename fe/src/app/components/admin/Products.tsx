import { useState, useEffect } from 'react'
import { Icon } from './Icon'
import { GLASS, INPUT, BTN_PRIMARY, BTN_GHOST, SECTION_LABEL, PAGE_TITLE, TH, TD, badge, MONO } from './ui'
import { productsApi, ProductBE, CategoryBE } from '../../../api/products'

interface ProductForm {
  id: number;
  name: string;
  categoryId: number | null;
  price: number;
  stock: number;
  carbonIndex: number;
  greenPoints: number;
  ecoFriendliness: string;
  description: string;
  mainImage: string;
  subImagesRaw: string;
}

const EMPTY: ProductForm = { id: 0, name: '', categoryId: null, price: 0, stock: 0, carbonIndex: 0, greenPoints: 0, ecoFriendliness: 'BIODEGRADABLE', description: '', mainImage: '', subImagesRaw: '' }
const ECO = ['BIODEGRADABLE','100% ORGANIC','ZERO PLASTIC','RECYCLABLE','100% NATURAL','FSC CERTIFIED','BPA FREE','SUSTAINABLE','PLANTABLE','PET SAFE']
const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'
const LMONO = '"Liberation Mono","Courier New",monospace'

const carbonBadge = (v: number) => v < 0.3 ? badge('success') : v <= 0.6 ? badge('warning') : badge('danger')

export default function Products() {
  const [products, setProducts] = useState<ProductBE[]>([])
  const [categories, setCategories] = useState<CategoryBE[]>([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<ProductForm | null>(null)
  const [certModal, setCertModal] = useState<ProductBE | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Cert Form State
  const [certForm, setCertForm] = useState({ name: '', issuer: '', issueDate: '', imageUrl: '' })

  const fetchProducts = async () => {
    try {
      const res = await productsApi.getProducts(0, 1000);
      setProducts(res.content);
      // Update certModal if it's open
      setCertModal(prev => prev ? (res.content.find(p => p.id === prev.id) || prev) : null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    productsApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  function openNew() { 
    setModal({ ...EMPTY, categoryId: categories.length > 0 ? categories[0].id : null }); 
    setIsNew(true) 
  }
  
  function openEdit(p: ProductBE) { 
    setModal({ 
      id: p.id,
      name: p.name,
      categoryId: p.categories?.[0]?.id || (categories.length > 0 ? categories[0].id : null),
      price: p.price,
      stock: p.stock,
      carbonIndex: p.carbonIndex || 0,
      greenPoints: p.greenPoints || 0,
      ecoFriendliness: p.ecoFriendliness || 'BIODEGRADABLE',
      description: p.description || '',
      mainImage: p.mainImage || '',
      subImagesRaw: p.subImages?.join('\n') || ''
    }); 
    setIsNew(false) 
  }

  async function save() {
    if (!modal) return;
    setLoading(true);
    try {
      const req = {
        name: modal.name,
        price: modal.price,
        stock: modal.stock,
        greenPoints: modal.greenPoints,
        ecoFriendliness: modal.ecoFriendliness,
        carbonIndex: modal.carbonIndex,
        categoryIds: modal.categoryId ? [modal.categoryId] : [],
        description: modal.description,
        mainImage: modal.mainImage,
        subImages: modal.subImagesRaw.split('\n').map(s => s.trim()).filter(Boolean),
      };
      
      if (isNew) {
        await productsApi.createProduct(req);
      } else {
        await productsApi.updateProduct(modal.id, req);
      }
      await fetchProducts();
      setModal(null);
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  }

  async function remove() { 
    if (!deleteId) return;
    setLoading(true);
    try {
      await productsApi.deleteProduct(deleteId);
      await fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi xóa sản phẩm');
    } finally {
      setDeleteId(null);
      setLoading(false);
    }
  }
  
  async function addCertificate(e: React.FormEvent) {
    e.preventDefault();
    if (!certModal) return;
    setLoading(true);
    try {
      await productsApi.createGreenCertificate({
        ...certForm,
        productId: certModal.id
      });
      setCertForm({ name: '', issuer: '', issueDate: '', imageUrl: '' });
      await fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi thêm chứng chỉ');
    } finally {
      setLoading(false);
    }
  }
  
  async function removeCertificate(certId: number) {
    if (!confirm('Bạn có chắc muốn xóa chứng chỉ này?')) return;
    setLoading(true);
    try {
      await productsApi.deleteGreenCertificate(certId);
      await fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi xóa chứng chỉ');
    } finally {
      setLoading(false);
    }
  }

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
                {['Sản phẩm','Danh mục','Giá','Tồn kho','CO₂ (kg)','Eco','Chứng chỉ',''].map(h => (
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
                    <div style={{ fontSize: 11, color: '#25521f', fontFamily: NS, marginTop: 2 }}>🌿 {p.greenPoints || 0} pts</div>
                  </td>
                  <td style={{ ...TD, color: '#6b7280', fontFamily: NS }}>{p.categories?.[0]?.name || 'Chưa phân loại'}</td>
                  <td style={{ ...TD, textAlign: 'right', ...MONO, fontWeight: 600, color: '#1a1c19' }}>{p.price.toLocaleString('vi-VN')}đ</td>
                  <td style={{ ...TD, textAlign: 'right', ...MONO, fontWeight: 600, color: p.stock === 0 ? '#ba1a1a' : '#1a1c19' }}>{p.stock}</td>
                  <td style={{ ...TD, textAlign: 'center' }}>
                    <span style={carbonBadge(p.carbonIndex || 0)}>{p.carbonIndex || 0}</span>
                  </td>
                  <td style={TD}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba', borderRadius: 6, padding: '3px 7px', fontFamily: NS }}>
                      {p.ecoFriendliness || 'ECO'}
                    </span>
                  </td>
                  <td style={TD}>
                    <button onClick={() => setCertModal(p)} style={{ background: 'transparent', border: '1px solid #c2deba', color: '#3d6b35', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: NS, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="Award" size={12} color="#3d6b35" />
                      {p.greenCertificates?.length || 0}
                    </button>
                  </td>
                  <td style={TD}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(p)} style={{ width: 32, height: 32, background: '#f0f7ee', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Pencil" size={14} color="#3d6b35" /></button>
                      <button onClick={() => setDeleteId(p.id)} style={{ width: 32, height: 32, background: '#fff0f0', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Trash2" size={14} color="#ba1a1a" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ ...TD, textAlign: 'center', color: '#6b7280' }}>Không tìm thấy sản phẩm nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', fontSize: 12, color: '#6b7280', fontFamily: NS, borderTop: '1px solid #eef2eb' }}>{filtered.length} sản phẩm</div>
      </div>

      {/* Product Modal */}
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
                  <select value={modal.categoryId || ''} onChange={e => setModal({ ...modal, categoryId: +e.target.value })} style={{ ...INPUT, cursor: 'pointer' }}>
                    <option value="" disabled>-- Chọn --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Eco Friendliness</label>
                  <input list="eco-list" value={modal.ecoFriendliness} onChange={e => setModal({ ...modal, ecoFriendliness: e.target.value })} 
                    style={INPUT} placeholder="Nhập hoặc chọn..." 
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                  <datalist id="eco-list">
                    {ECO.map(b => <option key={b} value={b} />)}
                  </datalist>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Link hình ảnh chính</label>
                  <input value={modal.mainImage} onChange={e => setModal({ ...modal, mainImage: e.target.value })}
                    style={INPUT} placeholder="https://..."
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Link ảnh phụ (mỗi ảnh 1 dòng)</label>
                  <textarea value={modal.subImagesRaw} onChange={e => setModal({ ...modal, subImagesRaw: e.target.value })} rows={2}
                    style={{ ...INPUT, resize: 'vertical' }} placeholder="https://...&#10;https://..."
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Mô tả sản phẩm</label>
                <textarea value={modal.description} onChange={e => setModal({ ...modal, description: e.target.value })} rows={3}
                  style={{ ...INPUT, resize: 'vertical' }}
                  onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                  onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
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
              <div style={{ padding: '12px 16px', background: '#f5f9f3', borderRadius: 12, border: '1px dashed #c2deba' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#3d6b35' }}>
                  <Icon name="Info" size={14} color="#3d6b35" />
                  <span style={{ fontSize: 12, fontFamily: NS, fontWeight: 500 }}>Quản lý Chứng nhận xanh</span>
                </div>
                <p style={{ fontSize: 11, color: '#6b7280', fontFamily: NS, margin: '6px 0 0', lineHeight: 1.5 }}>
                  Chứng nhận xanh hiện được quản lý ở một luồng riêng. Hãy lưu thông tin sản phẩm tại đây trước, sau đó ấn vào biểu tượng 🎖️ ở cột "Chứng chỉ" ngoài danh sách để thêm hoặc xóa chứng nhận.
                </p>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eef2eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={BTN_GHOST}>Hủy</button>
              <button onClick={save} disabled={!modal.name || modal.price <= 0 || loading} style={{ ...BTN_PRIMARY, opacity: (!modal.name || modal.price <= 0 || loading) ? 0.5 : 1 }}>
                {loading ? 'Đang lưu...' : (isNew ? 'Thêm sản phẩm' : 'Lưu thay đổi')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cert Modal */}
      {certModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #dde8d8', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 18px', borderBottom: '1px solid #eef2eb' }}>
              <div>
                <h2 style={{ fontFamily: NS, fontWeight: 700, fontSize: 18, color: '#1a1c19', margin: '0 0 4px' }}>Quản lý chứng nhận xanh</h2>
                <p style={{ fontSize: 13, color: '#6b7280', fontFamily: NS, margin: 0 }}>{certModal.name}</p>
              </div>
              <button onClick={() => setCertModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 20, lineHeight: 1 }}>✕</button>
            </div>
            
            <div style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1a1c19', fontFamily: NS, margin: '0 0 12px' }}>Danh sách chứng nhận</h3>
              {(!certModal.greenCertificates || certModal.greenCertificates.length === 0) ? (
                <div style={{ padding: '20px', textAlign: 'center', background: '#f5f9f3', borderRadius: 12, border: '1px dashed #c2deba', fontSize: 13, color: '#6b7280', fontFamily: NS, marginBottom: 24 }}>
                  Chưa có chứng nhận nào
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {certModal.greenCertificates.map(c => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#fcfdfb', border: '1px solid #eef2eb', borderRadius: 12 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1c19', fontFamily: NS }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, marginTop: 4 }}>Bởi: {c.issuer} · {c.issueDate}</div>
                      </div>
                      <button onClick={() => removeCertificate(c.id)} disabled={loading} style={{ background: '#fff0f0', border: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
                        <Icon name="Trash2" size={14} color="#ba1a1a" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1a1c19', fontFamily: NS, margin: '0 0 12px', borderTop: '1px solid #eef2eb', paddingTop: 20 }}>Thêm chứng nhận mới</h3>
              <form onSubmit={addCertificate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Tên chứng nhận *</label>
                  <input required value={certForm.name} onChange={e => setCertForm({ ...certForm, name: e.target.value })} style={INPUT} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Tổ chức cấp (Issuer) *</label>
                  <input required value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} style={INPUT} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Ngày cấp *</label>
                    <input required type="date" value={certForm.issueDate} onChange={e => setCertForm({ ...certForm, issueDate: e.target.value })} style={INPUT} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Link hình ảnh logo (tuỳ chọn)</label>
                    <input value={certForm.imageUrl} onChange={e => setCertForm({ ...certForm, imageUrl: e.target.value })} style={INPUT} placeholder="https://..." />
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{ ...BTN_PRIMARY, marginTop: 10, alignSelf: 'flex-end', opacity: loading ? 0.5 : 1 }}>
                  {loading ? 'Đang thêm...' : 'Thêm chứng nhận'}
                </button>
              </form>
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
            <p style={{ fontSize: 13, color: '#6b7280', fontFamily: NS, margin: '0 0 22px' }}>Sản phẩm sẽ bị xóa khỏi hệ thống.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ ...BTN_GHOST, flex: 1, justifyContent: 'center' }}>Hủy</button>
              <button onClick={() => remove()} disabled={loading} style={{ flex: 1, background: '#ba1a1a', color: '#fff', border: 'none', borderRadius: 999, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: NS, opacity: loading ? 0.5 : 1 }}>
                {loading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
