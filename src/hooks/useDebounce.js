import { useState, useEffect } from 'react';

/**
 * Hook debounce giá trị (trì hoãn cập nhật giá trị)
 * Tránh việc gọi các thao tác nặng (như gọi API tìm kiếm, lọc danh sách) quá nhiều lần liên tiếp khi người dùng gõ phím.
 * Dùng cho ô tìm kiếm sản phẩm trong trang Products page.
 * 
 * @param {*} value - Giá trị cần theo dõi để trì hoãn cập nhật (ví dụ: search term)
 * @param {number} delay - Thời gian chờ tính bằng mili-giây (mặc định là 300ms)
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Thiết lập một bộ hẹn giờ (timer) sau khoảng thời gian 'delay' mới cập nhật state
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hàm dọn dẹp (cleanup function): Tự động hủy bộ hẹn giờ cũ nếu giá trị 'value' hoặc 'delay' thay đổi liên tục
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;

