import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../../contexts';
import { formatPrice } from '../../api';
import { toast } from 'react-toastify';

// Component Cổng thanh toán trực tuyến Giả lập (Mock Payment Gateway Page)
const MockPayment = () => {
  // Lấy mã orderId từ đường dẫn URL router
  const { orderId } = useParams();
  const navigate = useNavigate();
  // Lấy danh sách các đơn hàng và hàm update từ OrderContext
  const { orders, updateOrder } = useOrders();

  // Tìm đơn hàng tương ứng khớp với orderId
  const order = orders.find(o => o.id === orderId);

  // Trường hợp không tìm thấy đơn hàng trên hệ thống
  if (!order) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-obsidian text-center">
        <div className="glass-card rounded-3xl p-12 max-w-md mx-auto">
          <div className="text-rose text-5xl mb-4">⚠️</div>
          <h2 className="text-ivory font-heading text-2xl mb-3">Đơn hàng không tồn tại</h2>
          <p className="text-silver text-sm mb-6">Không tìm thấy mã đơn hàng {orderId} trong hệ thống.</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full bg-gold text-obsidian font-semibold text-sm cursor-pointer border-none hover:shadow-glow-gold transition-all">
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Giả lập hành động người dùng bấm nút: "Thanh toán thành công"
  const handlePaymentSuccess = () => {
    updateOrder(orderId, {
      paymentStatus: 'paid',      // Đánh dấu đã thanh toán thành công
      orderStatus: 'confirmed',   // Chuyển đơn hàng sang đã xác nhận
      status: 'Hoàn thành'        // Khả năng tương thích ngược
    });
    toast.success("💳 Thanh toán thành công (Giả lập)!");
    navigate(`/payment/success/${orderId}`); // Chuyển sang màn hình chúc mừng thành công
  };

  // Giả lập hành động người dùng bấm nút: "Thanh toán thất bại"
  const handlePaymentFailed = () => {
    updateOrder(orderId, {
      paymentStatus: 'failed',     // Đánh dấu thanh toán thất bại
      orderStatus: 'cancelled',    // Đơn hàng tự động hủy
      status: 'Đã hủy'             // Khả năng tương thích ngược
    });
    toast.error("❌ Thanh toán thất bại (Giả lập)!");
    navigate(`/payment/failed/${orderId}`); // Chuyển sang màn hình báo lỗi thanh toán
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-obsidian flex items-center justify-center px-6">
      <div className="w-full max-w-2xl glass-card rounded-3xl p-8 lg:p-10 animate-scale-in">
        {/* Tiêu đề trang */}
        <div className="text-center mb-8 border-b border-white/5 pb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold mb-3">
            CỔNG THANH TOÁN GIẢ LẬP
          </span>
          <h2 className="text-ivory font-heading text-2xl lg:text-3xl font-bold">Xác nhận thanh toán trực tuyến</h2>
          <p className="text-silver-dark text-xs mt-2">Mã giao dịch: <span className="text-gold font-mono font-bold">{orderId}</span></p>
        </div>

        {/* Tóm tắt chi tiết giỏ hàng của đơn hàng cần thanh toán */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-ivory text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="text-gold">📦</span> Tóm tắt đơn hàng
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img src={item.img} alt={item.productName || item.name} className="w-10 h-10 rounded-lg object-cover bg-surface shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-ivory text-xs truncate">{item.productName || item.name}</p>
                    <p className="text-silver-dark text-[10px]">SL: {item.quantity}</p>
                  </div>
                  <span className="text-gold text-xs font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/15 mt-4 pt-3 flex justify-between">
              <span className="text-silver text-xs font-semibold">Khách hàng:</span>
              <span className="text-ivory text-xs">{order.customerName}</span>
            </div>
          </div>

          {/* Hiển thị số tiền phải trả và thông tin ngân hàng thụ hưởng giả lập */}
          <div className="flex flex-col justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div>
              <span className="text-silver-dark text-xs block mb-1">Số tiền cần thanh toán</span>
              <span className="text-emerald font-bold text-3xl font-heading block">{formatPrice(order.total)}</span>
            </div>
            
            <div className="mt-4 p-3 rounded-xl bg-gold/5 border border-gold/10 space-y-1.5 text-[11px] text-silver-dark">
              <p className="text-gold font-semibold mb-1">Thông tin chuyển khoản giả lập:</p>
              <p><strong className="text-silver">Ngân hàng:</strong> ECommerce Bank (ECB)</p>
              <p><strong className="text-silver">Số tài khoản:</strong> 0123 456 789</p>
              <p><strong className="text-silver">Chủ TK:</strong> ECOMMERCE PORTAL</p>
            </div>
          </div>
        </div>

        {/* Khối các Nút thao tác xử lý giao dịch */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
          <button
            onClick={handlePaymentFailed}
            className="flex-1 py-4 rounded-xl border border-rose/30 text-rose font-bold text-sm tracking-wider uppercase bg-rose/5 hover:bg-rose/10 hover:shadow-glow-rose transition-all cursor-pointer"
          >
            Thanh toán thất bại
          </button>
          
          <button
            onClick={handlePaymentSuccess}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald to-emerald-dark text-obsidian font-bold text-sm tracking-wider uppercase border-none hover:shadow-glow-emerald transition-all cursor-pointer"
          >
            Thanh toán thành công
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockPayment;

