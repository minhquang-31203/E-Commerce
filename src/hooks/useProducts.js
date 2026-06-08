import { useState, useEffect } from 'react';
import { fetchAllProducts, fetchProductsByCategories, fetchProductById } from '../api';

/**
 * Hook quản lý việc gọi API lấy danh sách/chi tiết sản phẩm và lưu trạng thái tải (Loading) / lỗi (Error)
 * Đóng gói logic gọi API lặp đi lặp lại ở Home.jsx và Products.jsx.
 * 
 * @param {'all' | 'categories' | 'single'} mode - Chế độ tải dữ liệu
 * @param {*} param - ID sản phẩm (khi mode='single') hoặc danh sách chuyên mục (khi mode='categories')
 */
const useProducts = (mode = 'all', param = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Biến cờ hiệu (cleanup flag) để phát hiện component đã bị hủy kích hoạt (unmount)
    // Giúp phòng ngừa lỗi cập nhật State trên một component không còn hiển thị (Memory Leak / Race Condition)
    let cancelled = false;

    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;

        // Lựa chọn hàm gọi API tương ứng với chế độ được cấu hình
        switch (mode) {
          case 'categories':
            data = await fetchProductsByCategories(param || undefined);
            break;
          case 'single':
            data = await fetchProductById(param);
            // API lấy sản phẩm đơn lẻ trả về 1 Object, bọc lại thành mảng [Object] để đồng bộ kiểu dữ liệu
            data = [data];
            break;
          case 'all':
          default:
            data = await fetchAllProducts();
            break;
        }

        // Chỉ cập nhật State nếu component vẫn đang được gắn trên cây DOM
        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          console.error('[useProducts] Xảy ra lỗi khi tải sản phẩm:', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    // Hàm Cleanup: Sẽ tự động chạy khi component bị hủy (unmount) hoặc tham số dependencies thay đổi
    return () => {
      cancelled = true;
    };
  }, [mode, param]);

  return { products, loading, error };
};

export default useProducts;

