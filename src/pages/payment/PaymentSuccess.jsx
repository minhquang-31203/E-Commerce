import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../../contexts';
import { formatPrice } from '../../api';

// Component thông báo Thanh toán thành công (Payment Success Page)
const PaymentSuccess = () => {
  // Lấy mã đơn hàng orderId từ URL params
  const { orderId } = useParams();
  const { orders } = useOrders();

  // Tìm đơn hàng tương ứng khớp với ID
  const order = orders.find(o => o.id === orderId);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-obsidian flex items-center justify-center px-6">
      <div className="text-center glass-card rounded-3xl p-10 max-w-md mx-auto animate-scale-in">
        {/* Biểu tượng dấu tích xanh */}
        <div className="w-16 h-16 rounded-full bg-emerald/20 text-emerald flex items-center justify-center mx-auto mb-6">
          <svg fill="currentColor" viewBox="0 0 20 20" className="w-8 h-8">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
        </div>
        
        <h2 className="text-ivory font-heading text-2xl lg:text-3xl font-bold mb-3">Thanh toán thành công!</h2>
        <p className="text-silver text-sm mb-4">
          Giao dịch cho đơn hàng <span className="text-gold font-mono font-bold">{orderId}</span> đã được ghi nhận.
        </p>

        {/* Khối hiển thị biên lai tóm tắt đơn hàng thanh toán thành công */}
        {order && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left text-xs mb-8 space-y-2">
            <div className="flex justify-between"><span className="text-silver-dark">Khách hàng:</span><span className="text-ivory font-medium">{order.customerName}</span></div>
            <div className="flex justify-between"><span className="text-silver-dark">Số tiền đã trả:</span><span className="text-emerald font-bold">{formatPrice(order.total)}</span></div>
            <div className="flex justify-between"><span className="text-silver-dark">Phương thức:</span><span className="text-gold font-medium uppercase">{order.paymentMethod}</span></div>
          </div>
        )}

        {/* Khối các Nút chuyển tiếp */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/orders"
            className="px-6 py-3 rounded-full bg-gold text-obsidian font-semibold text-xs no-underline hover:shadow-glow-gold transition-all"
          >
            Lịch sử mua hàng
          </Link>
          
          <Link
            to="/"
            className="px-6 py-3 rounded-full border border-white/15 text-ivory font-medium text-xs no-underline hover:bg-white/5 transition-all"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

