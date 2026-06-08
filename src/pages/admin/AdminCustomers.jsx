import React, { useMemo } from 'react';
import { useOrders } from '../../contexts';
import { formatPrice } from '../../api';

const AdminCustomers = () => {
  const { orders } = useOrders();

  const customers = useMemo(() => {
    const map = {};
    orders.forEach(order => {
      const id = order.customerId || order.shippingInfo?.name || 'unknown';
      const name = order.customerName || order.shippingInfo?.name || 'Khách vãng lai';
      if (!map[id]) {
        map[id] = { id, name, email: order.customerId || '—', totalOrders: 0, totalSpent: 0, lastOrderDate: order.date };
      }
      map[id].totalOrders += 1;
      map[id].totalSpent += order.total;
      map[id].lastOrderDate = order.date;
    });
    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-2xl bg-obsidian/40 border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Customer Name</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Email</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Total Orders</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Total Spent</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Last Order Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/20 to-sapphire/20 flex items-center justify-center text-ivory text-xs font-bold shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-ivory text-sm font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4"><span className="text-silver text-xs">{c.email}</span></td>
                  <td className="py-3.5 px-4"><span className="text-ivory text-sm font-semibold">{c.totalOrders}</span></td>
                  <td className="py-3.5 px-4"><span className="text-emerald text-sm font-bold">{formatPrice(c.totalSpent)}</span></td>
                  <td className="py-3.5 px-4"><span className="text-silver-dark text-xs">{c.lastOrderDate}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3 opacity-40">👥</div>
            <p className="text-silver-dark text-sm">Chưa có dữ liệu khách hàng</p>
            <p className="text-silver-dark/60 text-xs mt-1">Dữ liệu khách hàng sẽ xuất hiện khi có đơn hàng</p>
          </div>
        )}
      </div>
      <p className="text-silver-dark text-xs">{customers.length} khách hàng</p>
    </div>
  );
};

export default AdminCustomers;
