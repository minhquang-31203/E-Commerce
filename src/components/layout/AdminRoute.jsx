import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts';

/**
 * AdminRoute — Bảo vệ route dành riêng cho admin (Admin Authorization Guard)
 * - Chưa đăng nhập → redirect về /login (kèm location cũ)
 * - Đã đăng nhập nhưng không phải admin → redirect về trang chủ /
 */
const AdminRoute = ({ children }) => {
  // Lấy thông tin user hiện tại từ AuthContext
  const { user } = useAuth();
  const location = useLocation();

  // 1. Kiểm tra đăng nhập
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Kiểm tra quyền Admin
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. Nếu thỏa mãn cả 2 điều kiện, render các component con (children)
  return children;
};

export default AdminRoute;

