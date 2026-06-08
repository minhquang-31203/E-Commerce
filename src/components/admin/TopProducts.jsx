import React from 'react';
import { formatPrice } from '../../api';

// Component hiển thị danh sách Top sản phẩm bán chạy nhất trong Admin Dashboard
const TopProducts = ({ topProducts = [] }) => {
  return (
    <div className="rounded-2xl bg-obsidian/40 border border-white/[0.06] p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <h3 className="text-ivory font-heading text-lg mb-5 flex items-center gap-2">
        <span className="text-gold">🏆</span> Top sản phẩm bán chạy
      </h3>
      
      {/* Kiểm tra nếu không có sản phẩm nào bán ra (mảng rỗng) */}
      {topProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-silver-dark text-sm">Chưa có dữ liệu bán hàng</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topProducts.map((product, i) => (
            <div
              key={product.name}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
            >
              {/* Huy hiệu thứ hạng (Rank Badge) với màu sắc nổi bật cho Top 1, 2, 3 */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
                ${i === 0 ? 'bg-gold/20 text-gold' : i === 1 ? 'bg-silver/20 text-silver' : i === 2 ? 'bg-gold-dark/20 text-gold-dark' : 'bg-white/5 text-silver-dark'}`}>
                #{i + 1}
              </div>
              
              {/* Tên sản phẩm và Tổng doanh số bán ra (đã format tiền tệ) */}
              <div className="flex-1 min-w-0">
                <p className="text-ivory text-sm font-medium truncate group-hover:text-gold transition-colors">{product.name}</p>
                <p className="text-silver-dark text-xs">{formatPrice(product.revenue)}</p>
              </div>
              
              {/* Số lượng sản phẩm đã bán */}
              <span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold shrink-0">
                {product.quantity} SP
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProducts;

