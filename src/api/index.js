/**
 * Điểm xuất khẩu tập trung (Barrel Export) cho các dịch vụ API.
 * Cho phép các components khác import ngắn gọn từ thư mục api (ví dụ: import { fetchAllProducts } from '../api')
 */

export { default as httpClient } from './httpClient';
export {
  fetchAllProducts,
  fetchProductById,
  fetchProductsByCategories,
  formatProductData,
  formatPrice,
} from './productApi';

