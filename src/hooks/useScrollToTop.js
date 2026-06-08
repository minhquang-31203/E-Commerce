import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook tự động cuộn lên đầu trang khi thay đổi route
 * Extract từ component ScrollToTop trong App.jsx
 */
const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTop;
