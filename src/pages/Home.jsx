import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/layout/Banner';
import ProductCard from '../components/common/ProductCard';
import ProductSkeleton from '../components/common/ProductSkeleton';
import { useProducts } from '../hooks';

const Home = () => {
  const { products, loading } = useProducts('all');

  const saleProducts = useMemo(() => products.filter(p => p.id <= 4), [products]);
  const trendingProducts = useMemo(() => products.filter(p => p.id > 4 && p.id <= 12), [products]);

  return (
    <div className="bg-obsidian">
      <Banner />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        
        {/* Siêu Sale Section */}
        <section className="py-16" aria-label="Siêu sale hôm nay">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-ivory">
                <span className="mr-2">🔥</span> Siêu Sale Hôm Nay
              </h2>
              <p className="text-silver mt-2 text-sm">
                Sở hữu ngay các sản phẩm yêu thích với mức giá độc quyền.
              </p>
            </div>
            <Link to="/products" className="inline-flex items-center gap-1 text-gold text-sm font-medium hover:text-gold-light transition-colors no-underline group">
              Xem tất cả 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : saleProducts.map((product, i) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))
            }
          </div>
        </section>

        {/* Tại sao chọn chúng tôi */}
        <section className="py-16" aria-label="Tại sao chọn chúng tôi">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-ivory text-center">Tại Sao Chọn ECommerce?</h2>
          <p className="text-silver text-center mt-3 text-sm max-w-lg mx-auto">Cam kết mang đến trải nghiệm mua sắm tốt nhất cho bạn.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {[
              { icon: '🚚', title: 'Giao hàng miễn phí', desc: 'Miễn phí vận chuyển cho mọi đơn hàng trên toàn quốc, không giới hạn giá trị.' },
              { icon: '✅', title: 'Sản phẩm chính hãng', desc: '100% sản phẩm chính hãng, có tem chống hàng giả và giấy chứng nhận.' },
              { icon: '🔄', title: 'Đổi trả dễ dàng', desc: 'Chính sách đổi trả trong 30 ngày. Hoàn tiền nhanh chóng, không phiền hà.' },
              { icon: '💬', title: 'Tư vấn tận tâm', desc: 'Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ bạn 24/7 qua chat và hotline.' },
            ].map((feature, i) => (
              <div key={feature.title} className="glass-card rounded-2xl p-6 text-center hover:border-gold/20 transition-all duration-500 group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-ivory text-base font-semibold font-heading mb-2">{feature.title}</h3>
                <p className="text-silver-dark text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section className="py-16" aria-label="Đang được săn đón">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ivory">Đang Được Săn Đón</h2>
            <p className="text-silver mt-3 text-sm max-w-lg mx-auto">
              Khám phá bộ sưu tập thịnh hành nhất tháng này, được tuyển chọn kỹ lưỡng dành riêng cho bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              : trendingProducts.map((product, i) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))
            }
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16" aria-label="Đánh giá khách hàng">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-ivory text-center">Khách Hàng Nói Gì?</h2>
          <p className="text-silver text-center mt-3 text-sm">Hơn 50,000+ khách hàng đã tin tưởng và yêu thích ECommerce.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
            {[
              { text: '"Sản phẩm chất lượng, giao hàng nhanh. Đặc biệt là dịch vụ chăm sóc khách hàng rất tận tình!"', name: 'Thanh Ngọc', role: 'Khách hàng thân thiết', initials: 'TN' },
              { text: '"Mình đã thử nhiều nơi nhưng ECommerce là nơi mình tin tưởng nhất. Sản phẩm chính hãng 100%."', name: 'Minh Hoàng', role: 'Đã mua 15+ đơn', initials: 'MH' },
              { text: '"Giá cả hợp lý, thường xuyên có khuyến mãi. Giao diện web đẹp, dễ sử dụng. Rất recommend!"', name: 'Lan Anh', role: 'Khách hàng VIP', initials: 'LA' },
            ].map((t, i) => (
              <div key={t.name} className="glass-card rounded-2xl p-6 hover:border-gold/20 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="text-gold text-sm mb-3 tracking-wider">★★★★★</div>
                <p className="text-silver text-sm leading-relaxed italic mb-5">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-obsidian text-xs font-bold">{t.initials}</div>
                  <div>
                    <strong className="text-ivory text-sm block">{t.name}</strong>
                    <span className="text-silver-dark text-xs">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-10">
          <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm
            bg-gradient-to-r from-gold to-gold-dark text-obsidian 
            shadow-glow-gold hover:shadow-glow-gold-strong
            transition-all duration-300 hover:-translate-y-0.5 no-underline">
            Khám phá toàn bộ danh mục →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Home;