import { useState, useEffect } from 'react'
import { Icon } from './Icon'
import { GLASS, INPUT, BTN_PRIMARY, BTN_GHOST, SECTION_LABEL, PAGE_TITLE } from './ui'
import { categoriesApi, Category, CategoryRequest } from '../../../api/categories'

const EMPTY: CategoryRequest = { name: '', description: '', parentId: null }
const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'

export default function Categories() {
  const [cats, setCats] = useState<Category[]>([])
  const [modal, setModal] = useState<(CategoryRequest & { id?: number }) | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await categoriesApi.getAll()
      setCats(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const roots  = cats.filter(c => !c.parentId)

  function openNew()    { setModal({ ...EMPTY }); setIsNew(true) }
  function openEdit(c: Category) { setModal({ id: c.id, name: c.name, description: c.description || '', parentId: c.parentId }); setIsNew(false) }
  
  async function save() {
    if (!modal) return
    try {
      if (isNew) {
        await categoriesApi.create(modal)
      } else {
        await categoriesApi.update(modal.id!, modal)
      }
      load()
      setModal(null)
    } catch (e) {
      console.error(e)
    }
  }

  async function remove(id: number) { 
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await categoriesApi.delete(id)
        load()
      } catch (e) {
        console.error(e)
      }
    }
  }

  const ICON_COLORS = ['#3d6b35','#5a9448','#6f6143','#3b4fd4','#8ab87a','#b8763a','#a35a9a']

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div><p style={SECTION_LABEL}>Inventory Structure</p><h1 style={PAGE_TITLE}>Categories</h1></div>
        <button style={BTN_PRIMARY} onClick={openNew}><Icon name="Plus" size={14} color="#fff" /> Add category</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid #dde8d8', borderRadius: 12, padding: '8px 16px', fontSize: 13, color: '#42493e', fontFamily: NS }}>
          {cats.length} categories · {roots.length} root
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {roots.map((root, ri) => {
            const children = cats.filter(c => c.parentId === root.id)
            const iconColor = ICON_COLORS[ri % ICON_COLORS.length]
            return (
              <div key={root.id} style={{ ...GLASS, overflow: 'hidden' }}>
                {/* Root row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: '#f5f9f3', borderBottom: children.length ? '1px solid #eef2eb' : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${iconColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: iconColor, flexShrink: 0, fontFamily: NS }}>{root.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1c19', fontFamily: NS }}>{root.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280', fontFamily: NS }}>{root.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(root)} style={{ width: 32, height: 32, background: '#f0f7ee', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', }}><Icon name="Pencil" size={13} color="#3d6b35" /></button>
                    <button onClick={() => remove(root.id)} style={{ width: 32, height: 32, background: '#fff0f0', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', }}><Icon name="Trash2" size={13} color="#ba1a1a" /></button>
                  </div>
                </div>
                {/* Children */}
                {children.map((child, ci) => (
                  <div key={child.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px 12px 52px', borderBottom: ci < children.length - 1 ? '1px solid #eef2eb' : 'none' }}>
                    <div style={{ fontSize: 16, color: '#c7d9c2', marginRight: 4 }}>└</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 14, color: '#1a1c19', fontFamily: NS }}>{child.name}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', fontFamily: NS }}>{child.description}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(child)} style={{ width: 32, height: 32, background: '#f0f7ee', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', }}><Icon name="Pencil" size={13} color="#3d6b35" /></button>
                      <button onClick={() => remove(child.id)} style={{ width: 32, height: 32, background: '#fff0f0', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', }}><Icon name="Trash2" size={13} color="#ba1a1a" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #dde8d8', width: '100%', maxWidth: 440, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 18px', borderBottom: '1px solid #eef2eb' }}>
              <h2 style={{ fontFamily: NS, fontWeight: 700, fontSize: 18, color: '#1a1c19', margin: 0 }}>{isNew ? 'Add new category' : 'Edit category'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 20 }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Category Name *</label>
                <input value={modal.name} onChange={e => setModal({ ...modal, name: e.target.value })} style={INPUT}
                  onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                  onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Description</label>
                <textarea value={modal.description} onChange={e => setModal({ ...modal, description: e.target.value })} rows={2}
                  style={{ ...INPUT, resize: 'none' as const }}
                  onFocus={e => { e.target.style.borderColor='#3d6b35'; e.target.style.boxShadow='0 0 0 3px rgba(61,107,53,0.10)' }}
                  onBlur={e => { e.target.style.borderColor='#dde8d8'; e.target.style.boxShadow='none' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, display: 'block', marginBottom: 6 }}>Parent Category</label>
                <select value={modal.parentId || ''} onChange={e => setModal({ ...modal, parentId: e.target.value ? +e.target.value : null })} style={{ ...INPUT, cursor: 'pointer' }}>
                  <option value="">— None (root category) —</option>
                  {roots.filter(r => r.id !== modal.id).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eef2eb', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={BTN_GHOST}>Cancel</button>
              <button onClick={save} disabled={!modal.name} style={{ ...BTN_PRIMARY, opacity: !modal.name ? 0.5 : 1 }}>
                {isNew ? 'Add category' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
