import React from 'react';
import { useOrders } from '../contexts';
import { Link } from 'react-router-dom';
import { formatPrice } from '../api';

// Component hiển thị lịch sử đơn hàng của người dùng (Order History Page)
const OrderHistory = () => {
  // Lấy danh sách toàn bộ đơn hàng từ OrderContext
  const { orders } = useOrders();

  // Trường hợp chưa có đơn hàng nào
  if (orders.length === 0) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-obsidian">
        <div className="text-center glass-card rounded-3xl p-12 max-w-md mx-auto animate-scale-in">
          <div className="text-5xl mb-5 opacity-50">📦</div>
          <h2 className="text-ivory font-heading text-2xl mb-3">Bạn chưa có đơn hàng nào</h2>
          <p className="text-silver text-sm mb-8">Hãy chọn cho mình những sản phẩm chăm sóc da tuyệt vời nhé!</p>
          <Link to="/products" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-gold to-gold-dark text-obsidian font-semibold text-sm no-underline hover:shadow-glow-gold transition-all">
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-obsidian">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h2 className="font-heading text-3xl font-bold text-ivory mb-8 animate-fade-in">Lịch sử mua hàng</h2>
        
        {/* Danh sách thẻ đơn hàng xếp dọc */}
        <div className="space-y-5">
          {orders.map((order, i) => (
            <div 
              key={order.id} 
              className="glass-card rounded-2xl overflow-hidden animate-fade-in-up" 
              style={{ animationDelay: `${i * 0.1}s` }} // Hiệu ứng hiển thị so le
            >
              {/* Phần đầu của thẻ đơn hàng (Mã đơn, Ngày đặt, Trạng thái) */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5">
                <div>
                  <span className="text-gold text-xs font-mono font-bold">Mã đơn: {order.id}</span>
                  <p className="text-silver-dark text-xs mt-0.5">Ngày đặt: {order.date}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold self-start">{order.status}</span>
              </div>
              
              {/* Danh sách các sản phẩm có trong đơn hàng này */}
              <div className="p-5 space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-surface" />
                    <div className="flex-1 min-w-0">
                      <p className="text-ivory text-sm truncate">{item.name}</p>
                      <p className="text-silver-dark text-xs">SL: {item.quantity}</p>
                    </div>
                    <span className="text-gold text-sm font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Phần chân của thẻ đơn hàng (Thông tin giao nhận & Tổng tiền) */}
              <div className="p-5 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3">
                <div className="text-xs text-silver-dark space-y-0.5">
                  <p><strong className="text-silver">Người nhận:</strong> {order.shippingInfo.name}</p>
                  <p><strong className="text-silver">Địa chỉ:</strong> {order.shippingInfo.address}</p>
                </div>
                <div className="text-right">
                  <span className="text-silver text-xs">Tổng thanh toán:</span>
                  <span className="block text-gold font-bold text-lg font-heading">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;