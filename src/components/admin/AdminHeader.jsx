import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts';

// Đối chiếu đường dẫn route (pathname) với tiêu đề hiển thị tương ứng
const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
};

const AdminHeader = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Xác định tiêu đề trang hiện tại, mặc định là "Admin" nếu không khớp
  const pageTitle = pageTitles[location.pathname] || 'Admin';

  return (
    <header className="sticky top-0 z-30 h-16 bg-obsidian/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-6">
      {/* Khối bên trái: Nút hamburger menu (chỉ hiển thị ở mobile) + Tên trang hiện tại & Ngày tháng */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-silver hover:text-ivory bg-transparent border-none p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h2 className="text-ivory text-lg font-heading font-bold leading-tight">{pageTitle}</h2>
          {/* Định dạng ngày hiện tại sang tiếng Việt (Thứ..., ngày... tháng... năm...) */}
          <p className="text-silver-dark text-[10px] tracking-wider">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Khối bên phải: Nút quay lại trang mua sắm + Avatar người dùng */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/10 text-silver text-xs font-medium hover:bg-white/5 hover:text-ivory transition-all no-underline"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Visit Store
        </Link>
        {/* Avatar hiển thị chữ cái đầu tiên của tên admin */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 to-sapphire/30 flex items-center justify-center text-ivory text-xs font-bold">
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

