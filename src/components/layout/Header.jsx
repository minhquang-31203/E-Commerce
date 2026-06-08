import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart, useWishlist, useOrders, useAuth } from '../../contexts';
import { useScrollPosition } from '../../hooks';

// SVG Icons
const ICONS = {
  logout: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  login: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  orders: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  ),
  heart: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  ),
  cart: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  )
};

const Header = () => {
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { orders } = useOrders();
  const { user, logout } = useAuth();

  const [isBumping, setIsBumping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isScrolled } = useScrollPosition(20);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (cartCount === 0) return;
    setIsBumping(true);
    const timer = setTimeout(() => setIsBumping(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] h-20 flex items-center justify-between px-6 lg:px-12 transition-all duration-500
      ${isScrolled
        ? 'bg-obsidian/80 backdrop-blur-xl border-b border-white/5 shadow-soft'
        : 'bg-transparent border-b border-transparent'}`}
    >
      {/* Hamburger */}
      <button
        className="lg:hidden text-ivory text-xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 font-heading text-xl lg:text-2xl font-bold tracking-wider gradient-text-gold no-underline group" aria-label="ECommerce trang chủ">
        <svg viewBox="0 0 32 32" className="w-8 h-8 group-hover:rotate-6 transition-all duration-300 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] shrink-0">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#e8c547" />
              <stop offset="100%" stopColor="#b8960f" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#logoGrad)" />
          <path d="M11 9h11M11 16h8M11 23h11M11 9v14" stroke="#0a0a0f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span>Commerce</span>
      </Link>

      {/* Navigation */}
      <nav className={`
        lg:flex items-center gap-1
        ${isMenuOpen
          ? 'flex flex-col absolute top-20 left-0 right-0 bg-obsidian/95 backdrop-blur-xl border-b border-white/5 p-6 gap-2 animate-fade-in-down'
          : 'hidden'}`}
        aria-label="Main navigation"
      >
        {[
          { path: '/', label: 'Trang chủ' },
          { path: '/products', label: 'Sản phẩm' },
          { path: '/orders', label: 'Đơn hàng' },
          { path: '/about', label: 'Về chúng tôi' },
        ].map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 no-underline
              ${isActive(path)
                ? 'text-gold bg-gold-muted'
                : 'text-silver hover:text-ivory hover:bg-white/5'}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1 lg:gap-2">
        {user ? (
          <div className="hidden sm:flex items-center gap-2 mr-1">
            <span className="text-xs text-silver truncate max-w-[120px]" title={user.email}>
              Chào, <span className="text-gold font-medium">{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-silver hover:text-rose hover:bg-rose/10 transition-all border-none bg-transparent"
              title="Đăng xuất"
              aria-label="Đăng xuất"
            >
              {ICONS.logout}
            </button>
          </div>
        ) : (
          <Link to="/login" className="w-9 h-9 rounded-lg flex items-center justify-center text-silver hover:text-gold hover:bg-gold-muted transition-all" title="Đăng nhập" aria-label="Đăng nhập">
            {ICONS.login}
          </Link>
        )}

        <Link to="/orders" className="relative w-9 h-9 rounded-lg flex items-center justify-center text-silver hover:text-gold hover:bg-gold-muted transition-all" title="Lịch sử đơn hàng" aria-label="Lịch sử đơn hàng">
          {ICONS.orders}
          {orders.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald"></span>}
        </Link>

        <Link to="/wishlist" className="relative w-9 h-9 rounded-lg flex items-center justify-center text-silver hover:text-rose hover:bg-rose/10 transition-all" title="Yêu thích" aria-label="Danh sách yêu thích">
          {ICONS.heart}
          {wishlist.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose"></span>}
        </Link>

        <Link to="/cart" className="relative w-9 h-9 rounded-lg flex items-center justify-center text-silver hover:text-gold hover:bg-gold-muted transition-all" title="Giỏ hàng" aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}>
          {ICONS.cart}
          <span className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gold text-obsidian text-[10px] font-bold leading-none px-1 ${isBumping ? 'animate-bump' : ''}`}>
            {cartCount}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;