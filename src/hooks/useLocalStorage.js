import { useState, useEffect } from 'react';

/**
 * Hook lưu trữ state tự động đồng bộ với localStorage ở trình duyệt
 * Giải pháp thay thế cho pattern lặp lại khi thao tác với localStorage ở AuthContext, WishlistContext, OrderContext.
 * 
 * @param {string} key - Tên khóa lưu trữ ở localStorage
 * @param {*} initialValue - Giá trị mặc định gán cho state nếu khóa chưa tồn tại trong storage
 */
const useLocalStorage = (key, initialValue) => {
  // Khởi tạo State dạng trì hoãn (Lazy Initial State) để chỉ đọc localStorage duy nhất 1 lần khi render lần đầu
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      // Nếu đã có dữ liệu, phân giải chuỗi JSON; nếu chưa, trả về giá trị mặc định ban đầu
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`[useLocalStorage] Lỗi khi đọc dữ liệu của khóa "${key}":`, error);
      return initialValue;
    }
  });

  // Tự động ghi dữ liệu mới vào localStorage mỗi khi khóa 'key' hoặc giá trị state 'storedValue' thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`[useLocalStorage] Lỗi khi ghi dữ liệu của khóa "${key}":`, error);
    }
  }, [key, storedValue]);

  // Trả về tuple gồm giá trị hiện tại và hàm cập nhật tương tự useState tiêu chuẩn
  return [storedValue, setStoredValue];
};

export default useLocalStorage;

