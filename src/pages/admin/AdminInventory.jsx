import React, { useState, useEffect, useMemo } from 'react';
import { useOrders } from '../../contexts';
import { fetchAllProducts } from '../../api';
import { toast } from 'react-toastify';

const AdminInventory = () => {
  const { orders } = useOrders();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [newImportValue, setNewImportValue] = useState(0);

  // local storage key for imported stock quantities
  const [importedStock, setImportedStock] = useState(() => {
    try {
      const stored = localStorage.getItem('admin_inventory');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const loadProductsList = async () => {
      try {
        const stored = localStorage.getItem('admin_products');
        if (stored) {
          setProducts(JSON.parse(stored));
        } else {
          const apiProducts = await fetchAllProducts();
          setProducts(apiProducts);
        }
      } catch (err) {
        console.error('Failed to fetch products for inventory:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProductsList();
  }, []);

  const saveImportedStock = (updatedStock) => {
    setImportedStock(updatedStock);
    localStorage.setItem('admin_inventory', JSON.stringify(updatedStock));
  };

  // Helper to fetch imported supply for a product
  const getImportedQty = (prodId) => {
    if (importedStock[prodId] !== undefined) {
      return importedStock[prodId];
    }
    // initial stock generation seed based on product ID to make it realistic
    const seed = ((prodId * 7 + 13) % 120) + 40;
    return seed;
  };

  // Sum up all sold quantities from successful (paymentStatus === 'paid') orders
  const soldQuantities = useMemo(() => {
    const map = {};
    orders.forEach(order => {
      if (order.paymentStatus === 'paid') {
        order.items.forEach(item => {
          const pid = item.productId || item.id;
          if (pid) {
            map[pid] = (map[pid] || 0) + item.quantity;
          }
        });
      }
    });
    return map;
  }, [orders]);

  const inventoryList = useMemo(() => {
    return products.map(p => {
      const imported = getImportedQty(p.id);
      const sold = soldQuantities[p.id] || 0;
      const remaining = Math.max(0, imported - sold);
      
      let status = 'in_stock'; // 'in_stock', 'low_stock', 'out_of_stock'
      if (remaining === 0) {
        status = 'out_of_stock';
      } else if (remaining <= 15) {
        status = 'low_stock';
      }

      return {
        ...p,
        imported,
        sold,
        remaining,
        status
      };
    });
  }, [products, importedStock, soldQuantities]);

  const filtered = useMemo(() => {
    if (!search.trim()) return inventoryList;
    const q = search.toLowerCase();
    return inventoryList.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }, [inventoryList, search]);

  // Global aggregate metrics
  const metrics = useMemo(() => {
    let totalImported = 0;
    let totalSold = 0;
    let totalRemaining = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    inventoryList.forEach(item => {
      totalImported += item.imported;
      totalSold += item.sold;
      totalRemaining += item.remaining;
      if (item.status === 'low_stock') lowStockCount++;
      else if (item.status === 'out_of_stock') outOfStockCount++;
    });

    return { totalImported, totalSold, totalRemaining, lowStockCount, outOfStockCount };
  }, [inventoryList]);

  const handleAdjustImport = (product) => {
    setAdjustingProduct(product);
    setNewImportValue(product.imported);
  };

  const handleSaveImportValue = (e) => {
    e.preventDefault();
    if (newImportValue < 0) {
      toast.warning('Số lượng nhập kho không được âm!');
      return;
    }
    const updated = {
      ...importedStock,
      [adjustingProduct.id]: newImportValue
    };
    saveImportedStock(updated);
    setAdjustingProduct(null);
    toast.success(`📈 Đã cập nhật số lượng nhập kho cho: ${adjustingProduct.name}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl skeleton-dark" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-white/[0.04] bg-white/[0.01]">
          <span className="text-[10px] text-silver-dark font-semibold uppercase tracking-wider block mb-1">Tổng Số Lượng Nhập</span>
          <span className="text-ivory text-xl font-bold font-heading">{metrics.totalImported} <span className="text-[10px] font-normal text-silver-dark">SP</span></span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-white/[0.04] bg-white/[0.01]">
          <span className="text-[10px] text-silver-dark font-semibold uppercase tracking-wider block mb-1">Tổng Số Lượng Đã Bán</span>
          <span className="text-emerald text-xl font-bold font-heading">{metrics.totalSold} <span className="text-[10px] font-normal text-silver-dark">SP</span></span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-white/[0.04] bg-white/[0.01]">
          <span className="text-[10px] text-silver-dark font-semibold uppercase tracking-wider block mb-1">Tồn Kho Còn Lại</span>
          <span className="text-gold text-xl font-bold font-heading">{metrics.totalRemaining} <span className="text-[10px] font-normal text-silver-dark">SP</span></span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-white/[0.04] bg-amber/5">
          <span className="text-[10px] text-amber/80 font-semibold uppercase tracking-wider block mb-1">Cảnh Báo Hết Hàng</span>
          <span className="text-amber font-bold text-xl font-heading">{metrics.lowStockCount} <span className="text-[10px] font-normal text-amber/60">SP</span></span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-white/[0.04] bg-rose/5">
          <span className="text-[10px] text-rose/80 font-semibold uppercase tracking-wider block mb-1">Sản Phẩm Đã Hết Hàng</span>
          <span className="text-rose font-bold text-xl font-heading">{metrics.outOfStockCount} <span className="text-[10px] font-normal text-rose/60">SP</span></span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm sản phẩm theo tên..."
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
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Số lượng nhập vào</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Số lượng đã bán</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Số lượng còn lại</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Cảnh báo kho</th>
                <th className="text-silver-dark text-[10px] font-semibold uppercase tracking-wider py-3.5 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                let badgeClass = 'bg-emerald/10 text-emerald border-emerald/25';
                let badgeText = 'Còn hàng';
                if (item.status === 'out_of_stock') {
                  badgeClass = 'bg-rose/10 text-rose border-rose/25';
                  badgeText = 'Hết hàng';
                } else if (item.status === 'low_stock') {
                  badgeClass = 'bg-amber/10 text-amber border-amber/25';
                  badgeText = 'Sắp hết hàng';
                }

                return (
                  <tr key={item.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-surface border border-white/5" />
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-ivory text-xs font-semibold truncate max-w-[180px]">{item.name}</p>
                      <p className="text-silver-dark text-[9px]">{item.brand}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-silver">
                      {item.imported}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald">
                      {item.sold}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-gold">
                      {item.remaining}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeClass}`}>
                        {badgeText}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleAdjustImport(item)}
                        className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold border border-gold/25 hover:bg-gold/15 active:scale-95 transition-all text-[11px] font-semibold cursor-pointer"
                      >
                        Nhập thêm hàng
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

      {/* Adjust Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm glass-card rounded-2xl p-6 border border-white/10 shadow-glow-gold-strong animate-scale-in relative">
            <button
              onClick={() => setAdjustingProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-silver hover:text-ivory bg-white/5 border-none cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-ivory font-heading text-base font-bold mb-4 flex items-center gap-2">
              <span className="text-gold">📈</span> Nhập thêm sản phẩm
            </h3>
            <p className="text-silver text-xs mb-4">
              Cập nhật số lượng nhập kho cho: <strong className="text-gold">{adjustingProduct.name}</strong>
            </p>

            <form onSubmit={handleSaveImportValue} className="space-y-4">
              <div>
                <label className="block text-silver text-[11px] font-semibold mb-1.5">Số lượng nhập kho mới (Total Supply)</label>
                <input
                  type="number"
                  min="0"
                  value={newImportValue}
                  onChange={(e) => setNewImportValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-sm focus:outline-none focus:border-gold/40 focus:bg-white/8 transition-all"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-ivory text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer bg-transparent"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-obsidian text-xs font-bold border-none hover:shadow-glow-gold transition-all cursor-pointer"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
