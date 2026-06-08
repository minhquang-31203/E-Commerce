/**
 * Product API Service
 * Tập trung toàn bộ logic gọi API sản phẩm + chuyển đổi dữ liệu VNĐ
 * Loại bỏ code duplicate giữa Home, Products, ProductDetail
 */
import httpClient from './httpClient';

// Hệ số chuyển đổi USD → VNĐ
const USD_TO_VND = 26000;

/**
 * Chuyển đổi raw product data từ API sang format dùng trong app
 * @param {Object} item - Raw product object từ dummyjson.com
 * @returns {Object} Formatted product
 */
export const formatProductData = (item) => {
  const originalPrice = Math.round(item.price * USD_TO_VND);

  if (item.id <= 4) {
    // Sản phẩm Siêu Sale
    const discountPercent = Math.round(item.discountPercentage);
    const discountedPrice = Math.round(originalPrice * (1 - discountPercent / 100));

    return {
      id: item.id,
      name: item.title,
      oldPrice: originalPrice,
      price: discountedPrice,
      discount: discountPercent,
      img: item.thumbnail,
      category: item.category || null,
      description: item.description || '',
      brand: item.brand || 'ECommerce Mall',
    };
  }

  // Sản phẩm thông thường
  return {
    id: item.id,
    name: item.title,
    oldPrice: null,
    price: originalPrice,
    discount: null,
    img: item.thumbnail,
    category: item.category || null,
    description: item.description || '',
    brand: item.brand || 'ECommerce Mall',
  };
};

/**
 * Format giá tiền sang VNĐ
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

/**
 * Lấy tất cả sản phẩm (trang chủ)
 */
export const fetchAllProducts = async () => {
  const data = await httpClient.get('/products?limit=100');
  return data.products.map(formatProductData);
};

/**
 * Lấy sản phẩm theo ID (trang chi tiết)
 */
export const fetchProductById = async (id) => {
  const data = await httpClient.get(`/products/${id}`);
  return formatProductData(data);
};

/**
 * Lấy sản phẩm theo nhiều category (trang Products)
 */
export const fetchProductsByCategories = async (categories = ['beauty', 'skin-care', 'fragrances']) => {
  const results = await Promise.all(
    categories.map((cat) => httpClient.get(`/products/category/${cat}`))
  );

  const allItems = results.flatMap((res) => res.products);
  return allItems.map(formatProductData);
};
