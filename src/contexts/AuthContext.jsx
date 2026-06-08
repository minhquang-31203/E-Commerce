/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useLocalStorage } from '../hooks';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Tài khoản admin mặc định
const DEFAULT_ADMIN = {
  name: 'Admin',
  email: 'admin@quang.com',
  password: 'admin123',
  role: 'admin',
};

export const AuthProvider = ({ children }) => {
  // State: Lưu thông tin người dùng đang đăng nhập
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('glow_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // State: Cơ sở dữ liệu giả lập chứa danh sách tài khoản đã đăng ký
  const [registeredUsers, setRegisteredUsers] = useLocalStorage('glow_accounts_db', []);

  // Seed tài khoản admin mặc định nếu chưa có trong DB
  React.useEffect(() => {
    const hasAdmin = registeredUsers.some(u => u.email === DEFAULT_ADMIN.email);
    if (!hasAdmin) {
      setRegisteredUsers(prev => [DEFAULT_ADMIN, ...prev]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hành động: Đăng ký người dùng mới
  const register = (newUser) => {
    const isExisted = registeredUsers.find(u => u.email === newUser.email);
    if (isExisted) {
      toast.error("Email này đã được sử dụng!");
      return false;
    }

    // Gán role "user" mặc định cho tài khoản mới
    setRegisteredUsers([...registeredUsers, { ...newUser, role: 'user' }]);
    return true;
  };

  // Hành động: Xác thực người dùng (Đăng nhập)
  const login = (email, password) => {
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const sessionData = { name: foundUser.name, email: foundUser.email, role: foundUser.role || 'user' };
      setUser(sessionData);
      localStorage.setItem('glow_user', JSON.stringify(sessionData));
      toast.success(`Chào mừng ${foundUser.name} quay trở lại!`);
      return sessionData;
    } else {
      toast.error("Email hoặc mật khẩu không chính xác!");
      return false;
    }
  };

  // Hành động: Xác thực người dùng bằng Google (Giả lập)
  const loginWithGoogle = () => {
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

  // Hành động: Kiểm tra Email có tồn tại trong hệ thống giả lập không
  const checkEmailExists = (email) => {
    return registeredUsers.some(u => u.email === email);
  };

  // Hành động: Khôi phục mật khẩu (Ghi đè mật khẩu mới)
  const resetPassword = (email, newPassword) => {
    const userIndex = registeredUsers.findIndex(u => u.email === email);
    if (userIndex !== -1) {
      const updatedDB = [...registeredUsers];
      updatedDB[userIndex].password = newPassword;
      setRegisteredUsers(updatedDB);
      toast.success("Mật khẩu của bạn đã được thay đổi thành công!");
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('glow_user');
    toast.info('Bạn đã đăng xuất.');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loginWithGoogle, resetPassword, checkEmailExists }}>
      {children}
    </AuthContext.Provider>
  );
};
