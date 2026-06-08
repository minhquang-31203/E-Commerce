import React, { useMemo } from 'react';
import { useOrders } from '../../contexts';
import { formatPrice } from '../../api';
import StatCard from '../../components/admin/StatCard';
import RevenueChart from '../../components/admin/RevenueChart';
import TopProducts from '../../components/admin/TopProducts';
import RecentOrders from '../../components/admin/RecentOrders';

const AdminDashboard = () => {
  const { orders } = useOrders();

  // ── Tính toán thống kê từ dữ liệu orders thật ──
  const stats = useMemo(() => {
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
    
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProductsSold = paidOrders.reduce((sum, order) =>
      sum + order.items.reduce((s, item) => s + item.quantity, 0), 0
    );
    const uniqueCustomers = new Set(orders.map(o => o.customerId || o.shippingInfo?.name)).size;

    // Top sản phẩm bán chạy (chỉ lấy từ đơn hàng đã thanh toán)
    const productMap = {};
    paidOrders.forEach(order => {
      order.items.forEach(item => {
        const key = item.productName || item.name;
        if (!productMap[key]) {
          productMap[key] = { name: key, quantity: 0, revenue: 0 };
        }
        productMap[key].quantity += item.quantity;
        productMap[key].revenue += item.price * item.quantity;
      });
    });
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const recentOrders = orders.slice(0, 10);

    return { totalRevenue, totalOrders, totalProductsSold, uniqueCustomers, topProducts, recentOrders };
  }, [orders]);

  // ── Stat Cards Config ──
  const statCards = [
    {
      label: 'Tổng doanh thu',
      value: formatPrice(stats.totalRevenue),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-emerald', bg: 'bg-emerald/10', border: 'border-emerald/20',
    },
    {
      label: 'Tổng đơn hàng',
      value: stats.totalOrders,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'text-sapphire', bg: 'bg-sapphire/10', border: 'border-sapphire/20',
    },
    {
      label: 'Sản phẩm đã bán',
      value: stats.totalProductsSold,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20',
    },
    {
      label: 'Khách hàng',
      value: stats.uniqueCustomers,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'text-rose', bg: 'bg-rose/10', border: 'border-rose/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.1} />
        ))}
      </div>

      {/* Revenue Chart */}
      <RevenueChart orders={orders} />

      {/* Top Products + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <TopProducts topProducts={stats.topProducts} />
        </div>
        <div className="lg:col-span-3">
          <RecentOrders recentOrders={stats.recentOrders} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
