import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts';

/**
 * AdminRoute — Bảo vệ route dành riêng cho admin
 * - Chưa đăng nhập → redirect về /login
 * - Đã đăng nhập nhưng không phải admin → redirect về /
 */
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
