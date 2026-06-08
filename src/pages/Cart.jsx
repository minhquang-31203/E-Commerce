import React from 'react';
import { useCart } from '../contexts';
import { Link } from 'react-router-dom';
import { formatPrice } from '../api';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-obsidian">
        <div className="text-center glass-card rounded-3xl p-12 max-w-md mx-auto animate-scale-in">
          <div className="text-6xl mb-6 opacity-50">🛒</div>
          <h2 className="text-ivory font-heading text-2xl mb-3">Giỏ hàng của bạn đang trống</h2>
          <p className="text-silver text-sm mb-8 leading-relaxed">Dường như bạn chưa thêm sản phẩm nào vào giỏ. Hãy khám phá và chọn cho mình các sản phẩm hoàn hảo nhé!</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold to-gold-dark text-obsidian font-semibold text-sm no-underline hover:shadow-glow-gold transition-all">
            Khám phá sản phẩm →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-obsidian">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="mb-8 animate-fade-in-up">
          <h2 className="font-heading text-3xl font-bold text-ivory">Giỏ hàng ({cart.reduce((a, b) => a + b.quantity, 0)} sản phẩm)</h2>
          <p className="text-silver text-sm mt-2">Tuyệt vời, bạn đã chọn đủ trang bị để chăm chút cho bản thân.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="glass-card rounded-2xl p-4 flex gap-4 animate-fade-in-up hover:border-gold/20 transition-all" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface">
                  <img src={item.img} alt={item.name} width="80" height="80" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-ivory text-sm font-medium truncate">{item.name}</h4>
                  <p className="text-gold font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-0 rounded-xl overflow-hidden border border-white/10">
                      <button className="w-8 h-8 flex items-center justify-center text-silver hover:text-ivory hover:bg-white/10 transition-all bg-transparent border-none text-sm" onClick={() => updateQuantity(item.id, -1)} aria-label="Giảm">−</button>
                      <span className="w-8 h-8 flex items-center justify-center text-ivory text-sm font-medium bg-white/5">{item.quantity}</span>
                      <button className="w-8 h-8 flex items-center justify-center text-silver hover:text-ivory hover:bg-white/10 transition-all bg-transparent border-none text-sm" onClick={() => updateQuantity(item.id, 1)} aria-label="Tăng">+</button>
                    </div>
                    <button className="flex items-center gap-1.5 text-silver-dark text-xs hover:text-rose transition-colors bg-transparent border-none cursor-pointer" onClick={() => removeFromCart(item.id)} aria-label="Xóa">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-6 h-fit lg:sticky lg:top-24">
            <h3 className="text-ivory font-heading text-lg mb-5">Tóm tắt đơn hàng</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-silver">Tạm tính:</span><span className="text-ivory">{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between"><span className="text-silver">Phí vận chuyển:</span><span className="text-emerald font-medium">Miễn phí</span></div>
              <div className="border-t border-white/10 pt-3 flex justify-between"><span className="text-ivory font-semibold">Tổng cộng:</span><span className="text-gold font-bold text-lg">{formatPrice(totalPrice)}</span></div>
            </div>
            <Link to="/checkout" className="block mt-6 no-underline">
              <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-obsidian font-bold text-sm tracking-wider uppercase border-none hover:shadow-glow-gold transition-all flex items-center justify-center gap-2">
                Tiến hành thanh toán →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;