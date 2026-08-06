import { useState, useRef, useEffect, useMemo } from 'react'
import { Icon } from './Icon'
import { useAuthStore } from '../../../store/authStore'
import { getUserConversations, getMessagesByConversation, sendMessage, ChatMessage, Conversation } from '../../../api/chat'
import { profileApi, UserProfileResponse } from '../../../api/profile'
import { ordersApi, OrderBE } from '../../../api/orders'
import imageCompression from 'browser-image-compression'
import { Client } from '@stomp/stompjs'
import { toast } from '../Toast'

function formatTime(val: any) {
  if (!val) return ''
  try {
    let d: Date
    if (Array.isArray(val)) {
      d = new Date(val[0], val[1] - 1, val[2], val[3], val[4], val[5] || 0)
    } else {
      d = new Date(val)
    }
    if (isNaN(d.getTime())) return ''
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  } catch(e) {
    return ''
  }
}

type Message = {
  id: string
  from: 'customer' | 'admin'
  text: string
  time: string
  fileUrl?: string
}

type ConvoState = {
  id: number
  customerId: number
  name: string
  initials: string
  color: string
  avatarUrl?: string
  topic: string
  unread: number
  online: boolean
  messages: Message[]
}

const COLORS = ['#3d6b35', '#5a7fa8', '#7a5fa8', '#a8613d', '#8a5fa8', '#4a8a6a']

type Status = 'Chờ xác nhận' | 'Đang giao' | 'Đã giao' | 'Đã hủy'

const STATUS_MAP: Record<string, Status> = {
  PENDING: 'Chờ xác nhận',
  DELIVERY: 'Đang giao',
  COMPLETED: 'Đã giao',
  CANCELLED: 'Đã hủy'
}

const statusStyle: Record<Status, React.CSSProperties> = {
  'Chờ xác nhận': { background: '#fdf6ec', color: '#6f6143', border: '1px solid #e8d8ae' },
  'Đang giao':    { background: '#efe8ff', color: '#6b35a3', border: '1px solid #d0b8f5' },
  'Đã giao':      { background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba' },
  'Đã hủy':       { background: '#fff0f0', color: '#ba1a1a', border: '1px solid #f5c2c2' },
}

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Chat() {
  const { user } = useAuthStore()
  const [convos, setConvos] = useState<ConvoState[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const endRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const stompClientRef = useRef<Client | null>(null)
  
  // Sync messages reference for STOMP callback
  const convosRef = useRef(convos)
  useEffect(() => { convosRef.current = convos }, [convos])

  useEffect(() => {
    if (!user) return

    let active = true

    const loadData = async () => {
      try {
        const conversations = await getUserConversations(user.id)
        if (!active) return

        const states: ConvoState[] = []
        for (let i = 0; i < conversations.length; i++) {
          const c = conversations[i]
          // The customer is always the one who is NOT the admin. In most cases, Admin is user2_id or user1_id.
          // Since Admin is viewing this, the customer is the other user.
          const isUser1Admin = c.user1_id === user.id
          const customerName = isUser1Admin ? c.user2Username : c.user1Username
          const customerId = isUser1Admin ? c.user2_id : c.user1_id
          const avatarUrl = isUser1Admin ? c.user2AvatarUrl : c.user1AvatarUrl
          const name = customerName || `Khách hàng ${customerId}`
          
          const rawMessages = await getMessagesByConversation(c.id, user.id)
          
          const messages: Message[] = rawMessages.map(m => ({
            id: m.id.toString(),
            from: m.senderId === user.id ? 'admin' : 'customer',
            text: m.content,
            time: formatTime(m.createdAt),
            fileUrl: m.fileUrl
          }))

          states.push({
            id: c.id,
            customerId,
            name,
            initials: getInitials(name),
            color: COLORS[i % COLORS.length],
            avatarUrl,
            topic: 'Hỗ trợ khách hàng',
            unread: 0,
            online: false,
            messages
          })
        }

        states.sort((a, b) => {
          const aTime = a.messages.length > 0 ? a.messages[a.messages.length - 1].id : '0'
          const bTime = b.messages.length > 0 ? b.messages[b.messages.length - 1].id : '0'
          return Number(bTime) - Number(aTime)
        })

        if (active) {
          setConvos(states)
          if (states.length > 0) setActiveId(states[0].id)
          setLoading(false)

          // Connect STOMP
          const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            onConnect: () => {
              // Subscribe to all conversations
              states.forEach(c => {
                client.subscribe(`/topic/conversation/${c.id}`, (msg) => {
                  const newMsg = JSON.parse(msg.body)
                  
                  setConvos(prev => {
                    const currentConvos = [...prev]
                    const idx = currentConvos.findIndex(x => x.id === c.id)
                    if (idx === -1) return prev
                    
                    const target = currentConvos[idx]
                    // prevent duplicate
                    if (target.messages.find(m => m.id === newMsg.id.toString())) return prev

                    const isActive = target.id === activeId
                    
                    const isFromAdmin = newMsg.senderId === user.id
                    // Note: Optimistic messages from admin might have a temporary ID, we ignore them for simplicity or they get replaced.
                    // For Admin panel, let's keep it simple: we wait for STOMP to append our own messages, 
                    // OR we optimistic append and then replace. Since Admin wants speed, let's just use STOMP for both to avoid complexity, 
                    // or implement optimistic appending.
                    
                    // Actually, if we optimistic append, we need to replace it.
                    const tmpIndex = target.messages.findIndex(m => m.from === 'admin' && m.id.length > 10 && m.text === newMsg.content)
                    
                    const formattedMsg: Message = {
                      id: newMsg.id.toString(),
                      from: isFromAdmin ? 'admin' : 'customer',
                      text: newMsg.content,
                      time: formatTime(newMsg.createdAt),
                      fileUrl: newMsg.fileUrl
                    }

                    if (tmpIndex !== -1) {
                      target.messages[tmpIndex] = formattedMsg
                    } else {
                      target.messages.push(formattedMsg)
                      if (!isActive && !isFromAdmin) {
                        target.unread += 1
                      }
                    }

                    // Move to top
                    currentConvos.splice(idx, 1)
                    currentConvos.unshift(target)
                    return currentConvos
                  })
                })
              })
            }
          })
          client.activate()
          stompClientRef.current = client
        }

      } catch (err) {
        console.error(err)
        if (active) setLoading(false)
      }
    }

    loadData()

    return () => {
      active = false
      stompClientRef.current?.deactivate()
    }
  }, [user])

  const active = useMemo(() => convos.find(c => c.id === activeId), [convos, activeId])
  const filtered = useMemo(() => convos.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.topic.toLowerCase().includes(search.toLowerCase())
  ), [convos, search])
  
  const totalUnread = convos.reduce((s, c) => s + c.unread, 0)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('CHAT_UNREAD_UPDATE', { detail: totalUnread }))
  }, [totalUnread])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeId, active?.messages.length])

  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileModal, setProfileModal] = useState<number | null>(null)
  const [ordersModal, setOrdersModal] = useState<number | null>(null)
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null)
  const [ordersData, setOrdersData] = useState<OrderBE[]>([])
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    if (profileModal) {
      setModalLoading(true)
      profileApi.getProfile(profileModal).then(p => { setProfileData(p); setModalLoading(false) })
        .catch(err => { console.error(err); toast.error('Lỗi', 'Không thể lấy hồ sơ'); setProfileModal(null); setModalLoading(false) })
    } else {
      setProfileData(null)
    }
  }, [profileModal])

  useEffect(() => {
    if (ordersModal) {
      setModalLoading(true)
      ordersApi.getOrdersAdmin().then(orders => {
        setOrdersData(orders.filter(o => o.userId === ordersModal))
        setModalLoading(false)
      }).catch(err => {
        console.error(err)
        toast.error('Lỗi', 'Không thể tải đơn hàng')
        setOrdersModal(null)
        setModalLoading(false)
      })
    } else {
      setOrdersData([])
    }
  }, [ordersModal])

  function select(id: number) {
    setActiveId(id)
    setConvos(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !activeId || !user) return
    const file = e.target.files[0]
    
    setIsUploadingImage(true)
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true, fileType: 'image/webp' }
      const compressedFile = await imageCompression(file, options)
      const url = await profileApi.uploadFile(compressedFile)
      
      const tmpId = Date.now().toString()
      const time = formatTime(new Date())
      
      setConvos(prev => {
        const currentConvos = [...prev]
        const idx = currentConvos.findIndex(x => x.id === activeId)
        if (idx === -1) return prev
        const target = currentConvos[idx]
        target.messages.push({ id: tmpId, from: 'admin', text: '[Hình ảnh]', time, fileUrl: url })
        
        currentConvos.splice(idx, 1)
        currentConvos.unshift(target)
        return currentConvos
      })

      sendMessage({ conversationId: activeId, senderId: user.id, content: '[Hình ảnh]', fileUrl: url }).catch(err => console.error(err))
    } catch (err) {
      toast.error('Lỗi', 'Lỗi tải ảnh lên')
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleSend() {
    if (!activeId || !user) return
    const text = draft.trim()
    if (!text && !isUploadingImage) return

    const tmpId = Date.now().toString()
    const time = formatTime(new Date())
    
    // Optimistic UI update
    setConvos(prev => {
      const currentConvos = [...prev]
      const idx = currentConvos.findIndex(x => x.id === activeId)
      if (idx === -1) return prev
      const target = currentConvos[idx]
      target.messages.push({ id: tmpId, from: 'admin', text, time })
      
      currentConvos.splice(idx, 1)
      currentConvos.unshift(target)
      return currentConvos
    })
    
    setDraft('')
    setTimeout(() => textareaRef.current?.focus(), 0)

    sendMessage({
      conversationId: activeId,
      senderId: user.id,
      content: text
    }).catch(err => console.error(err))
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải tin nhắn...</div>
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
              const isActive = c.id === activeId
              const lastMsgObj = c.messages.length > 0 ? c.messages[c.messages.length - 1] : null
              const lastMsgText = lastMsgObj ? (lastMsgObj.text || (lastMsgObj.fileUrl ? '[Hình ảnh]' : '')) : 'Chưa có tin nhắn'
              const lastMsgTime = lastMsgObj ? lastMsgObj.time : ''
              
              return (
                <button
                  key={c.id}
                  onClick={() => select(c.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', border: 'none', textAlign: 'left',
                    background: isActive ? '#f0f7ee' : 'transparent',
                    borderLeft: `3px solid ${isActive ? '#25521f' : 'transparent'}`,
                    cursor: 'pointer', transition: 'background 120ms',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#f5f8f3' }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    {c.avatarUrl ? (
                      <img src={c.avatarUrl} alt={c.name} style={{ width: 38, height: 38, borderRadius: 999, objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: 38, height: 38, borderRadius: 999,
                        background: c.color, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                      }}>{c.initials}</div>
                    )}
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
                      <span style={{ fontSize: 10, color: '#b0bab0', fontFamily: 'Inter, sans-serif', flexShrink: 0, marginLeft: 4 }}>{lastMsgTime}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 11.5, color: c.unread > 0 ? '#42493e' : '#9ca3af', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontWeight: c.unread > 0 ? 500 : 400 }}>{lastMsgText}</span>
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
        {active ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Chat header */}
            <div style={{
              padding: '12px 20px', borderBottom: '1px solid #eef2eb',
              display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
              background: '#fff',
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {active.avatarUrl ? (
                  <img src={active.avatarUrl} alt={active.name} style={{ width: 36, height: 36, borderRadius: 999, objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: 36, height: 36, borderRadius: 999,
                    background: active.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                  }}>{active.initials}</div>
                )}
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
                <button onClick={() => setProfileModal(active.customerId)} style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                  border: '1px solid #dde8d8', borderRadius: 8, background: '#fff',
                  cursor: 'pointer', fontSize: 12, color: '#42493e', fontFamily: 'Inter, sans-serif',
                }}>
                  <Icon name="User" size={12} color="#6b7280" />
                  Hồ sơ
                </button>
                <button onClick={() => setOrdersModal(active.customerId)} style={{
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
                const isLastInGroup = i === active.messages.length - 1 || active.messages[i + 1].from !== msg.from
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
                        active.avatarUrl ? (
                          <img src={active.avatarUrl} alt={active.name} style={{ width: 28, height: 28, borderRadius: 999, objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            width: 28, height: 28, borderRadius: 999,
                            background: active.color, color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 9, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                          }}>{active.initials}</div>
                        )
                      )}
                    </div>
                    <div style={{ maxWidth: '62%', display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-end' : 'flex-start', gap: 3 }}>
                      <div style={{
                        padding: '9px 13px',
                        background: isAdmin ? '#25521f' : '#fff',
                        color: isAdmin ? '#e8f5e4' : '#1a1c19',
                        borderRadius: isAdmin
                          ? (grouped ? '14px 4px 4px 14px' : '14px 4px 14px 14px')
                          : (grouped ? '4px 14px 14px 4px' : '4px 14px 14px 4px'),
                        fontSize: 13.5, lineHeight: 1.55,
                        fontFamily: 'Inter, sans-serif',
                        border: isAdmin ? 'none' : '1px solid #e8eee4',
                        boxShadow: isAdmin ? '0 1px 4px rgba(37,82,31,0.18)' : '0 1px 3px rgba(0,0,0,0.05)',
                        wordBreak: 'break-word',
                      }}>
                        {msg.fileUrl && (
                          <div style={{ marginBottom: msg.text ? 4 : 0 }}>
                            <img src={msg.fileUrl} alt="attachment" style={{ maxWidth: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'contain' }} />
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                          {msg.text && <div style={{ flex: 1 }}>{msg.text}</div>}
                          <span style={{
                            fontSize: 10,
                            color: isAdmin ? '#8ab87a' : '#9ca3af',
                            fontFamily: 'Inter, sans-serif',
                            lineHeight: 1,
                            marginTop: msg.text ? 4 : 0,
                            marginLeft: 'auto'
                          }}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
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
              }}>
                <input type="file" accept="image/*" className="hidden" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageUpload} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  style={{
                    background: 'transparent', border: 'none', padding: 4, cursor: isUploadingImage ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isUploadingImage ? 0.3 : 1
                  }}
                  title="Gửi hình ảnh"
                >
                  <Icon name="Image" size={18} color="#b0bab0" />
                </button>
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={e => {
                    setDraft(e.target.value)
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px'
                  }}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
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
                  onClick={handleSend}
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
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
            Chọn một hội thoại để bắt đầu
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {profileModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 400, border: '1px solid #dde8d8', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #eef2eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: 16, color: '#1a1c19', fontFamily: '"Nimbus Sans", sans-serif' }}>Hồ sơ khách hàng</h3>
              <button onClick={() => setProfileModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 20, lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: '20px' }}>
              {modalLoading ? <div style={{ textAlign: 'center', color: '#6b7280' }}>Đang tải...</div> : profileData ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={profileData.avatarUrl || 'https://via.placeholder.com/60'} alt="avatar" style={{ width: 60, height: 60, borderRadius: 999, objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1c19', fontFamily: 'Inter, sans-serif' }}>{profileData.fullName || profileData.userName}</div>
                      <div style={{ fontSize: 13, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>{profileData.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#f9fbf8', padding: 12, borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#6b7280' }}>Số điện thoại:</span><span style={{ color: '#1a1c19', fontWeight: 500 }}>{profileData.phoneNumber || 'Chưa cập nhật'}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#6b7280' }}>Tên đăng nhập:</span><span style={{ color: '#1a1c19', fontWeight: 500 }}>{profileData.userName}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#6b7280' }}>Điểm xanh:</span><span style={{ color: '#25521f', fontWeight: 700 }}>{profileData.greenPoints} pt</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#6b7280' }}>Chỉ số CO2:</span><span style={{ color: '#3d6b35', fontWeight: 700 }}>{typeof profileData.totalCarbonIndex === 'number' ? profileData.totalCarbonIndex.toFixed(2) : '0'} kg</span></div>
                  </div>
                </div>
              ) : <div style={{ color: '#ba1a1a', textAlign: 'center' }}>Không tìm thấy thông tin</div>}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #eef2eb', textAlign: 'right' }}>
              <button onClick={() => setProfileModal(null)} style={{ background: '#25521f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {ordersModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 500, border: '1px solid #dde8d8', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #eef2eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: 16, color: '#1a1c19', fontFamily: '"Nimbus Sans", sans-serif' }}>Lịch sử đơn hàng</h3>
              <button onClick={() => setOrdersModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 20, lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {modalLoading ? <div style={{ textAlign: 'center', color: '#6b7280' }}>Đang tải...</div> : ordersData.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {ordersData.map(o => {
                    const statusKey = STATUS_MAP[o.status] || 'Chờ xác nhận'
                    return (
                    <div key={o.id} style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#f9fbf8', border: '1px solid #eef2eb', padding: 14, borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#3d6b35', fontFamily: 'monospace' }}>#{o.id}</span>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600, ...statusStyle[statusKey] }}>{statusKey}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#42493e', fontFamily: 'Inter, sans-serif' }}>Ngày đặt: {new Date(o.createdAt).toLocaleDateString('vi-VN')}</div>
                      <div style={{ fontSize: 13, color: '#42493e', fontFamily: 'Inter, sans-serif' }}>Tổng tiền: <strong style={{ color: '#1a1c19' }}>{o.totalAmount.toLocaleString('vi-VN')}đ</strong></div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        {o.orderItems.length} sản phẩm ({o.orderItems.map(i => i.productName).join(', ')})
                      </div>
                    </div>
                  )})}
                </div>
              ) : <div style={{ textAlign: 'center', color: '#6b7280' }}>Khách hàng chưa có đơn hàng nào.</div>}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #eef2eb', textAlign: 'right' }}>
              <button onClick={() => setOrdersModal(null)} style={{ background: '#25521f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
