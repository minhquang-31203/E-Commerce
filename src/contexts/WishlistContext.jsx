/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import { useLocalStorage } from '../hooks';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useLocalStorage('glow_wishlist', []);

  // Hành động: Thay đổi trạng thái thêm/xóa sản phẩm yêu thích
  const toggleWishlist = (product) => {
    const isExist = wishlist.find(item => item.id === product.id);

    if (isExist) {
      toast.info(`Đã bỏ yêu thích ${product.name}`, { autoClose: 1500 });
      setWishlist(prev => prev.filter(item => item.id !== product.id));
    } else {
      toast.success(` Đã lưu ${product.name} vào danh sách!`, { 
        icon: '❤️',
        autoClose: 1500 
      });
      setWishlist(prev => [...prev, product]);
    }
  };

  // Hàm phụ trợ: Kiểm tra xem ID sản phẩm đã có trong danh sách chưa
  const isInWishlist = (id) => wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
