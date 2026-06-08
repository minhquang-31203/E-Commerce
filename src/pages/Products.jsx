import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/common/ProductCard';
import ProductSkeleton from '../components/common/ProductSkeleton';
import Slider from 'rc-slider'; 
import 'rc-slider/assets/index.css'; 
import { useProducts, useDebounce } from '../hooks';

// Dictionary mapping category slugs to premium Vietnamese names
const categoryLabels = {
  'all': 'Tất cả sản phẩm',
  'beauty': 'Làm đẹp & Mỹ phẩm',
  'fragrances': 'Nước hoa cao cấp',
  'furniture': 'Nội thất sang trọng',
  'groceries': 'Thực phẩm tiện lợi',
  'home-decoration': 'Trang trí nhà cửa',
  'kitchen-accessories': 'Dụng cụ nhà bếp',
  'laptops': 'Máy tính & Laptop',
  'mens-shirts': 'Thời trang Nam',
  'mens-shoes': 'Giày dép Nam',
  'mens-watches': 'Đồng hồ Nam',
  'mobile-accessories': 'Phụ kiện di động',
  'motorcycle': 'Xe máy & Phụ tùng',
  'skin-care': 'Chăm sóc da chuyên sâu',
  'smartphones': 'Điện thoại thông minh',
  'sports-accessories': 'Dụng cụ thể thao',
  'sunglasses': 'Kính râm thời trang',
  'tablets': 'Máy tính bảng',
  'tops': 'Áo thời trang',
  'vehicle': 'Phương tiện di chuyển',
  'womens-bags': 'Túi xách Nữ',
  'womens-dresses': 'Váy đầm Nữ',
  'womens-jewellery': 'Trang sức Nữ',
  'womens-shoes': 'Giày dép Nữ',
  'womens-watches': 'Đồng hồ Nữ'
};

const Products = () => {
  // Fetch ALL products to get all 100 items from API
  const { products, loading } = useProducts('all');
  
  const [filters, setFilters] = useState({
    search: '', category: 'all', minPrice: '', maxPrice: '', sort: 'default'
  });

  const MAX_PRICE = 100000000; // 100,000,000 VNĐ to support expensive products
  const [sliderRange, setSliderRange] = useState([0, MAX_PRICE]); 
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Dynamically extract categories present in current loaded products
  const uniqueCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const displayProducts = useMemo(() => {
    let result = [...products];
    if (debouncedSearch) {
      result = result.filter(p => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.minPrice !== '') {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== '') {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }
    if (filters.sort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }
    return result;
  }, [products, debouncedSearch, filters]);

  const totalPages = Math.ceil(displayProducts.length / itemsPerPage); 
  const indexOfLastItem = currentPage * itemsPerPage; 
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; 
  const currentItems = displayProducts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <div className="flex min-h-screen pt-20 bg-obsidian">
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsMobileFilterOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`w-72 shrink-0 p-6 border-r border-white/5 bg-obsidian-light
        lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:overflow-y-auto
        ${isMobileFilterOpen ? 'fixed top-0 left-0 bottom-0 z-50 animate-slide-in-right bg-obsidian/95 backdrop-blur-xl w-80' : 'hidden lg:block'}`}
        aria-label="Bộ lọc sản phẩm">
        <button className="lg:hidden absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-silver hover:text-ivory bg-white/5 cursor-pointer border-none" onClick={() => setIsMobileFilterOpen(false)} aria-label="Đóng">✕</button>

        <div className="mb-6">
          <h4 className="text-ivory font-heading text-xs font-semibold uppercase tracking-widest mb-3">Tìm kiếm</h4>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" name="search" placeholder="Tên sản phẩm..." value={filters.search} onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-sm placeholder:text-silver-dark/50 focus:outline-none focus:border-gold/40 transition-all" />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-ivory font-heading text-xs font-semibold uppercase tracking-widest mb-3">Danh mục</h4>
          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
            {uniqueCategories.map(cat => (
              <label key={cat} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs
                ${filters.category === cat ? 'bg-gold/10 text-gold' : 'text-silver hover:bg-white/5 hover:text-ivory'}`}>
                <input type="radio" name="category" value={cat} checked={filters.category === cat} onChange={handleFilterChange} className="hidden" />
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all shrink-0
                  ${filters.category === cat ? 'border-gold bg-gold' : 'border-silver-dark'}`}>
                  {filters.category === cat && <span className="w-1.5 h-1.5 rounded-full bg-obsidian"></span>}
                </span>
                <span className="truncate">{categoryLabels[cat] || cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-ivory font-heading text-xs font-semibold uppercase tracking-widest mb-3">Khoảng giá</h4>
          <div className="px-1 mb-4">
            <Slider range min={0} max={MAX_PRICE} step={100000} value={sliderRange}
              onChange={(value) => { setSliderRange(value); setFilters(prev => ({ ...prev, minPrice: value[0], maxPrice: value[1] })); }} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Từ" value={filters.minPrice === '' ? 0 : filters.minPrice}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-ivory text-xs focus:outline-none focus:border-gold/40 transition-all"
                onChange={(e) => { const v = Number(e.target.value); setFilters(prev => ({ ...prev, minPrice: v })); setSliderRange([v, sliderRange[1]]); }} />
              <span className="text-silver-dark text-xs">—</span>
              <input type="number" placeholder="Đến" value={filters.maxPrice === '' ? MAX_PRICE : filters.maxPrice}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-ivory text-xs focus:outline-none focus:border-gold/40 transition-all"
                onChange={(e) => { const v = Number(e.target.value); setFilters(prev => ({ ...prev, maxPrice: v })); setSliderRange([sliderRange[0], v]); }} />
            </div>
            <span className="text-[10px] text-silver-dark text-center italic">Đơn vị: VNĐ</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-8">
        <button className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-silver text-sm mb-6 hover:bg-white/10 transition-all cursor-pointer" onClick={() => setIsMobileFilterOpen(true)}>
          ☰ Lọc & Sắp xếp
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <p className="text-silver text-sm">
            Hiển thị <strong className="text-ivory">{currentItems.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, displayProducts.length)}</strong> trên <strong className="text-ivory">{displayProducts.length}</strong> sản phẩm
          </p>
          <select name="sort" value={filters.sort} onChange={handleFilterChange}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-silver text-sm focus:outline-none focus:border-gold/40 cursor-pointer bg-obsidian-light text-ivory" aria-label="Sắp xếp">
            <option value="default" className="bg-obsidian-light text-ivory">Mặc định</option>
            <option value="asc" className="bg-obsidian-light text-ivory">Giá: Thấp → Cao</option>
            <option value="desc" className="bg-obsidian-light text-ivory">Giá: Cao → Thấp</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : displayProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {currentItems.map((product, i) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Phân trang">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl text-xs border border-white/10 text-silver hover:text-gold hover:border-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-transparent cursor-pointer">← Trước</button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button key={idx + 1} onClick={() => paginate(idx + 1)}
                    className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all border-none cursor-pointer ${currentPage === idx + 1 ? 'bg-gold text-obsidian font-bold' : 'bg-white/5 text-silver hover:bg-gold/15 hover:text-gold'}`}
                    aria-current={currentPage === idx + 1 ? 'page' : undefined}>{idx + 1}</button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl text-xs border border-white/10 text-silver hover:text-gold hover:border-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-transparent cursor-pointer">Sau →</button>
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-ivory text-xl font-heading mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-silver text-sm">Hãy thử thay đổi bộ lọc hoặc tìm từ khóa khác.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;