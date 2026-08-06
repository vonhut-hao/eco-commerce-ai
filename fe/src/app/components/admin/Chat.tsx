import { useState, useRef, useEffect } from 'react'
import { Icon } from './Icon'

type Message = {
  id: number
  from: 'customer' | 'admin'
  text: string
  time: string
}

type Convo = {
  id: number
  name: string
  initials: string
  color: string
  topic: string
  lastMsg: string
  lastTime: string
  unread: number
  online: boolean
  messages: Message[]
}

const CONVOS: Convo[] = [
  {
    id: 1, name: 'Nguyễn Thị Lan', initials: 'NL', color: '#3d6b35',
    topic: 'Bamboo Toothbrush Set', lastMsg: 'Mình muốn mua 2 hộp luôn', lastTime: '11:04', unread: 2, online: true,
    messages: [
      { id: 1, from: 'customer', text: 'Chào shop! Mình muốn hỏi về sản phẩm Bamboo Toothbrush Set (Pack of 4)', time: '10:22' },
      { id: 2, from: 'admin',    text: 'Xin chào Lan! Bạn cần biết thêm thông tin gì về sản phẩm đó ạ?', time: '10:24' },
      { id: 3, from: 'customer', text: 'Sản phẩm có chứng nhận gì không shop? Mình đang tìm hàng organic cho cả gia đình', time: '10:25' },
      { id: 4, from: 'admin',    text: 'Sản phẩm đạt chuẩn BIODEGRADABLE và BPA FREE bạn nhé! Nguyên liệu 100% tre tự nhiên, không chứa hóa chất độc hại. Phù hợp cho cả gia đình 🌿', time: '10:27' },
      { id: 5, from: 'customer', text: 'Bao giờ hàng về shop vậy bạn?', time: '11:03' },
      { id: 6, from: 'customer', text: 'Mình muốn mua 2 hộp luôn', time: '11:04' },
    ],
  },
  {
    id: 2, name: 'Trần Văn Minh', initials: 'TM', color: '#5a7fa8',
    topic: 'Đơn hàng ORD-2846', lastMsg: 'Cảm ơn shop nhiều nha!', lastTime: '09:46', unread: 0, online: false,
    messages: [
      { id: 1, from: 'customer', text: 'Shop ơi cho mình hỏi đơn ORD-2846 sao chưa thấy xác nhận vậy?', time: '09:10' },
      { id: 2, from: 'admin',    text: 'Chào Minh! Mình kiểm tra ngay cho bạn nhé', time: '09:15' },
      { id: 3, from: 'admin',    text: 'Đơn bạn đang ở trạng thái "Chờ xác nhận", sẽ được xử lý trong 30 phút nữa ạ', time: '09:16' },
      { id: 4, from: 'customer', text: 'Oke shop, mình chờ nha', time: '09:18' },
      { id: 5, from: 'admin',    text: 'Đơn hàng vừa được xác nhận rồi ạ! Dự kiến giao trong 2–3 ngày làm việc 🚚', time: '09:45' },
      { id: 6, from: 'customer', text: 'Cảm ơn shop nhiều nha!', time: '09:46' },
    ],
  },
  {
    id: 3, name: 'Phạm Thu Hà', initials: 'PH', color: '#7a5fa8',
    topic: 'Chỉ số CO₂', lastMsg: 'Mình hiểu rồi, cảm ơn bạn!', lastTime: '07:41', unread: 0, online: false,
    messages: [
      { id: 1, from: 'customer', text: 'Chỉ số CO₂ 0.3 kg trên sản phẩm là tính như thế nào vậy shop?', time: '07:30' },
      { id: 2, from: 'admin',    text: 'Đây là lượng CO₂ phát thải trong toàn bộ vòng đời sản phẩm: từ nguyên liệu, sản xuất, vận chuyển đến khi tái chế bạn nhé', time: '07:35' },
      { id: 3, from: 'customer', text: 'Sản phẩm nào thân thiện nhất với môi trường?', time: '07:36' },
      { id: 4, from: 'admin',    text: 'Reusable Steel Straw Kit có chỉ số thấp nhất: chỉ 0.1 kg CO₂. Bạn lọc theo "Carbon thấp" trên trang Shop nhé!', time: '07:40' },
      { id: 5, from: 'customer', text: 'Mình hiểu rồi, cảm ơn bạn!', time: '07:41' },
    ],
  },
  {
    id: 4, name: 'Lê Hoàng Nam', initials: 'LN', color: '#a8613d',
    topic: 'Đổi trả hàng', lastMsg: 'Shop có hỗ trợ đổi trả không?', lastTime: '06:00', unread: 1, online: true,
    messages: [
      { id: 1, from: 'customer', text: 'Shop có hỗ trợ đổi trả không ạ?', time: '06:00' },
    ],
  },
  {
    id: 5, name: 'Võ Thị Bích', initials: 'VB', color: '#8a5fa8',
    topic: 'Mua sỉ', lastMsg: 'Shop có chính sách sỉ không?', lastTime: 'Hôm qua', unread: 0, online: false,
    messages: [
      { id: 1, from: 'customer', text: 'Mình muốn mua số lượng lớn để bán lại, shop có chính sách sỉ không?', time: 'Hôm qua' },
      { id: 2, from: 'admin',    text: 'Xin chào Bích! Bạn quan tâm đến mặt hàng nào và số lượng bao nhiêu ạ? Mình sẽ báo giá sỉ cụ thể cho bạn nhé', time: 'Hôm qua' },
    ],
  },
  {
    id: 6, name: 'Đinh Quốc Hùng', initials: 'ĐH', color: '#4a8a6a',
    topic: 'Green Points', lastMsg: 'Vậy dùng được 12.500đ hả shop?', lastTime: 'Hôm qua', unread: 0, online: false,
    messages: [
      { id: 1, from: 'customer', text: 'Green Points của mình có dùng để thanh toán được không ạ?', time: 'Hôm qua' },
      { id: 2, from: 'admin',    text: '100 Green Points = 1.000 VNĐ, áp dụng tối đa 30% giá trị đơn. Bạn đang có bao nhiêu điểm ạ?', time: 'Hôm qua' },
      { id: 3, from: 'customer', text: 'Mình có 1.250 điểm. Vậy dùng được 12.500đ hả shop?', time: 'Hôm qua' },
    ],
  },
]

export default function Chat() {
  const [convos, setConvos] = useState<Convo[]>(CONVOS)
  const [activeId, setActiveId] = useState(1)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const active = convos.find(c => c.id === activeId)!
  const filtered = convos.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.topic.toLowerCase().includes(search.toLowerCase())
  )
  const totalUnread = convos.reduce((s, c) => s + c.unread, 0)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeId, active.messages.length])

  function select(id: number) {
    setActiveId(id)
    setConvos(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
  }

  function send() {
    const text = draft.trim()
    if (!text) return
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    const newMsg: Message = { id: Date.now(), from: 'admin', text, time }
    setConvos(prev => prev.map(c =>
      c.id === activeId ? { ...c, lastMsg: text, lastTime: time, messages: [...c.messages, newMsg] } : c
    ))
    setDraft('')
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Page title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1c19', margin: 0, fontFamily: '"Nimbus Sans","Helvetica Neue",Arial,sans-serif' }}>
          Chat khách hàng
        </h1>
        {totalUnread > 0 && (
          <span style={{ background: '#ba1a1a', color: '#fff', borderRadius: 999, fontSize: 11, fontWeight: 700, padding: '2px 9px' }}>
            {totalUnread}
          </span>
        )}
      </div>

      {/* Chat body */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'flex', borderRadius: 16, overflow: 'hidden',
        border: '1px solid #dde8d8',
        background: '#fff',
        boxShadow: '0 2px 16px rgba(37,82,31,0.07)',
      }}>

        {/* ── Left: conversation list ── */}
        <div style={{
          width: 280, flexShrink: 0,
          borderRight: '1px solid #eef2eb',
          display: 'flex', flexDirection: 'column',
          background: '#fafcf9',
        }}>
          {/* Search bar */}
          <div style={{ padding: '14px 12px 10px', borderBottom: '1px solid #eef2eb' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: '#fff', border: '1px solid #dde8d8',
              borderRadius: 8, padding: '6px 10px',
            }}>
              <Icon name="Search" size={13} color="#b0bab0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm hội thoại..."
                style={{
                  border: 'none', background: 'transparent', outline: 'none',
                  fontSize: 12.5, color: '#42493e', width: '100%',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(c => {
              const active = c.id === activeId
              return (
                <button
                  key={c.id}
                  onClick={() => select(c.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', border: 'none', textAlign: 'left',
                    background: active ? '#f0f7ee' : 'transparent',
                    borderLeft: `3px solid ${active ? '#25521f' : 'transparent'}`,
                    cursor: 'pointer', transition: 'background 120ms',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#f5f8f3' }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 999,
                      background: c.color, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                    }}>{c.initials}</div>
                    {c.online && (
                      <span style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: 9, height: 9, borderRadius: 999,
                        background: '#22c55e', border: '2px solid #fafcf9',
                      }} />
                    )}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: c.unread > 0 ? 700 : 500, color: '#1a1c19', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>{c.name}</span>
                      <span style={{ fontSize: 10, color: '#b0bab0', fontFamily: 'Inter, sans-serif', flexShrink: 0, marginLeft: 4 }}>{c.lastTime}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 11.5, color: c.unread > 0 ? '#42493e' : '#9ca3af', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontWeight: c.unread > 0 ? 500 : 400 }}>{c.lastMsg}</span>
                      {c.unread > 0 && (
                        <span style={{ background: '#25521f', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 6px', flexShrink: 0 }}>{c.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Right: chat window ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Chat header */}
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid #eef2eb',
            display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
            background: '#fff',
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 999,
                background: active.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif',
              }}>{active.initials}</div>
              {active.online && (
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: 999, background: '#22c55e', border: '2px solid #fff' }} />
              )}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1c19', fontFamily: 'Inter, sans-serif' }}>{active.name}</div>
              <div style={{ fontSize: 11, color: active.online ? '#22c55e' : '#b0bab0', fontFamily: 'Inter, sans-serif' }}>
                {active.online ? 'Đang hoạt động' : 'Ngoại tuyến'}
                <span style={{ color: '#d1d5db', margin: '0 5px' }}>·</span>
                <span style={{ color: '#9ca3af' }}>{active.topic}</span>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                border: '1px solid #dde8d8', borderRadius: 8, background: '#fff',
                cursor: 'pointer', fontSize: 12, color: '#42493e', fontFamily: 'Inter, sans-serif',
              }}>
                <Icon name="User" size={12} color="#6b7280" />
                Hồ sơ
              </button>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                border: '1px solid #dde8d8', borderRadius: 8, background: '#fff',
                cursor: 'pointer', fontSize: 12, color: '#42493e', fontFamily: 'Inter, sans-serif',
              }}>
                <Icon name="ShoppingBag" size={12} color="#6b7280" />
                Đơn hàng
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10, background: '#f9fbf8' }}>
            {active.messages.map((msg, i) => {
              const isAdmin = msg.from === 'admin'
              const prevFrom = i > 0 ? active.messages[i - 1].from : null
              const grouped = prevFrom === msg.from
              return (
                <div key={msg.id} style={{
                  display: 'flex',
                  flexDirection: isAdmin ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 8,
                  marginTop: grouped ? 0 : 8,
                }}>
                  {/* Avatar — show only on last in group */}
                  <div style={{ width: 28, flexShrink: 0 }}>
                    {!isAdmin && !grouped && (
                      <div style={{
                        width: 28, height: 28, borderRadius: 999,
                        background: active.color, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                      }}>{active.initials}</div>
                    )}
                  </div>
                  <div style={{ maxWidth: '62%', display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-end' : 'flex-start', gap: 3 }}>
                    <div style={{
                      padding: '9px 13px',
                      background: isAdmin ? '#25521f' : '#fff',
                      color: isAdmin ? '#e8f5e4' : '#1a1c19',
                      borderRadius: isAdmin
                        ? (grouped ? '14px 4px 4px 14px' : '14px 4px 14px 14px')
                        : (grouped ? '4px 14px 14px 4px' : '4px 14px 14px 14px'),
                      fontSize: 13.5, lineHeight: 1.55,
                      fontFamily: 'Inter, sans-serif',
                      border: isAdmin ? 'none' : '1px solid #e8eee4',
                      boxShadow: isAdmin ? '0 1px 4px rgba(37,82,31,0.18)' : '0 1px 3px rgba(0,0,0,0.05)',
                      wordBreak: 'break-word',
                    }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: 10, color: '#b0bab0', fontFamily: 'Inter, sans-serif', paddingInline: 2 }}>{msg.time}</span>
                  </div>
                </div>
              )
            })}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 16px 14px', borderTop: '1px solid #eef2eb', background: '#fff', flexShrink: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#f5f8f3', border: '1.5px solid #dde8d8',
              borderRadius: 12, padding: '8px 8px 8px 14px',
              transition: 'border-color 150ms',
            }}
              onFocus={() => {}}
            >
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={e => {
                  setDraft(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px'
                }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng)"
                rows={1}
                style={{
                  flex: 1, border: 'none', outline: 'none', resize: 'none',
                  fontSize: 13.5, color: '#1a1c19', fontFamily: 'Inter, sans-serif',
                  lineHeight: '22px', background: 'transparent',
                  minHeight: 22, maxHeight: 110, padding: 0,
                }}
              />
              <button
                onClick={send}
                disabled={!draft.trim()}
                style={{
                  width: 34, height: 34, borderRadius: 9, border: 'none',
                  background: draft.trim() ? '#25521f' : '#e8eee4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: draft.trim() ? 'pointer' : 'default',
                  transition: 'background 150ms', flexShrink: 0,
                }}
              >
                <Icon name="Send" size={14} color={draft.trim() ? '#d4edbe' : '#a0b899'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
