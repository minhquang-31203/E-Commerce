import React, { useState, useEffect, useMemo } from 'react';
import { fetchAllProducts, formatPrice } from '../../api';
import { toast } from 'react-toastify';

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

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // Load from localStorage or API
  useEffect(() => {
    const load = async () => {
      try {
        const stored = localStorage.getItem('admin_products');
        if (stored) {
          setProducts(JSON.parse(stored));
        } else {
          const apiProducts = await fetchAllProducts();
          // Initialize active display status as true by default
          const initialized = apiProducts.map(p => ({
            ...p,
            visible: p.visible !== undefined ? p.visible : true
          }));
          setProducts(initialized);
          localStorage.setItem('admin_products', JSON.stringify(initialized));
        }
      } catch (err) {
        console.error('Failed to load admin products:', err);
        toast.error('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveProducts = (updatedList) => {
    setProducts(updatedList);
    localStorage.setItem('admin_products', JSON.stringify(updatedList));
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleToggleVisibility = (id) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const nextState = !p.visible;
        toast.success(`Đã ${nextState ? 'Hiển thị' : 'Ẩn'} sản phẩm: ${p.name}`);
        return { ...p, visible: nextState };
      }
      return p;
    });
    saveProducts(updated);
  };

  const handleEditClick = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct.name.trim()) {
      toast.warning('Tên sản phẩm không được trống!');
      return;
    }
    if (editingProduct.price <= 0) {
      toast.warning('Giá sản phẩm phải lớn hơn 0!');
      return;
    }

    const updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    saveProducts(updated);
    setEditingProduct(null);
    toast.success('✨ Đã cập nhật sản phẩm thành công!');
  };

  const uniqueCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [products]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl skeleton-dark" />
        ))}
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-sm placeholder:text-silver-dark/50 focus:outline-none focus:border-gold/40 focus:bg-white/8 transition-all";

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo tên, danh mục, mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian/60 border border-white/10 text-ivory text-sm placeholder:text-silver-dark/50 focus:outline-none focus:border-gold/40 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-obsidian/40 border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Hình ảnh</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Tên sản phẩm</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Danh mục</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Giá</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Mô tả</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Trạng thái</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const isVisible = product.visible !== false;
                return (
                  <tr key={product.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-11 h-11 rounded-lg object-cover bg-surface border border-white/5"
                        loading="lazy"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-ivory text-xs font-semibold truncate max-w-[150px]">{product.name}</p>
                      <p className="text-silver-dark text-[9px]">{product.brand || 'ECommerce Mall'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-silver text-[10px] uppercase shrink-0">
                        {categoryLabels[product.category] || product.category || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gold text-xs font-bold">{formatPrice(product.price)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-silver text-[11px] truncate max-w-[180px]" title={product.description}>
                        {product.description || 'Chưa có mô tả'}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleVisibility(product.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer transition-all bg-transparent
                          ${isVisible
                            ? 'bg-emerald/10 text-emerald border-emerald/25 hover:bg-emerald/15'
                            : 'bg-white/5 text-silver-dark border-white/10 hover:bg-white/10'
                          }`}
                        title="Click để thay đổi hiển thị"
                      >
                        {isVisible ? 'Hiển thị' : 'Ẩn'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-1.5 rounded-lg bg-transparent border-none text-silver hover:text-gold hover:bg-gold/10 transition-all cursor-pointer"
                        title="Sửa thông tin"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-silver-dark text-sm">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>

      <p className="text-silver-dark text-xs">
        Hiển thị {filtered.length} / {products.length} sản phẩm
      </p>

      {/* Editor Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-card rounded-2xl p-6 lg:p-8 animate-scale-in relative border border-white/10 shadow-glow-gold-strong">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-silver hover:text-ivory bg-white/5 border-none cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-ivory font-heading text-lg font-bold mb-6 flex items-center gap-2">
              <span className="text-gold">✏️</span> Chỉnh sửa sản phẩm
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-silver text-xs font-semibold mb-1.5">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-silver text-xs font-semibold mb-1.5">Danh mục</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className={`${inputClass} bg-obsidian-light text-ivory cursor-pointer`}
                  >
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {categoryLabels[cat] || cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-silver text-xs font-semibold mb-1.5">Giá sản phẩm (VNĐ) *</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-silver text-xs font-semibold mb-1.5">Mô tả sản phẩm</label>
                <textarea
                  rows="3"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-silver text-xs font-semibold mb-1.5">Trạng thái hiển thị</label>
                <select
                  value={editingProduct.visible ? 'true' : 'false'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, visible: e.target.value === 'true' })}
                  className={`${inputClass} bg-obsidian-light text-ivory cursor-pointer`}
                >
                  <option value="true">Hiển thị (Active)</option>
                  <option value="false">Ẩn (Hidden)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-ivory text-sm font-semibold hover:bg-white/5 transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-obsidian text-sm font-bold border-none hover:shadow-glow-gold transition-all cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
