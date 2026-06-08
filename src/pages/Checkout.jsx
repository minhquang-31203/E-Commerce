import React, { useState } from 'react';
import { useCart, useOrders, useAuth } from '../contexts';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { formatPrice } from '../api';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const formik = useFormik({
    initialValues: { name: '', phone: '', address: '', note: '', paymentMethod: 'cod' },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Tên quá ngắn').required('Vui lòng nhập họ và tên'),
      phone: Yup.string().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ').required('Vui lòng cung cấp số điện thoại'),
      address: Yup.string().min(10, 'Vui lòng nhập địa chỉ chi tiết hơn').required('Địa chỉ giao hàng không được để trống'),
      note: Yup.string().max(200, 'Ghi chú không được quá 200 ký tự'),
    }),
    onSubmit: (values) => {
      const orderId = `ORD-${Date.now()}`;
      
      const newOrder = {
        id: orderId,
        customerId: user?.email || 'guest',
        customerName: values.name || user?.name || 'Khách vãng lai',
        date: new Date().toLocaleString('vi-VN'),
        createdAt: new Date().toISOString(),
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          img: item.img,
          name: item.name,
        })),
        total: totalPrice,
        shippingInfo: {
          name: values.name,
          phone: values.phone,
          address: values.address,
          note: values.note,
        },
        paymentMethod: values.paymentMethod,
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
        status: 'Đang xử lý', // keeping status for backwards compatibility
      };

      addOrder(newOrder);

      if (values.paymentMethod === 'cod') {
        setCreatedOrderId(orderId);
        setIsSuccess(true);
        clearCart();
        toast.success("✨ Đặt hàng COD thành công!");
      } else {
        clearCart();
        toast.info("🔄 Đang chuyển đến cổng thanh toán...");
        navigate(`/payment/mock/${orderId}`);
      }
    },
  });

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-obsidian">
        <div className="text-center glass-card rounded-3xl p-12 max-w-md mx-auto animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-emerald/20 text-emerald flex items-center justify-center mx-auto mb-5">
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-8 h-8"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
          </div>
          <h2 className="text-ivory font-heading text-2xl mb-3">Đặt hàng thành công!</h2>
          <p className="text-silver text-sm mb-2">Mã đơn: <span className="text-gold font-mono font-bold">{createdOrderId}</span></p>
          <p className="text-silver text-sm mb-8">Cảm ơn bạn đã tin tưởng ECommerce. Chúng tôi sẽ sớm giao hàng đến bạn.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/orders" className="px-6 py-3 rounded-full bg-gold text-obsidian font-semibold text-sm no-underline hover:shadow-glow-gold transition-all">Xem đơn hàng</Link>
            <Link to="/" className="px-6 py-3 rounded-full border border-white/15 text-ivory font-medium text-sm no-underline hover:bg-white/5 transition-all">Tiếp tục mua sắm</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-obsidian">
        <div className="text-center glass-card rounded-3xl p-12 max-w-md mx-auto">
          <h2 className="text-ivory font-heading text-2xl mb-3">Không có sản phẩm nào</h2>
          <p className="text-silver text-sm mb-6">Hãy lấp đầy giỏ hàng bằng những sản phẩm tuyệt vời!</p>
          <Link to="/" className="inline-block px-6 py-3 rounded-full bg-gold text-obsidian font-semibold text-sm no-underline">Quay lại cửa hàng</Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-sm placeholder:text-silver-dark/50 focus:outline-none focus:border-gold/40 focus:bg-white/8 transition-all";
  const errorInputClass = "border-rose/50 focus:border-rose/70";

  return (
    <div className="min-h-screen pt-24 pb-20 bg-obsidian">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-10 animate-fade-in">
          {['Giỏ hàng', 'Thanh toán', 'Hoàn tất'].map((step, i) => (
            <React.Fragment key={step}>
              {i > 0 && <div className={`w-12 h-px ${i <= 1 ? 'bg-gold' : 'bg-white/10'}`}></div>}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${i === 0 ? 'bg-gold text-obsidian' : i === 1 ? 'bg-gold/20 text-gold border border-gold/40' : 'bg-white/5 text-silver-dark border border-white/10'}`}>
                  {i === 0 ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${i <= 1 ? 'text-ivory' : 'text-silver-dark'}`}>{step}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in-up">
          {/* Form */}
          <form className="lg:col-span-3 glass-card rounded-2xl p-6 lg:p-8" onSubmit={formik.handleSubmit} noValidate>
            <h3 className="text-ivory font-heading text-xl mb-6">Thông tin giao hàng</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-silver text-xs font-medium mb-1.5">Họ và tên <span className="text-rose">*</span></label>
                <input id="name" type="text" {...formik.getFieldProps('name')} placeholder="Nguyễn Văn A" className={`${inputClass} ${formik.touched.name && formik.errors.name ? errorInputClass : ''}`} />
                {formik.touched.name && formik.errors.name && <span className="text-rose text-xs mt-1 block">{formik.errors.name}</span>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-silver text-xs font-medium mb-1.5">Số điện thoại <span className="text-rose">*</span></label>
                <input id="phone" type="tel" {...formik.getFieldProps('phone')} placeholder="0987654321" className={`${inputClass} ${formik.touched.phone && formik.errors.phone ? errorInputClass : ''}`} />
                {formik.touched.phone && formik.errors.phone && <span className="text-rose text-xs mt-1 block">{formik.errors.phone}</span>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-silver text-xs font-medium mb-1.5">Địa chỉ giao hàng <span className="text-rose">*</span></label>
                <textarea id="address" rows="2" {...formik.getFieldProps('address')} placeholder="Số nhà, Tên đường, Phường/Xã..." className={`${inputClass} resize-none ${formik.touched.address && formik.errors.address ? errorInputClass : ''}`}></textarea>
                {formik.touched.address && formik.errors.address && <span className="text-rose text-xs mt-1 block">{formik.errors.address}</span>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="note" className="block text-silver text-xs font-medium mb-1.5">Ghi chú (Tùy chọn)</label>
                <textarea id="note" rows="2" {...formik.getFieldProps('note')} placeholder="Nhờ shop gói quà..." className={`${inputClass} resize-none`}></textarea>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="paymentMethod" className="block text-silver text-xs font-medium mb-1.5">Phương thức thanh toán <span className="text-rose">*</span></label>
                <select id="paymentMethod" {...formik.getFieldProps('paymentMethod')} className={`${inputClass} cursor-pointer bg-obsidian-light text-ivory`}>
                  <option value="cod" className="bg-obsidian-light text-ivory">Thanh toán khi nhận hàng (COD)</option>
                  <option value="online" className="bg-obsidian-light text-ivory">Thanh toán trực tuyến (Online Payment)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-obsidian font-bold text-sm tracking-wider uppercase border-none hover:shadow-glow-gold-strong transition-all cursor-pointer">
              Hoàn tất đặt hàng
            </button>
          </form>

          {/* Summary */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 h-fit lg:sticky lg:top-24">
            <h3 className="text-ivory font-heading text-lg mb-5">Đơn hàng ({cart.reduce((a, b) => a + b.quantity, 0)} SP)</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-obsidian text-[10px] font-bold flex items-center justify-center">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0"><p className="text-ivory text-xs truncate">{item.name}</p></div>
                  <span className="text-gold text-xs font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 mt-4 pt-4 flex justify-between">
              <span className="text-ivory font-semibold text-sm">Tổng thanh toán:</span>
              <span className="text-gold font-bold text-lg">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;