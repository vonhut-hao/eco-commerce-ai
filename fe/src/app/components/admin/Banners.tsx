import { useState, useEffect } from 'react'
import { Icon } from './Icon'
import { GLASS, INPUT, BTN_PRIMARY, BTN_GHOST, SECTION_LABEL, PAGE_TITLE } from './ui'
import { bannersApi, Banner, BannerRequest } from '../../../api/banners'
import { uploadApi } from '../../../api/upload'

const PHOTOS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=300&fit=crop&auto=format',
]

const EMPTY: BannerRequest = { title: '', imageUrl: PHOTOS[0], linkUrl: '', displayOrder: 5, isActive: true }
const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [modal, setModal] = useState<(BannerRequest & { id?: number }) | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    loadBanners();
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const { url } = await uploadApi.uploadImage(file);
      if (modal) setModal({ ...modal, imageUrl: url });
    } catch (err) {
      console.error(err);
      alert('An error occurred while uploading image');
    } finally {
      setUploadingImage(false);
    }
  }

  async function loadBanners() {
    try {
      const data = await bannersApi.getAllBanners();
      setBanners(data);
    } catch (e) {
      console.error(e);
    }
  }

  function openNew() { setModal({ ...EMPTY }); setIsNew(true) }
  function openEdit(b: Banner) { setModal({ id: b.id, title: b.title, imageUrl: b.imageUrl, linkUrl: b.linkUrl, displayOrder: b.displayOrder, isActive: b.isActive }); setIsNew(false) }
  
  async function save() {
    if (!modal) return
    setLoading(true)
    try {
      if (isNew) {
        await bannersApi.createBanner(modal);
      } else {
        await bannersApi.updateBanner(modal.id!, modal);
      }
      await loadBanners();
      setModal(null)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive(b: Banner) { 
    try {
      await bannersApi.updateBanner(b.id, { ...b, isActive: !b.isActive });
      await loadBanners();
    } catch (e) {
      console.error(e)
    }
  }

  async function deleteBanner(id: number) {
    try {
      await bannersApi.deleteBanner(id);
      await loadBanners();
      setDeleteId(null);
    } catch (e) {
      console.error(e)
    }
  }

  const sorted = [...banners].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div><p style={SECTION_LABEL}>Homepage Content</p><h1 style={PAGE_TITLE}>Promotional Banners</h1></div>
        <button style={BTN_PRIMARY} onClick={openNew}><Icon name="Plus" size={14} color="#fff" /> Add Banner</button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <span style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid #dde8d8', borderRadius: 12, padding: '8px 16px', fontSize: 13, color: '#42493e', fontFamily: NS }}>
          {banners.filter(b => b.isActive).length} / {banners.length} currently displaying
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.map(b => (
          <div key={b.id} style={{ ...GLASS, overflow: 'hidden', display: 'flex', opacity: b.isActive ? 1 : 0.65 }}>
            {/* Image preview */}
            <div style={{ width: 200, flexShrink: 0, position: 'relative', background: '#e8f5e4', overflow: 'hidden' }}>
              <img src={b.imageUrl} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.35), transparent)' }} />
              <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 6, padding: '2px 8px', fontFamily: NS }}>
                #{b.displayOrder}
              </span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: '#1a1c19', fontFamily: NS, marginBottom: 4 }}>{b.title}</div>
              <div style={{ fontSize: 13, color: '#6b7280', fontFamily: NS, marginBottom: 10 }}>🔗 <span style={{ color: '#3d6b35' }}>{b.linkUrl}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '3px 8px', fontFamily: NS,
                  ...(b.isActive ? { background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba' } : { background: '#f5f5f0', color: '#6b7280', border: '1px solid #e0e0d8' }),
                }}>
                  {b.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '18px 18px', borderLeft: '1px solid #eef2eb', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
              <button onClick={() => toggleActive(b)} style={{ width: 36, height: 36, background: b.isActive ? '#e8f5e4' : '#f5f5f0', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: b.isActive ? '#3d6b35' : '#6b7280' }}>
                {b.isActive ? <Icon name="ToggleRight" size={16} color="#3d6b35" /> : <Icon name="ToggleLeft" size={16} color="#6b7280" />}
              </button>
              <button onClick={() => openEdit(b)} style={{ width: 36, height: 36, background: '#f0f7ee', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Pencil" size={14} color="#3d6b35" /></button>
              <button onClick={() => setDeleteId(b.id)} style={{ width: 36, height: 36, background: '#fff0f0', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="Trash2" size={14} color="#ba1a1a" /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #dde8d8', width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 18px', borderBottom: '1px solid #eef2eb' }}>
              <h2 style={{ fontFamily: NS, fontWeight: 700, fontSize: 18, color: '#1a1c19', margin: 0 }}>{isNew ? 'Add new banner' : 'Edit banner'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 20 }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {modal.imageUrl && (
                <div style={{ borderRadius: 12, overflow: 'hidden', height: 120, background: '#e8f5e4' }}>
                  <img src={modal.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Title</label>
                <input value={modal.title} onChange={e => setModal({ ...modal, title: e.target.value })} style={INPUT}
                  onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                  onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Image URL *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={modal.imageUrl} onChange={e => setModal({ ...modal, imageUrl: e.target.value })} style={{ ...INPUT, flex: 1 }}
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', background: '#e8f5e4', color: '#25521f', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: uploadingImage ? 'not-allowed' : 'pointer', opacity: uploadingImage ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                    {uploadingImage ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} disabled={uploadingImage} />
                  </label>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Link URL</label>
                <input value={modal.linkUrl} onChange={e => setModal({ ...modal, linkUrl: e.target.value })} placeholder="/shop?tag=summer" style={INPUT}
                  onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                  onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Display Order</label>
                  <input type="number" value={modal.displayOrder} onChange={e => setModal({ ...modal, displayOrder: +e.target.value })} style={INPUT}
                    onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                    onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={modal.isActive} onChange={e => setModal({ ...modal, isActive: e.target.checked })} style={{ accentColor: '#3d6b35', width: 16, height: 16 }} />
                    <span style={{ fontSize: 14, color: '#1a1c19', fontFamily: NS }}>Display immediately</span>
                  </label>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eef2eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={BTN_GHOST}>Cancel</button>
              <button onClick={save} disabled={!modal.imageUrl || loading} style={{ ...BTN_PRIMARY, opacity: (!modal.imageUrl || loading) ? 0.5 : 1 }}>
                {loading ? 'Saving...' : isNew ? 'Add banner' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 340, textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Icon name="Trash2" size={22} color="#ba1a1a" /></div>
            <h3 style={{ fontFamily: NS, fontWeight: 700, fontSize: 17, color: '#1a1c19', margin: '0 0 8px' }}>Delete banner?</h3>
            <p style={{ fontSize: 13, color: '#6b7280', fontFamily: NS, margin: '0 0 22px' }}>The banner will be removed from the homepage.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ ...BTN_GHOST, flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={() => deleteBanner(deleteId)} style={{ flex: 1, background: '#ba1a1a', color: '#fff', border: 'none', borderRadius: 999, padding: '9px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: NS }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
