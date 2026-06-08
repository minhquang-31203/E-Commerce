import React, { useState, useMemo } from 'react';
import { useOrders } from '../../contexts';
import { formatPrice } from '../../api';
import { toast } from 'react-toastify';

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Đang xử lý', value: 'Đang xử lý' },
  { label: 'Hoàn thành', value: 'Hoàn thành' },
  { label: 'Đã hủy', value: 'Đã hủy' },
];

const paymentMethodBadge = (method) => {
  const map = {
    'cod': 'bg-sapphire/15 text-sapphire border-sapphire/25',
    'online': 'bg-gold/15 text-gold border-gold/25',
  };
  const labels = {
    'cod': 'COD',
    'online': 'Online Payment',
  };
  return {
    className: map[method] || 'bg-white/10 text-silver border-white/15',
    label: labels[method] || method || '—'
  };
};

const paymentStatusBadge = (status) => {
  const map = {
    'unpaid': 'bg-amber/15 text-amber border-amber/25',
    'paid': 'bg-emerald/15 text-emerald border-emerald/25',
    'failed': 'bg-rose/15 text-rose border-rose/25',
  };
  const labels = {
    'unpaid': 'Chưa thanh toán',
    'paid': 'Đã thanh toán',
    'failed': 'Thất bại',
  };
  return {
    className: map[status] || 'bg-white/10 text-silver border-white/15',
    label: labels[status] || status || '—'
  };
};

const orderStatusBadge = (status) => {
  const map = {
    'pending': 'bg-amber/15 text-amber border-amber/25',
    'confirmed': 'bg-emerald/15 text-emerald border-emerald/25',
    'cancelled': 'bg-rose/15 text-rose border-rose/25',
  };
  const labels = {
    'pending': 'Chờ xử lý',
    'confirmed': 'Đã xác nhận',
    'cancelled': 'Đã hủy',
  };
  return {
    className: map[status] || 'bg-white/10 text-silver border-white/15',
    label: labels[status] || status || '—'
  };
};

const AdminOrders = () => {
  const { orders, updateOrder } = useOrders();
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter(o => o.status === filter);
  }, [orders, filter]);

  const handleToggleStatus = (orderId, currentOrderStatus) => {
    const nextMap = {
      'pending': { orderStatus: 'confirmed', status: 'Hoàn thành' },
      'confirmed': { orderStatus: 'cancelled', status: 'Đã hủy' },
      'cancelled': { orderStatus: 'pending', status: 'Đang xử lý' }
    };
    const next = nextMap[currentOrderStatus || 'pending'];
    updateOrder(orderId, next);
    toast.success(`🔄 Đã cập nhật đơn ${orderId} thành "${next.status}"!`);
  };

  const handleTogglePaymentStatus = (orderId, currentPaymentStatus) => {
    const nextMap = {
      'unpaid': { paymentStatus: 'paid' },
      'paid': { paymentStatus: 'failed' },
      'failed': { paymentStatus: 'unpaid' }
    };
    const next = nextMap[currentPaymentStatus || 'unpaid'];
    updateOrder(orderId, next);
    toast.success(`💳 Đã cập nhật TT thanh toán đơn ${orderId}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer
              ${filter === f.value
                ? 'bg-gold/10 text-gold border-gold/25'
                : 'bg-transparent text-silver border-white/10 hover:bg-white/5 hover:text-ivory'
              }`}
          >
            {f.label}
            {f.value !== 'all' && (
              <span className="ml-1.5 text-[10px] opacity-60">
                ({orders.filter(o => o.status === f.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-obsidian/40 border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Order ID</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Khách hàng</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Sản phẩm</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Tổng tiền</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Phương thức</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">TT Thanh toán</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">TT Đơn hàng</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Ngày đặt</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const methodBadge = paymentMethodBadge(order.paymentMethod);
                const payBadge = paymentStatusBadge(order.paymentStatus);
                const ordBadge = orderStatusBadge(order.orderStatus);

                return (
                  <tr key={order.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="text-gold text-xs font-mono font-semibold">{order.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-ivory text-xs font-medium">{order.customerName || '—'}</p>
                      <p className="text-silver-dark text-[10px]">{order.customerId || '—'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="max-w-[180px]">
                        {order.items.slice(0, 2).map((item, i) => (
                          <p key={i} className="text-silver text-xs truncate">
                            {item.productName || item.name} × {item.quantity}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-silver-dark text-[10px]">+{order.items.length - 2} more</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald text-sm font-bold">{formatPrice(order.total)}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${methodBadge.className}`}>
                        {methodBadge.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePaymentStatus(order.id, order.paymentStatus)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${payBadge.className} hover:scale-105 active:scale-95 transition-all cursor-pointer bg-transparent`}
                        title="Click to toggle Payment Status"
                      >
                        {payBadge.label}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(order.id, order.orderStatus)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${ordBadge.className} hover:scale-105 active:scale-95 transition-all cursor-pointer bg-transparent`}
                        title="Click to toggle Order Status"
                      >
                        {ordBadge.label}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-silver-dark text-xs">{order.date}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toast.info(`Đơn hàng của khách ${order.customerName} tổng cộng ${formatPrice(order.total)}`)}
                        className="p-1.5 rounded-lg bg-transparent border-none text-silver hover:text-sapphire hover:bg-sapphire/10 transition-all cursor-pointer"
                        title="Quick View Info"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-silver-dark text-sm">
              {filter === 'all' ? 'Chưa có đơn hàng nào' : `Không có đơn hàng "${filter}"`}
            </p>
            <p className="text-silver-dark/60 text-xs mt-1">Đơn hàng sẽ xuất hiện khi khách mua hàng</p>
          </div>
        )}
      </div>
      <p className="text-silver-dark text-xs">Hiển thị {filtered.length} / {orders.length} đơn hàng</p>
    </div>
  );
};

export default AdminOrders;
