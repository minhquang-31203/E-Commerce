import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts';

// Component bảo vệ các tuyến đường yêu cầu đăng nhập (User Authentication Guard)
const ProtectedRoute = ({ children }) => {
  // Lấy thông tin user hiện tại từ AuthContext
  const { user } = useAuth();
  const location = useLocation();

  // Nếu chưa đăng nhập, chuyển hướng người dùng về trang /login
  // Truyền trạng thái location hiện tại qua `state` để có thể quay lại sau khi đăng nhập thành công
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu đã đăng nhập, cho phép render các component con (children) bên trong
  return children;
};

export default ProtectedRoute;