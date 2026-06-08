/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useLocalStorage('orders', []);

  // Hành động: Lưu trữ đơn hàng mới vào lịch sử
  const addOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]); 
  };

  // Hành động: Cập nhật trạng thái đơn hàng (Simulated payment status, etc.)
  const updateOrder = (orderId, updatedFields) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updatedFields } : o));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
