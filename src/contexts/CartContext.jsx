/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';

// Khởi tạo đối tượng Context cho giỏ hàng (CartContext)
const CartContext = createContext();

// Hook tùy chỉnh giúp các component lấy nhanh dữ liệu và các hàm thao tác giỏ hàng
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // State: Lưu trữ danh sách sản phẩm trong giỏ hàng
  const [cart, setCart] = useState([]);

  // Hành động: Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Tìm xem sản phẩm này đã tồn tại trong giỏ hàng chưa
      const existingItem = prevCart.find(item => item.id === product.id);
      
      // Nếu có rồi, tăng số lượng lên 1
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Nếu chưa có, thêm sản phẩm mới vào mảng với số lượng mặc định = 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  // Hành động: Xóa hẳn một sản phẩm ra khỏi giỏ hàng
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  // Hành động: Cập nhật tăng/giảm số lượng của sản phẩm trong giỏ hàng
  // delta nhận giá trị +1 (tăng) hoặc -1 (giảm)
  const updateQuantity = (id, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        // Bộ lọc tự động xóa sản phẩm ra khỏi giỏ hàng nếu số lượng giảm xuống <= 0
        .filter(item => item.quantity > 0); 
    });
  };
  
  // Hành động: Xóa sạch toàn bộ giỏ hàng (ví dụ sau khi đặt hàng thành công)
  const clearCart = () => {
    setCart([]);
  };

  // Tính tổng số lượng tất cả các sản phẩm đang có trong giỏ hàng sử dụng reduce
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

