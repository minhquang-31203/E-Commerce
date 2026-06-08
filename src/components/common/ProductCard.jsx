import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, useWishlist } from '../../contexts';
import { formatPrice } from '../../api';

const HeartIcon = ({ isFavorite }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={isFavorite ? "currentColor" : "none"} 
    stroke="currentColor"
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

// Component hiển thị đánh giá sao
const RatingStars = ({ productId }) => {
  const rating = 3.8 + (productId % 5) * 0.25;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <span 
            key={star} 
            className={`text-xs ${star <= fullStars ? 'text-gold' : star === fullStars + 1 && hasHalf ? 'text-gold/50' : 'text-silver-dark/30'}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-[11px] text-silver-dark">{rating.toFixed(1)}</span>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist(); 
  
  const [isAdded, setIsAdded] = useState(false);
  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleToggleHeart = (e) => {
    e.preventDefault(); 
    toggleWishlist(product);
  };

  return (
    <article className="group glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:border-gold/30 hover:shadow-glow-gold hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-square bg-surface">
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-rose text-white text-xs font-bold shadow-lg">
            -{product.discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-none
            ${isFavorite 
              ? 'bg-rose text-white shadow-lg' 
              : 'bg-obsidian/60 backdrop-blur-sm text-silver hover:text-rose hover:bg-obsidian/80'}`}
          onClick={handleToggleHeart}
          title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          <HeartIcon isFavorite={isFavorite} />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product.id}`}>
          <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        </Link>

        {/* Quick View Overlay */}
        <Link to={`/product/${product.id}`} className="absolute inset-0 flex items-center justify-center bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-all duration-300 no-underline" aria-label={`Xem chi tiết ${product.name}`}>
          <span className="px-5 py-2 rounded-full bg-gold text-obsidian font-semibold text-xs tracking-wider uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Xem chi tiết
          </span>
        </Link>
      </div>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`} className="no-underline">
          <h3 className="text-ivory text-sm font-medium line-clamp-2 hover:text-gold transition-colors leading-snug">{product.name}</h3>
        </Link>
        
        <RatingStars productId={product.id} />

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2.5">
          <p className="text-gold font-bold text-base">{formatPrice(product.price)}</p>
          {product.oldPrice && (
            <p className="text-silver-dark text-xs line-through">{formatPrice(product.oldPrice)}</p>
          )}
        </div>
        
        <button 
          className={`w-full mt-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-300 border-none
            ${isAdded 
              ? 'bg-emerald/20 text-emerald cursor-default' 
              : 'bg-gold/10 text-gold hover:bg-gold hover:text-obsidian'}`}
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          {isAdded ? '✓ Đã thêm' : 'Thêm vào giỏ'}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;