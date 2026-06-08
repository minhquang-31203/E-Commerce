import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts';
import { fetchProductById, formatPrice } from '../api';

// Component trang Chi tiết sản phẩm (Product Detail Page)
const ProductDetail = () => {
  // Lấy ID sản phẩm từ URL thông qua hook useParams của React Router
  const { id } = useParams(); 
  const { addToCart } = useCart();
  
  // Các trạng thái cục bộ quản lý thông tin sản phẩm, trạng thái tải và cờ hiệu thêm giỏ hàng thành công
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false); 

  // Gọi API lấy thông tin chi tiết sản phẩm mỗi khi ID sản phẩm thay đổi
  useEffect(() => {
    fetchProductById(id)
      .then(data => { setProduct(data); setLoading(false); })
      .catch(err => { console.error("Lỗi khi fetch chi tiết sản phẩm:", err); setLoading(false); });
  }, [id]);

  // Xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    // Trả cờ hiệu "Đã thêm" về trạng thái ban đầu sau 1.5 giây
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Hiển thị màn hình chờ khi đang tải dữ liệu sản phẩm
  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-obsidian">
        <div className="text-gold animate-pulse text-lg">Đang tải thông tin sản phẩm...</div>
      </div>
    );
  }

  // Trường hợp không tìm thấy sản phẩm hoặc lỗi
  if (!product) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-obsidian">
        <h2 className="text-ivory text-xl">Không tìm thấy sản phẩm!</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-obsidian">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Thanh điều hướng nhanh (Breadcrumb Navigation) */}
        <nav className="text-sm text-silver-dark mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-gold transition-colors">Trang chủ</Link>
          <span className="text-silver-dark/40">/</span>
          <Link to="/products" className="hover:text-gold transition-colors">Sản phẩm</Link>
          <span className="text-silver-dark/40">/</span>
          <span className="text-ivory">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 animate-fade-in-up">
          {/* Cột trái: Ảnh chụp sản phẩm */}
          <div className="glass-card rounded-3xl overflow-hidden aspect-square">
            <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Cột phải: Thông tin sản phẩm & Nút mua hàng */}
          <div className="flex flex-col justify-center">
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-ivory leading-tight">{product.name}</h1>
            <p className="text-silver text-sm mt-3">
              Thương hiệu: <span className="text-gold font-semibold">{product.brand}</span>
            </p>
            
            {/* Khung hiển thị giá tiền & Thẻ giảm giá */}
            <div className="flex items-baseline gap-4 mt-6 p-5 rounded-2xl bg-gold/5 border border-gold/10">
              <p className="text-gold font-bold text-2xl lg:text-3xl font-heading">{formatPrice(product.price)}</p>
              {/* Hiển thị giá gốc gạch ngang nếu có chương trình khuyến mãi */}
              {product.oldPrice && (
                <p className="text-silver-dark line-through text-sm">{formatPrice(product.oldPrice)}</p>
              )}
              {/* Nhãn hiển thị phần trăm giảm giá */}
              {product.discount && (
                <span className="px-3 py-1 rounded-full bg-rose text-white text-xs font-bold">GIẢM {product.discount}%</span>
              )}
            </div>
            
            {/* Mô tả chi tiết */}
            <div className="mt-8">
              <h3 className="text-ivory font-heading text-lg mb-3">Mô tả sản phẩm</h3>
              <p className="text-silver text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Nút bấm Thêm vào giỏ hàng (Chuyển màu xanh lá và vô hiệu hóa tạm thời khi bấm) */}
            <button 
              className={`mt-8 py-4 rounded-2xl text-sm font-bold tracking-wider uppercase transition-all duration-300 border-none cursor-pointer
                ${isAdded 
                  ? 'bg-emerald/20 text-emerald cursor-default' 
                  : 'bg-gradient-to-r from-gold to-gold-dark text-obsidian hover:shadow-glow-gold-strong hover:-translate-y-0.5'}`}
              onClick={handleAddToCart}
              disabled={isAdded}
            >
              {isAdded ? 'Đã thêm vào giỏ ✔️' : 'Thêm vào giỏ hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;