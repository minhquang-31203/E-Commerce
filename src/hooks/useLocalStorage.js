import { useState, useEffect } from 'react';

/**
 * Hook lưu trữ state đồng bộ với localStorage
 * Thay thế pattern lặp lại ở AuthContext, WishlistContext, OrderContext
 * 
 * @param {string} key - localStorage key
 * @param {*} initialValue - Giá trị mặc định nếu chưa có trong storage
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`[useLocalStorage] Error reading "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`[useLocalStorage] Error writing "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
