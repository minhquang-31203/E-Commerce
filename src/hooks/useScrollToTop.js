import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook tự động cuộn giao diện trình duyệt lên đầu trang (0, 0) bất cứ khi nào người dùng chuyển sang một Route mới.
 * Tách biệt logic từ component ScrollToTop.
 */
const useScrollToTop = () => {
  // Trích xuất đường dẫn hiện tại (pathname) từ hook useLocation của React Router
  const { pathname } = useLocation();

  useEffect(() => {
    // Thực hiện cuộn lên góc trên cùng bên trái của cửa sổ hiển thị
    window.scrollTo(0, 0);
  }, [pathname]); // Tác vụ này chạy lại mỗi khi đường dẫn thay đổi
};

export default useScrollToTop;

