import { useState, useEffect } from 'react';

/**
 * Hook debounce giá trị — tránh gọi filter/search quá nhiều lần
 * Dùng cho search input trong Products page
 * 
 * @param {*} value - Giá trị cần debounce
 * @param {number} delay - Thời gian chờ (ms)
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
