import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

/**
 * AdminLayout — Khung bố cục (Layout) chính cho khu vực quản trị (Admin panel)
 * Tích hợp sẵn cơ chế bảo vệ quyền truy cập (Guard) + Sidebar + Header + Outlet chứa trang nội dung con.
 */
const AdminLayout = () => {
  // Lấy thông tin user hiện tại từ AuthContext
  const { user } = useAuth();
  const location = useLocation();
  
  // Trạng thái đóng/mở thanh Sidebar trên thiết bị di động (Mobile Sidebar)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. Kiểm tra xác thực (Authentication Guard): Chưa đăng nhập chuyển hướng về /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Kiểm tra phân quyền (Authorization Guard): Đăng nhập rồi nhưng không phải Admin chuyển hướng về trang chủ /
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-obsidian-lighter">
      {/* Sidebar điều hướng Admin */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Khối giao diện bên phải Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header quản trị chứa nút mở Sidebar và tên trang hiện tại */}
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Vùng hiển thị nội dung động của các trang con admin (Dashboard, Products, Orders,...) */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

