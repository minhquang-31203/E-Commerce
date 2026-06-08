/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import { useLocalStorage } from '../hooks';

// Khởi tạo đối tượng Context cho danh sách sản phẩm yêu thích (WishlistContext)
const WishlistContext = createContext();

// Hook tùy chỉnh giúp lấy nhanh trạng thái danh sách yêu thích
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  // State: Lưu trữ mảng sản phẩm yêu thích được đồng bộ hóa với LocalStorage qua khóa 'glow_wishlist'
  const [wishlist, setWishlist] = useLocalStorage('glow_wishlist', []);

  // Hành động: Đảo trạng thái yêu thích (Thêm nếu chưa có, Xóa nếu đã có)
  const toggleWishlist = (product) => {
    // Kiểm tra xem sản phẩm đã nằm trong danh sách yêu thích chưa
    const isExist = wishlist.find(item => item.id === product.id);

    if (isExist) {
      // Nếu đã yêu thích rồi -> Tiến hành xóa sản phẩm khỏi danh sách và hiển thị thông báo
      toast.info(`Đã bỏ yêu thích ${product.name}`, { autoClose: 1500 });
      setWishlist(prev => prev.filter(item => item.id !== product.id));
    } else {
      // Nếu chưa yêu thích -> Tiến hành thêm vào danh sách và hiển thị thông báo kèm icon Trái Tim
      toast.success(` Đã lưu ${product.name} vào danh sách!`, { 
        icon: '❤️',
        autoClose: 1500 
      });
      setWishlist(prev => [...prev, product]);
    }
  };

  // Hàm tiện ích: Kiểm tra xem một ID sản phẩm cụ thể đã nằm trong danh sách yêu thích chưa
  const isInWishlist = (id) => wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

