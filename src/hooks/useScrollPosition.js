import { useState, useEffect } from 'react';

/**
 * Hook theo dõi vị trí scroll
 * Extract từ Header.jsx (isScrolled state) và App.jsx (ScrollToTopButton)
 * 
 * @param {number} threshold - Ngưỡng pixel để kích hoạt
 * @returns {{ isScrolled: boolean, scrollY: number }}
 */
const useScrollPosition = (threshold = 20) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);
      setIsScrolled(currentY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { isScrolled, scrollY };
};

export default useScrollPosition;
