import { useScrollToTop } from '../../hooks';

/**
 * Component tự động cuộn lên đầu trang khi thay đổi route
 */
const ScrollToTopHandler = () => {
  useScrollToTop();
  return null;
};

export default ScrollToTopHandler;
