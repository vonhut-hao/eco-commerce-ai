import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { Icon } from './Icon'
import { GLASS, MONO, SECTION_LABEL, PAGE_TITLE } from './ui'

const revenueData = [
  { month: 'T1', revenue: 42000000, orders: 124 },
  { month: 'T2', revenue: 38500000, orders: 108 },
  { month: 'T3', revenue: 51000000, orders: 147 },
  { month: 'T4', revenue: 63200000, orders: 181 },
  { month: 'T5', revenue: 58900000, orders: 169 },
  { month: 'T6', revenue: 72100000, orders: 210 },
  { month: 'T7', revenue: 79400000, orders: 234 },
]

const categoryData = [
  { name: 'Home & Kitchen', value: 32, color: '#3d6b35' },
  { name: 'Personal Care',  value: 27, color: '#5a9448' },
  { name: 'Fashion',        value: 19, color: '#8ab87a' },
  { name: 'Food & Beverage',value: 14, color: '#b8d8a8' },
  { name: 'Khác',           value:  8, color: '#dde8d8' },
]

const topProducts = [
  { name: 'Bamboo Toothbrush Set (Pack of 4)', sold: 427, carbon: 0.3, revenue: '63.6M' },
  { name: 'Organic Cotton Tote Bag',           sold: 389, carbon: 0.2, revenue: '70.0M' },
  { name: 'Reusable Steel Straw Kit',          sold: 312, carbon: 0.1, revenue: '29.6M' },
  { name: 'Natural Coconut Bowl Set',          sold: 298, carbon: 0.4, revenue: '95.4M' },
  { name: 'Beeswax Food Wraps (Set of 3)',     sold: 267, carbon: 0.2, revenue: '32.0M' },
]

const recentOrders = [
  { id: 'ORD-2847', customer: 'Nguyễn Thị Lan',  total: '718,000',  status: 'Đang giao',      time: '2 giờ trước' },
  { id: 'ORD-2846', customer: 'Trần Văn Minh',   total: '180,000',  status: 'Chờ xác nhận',   time: '3 giờ trước' },
  { id: 'ORD-2845', customer: 'Phạm Thu Hà',     total: '645,000',  status: 'Đã giao',         time: '5 giờ trước' },
  { id: 'ORD-2844', customer: 'Lê Hoàng Nam',    total: '285,000',  status: 'Đã hủy',          time: '6 giờ trước' },
  { id: 'ORD-2843', customer: 'Võ Thị Bích',     total: '680,000',  status: 'Đang giao',       time: '8 giờ trước' },
]

const statusStyle: Record<string, React.CSSProperties> = {
  'Đang giao':    { background: '#e8f0ff', color: '#3b4fd4', border: '1px solid #c5d0f5' },
  'Chờ xác nhận': { background: '#fdf6ec', color: '#6f6143', border: '1px solid #e8d8ae' },
  'Đã giao':      { background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba' },
  'Đã hủy':       { background: '#fff0f0', color: '#ba1a1a', border: '1px solid #f5c2c2' },
}

type StatIcon = Parameters<typeof Icon>[0]['name']
const stats: { label: string; value: string; unit: string; trend: string; color: string; icon: StatIcon }[] = [
  { label: 'Doanh thu tháng 7', value: '79.4M', unit: 'VNĐ',      trend: '+10.2%', color: '#3d6b35', icon: 'TrendingUp'  },
  { label: 'Đơn hàng tháng 7',  value: '234',   unit: 'đơn hàng', trend: '+11.4%', color: '#5a9448', icon: 'ShoppingBag' },
  { label: 'Người dùng mới',    value: '1,847', unit: 'tài khoản',trend: '+8.3%',  color: '#6f6143', icon: 'Users'       },
  { label: 'Carbon tiết kiệm',  value: '4.2',   unit: 'tCO₂ eq.', trend: 'T7/2026',color: '#3b4fd4', icon: 'Leaf'        },
]

const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'
const LMONO = '"Liberation Mono","Courier New",monospace'

export default function Dashboard() {
  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <p style={SECTION_LABEL}>Tổng quan</p>
        <h1 style={PAGE_TITLE}>Thống kê</h1>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {stats.map(({ label, value, unit, trend, color, icon }) => (
          <div key={label} style={{
            ...GLASS,
            padding: '20px 22px',
            borderLeft: `4px solid ${color}`,
            borderRadius: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ ...SECTION_LABEL, margin: 0, fontSize: 10 }}>{label}</p>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={icon} size={15} color={color} />
              </div>
            </div>
            <p style={{ ...MONO, fontSize: 28, fontWeight: 700, color: '#1a1c19', margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 13, color: '#6b7280', fontFamily: NS }}>{unit}</span>
              <span style={{ fontSize: 11, fontWeight: 600, background: '#e8f5e4', color: '#25521f', borderRadius: 999, padding: '2px 8px', fontFamily: NS }}>{trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, marginBottom: 16 }}>
        {/* Revenue area chart */}
        <div style={{ ...GLASS, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ fontFamily: NS, fontWeight: 600, fontSize: 15, color: '#1a1c19', margin: 0 }}>Doanh thu 7 tháng</p>
            <span style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>VNĐ</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#3d6b35" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#3d6b35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2eb" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280', fontFamily: NS }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280', fontFamily: LMONO }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1e6).toFixed(0)}M`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #dde8d8', fontSize: 12, fontFamily: NS, background: 'rgba(255,255,255,0.95)' }}
                formatter={v => [`${(Number(v)/1e6).toFixed(1)}M đ`, 'Doanh thu']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3d6b35" strokeWidth={2} fill="url(#rv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{ ...GLASS, padding: '22px 24px' }}>
          <p style={{ fontFamily: NS, fontWeight: 600, fontSize: 15, color: '#1a1c19', margin: '0 0 16px' }}>Danh mục bán chạy</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={62} innerRadius={30}>
                {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #dde8d8', fontSize: 12, fontFamily: NS }} formatter={v => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {categoryData.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                  <span style={{ fontSize: 12, color: '#6b7280', fontFamily: NS }}>{c.name}</span>
                </div>
                <span style={{ ...MONO, fontSize: 12, fontWeight: 700, color: '#1a1c19' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Top products */}
        <div style={{ ...GLASS, padding: '22px 24px' }}>
          <p style={{ fontFamily: NS, fontWeight: 600, fontSize: 15, color: '#1a1c19', margin: '0 0 16px' }}>Sản phẩm bán chạy</p>
          {topProducts.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 8,
                background: i === 0 ? '#e8f5e4' : '#f5f9f3',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#3d6b35', flexShrink: 0,
                fontFamily: LMONO,
              }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1c19', fontFamily: NS, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>Đã bán: {p.sold} · CO₂ {p.carbon}kg</div>
              </div>
              <div style={{ ...MONO, fontSize: 13, fontWeight: 700, color: '#3d6b35', flexShrink: 0 }}>{p.revenue}</div>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div style={{ ...GLASS, padding: '22px 24px' }}>
          <p style={{ fontFamily: NS, fontWeight: 600, fontSize: 15, color: '#1a1c19', margin: '0 0 16px' }}>Đơn hàng gần đây</p>
          {recentOrders.map(o => (
            <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ ...MONO, fontSize: 12, fontWeight: 700, color: '#3d6b35' }}>#{o.id}</span>
                  <span style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>{o.time}</span>
                </div>
                <div style={{ fontSize: 13, color: '#42493e', fontFamily: NS }}>{o.customer} · <span style={{ ...MONO }}>{o.total}đ</span></div>
              </div>
              <span style={{ ...statusStyle[o.status], borderRadius: 999, padding: '2px 9px', fontSize: 11, fontWeight: 600, fontFamily: NS, whiteSpace: 'nowrap' as const }}>
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Orders bar chart */}
      <div style={{ ...GLASS, padding: '22px 24px' }}>
        <p style={{ fontFamily: NS, fontWeight: 600, fontSize: 15, color: '#1a1c19', margin: '0 0 16px' }}>Số đơn hàng theo tháng</p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={revenueData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2eb" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280', fontFamily: NS }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280', fontFamily: LMONO }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #dde8d8', fontSize: 12, fontFamily: NS }} />
            <Bar dataKey="orders" fill="#5a9448" radius={[4, 4, 0, 0]} name="Đơn hàng" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
