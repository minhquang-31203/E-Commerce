import React from 'react';
import { useWishlist } from '../contexts';
import ProductCard from '../components/common/ProductCard';
import { Link } from 'react-router-dom';

// Component trang Danh sách yêu thích (Wishlist Page)
const Wishlist = () => {
  // Lấy danh sách sản phẩm yêu thích từ WishlistContext
  const { wishlist } = useWishlist();

  // Trường hợp chưa yêu thích sản phẩm nào
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-obsidian">
        <div className="text-center glass-card rounded-3xl p-12 max-w-md mx-auto animate-scale-in">
          <div className="text-5xl mb-5 opacity-50">❤️</div>
          <h2 className="text-ivory font-heading text-2xl mb-3">Danh sách yêu thích trống</h2>
          <p className="text-silver text-sm mb-8">Hãy thả tim cho những sản phẩm bạn ưng ý nhé!</p>
          <Link to="/products" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-gold to-gold-dark text-obsidian font-semibold text-sm no-underline hover:shadow-glow-gold transition-all">
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-obsidian">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 className="font-heading text-3xl font-bold text-ivory mb-8 animate-fade-in">
          Sản phẩm bạn đã yêu thích <span className="text-rose">❤️</span>
        </h2>
        
        {/* Lưới hiển thị các sản phẩm đã thích */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wishlist.map((product, i) => (
            <div 
              key={product.id} 
              className="animate-fade-in-up" 
              style={{ animationDelay: `${i * 0.08}s` }} // Tạo hiệu ứng mượt lần lượt xuất hiện
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;