import { useState, useEffect } from 'react';

/**
 * Hook theo dõi vị trí cuộn (scroll) của trang trình duyệt
 * Tách biệt logic dùng chung từ Header.jsx (cho thanh đổi màu nền khi cuộn) và App.jsx (cho nút bấm cuộn lên đầu trang)
 * 
 * @param {number} threshold - Ngưỡng số lượng Pixel để kích hoạt cờ hiệu (mặc định là 20px)
 * @returns {{ isScrolled: boolean, scrollY: number }} Trả về vị trí hiện tại và cờ báo hiệu đã cuộn vượt ngưỡng hay chưa
 */
const useScrollPosition = (threshold = 20) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Hàm callback xử lý cập nhật vị trí cuộn
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);
      setIsScrolled(currentY > threshold); // Trả về true nếu cuộn sâu hơn ngưỡng threshold
    };

    // Đăng ký sự kiện cuộn chuột.
    // Sử dụng tùy chọn `{ passive: true }` để thông báo trình duyệt không chặn hành động cuộn tự nhiên của người dùng,
    // giúp tối ưu hóa hiệu năng render (đạt FPS cao hơn khi cuộn trang).
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Hàm Cleanup: Gỡ bỏ lắng nghe sự kiện khi component bị gỡ khỏi DOM
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { isScrolled, scrollY };
};

export default useScrollPosition;

