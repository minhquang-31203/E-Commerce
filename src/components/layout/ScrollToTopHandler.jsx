import { useScrollToTop } from '../../hooks';

/**
 * Component tự động cuộn lên đầu trang mỗi khi chuyển đổi Route (đổi trang)
 * Đây là một component không hiển thị giao diện (headless component)
 */
const ScrollToTopHandler = () => {
  // Gọi hook lắng nghe sự kiện đổi trang của react-router-dom để điều khiển scroll
  useScrollToTop();
  
  // Trả về null vì component này chỉ đảm nhận xử lý logic phụ (side-effect)
  return null;
};

export default ScrollToTopHandler;

