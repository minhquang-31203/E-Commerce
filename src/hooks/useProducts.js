import { useState, useEffect } from 'react';
import { fetchAllProducts, fetchProductsByCategories, fetchProductById } from '../api';

/**
 * Hook quản lý việc fetch và cache dữ liệu sản phẩm
 * Thay thế logic fetch trùng lặp ở Home.jsx và Products.jsx
 * 
 * @param {'all' | 'categories' | 'single'} mode - Kiểu fetch
 * @param {*} param - ID (single) hoặc array categories
 */
const useProducts = (mode = 'all', param = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;

        switch (mode) {
          case 'categories':
            data = await fetchProductsByCategories(param || undefined);
            break;
          case 'single':
            data = await fetchProductById(param);
            // Single product returns object, wrap in array for consistency
            data = [data];
            break;
          case 'all':
          default:
            data = await fetchAllProducts();
            break;
        }

        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          console.error('[useProducts]', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [mode, param]);

  return { products, loading, error };
};

export default useProducts;
