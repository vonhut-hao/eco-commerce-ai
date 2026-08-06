import { useState, useEffect } from 'react'
import { Icon } from './Icon'
import { GLASS, SECTION_LABEL, PAGE_TITLE } from './ui'
import { reviewsApi, CommentBE } from '../../../api/reviews'
import { toast } from '../Toast'

const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'

function Stars({ rating }: { rating: number }) {
  return (
    <span>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < rating ? '#f59e0b' : '#e5e7eb', fontSize: 14 }}>★</span>
      ))}
    </span>
  )
}

type ReviewStatus = 'VISIBLE' | 'HIDDEN' | 'PENDING'

const STATUS_LABEL: Record<ReviewStatus, string> = { VISIBLE: 'Hiển thị', HIDDEN: 'Đã ẩn', PENDING: 'Chờ duyệt' }
const STATUS_STYLE: Record<ReviewStatus, React.CSSProperties> = {
  VISIBLE: { background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba' },
  HIDDEN:  { background: '#fff0f0', color: '#ba1a1a', border: '1px solid #f5c2c2' },
  PENDING: { background: '#fdf6ec', color: '#6f6143', border: '1px solid #e8d8ae' },
}

export default function Reviews() {
  const [reviews, setReviews] = useState<CommentBE[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('all')

  useEffect(() => {
    loadReviews()
  }, [])

  function loadReviews() {
    setLoading(true)
    reviewsApi.getReviews().then(data => {
      // Sort by newest first (highest ID)
      setReviews(data.sort((a, b) => b.id - a.id))
    }).catch(err => {
      console.error(err)
      toast.error('Lỗi', 'Không thể tải danh sách đánh giá')
    }).finally(() => {
      setLoading(false)
    })
  }

  function remove(id: number) {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) return;
    
    reviewsApi.deleteReview(id).then(() => {
      toast.success('Thành công', 'Đã xóa đánh giá')
      setReviews(prev => prev.filter(r => r.id !== id))
    }).catch(err => {
      console.error(err)
      toast.error('Lỗi', 'Không thể xóa đánh giá')
    })
  }

  function setStatus(id: number, status: ReviewStatus) {
    reviewsApi.changeReviewStatus(id, status).then(() => {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      toast.success('Thành công', 'Đã cập nhật trạng thái')
    }).catch(err => {
      console.error(err)
      toast.error('Lỗi', 'Không thể cập nhật trạng thái')
    })
  }

  const filtered = reviews.filter(r => filter === 'all' || (r.status || 'PENDING') === filter)
  const counts = { 
    all: reviews.length, 
    PENDING: reviews.filter(r => (r.status || 'PENDING') === 'PENDING').length, 
    VISIBLE: reviews.filter(r => r.status === 'VISIBLE').length, 
    HIDDEN: reviews.filter(r => r.status === 'HIDDEN').length 
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div><p style={SECTION_LABEL}>Kiểm duyệt nội dung</p><h1 style={PAGE_TITLE}>Đánh giá</h1></div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', 'PENDING', 'VISIBLE', 'HIDDEN'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? 'linear-gradient(to right,#3d6b35,#25521f)' : 'rgba(255,255,255,0.75)',
            color: filter === f ? '#fff' : '#42493e',
            border: '1px solid #dde8d8', borderRadius: 999, padding: '7px 16px',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: NS,
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 7,
          }}>
            {f === 'all' ? 'Tất cả' : STATUS_LABEL[f]}
            <span style={{
              fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '1px 7px',
              background: filter === f ? 'rgba(255,255,255,0.25)' : '#f5f9f3',
              color: filter === f ? '#fff' : '#6b7280',
              fontFamily: NS,
            }}>{counts[f]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280', fontFamily: NS }}>Đang tải đánh giá...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(r => {
            const rStatus = (r.status || 'PENDING') as ReviewStatus;
            return (
            <div key={r.id} style={{ ...GLASS, padding: 20, opacity: rStatus === 'HIDDEN' ? 0.65 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 999, background: '#e8f5e4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#3d6b35', flexShrink: 0, fontFamily: NS }}>
                  {r.userName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1c19', fontFamily: NS }}>{r.userName || `User ${r.userId}`}</span>
                    <Stars rating={r.rating || 0} />
                    {r.createdAt && <span style={{ fontSize: 12, color: '#6b7280', fontFamily: NS }}>{new Date(r.createdAt).toLocaleDateString()}</span>}
                    <span style={{ ...STATUS_STYLE[rStatus], borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 600, fontFamily: NS, marginLeft: 'auto' }}>
                      {STATUS_LABEL[rStatus]}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', fontFamily: NS, marginBottom: 8 }}>📦 {r.productName || `Sản phẩm ID: ${r.productId}`}</div>
                  <p style={{ fontSize: 14, color: '#1a1c19', fontFamily: NS, margin: 0, lineHeight: 1.55 }}>{r.content}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid #eef2eb' }}>
                {rStatus !== 'VISIBLE' && (
                  <button onClick={() => setStatus(r.id, 'VISIBLE')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: '#25521f', background: '#e8f5e4', border: '1px solid #c2deba', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: NS }}>
                    <Icon name="CheckCircle" size={13} color="#25521f" /> Duyệt hiển thị
                  </button>
                )}
                {rStatus !== 'HIDDEN' && (
                  <button onClick={() => setStatus(r.id, 'HIDDEN')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: '#6b7280', background: '#f5f5f0', border: '1px solid #e0e0d8', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: NS }}>
                    <Icon name="EyeOff" size={13} color="#6b7280" /> Ẩn
                  </button>
                )}
                <button onClick={() => remove(r.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: '#ba1a1a', background: '#fff0f0', border: '1px solid #f5c2c2', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: NS }}>
                  <Icon name="Trash2" size={13} color="#ba1a1a" /> Xóa
                </button>
              </div>
            </div>
          )})}

          {filtered.length === 0 && (
            <div style={{ ...GLASS, padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
              <p style={{ fontSize: 14, color: '#6b7280', fontFamily: NS, margin: 0 }}>Không có đánh giá nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
