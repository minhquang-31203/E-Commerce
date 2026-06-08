/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks';

// Khởi tạo đối tượng Context quản lý danh sách đơn hàng (OrderContext)
const OrderContext = createContext();

// Hook tùy chỉnh giúp các component lấy nhanh lịch sử đơn hàng
export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  // State: Lưu trữ danh sách đơn hàng được đồng bộ hóa với LocalStorage qua khóa 'orders'
  const [orders, setOrders] = useLocalStorage('orders', []);

  // Hành động: Lưu trữ đơn hàng mới vào lịch sử mua hàng
  // Prepend đơn hàng mới lên đầu danh sách để hiển thị đơn hàng mới nhất trước
  const addOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]); 
  };

  // Hành động: Cập nhật thông tin/trạng thái của một đơn hàng cụ thể (ví dụ: Thay đổi trạng thái thanh toán, giao hàng)
  const updateOrder = (orderId, updatedFields) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updatedFields } : o));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

