import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-obsidian min-h-screen pt-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden" aria-label="Giới thiệu thương hiệu">
        {/* Animated Light Mesh Circles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-gold/5 blur-[110px] animate-float"></div>
          <div className="absolute bottom-[-15%] left-[-10%] w-[450px] h-[450px] rounded-full bg-sapphire/5 blur-[90px] animate-float [animation-delay:2s]"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold/8 text-gold-dark border border-gold/20">
            ✨ CÂU CHUYỆN THƯƠNG HIỆU
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-ivory leading-tight">
            Nâng Tầm Trải Nghiệm<br />
            <span className="gradient-text-gold">Chăm Sóc Sắc Đẹp</span>
          </h1>
          <p className="text-silver text-sm sm:text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed font-body">
            Chào mừng bạn đến với ECommerce. Nơi chúng tôi tuyển chọn những giải pháp chăm sóc da khoa học, 
            mỹ phẩm cao cấp và nước hoa tinh xảo giúp bạn tỏa sáng rạng ngời mỗi ngày.
          </p>
        </div>
      </section>

      {/* Brand Mission & Story */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up text-left">
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">SỨ MỆNH CỦA CHÚNG TÔI</span>
            <h2 className="font-heading text-3xl font-bold text-ivory">Tôn Vinh Vẻ Đẹp Nguyên Bản & An Toàn Khoa Học</h2>
            
            <p className="text-silver text-sm leading-relaxed font-light">
              ECommerce ra đời với tầm nhìn trở thành điểm đến mua sắm uy tín hàng đầu cho những tín đồ làm đẹp đích thực. Chúng tôi tin rằng làn da phản ánh sức khỏe và phong cách sống của bạn, vì thế mọi sản phẩm xuất hiện tại cửa hàng đều phải trải qua các quy trình đánh giá khắt khe.
            </p>
            <p className="text-silver text-sm leading-relaxed font-light">
              Chúng tôi cam kết mang tới cho khách hàng những dòng sản phẩm dưỡng da dịu nhẹ, serum đặc trị phục hồi chuyên sâu và nước hoa đẳng cấp quốc tế chính hãng 100%. Nói không với hàng giả, hàng kém chất lượng và các chất độc hại gây tổn thương biểu bì.
            </p>
            <div className="pt-2">
              <blockquote className="border-l-2 border-gold pl-4 text-silver italic text-xs leading-relaxed">
                "Vẻ đẹp thực sự không nằm ở việc che giấu khuyết điểm, mà nằm ở việc nuôi dưỡng làn da khỏe mạnh, căng tràn sức sống từ sâu bên trong."
              </blockquote>
            </div>
          </div>
          
          <div className="relative flex justify-center animate-fade-in-up [animation-delay:0.2s]">
            {/* Elegant glassmorphic layout container */}
            <div className="relative z-10 w-full max-w-md rounded-3xl p-3 bg-white/40 backdrop-blur-md border border-white/60 shadow-card">
              <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-obsidian-light border border-gold/10">
                <img 
                  src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80" 
                  alt="Elegant Skincare Routine Showcase" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grids */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16 text-center border-t border-silver-dark/10">
        <span className="text-[10px] font-bold text-gold uppercase tracking-wider block mb-2">GIÁ TRỊ CỐT LÕI</span>
        <h2 className="font-heading text-3xl font-bold text-ivory mb-12">Cam Kết Tuyệt Đối Về Chất Lượng</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🛡️',
              title: '100% Chính Hãng',
              desc: 'Tất cả sản phẩm được phân phối trực tiếp từ các thương hiệu làm đẹp danh tiếng và hệ thống đối tác quốc tế uy tín.'
            },
            {
              icon: '🧪',
              title: 'Kiểm Định Khoa Học',
              desc: 'Ưu tiên các dòng mỹ phẩm lành tính, chứa các hoạt chất phục hồi tự nhiên đã được kiểm chứng lâm sàng an toàn cho mọi loại da.'
            },
            {
              icon: '👑',
              title: 'Trải Nghiệm Premium',
              desc: 'Gói quà chuẩn Boutique sang trọng, hỗ trợ tư vấn chăm sóc cá nhân hóa 24/7 và giao hàng siêu tốc, an toàn.'
            }
          ].map((v, i) => (
            <div 
              key={v.title} 
              className="glass-card rounded-2xl p-6 text-center hover:border-gold/30 hover:shadow-glow-gold transition-all duration-500 group animate-fade-in-up" 
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto text-xl mb-4 group-hover:scale-110 transition-transform">
                {v.icon}
              </div>
              <h3 className="text-ivory font-heading text-base font-bold mb-2">{v.title}</h3>
              <p className="text-silver text-xs sm:text-sm leading-relaxed font-light">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Store Commitments & Banner */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16 border-t border-silver-dark/10">
        <div className="glass-card rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden bg-gradient-to-br from-gold/5 via-transparent to-transparent">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-ivory">Sẵn Sàng Nâng Cấp Chu Trình Làm Đẹp Của Bạn?</h3>
            <p className="text-silver text-xs sm:text-sm leading-relaxed font-light">
              Khám phá hàng ngàn sản phẩm dưỡng da, son môi, kem dưỡng ẩm và hương nước hoa quyến rũ được tuyển chọn kỹ lưỡng. Hãy để ECommerce đồng hành cùng bạn trên hành trình tỏa sáng rực rỡ.
            </p>
            <div className="pt-2">
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider
                  bg-gradient-to-r from-gold to-gold-dark text-white shadow-glow-gold hover:shadow-glow-gold-strong
                  transition-all duration-300 hover:-translate-y-0.5 no-underline"
              >
                Khám phá Cửa hàng
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;