/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useLocalStorage } from '../hooks';

// Khởi tạo đối tượng Context cho hệ thống xác thực (AuthContext)
const AuthContext = createContext();

// Hook tùy chỉnh tiện ích giúp các component con lấy nhanh thông tin xác thực
export const useAuth = () => useContext(AuthContext);

// Dữ liệu tài khoản quản trị (admin) mặc định để chạy thử nghiệm hệ thống
const DEFAULT_ADMIN = {
  name: 'Admin',
  email: 'admin@quang.com',
  password: 'admin123',
  role: 'admin',
};

export const AuthProvider = ({ children }) => {
  // State: Lưu thông tin người dùng đang đăng nhập hiện tại
  // Khởi tạo ban đầu bằng cách đọc từ localStorage để duy trì trạng thái khi refresh trình duyệt
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('glow_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // State: Cơ sở dữ liệu giả lập chứa danh sách tất cả tài khoản đã đăng ký trong ứng dụng
  // Sử dụng useLocalStorage để đồng bộ hóa dữ liệu này với khóa 'glow_accounts_db' ở trình duyệt
  const [registeredUsers, setRegisteredUsers] = useLocalStorage('glow_accounts_db', []);

  // Tự động kiểm tra và thêm tài khoản admin mặc định vào cơ sở dữ liệu nếu chưa tồn tại
  React.useEffect(() => {
    const hasAdmin = registeredUsers.some(u => u.email === DEFAULT_ADMIN.email);
    if (!hasAdmin) {
      setRegisteredUsers(prev => [DEFAULT_ADMIN, ...prev]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hành động: Đăng ký người dùng mới (Register Action)
  const register = (newUser) => {
    // Kiểm tra xem email đăng ký mới đã tồn tại hay chưa
    const isExisted = registeredUsers.find(u => u.email === newUser.email);
    if (isExisted) {
      toast.error("Email này đã được sử dụng!");
      return false;
    }

    // Gán vai trò "user" mặc định cho các tài khoản đăng ký mới bên ngoài và cập nhật database
    setRegisteredUsers([...registeredUsers, { ...newUser, role: 'user' }]);
    return true;
  };

  // Hành động: Xác thực thông tin người dùng đăng nhập (Login Action)
  const login = (email, password) => {
    // Tìm tài khoản trùng khớp cả email và mật khẩu trong database
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      // Thiết lập thông tin phiên đăng nhập (bỏ qua mật khẩu vì lý do bảo mật)
      const sessionData = { name: foundUser.name, email: foundUser.email, role: foundUser.role || 'user' };
      
      // Cập nhật State và lưu vào LocalStorage
      setUser(sessionData);
      localStorage.setItem('glow_user', JSON.stringify(sessionData));
      
      toast.success(`Chào mừng ${foundUser.name} quay trở lại!`);
      return sessionData;
    } else {
      toast.error("Email hoặc mật khẩu không chính xác!");
      return false;
    }
  };

  // Hành động: Đăng nhập nhanh bằng tài khoản Google (Google Login Simulation)
  const loginWithGoogle = () => {
    // Giả lập thông tin phản hồi từ Google Auth API
    const googleUser = {
      name: "Người dùng Google",
      email: `google_${Math.floor(Math.random() * 10000)}@gmail.com`,
      role: 'user',
    };

    setUser(googleUser);
    localStorage.setItem('glow_user', JSON.stringify(googleUser));
    toast.success(`Đăng nhập bằng Google thành công! Xin chào ${googleUser.name}.`);
    return googleUser;
  };

  // Hành động kiểm tra: Kiểm tra nhanh sự tồn tại của Email trong cơ sở dữ liệu
  const checkEmailExists = (email) => {
    return registeredUsers.some(u => u.email === email);
  };

  // Hành động: Đặt lại mật khẩu (Reset Password Action)
  const resetPassword = (email, newPassword) => {
    const userIndex = registeredUsers.findIndex(u => u.email === email);
    if (userIndex !== -1) {
      // Sao chép mảng cơ sở dữ liệu để tuân thủ tính bất biến (Immutability) của React
      const updatedDB = [...registeredUsers];
      updatedDB[userIndex].password = newPassword; // Ghi đè mật khẩu mới
      
      setRegisteredUsers(updatedDB); // Cập nhật database
      toast.success("Mật khẩu của bạn đã được thay đổi thành công!");
      return true;
    }
    return false;
  };

  // Hành động: Đăng xuất người dùng (Logout Action)
  const logout = () => {
    setUser(null); // Xóa thông tin user trong State
    localStorage.removeItem('glow_user'); // Xóa phiên đăng nhập khỏi LocalStorage
    toast.info('Bạn đã đăng xuất.');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loginWithGoogle, resetPassword, checkEmailExists }}>
      {children}
    </AuthContext.Provider>
  );
};

