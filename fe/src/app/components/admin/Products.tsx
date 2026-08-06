import { useState, useEffect } from 'react'
import { Icon } from './Icon'
import { GLASS, INPUT, BTN_PRIMARY, BTN_GHOST, SECTION_LABEL, PAGE_TITLE, TH, TD, badge, MONO } from './ui'
import { productsApi, ProductBE, CategoryBE } from '../../../api/products'
import { uploadApi } from '../../../api/upload'

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
  const [filterCategory, setFilterCategory] = useState<number | 'ALL'>('ALL')
  const [filterStock, setFilterStock] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL')
  const [modal, setModal] = useState<ProductForm | null>(null)
  const [certModal, setCertModal] = useState<ProductBE | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
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

  const getCategoryIdsToFilter = (catId: number | 'ALL'): (number | 'ALL')[] => {
    if (catId === 'ALL') return ['ALL'];
    const subs = categories.filter(c => c.parentId === catId).map(c => c.id);
    return [catId, ...subs];
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    
    const targetCatIds = getCategoryIdsToFilter(filterCategory);
    const matchCat = filterCategory === 'ALL' || (p.categories && p.categories.some(cat => targetCatIds.includes(cat.id)))
    
    const matchStock = filterStock === 'ALL' || (filterStock === 'IN_STOCK' ? p.stock > 0 : p.stock === 0)
    return matchSearch && matchCat && matchStock
  })

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
      alert('An error occurred while saving the product');
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
      alert('An error occurred while deleting the product');
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
      alert('An error occurred while adding the certificate');
    } finally {
      setLoading(false);
    }
  }
  
  async function removeCertificate(certId: number) {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    setLoading(true);
    try {
      await productsApi.deleteGreenCertificate(certId);
      await fetchProducts();
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the certificate');
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadMain(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !modal) return
    setUploadingImage(true)
    try {
      const url = await uploadApi.uploadImage(file)
      setModal({ ...modal, mainImage: url })
    } catch (err) {
      console.error(err)
      alert('An error occurred while uploading image')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleUploadSub(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length || !modal) return
    setUploadingImage(true)
    try {
      const urls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const url = await uploadApi.uploadImage(files[i])
        urls.push(url)
      }
      const existing = modal.subImagesRaw ? modal.subImagesRaw.split('\n').map(s => s.trim()).filter(Boolean) : []
      const combined = [...existing, ...urls]
      setModal({ ...modal, subImagesRaw: combined.join('\n') })
      toast.success('Upload Successful', `Uploaded ${urls.length} sub-image(s).`);
    } catch (err) {
      console.error(err)
      toast.error('Upload Error', 'An error occurred while uploading sub images');
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  function removeSubImage(indexToRemove: number) {
    if (!modal) return
    const list = modal.subImagesRaw.split('\n').map(s => s.trim()).filter(Boolean)
    const updated = list.filter((_, idx) => idx !== indexToRemove)
    setModal({ ...modal, subImagesRaw: updated.join('\n') })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={SECTION_LABEL}>Inventory Management</p>
          <h1 style={PAGE_TITLE}>Products</h1>
        </div>
        <button style={BTN_PRIMARY} onClick={openNew}><Icon name="Plus" size={14} color="#fff" /> Add product</button>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative', width: 260 }}>
          <Icon name="Search" size={14} color="#6b7280" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            style={{ ...INPUT, paddingLeft: 40, borderRadius: 999, background: 'rgba(255,255,255,0.70)', backdropFilter: 'blur(8px)' }} />
        </div>
        
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
          style={{ ...INPUT, width: 180, borderRadius: 999, background: 'rgba(255,255,255,0.70)', backdropFilter: 'blur(8px)', cursor: 'pointer' }}>
          <option value="ALL">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select value={filterStock} onChange={e => setFilterStock(e.target.value as any)}
          style={{ ...INPUT, width: 140, borderRadius: 999, background: 'rgba(255,255,255,0.70)', backdropFilter: 'blur(8px)', cursor: 'pointer' }}>
          <option value="ALL">Inventory</option>
          <option value="IN_STOCK">In stock</option>
          <option value="OUT_OF_STOCK">Out of stock</option>
        </select>
      </div>

      {/* Table */}
      <div style={GLASS}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Product','Category','Price','Stock','CO₂ (kg)','Eco','Certificates',''].map(h => (
                  <th key={h} style={{ ...TH, textAlign: h === 'Price' || h === 'Stock' ? 'right' : 'left' }}>{h}</th>
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
                  <td style={{ ...TD, color: '#6b7280', fontFamily: NS }}>{p.categories?.[0]?.name || 'Uncategorized'}</td>
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
                  <td colSpan={8} style={{ ...TD, textAlign: 'center', color: '#6b7280' }}>No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', fontSize: 12, color: '#6b7280', fontFamily: NS, borderTop: '1px solid #eef2eb' }}>{filtered.length} products</div>
      </div>

      {/* Product Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #dde8d8', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 18px', borderBottom: '1px solid #eef2eb' }}>
              <h2 style={{ fontFamily: NS, fontWeight: 700, fontSize: 18, color: '#1a1c19', margin: 0 }}>{isNew ? 'Add new product' : 'Edit product'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 20, lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['Product Name *','name','text'] as const].map(([label, field, type]) => (
                <div key={field}>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>{label}</label>
                  <input value={(modal as any)[field]} onChange={e => setModal({ ...modal, [field]: e.target.value })}
                    style={INPUT} onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Category</label>
                  <select value={modal.categoryId || ''} onChange={e => setModal({ ...modal, categoryId: +e.target.value })} style={{ ...INPUT, cursor: 'pointer' }}>
                    <option value="" disabled>-- Select --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Eco Friendliness</label>
                  <input list="eco-list" value={modal.ecoFriendliness} onChange={e => setModal({ ...modal, ecoFriendliness: e.target.value })} 
                    style={INPUT} placeholder="Enter or select..." 
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                  <datalist id="eco-list">
                    {ECO.map(b => <option key={b} value={b} />)}
                  </datalist>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS }}>Main image link</label>
                    <label style={{ fontSize: 11, color: '#3d6b35', cursor: 'pointer', fontFamily: NS, fontWeight: 600 }}>
                      {uploadingImage ? 'Loading...' : 'Upload image'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUploadMain} disabled={uploadingImage} />
                    </label>
                  </div>
                  <input value={modal.mainImage} onChange={e => setModal({ ...modal, mainImage: e.target.value })}
                    style={INPUT} placeholder="https://..."
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, fontWeight: 500 }}>
                      Sub Images ({modal.subImagesRaw.split('\n').map(s => s.trim()).filter(Boolean).length})
                    </label>
                    <label style={{
                      fontSize: 12, color: '#25521f', cursor: uploadingImage ? 'not-allowed' : 'pointer',
                      fontFamily: NS, fontWeight: 600, background: '#f0f7ee', border: '1px solid #c2deba',
                      borderRadius: 8, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6,
                      opacity: uploadingImage ? 0.6 : 1
                    }}>
                      <Icon name="UploadCloud" size={14} color="#25521f" />
                      {uploadingImage ? 'Uploading...' : '+ Upload Multiple Sub-Images'}
                      <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleUploadSub} disabled={uploadingImage} />
                    </label>
                  </div>

                  {/* Sub images thumbnail list */}
                  {(() => {
                    const subList = modal.subImagesRaw.split('\n').map(s => s.trim()).filter(Boolean);
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {subList.length > 0 && (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', background: '#fafaf5', border: '1px solid #e2e3de', padding: 10, borderRadius: 12, maxHeight: 160, overflowY: 'auto' }}>
                            {subList.map((url, idx) => (
                              <div key={idx} style={{ position: 'relative', width: 64, height: 64, borderRadius: 8, overflow: 'hidden', border: '1px solid #c2c9bb', background: '#fff', flexShrink: 0 }}>
                                <img src={url} alt={`Sub ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                                <button
                                  type="button"
                                  onClick={() => removeSubImage(idx)}
                                  style={{
                                    position: 'absolute', top: 2, right: 2, background: 'rgba(186,26,26,0.85)',
                                    color: '#fff', border: 'none', borderRadius: 999, width: 18, height: 18,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    fontSize: 10, fontWeight: 700
                                  }}
                                  title="Remove image"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <textarea
                          value={modal.subImagesRaw}
                          onChange={e => setModal({ ...modal, subImagesRaw: e.target.value })}
                          rows={2}
                          style={{ ...INPUT, resize: 'vertical', fontSize: 12, fontFamily: LMONO }}
                          placeholder="Sub image URLs (one per line or upload multiple images above)..."
                          onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                          onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }}
                        />
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Product description</label>
                <textarea value={modal.description} onChange={e => setModal({ ...modal, description: e.target.value })} rows={3}
                  style={{ ...INPUT, resize: 'vertical' }}
                  onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                  onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {([['Price (VND) *','price'],['Stock','stock']] as const).map(([lbl, fld]) => (
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
                  <p style={{ fontSize: 11, color: '#6b7280', fontFamily: NS, margin: '4px 0 0' }}>Low &lt;0.3 · Medium 0.3–0.6 · High &gt;0.6</p>
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
                  <span style={{ fontSize: 12, fontFamily: NS, fontWeight: 500 }}>Manage Green Certificates</span>
                </div>
                <p style={{ fontSize: 11, color: '#6b7280', fontFamily: NS, margin: '6px 0 0', lineHeight: 1.5 }}>
                  Green certificates are managed in a separate flow. Please save product info here first, then click the 🎖️ icon in the list to manage certificates.
                </p>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eef2eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={BTN_GHOST}>Cancel</button>
              <button onClick={save} disabled={!modal.name || modal.price <= 0 || loading} style={{ ...BTN_PRIMARY, opacity: (!modal.name || modal.price <= 0 || loading) ? 0.5 : 1 }}>
                {loading ? 'Saving...' : (isNew ? 'Add product' : 'Save changes')}
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
                <h2 style={{ fontFamily: NS, fontWeight: 700, fontSize: 18, color: '#1a1c19', margin: '0 0 4px' }}>Manage green certificates</h2>
                <p style={{ fontSize: 13, color: '#6b7280', fontFamily: NS, margin: 0 }}>{certModal.name}</p>
              </div>
              <button onClick={() => setCertModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 20, lineHeight: 1 }}>✕</button>
            </div>
            
            <div style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1a1c19', fontFamily: NS, margin: '0 0 12px' }}>Certificate list</h3>
              {(!certModal.greenCertificates || certModal.greenCertificates.length === 0) ? (
                <div style={{ padding: '20px', textAlign: 'center', background: '#f5f9f3', borderRadius: 12, border: '1px dashed #c2deba', fontSize: 13, color: '#6b7280', fontFamily: NS, marginBottom: 24 }}>
                  No certificates yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {certModal.greenCertificates.map(c => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#fcfdfb', border: '1px solid #eef2eb', borderRadius: 12 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1c19', fontFamily: NS }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, marginTop: 4 }}>By: {c.issuer} · {c.issueDate}</div>
                      </div>
                      <button onClick={() => removeCertificate(c.id)} disabled={loading} style={{ background: '#fff0f0', border: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
                        <Icon name="Trash2" size={14} color="#ba1a1a" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1a1c19', fontFamily: NS, margin: '0 0 12px', borderTop: '1px solid #eef2eb', paddingTop: 20 }}>Add new certificate</h3>
              <form onSubmit={addCertificate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Certificate name *</label>
                  <input required value={certForm.name} onChange={e => setCertForm({ ...certForm, name: e.target.value })} style={INPUT} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Issuer *</label>
                  <input required value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} style={INPUT} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Issue date *</label>
                    <input required type="date" value={certForm.issueDate} onChange={e => setCertForm({ ...certForm, issueDate: e.target.value })} style={INPUT} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Logo image link (optional)</label>
                    <input value={certForm.imageUrl} onChange={e => setCertForm({ ...certForm, imageUrl: e.target.value })} style={INPUT} placeholder="https://..." />
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{ ...BTN_PRIMARY, marginTop: 10, alignSelf: 'flex-end', opacity: loading ? 0.5 : 1 }}>
                  {loading ? 'Adding...' : 'Add certificate'}
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
            <h3 style={{ fontFamily: NS, fontWeight: 700, fontSize: 17, color: '#1a1c19', margin: '0 0 8px' }}>Delete product?</h3>
            <p style={{ fontSize: 13, color: '#6b7280', fontFamily: NS, margin: '0 0 22px' }}>The product will be deleted from the system.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ ...BTN_GHOST, flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={() => remove()} disabled={loading} style={{ flex: 1, background: '#ba1a1a', color: '#fff', border: 'none', borderRadius: 999, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: NS, opacity: loading ? 0.5 : 1 }}>
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
