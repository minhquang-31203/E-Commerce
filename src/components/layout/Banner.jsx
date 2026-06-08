import React from 'react';
import { Link } from 'react-router-dom';
import bannerHero from '../../assets/banner_hero.png';

const Banner = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-16 bg-obsidian" aria-label="Banner chào mừng">
      {/* Animated Light Mesh Circles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-25%] left-[-15%] w-[700px] h-[700px] rounded-full bg-gold/5 blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-sapphire/5 blur-[110px] animate-float [animation-delay:3s]"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(181, 137, 61, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(181, 137, 61, 0.2) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }}></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest
              bg-gold/8 text-gold-dark border border-gold/20">
              ✨ ĐẲNG CẤP THƯỢNG LƯU
            </span>
            
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-ivory leading-[1.1] tracking-tight text-balance">
              Define Your Elegance,<br/>
              <span className="gradient-text-gold">Reveal Your Glow</span>
            </h1>
            
            <p className="text-silver text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-light font-body">
              Nâng tầm chu trình chăm sóc bản thân với bộ sưu tập mỹ phẩm, 
              chăm sóc da chuyên sâu và nước hoa xa xỉ. Trải nghiệm sự giao thoa tinh tế giữa khoa học hiện đại và tinh hoa thiên nhiên.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to="/products" className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider
                bg-gradient-to-r from-gold to-gold-dark text-white
                shadow-glow-gold hover:shadow-glow-gold-strong
                transition-all duration-300 hover:-translate-y-0.5 no-underline">
                Săn Sale Ngay
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider
                bg-transparent text-ivory border border-silver-dark/30 hover:border-gold/50 hover:bg-gold/5
                transition-all duration-300 no-underline">
                Xem sản phẩm
              </Link>
            </div>

            {/* Micro Stats Bar inside left column */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-silver-dark/10 max-w-lg">
              {[
                { number: '2,000+', label: 'Sản phẩm' },
                { number: '50K+', label: 'Khách hàng' },
                { number: '99%', label: 'Hài lòng' },
              ].map((stat) => (
                <div key={stat.label} className="text-left">
                  <span className="block text-gold-dark font-heading text-lg sm:text-xl font-bold">{stat.number}</span>
                  <span className="block text-silver text-[10px] uppercase tracking-wider mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Premium Visual Product Showcase */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end animate-fade-in-up [animation-delay:0.2s]">
            {/* Background glowing circle for 3D effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gold/10 blur-2xl z-0 pointer-events-none"></div>

            {/* Custom SVG Shimmering star lines */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <svg className="absolute top-[-10px] left-[15px] w-6 h-6 text-gold animate-float" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0l3.09 9.5h9.91l-8 5.8 3.09 9.5-8-5.8-8 5.8 3.09-9.5-8-5.8h9.91z"/></svg>
              <svg className="absolute bottom-[20px] right-[-10px] w-4 h-4 text-gold-light animate-float [animation-delay:2s]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0l3.09 9.5h9.91l-8 5.8 3.09 9.5-8-5.8-8 5.8 3.09-9.5-8-5.8h9.91z"/></svg>
            </div>

            {/* Golden glassmorphic frame around generated image */}
            <div className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] rounded-3xl p-3 bg-white/40 backdrop-blur-md border border-white/60 shadow-elevated transition-transform duration-500 hover:rotate-1 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-obsidian-light border border-gold/10">
                <img 
                  src={bannerHero} 
                  alt="Luxury cosmetics presentation" 
                  className="w-full h-full object-cover object-center animate-scale-in"
                  loading="eager"
                />
                {/* Visual Glassmorphic Tag Overlay */}
                <div className="absolute bottom-4 left-4 right-4 glass-card rounded-xl p-3 border border-white/40 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-silver-dark uppercase tracking-widest block font-bold">New Collection</span>
                    <span className="text-[11px] text-ivory font-bold block">Glow Active Serum</span>
                  </div>
                  <span className="text-xs font-bold text-gold-dark">₫1,250,000</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;