import { useEffect, useState, useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { Icon } from './Icon'
import { GLASS, MONO, SECTION_LABEL, PAGE_TITLE } from './ui'
import { ordersApi, OrderResponse } from '../../../api/orders'
import { statisticsApi } from '../../../api/statistics'

const categoryDataMock = [
  { name: 'Home & Kitchen', value: 32, color: '#3d6b35' },
  { name: 'Personal Care',  value: 27, color: '#5a9448' },
  { name: 'Fashion',        value: 19, color: '#8ab87a' },
  { name: 'Food & Beverage',value: 14, color: '#b8d8a8' },
  { name: 'Khác',           value:  8, color: '#dde8d8' },
]

const statusStyle: Record<string, React.CSSProperties> = {
  'PENDING':      { background: '#fdf6ec', color: '#6f6143', border: '1px solid #e8d8ae' },
  'CONFIRMED':    { background: '#e8f0ff', color: '#3b4fd4', border: '1px solid #c5d0f5' },
  'SHIPPING':     { background: '#e8f0ff', color: '#3b4fd4', border: '1px solid #c5d0f5' },
  'COMPLETED':    { background: '#e8f5e4', color: '#25521f', border: '1px solid #c2deba' },
  'CANCELLED':    { background: '#fff0f0', color: '#ba1a1a', border: '1px solid #f5c2c2' },
}

const statusMap: Record<string, string> = {
  'PENDING': 'Chờ xác nhận',
  'CONFIRMED': 'Đã xác nhận',
  'SHIPPING': 'Đang giao',
  'COMPLETED': 'Đã giao',
  'CANCELLED': 'Đã hủy',
}

type StatIcon = Parameters<typeof Icon>[0]['name']

const NS = '"Nimbus Sans","Helvetica Neue",Arial,sans-serif'
const LMONO = '"Liberation Mono","Courier New",monospace'

function formatCurrency(amount: number) {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M';
  }
  return amount.toLocaleString() + 'đ';
}

function timeAgo(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / 3600000);
  if (diffHrs < 1) return 'Vừa xong';
  if (diffHrs < 24) return `${diffHrs} giờ trước`;
  return `${Math.floor(diffHrs / 24)} ngày trước`;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [revenueThisMonth, setRevenueThisMonth] = useState(0);

  useEffect(() => {
    ordersApi.getAllOrdersAdmin().then(setOrders).catch(console.error);
    const today = new Date().toISOString().split('T')[0];
    statisticsApi.getRevenue('MONTHLY', today).then(setRevenueThisMonth).catch(console.error);
  }, []);

  const data = useMemo(() => {
    // 1. Calculate 7 months chart data
    const months = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (6 - i));
      return {
        month: `T${d.getMonth() + 1}`,
        year: d.getFullYear(),
        monthNum: d.getMonth(),
        revenue: 0,
        orders: 0
      };
    });

    let totalOrdersThisMonth = 0;
    let totalCarbonSaved = 0;
    
    // Top products calculation
    const productStats: Record<number, { name: string; sold: number; revenue: number; carbon: number }> = {};

    orders.forEach(o => {
      const date = o.createdAt ? new Date(o.createdAt) : new Date();
      const m = date.getMonth();
      const y = date.getFullYear();
      
      const monthData = months.find(md => md.monthNum === m && md.year === y);
      
      if (o.status === 'COMPLETED' || o.status === 'SHIPPING' || o.status === 'CONFIRMED' || o.status === 'PENDING') {
        if (monthData) monthData.orders += 1;
        
        const now = new Date();
        if (m === now.getMonth() && y === now.getFullYear()) {
          totalOrdersThisMonth += 1;
        }
      }

      if (o.status === 'COMPLETED') {
        if (monthData) monthData.revenue += o.totalAmount;
        
        o.orderItems?.forEach(item => {
          totalCarbonSaved += (item.lineCarbonFootprint || 0);
          
          if (!productStats[item.productId]) {
            productStats[item.productId] = { name: item.productName, sold: 0, revenue: 0, carbon: 0 };
          }
          productStats[item.productId].sold += item.quantity;
          productStats[item.productId].revenue += item.price * item.quantity;
          productStats[item.productId].carbon += (item.lineCarbonFootprint || 0);
        });
      }
    });

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map(p => ({
        name: p.name,
        sold: p.sold,
        carbon: p.carbon.toFixed(1),
        revenue: formatCurrency(p.revenue)
      }));

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5)
      .map(o => ({
        id: `ORD-${o.id}`,
        customer: o.username,
        total: o.totalAmount.toLocaleString(),
        status: o.status,
        statusLabel: statusMap[o.status] || o.status,
        time: timeAgo(o.createdAt)
      }));

    const stats: { label: string; value: string; unit: string; trend: string; color: string; icon: StatIcon }[] = [
      { label: `Doanh thu tháng ${new Date().getMonth() + 1}`, value: formatCurrency(revenueThisMonth), unit: 'VNĐ',      trend: 'Mới nhất', color: '#3d6b35', icon: 'TrendingUp'  },
      { label: `Đơn hàng tháng ${new Date().getMonth() + 1}`,  value: totalOrdersThisMonth.toString(),   unit: 'đơn hàng', trend: 'Mới nhất', color: '#5a9448', icon: 'ShoppingBag' },
      { label: 'Người dùng mới',    value: '142', unit: 'tài khoản',trend: '+8.3%',  color: '#6f6143', icon: 'Users'       },
      { label: 'Carbon tiết kiệm',  value: totalCarbonSaved.toFixed(1),   unit: 'kg CO₂ eq.', trend: 'Tổng',color: '#3b4fd4', icon: 'Leaf'        },
    ];

    return {
      revenueData: months,
      topProducts,
      recentOrders,
      stats
    };
  }, [orders, revenueThisMonth]);

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <p style={SECTION_LABEL}>Tổng quan</p>
        <h1 style={PAGE_TITLE}>Thống kê</h1>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {data.stats.map(({ label, value, unit, trend, color, icon }) => (
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
            <AreaChart data={data.revenueData}>
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
              <Pie data={categoryDataMock} dataKey="value" cx="50%" cy="50%" outerRadius={62} innerRadius={30}>
                {categoryDataMock.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #dde8d8', fontSize: 12, fontFamily: NS }} formatter={v => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {categoryDataMock.map(c => (
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
          {data.topProducts.map((p, i) => (
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
          {data.topProducts.length === 0 && (
            <div style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>Chưa có dữ liệu sản phẩm</div>
          )}
        </div>

        {/* Recent orders */}
        <div style={{ ...GLASS, padding: '22px 24px' }}>
          <p style={{ fontFamily: NS, fontWeight: 600, fontSize: 15, color: '#1a1c19', margin: '0 0 16px' }}>Đơn hàng gần đây</p>
          {data.recentOrders.map(o => (
            <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ ...MONO, fontSize: 12, fontWeight: 700, color: '#3d6b35' }}>{o.id}</span>
                  <span style={{ fontSize: 11, color: '#6b7280', fontFamily: NS }}>{o.time}</span>
                </div>
                <div style={{ fontSize: 13, color: '#42493e', fontFamily: NS }}>{o.customer} · <span style={{ ...MONO }}>{o.total}đ</span></div>
              </div>
              <span style={{ ...(statusStyle[o.status] || statusStyle['PENDING']), borderRadius: 999, padding: '2px 9px', fontSize: 11, fontWeight: 600, fontFamily: NS, whiteSpace: 'nowrap' as const }}>
                {o.statusLabel}
              </span>
            </div>
          ))}
          {data.recentOrders.length === 0 && (
            <div style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>Chưa có đơn hàng nào</div>
          )}
        </div>
      </div>

      {/* Orders bar chart */}
      <div style={{ ...GLASS, padding: '22px 24px' }}>
        <p style={{ fontFamily: NS, fontWeight: 600, fontSize: 15, color: '#1a1c19', margin: '0 0 16px' }}>Số đơn hàng theo tháng</p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={data.revenueData} barSize={28}>
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
