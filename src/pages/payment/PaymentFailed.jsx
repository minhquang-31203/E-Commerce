import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../../contexts';
import { formatPrice } from '../../api';

// Component thông báo Thanh toán thất bại (Payment Failed Page)
const PaymentFailed = () => {
  // Lấy mã đơn hàng orderId từ tham số trên URL
  const { orderId } = useParams();
  const { orders } = useOrders();

  // Tìm thông tin đơn hàng tương ứng
  const order = orders.find(o => o.id === orderId);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-obsidian flex items-center justify-center px-6">
      <div className="text-center glass-card rounded-3xl p-10 max-w-md mx-auto animate-scale-in">
        {/* Biểu tượng lỗi đỏ */}
        <div className="w-16 h-16 rounded-full bg-rose/20 text-rose flex items-center justify-center mx-auto mb-6">
          <svg fill="currentColor" viewBox="0 0 20 20" className="w-8 h-8">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
          </svg>
        </div>
        
        <h2 className="text-ivory font-heading text-2xl lg:text-3xl font-bold mb-3">Thanh toán thất bại</h2>
        <p className="text-silver text-sm mb-4">
          Yêu cầu thanh toán cho đơn hàng <span className="text-rose font-mono font-bold">{orderId}</span> đã bị hủy bỏ hoặc gặp lỗi.
        </p>

        {/* Khối hiển thị thông tin đơn hàng bị lỗi (nếu tìm thấy) */}
        {order && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left text-xs mb-8 space-y-2">
            <div className="flex justify-between"><span className="text-silver-dark">Khách hàng:</span><span className="text-ivory font-medium">{order.customerName}</span></div>
            <div className="flex justify-between"><span className="text-silver-dark">Số tiền:</span><span className="text-rose font-bold">{formatPrice(order.total)}</span></div>
            <div className="flex justify-between"><span className="text-silver-dark">Trạng thái:</span><span className="text-rose font-medium uppercase">{order.paymentStatus}</span></div>
          </div>
        )}

        {/* Khối các Nút chuyển tiếp */}
        <div className="flex gap-4 justify-center">
          <Link
            to={`/payment/mock/${orderId}`}
            className="px-6 py-3 rounded-full bg-gold text-obsidian font-semibold text-xs no-underline hover:shadow-glow-gold transition-all"
          >
            Thử thanh toán lại
          </Link>
          
          <Link
            to="/"
            className="px-6 py-3 rounded-full border border-white/15 text-ivory font-medium text-xs no-underline hover:bg-white/5 transition-all"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;

