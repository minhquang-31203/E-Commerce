import React from 'react';
import { formatPrice } from '../../api';

const statusBadge = (status) => {
  const map = {
    'Đang xử lý': 'bg-gold/15 text-gold border-gold/25',
    'Đang giao': 'bg-sapphire/15 text-sapphire border-sapphire/25',
    'Hoàn thành': 'bg-emerald/15 text-emerald border-emerald/25',
    'Đã giao': 'bg-emerald/15 text-emerald border-emerald/25',
    'Đã hủy': 'bg-ruby/15 text-ruby border-ruby/25',
  };
  return map[status] || 'bg-white/10 text-silver border-white/15';
};

const RecentOrders = ({ recentOrders = [] }) => {
  return (
    <div className="rounded-2xl bg-obsidian/40 border border-white/[0.06] p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
      <h3 className="text-ivory font-heading text-lg mb-5 flex items-center gap-2">
        <span className="text-sapphire">📋</span> Đơn hàng gần đây
      </h3>
      {recentOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-silver-dark text-sm">Chưa có đơn hàng nào</p>
          <p className="text-silver-dark/60 text-xs mt-1">Đơn hàng sẽ xuất hiện khi khách mua hàng</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider pb-3 pr-4">Mã đơn</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider pb-3 pr-4">Khách hàng</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider pb-3 pr-4">Sản phẩm</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider pb-3 pr-4">Tổng tiền</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider pb-3 pr-4">Trạng thái</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider pb-3">Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pr-4">
                    <span className="text-gold text-xs font-mono font-semibold">{order.id}</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <p className="text-ivory text-xs font-medium">{order.customerName || order.shippingInfo?.name || '—'}</p>
                    <p className="text-silver-dark text-[10px]">{order.customerId || '—'}</p>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="text-silver text-xs">{order.items.reduce((s, i) => s + i.quantity, 0)} SP</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="text-emerald text-xs font-bold">{formatPrice(order.total)}</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="text-silver-dark text-xs">{order.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
