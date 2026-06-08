import React from 'react';
import { useScrollPosition } from '../../hooks';

/**
 * Nút cuộn trượt lên đầu trang — Luxury gold style
 */
const ScrollToTopButton = () => {
  const { isScrolled: visible } = useScrollPosition(400);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button 
      className={`fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center z-50
        bg-gradient-to-br from-gold to-gold-dark text-obsidian border-none cursor-pointer
        shadow-glow-gold transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-glow-gold-strong
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-5 pointer-events-none'}`}
      onClick={scrollUp}
      aria-label="Cuộn lên đầu trang"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
