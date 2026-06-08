/**
 * Dịch vụ API Sản Phẩm (Product API Service)
 * Tập trung toàn bộ logic gọi API sản phẩm từ DummyJSON và chuyển đổi dữ liệu sang định dạng tiền VNĐ.
 * Tránh trùng lặp code xử lý giữa các trang: Home, Products, ProductDetail.
 */
import httpClient from './httpClient';

// Hệ số chuyển đổi tỷ giá USD sang VNĐ (ví dụ: 1 USD = 26,000 VNĐ)
const USD_TO_VND = 26000;

/**
 * Chuyển đổi dữ liệu sản phẩm gốc (raw data) từ DummyJSON sang cấu trúc dữ liệu chuẩn của ứng dụng.
 * @param {Object} item - Đối tượng sản phẩm gốc trả về từ DummyJSON API.
 * @returns {Object} Đối tượng sản phẩm đã được chuẩn hóa và quy đổi giá tiền sang VNĐ.
 */
export const formatProductData = (item) => {
  // Quy đổi giá gốc từ USD sang VNĐ và làm tròn số
  const originalPrice = Math.round(item.price * USD_TO_VND);

  // Quy ước: 4 sản phẩm đầu tiên (id <= 4) là sản phẩm "Siêu Sale" (giảm giá đặc biệt)
  if (item.id <= 4) {
    const discountPercent = Math.round(item.discountPercentage);
    // Tính toán giá sau khi đã áp dụng phần trăm giảm giá
    const discountedPrice = Math.round(originalPrice * (1 - discountPercent / 100));

    return {
      id: item.id,
      name: item.title,
      oldPrice: originalPrice,      // Lưu giá gốc làm giá cũ để hiển thị gạch ngang
      price: discountedPrice,       // Giá bán thực tế sau khi giảm
      discount: discountPercent,     // Phần trăm giảm giá
      img: item.thumbnail,
      category: item.category || null,
      description: item.description || '',
      brand: item.brand || 'ECommerce Mall',
    };
  }

  // Đối với các sản phẩm thông thường (không giảm giá)
  return {
    id: item.id,
    name: item.title,
    oldPrice: null,                 // Không có giá cũ
    price: originalPrice,           // Giá bán thực tế chính bằng giá gốc quy đổi
    discount: null,                 // Không có phần trăm giảm giá
    img: item.thumbnail,
    category: item.category || null,
    description: item.description || '',
    brand: item.brand || 'ECommerce Mall',
  };
};

/**
 * Định dạng số tiền thành chuỗi tiền tệ VNĐ hiển thị đẹp mắt (ví dụ: 100000 -> 100.000 ₫).
 * Sử dụng thư viện Intl.NumberFormat tiêu chuẩn của JavaScript.
 * @param {number} price - Giá tiền dạng số.
 * @returns {string} Chuỗi tiền tệ đã định dạng theo chuẩn vi-VN.
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

/**
 * Lấy danh sách tất cả sản phẩm (thường dùng ở Trang chủ)
 * Giới hạn lấy tối đa 100 sản phẩm từ API
 * @returns {Promise<Array>} Danh sách sản phẩm đã được format sang cấu trúc của ứng dụng.
 */
export const fetchAllProducts = async () => {
  const data = await httpClient.get('/products?limit=100');
  return data.products.map(formatProductData);
};

/**
 * Lấy thông tin chi tiết của một sản phẩm dựa vào ID (dùng ở Trang chi tiết sản phẩm)
 * @param {number|string} id - ID của sản phẩm cần lấy.
 * @returns {Promise<Object>} Đối tượng chi tiết sản phẩm đã được format.
 */
export const fetchProductById = async (id) => {
  const data = await httpClient.get(`/products/${id}`);
  return formatProductData(data);
};

/**
 * Lấy danh sách sản phẩm thuộc nhiều danh mục khác nhau cùng lúc (dùng ở Trang sản phẩm)
 * Sử dụng Promise.all để thực hiện song song các request nhằm tối ưu tốc độ tải trang
 * @param {Array<string>} categories - Danh sách các danh mục (mặc định: làm đẹp, chăm sóc da, nước hoa).
 * @returns {Promise<Array>} Mảng danh sách sản phẩm thuộc các danh mục này sau khi đã được định dạng.
 */
export const fetchProductsByCategories = async (categories = ['beauty', 'skin-care', 'fragrances']) => {
  // Gửi đồng thời nhiều yêu cầu lấy sản phẩm của từng danh mục
  const results = await Promise.all(
    categories.map((cat) => httpClient.get(`/products/category/${cat}`))
  );

  // Gom các mảng sản phẩm con trả về từ các API thành một mảng phẳng duy nhất
  const allItems = results.flatMap((res) => res.products);
  
  // Trả về mảng sản phẩm đã được format
  return allItems.map(formatProductData);
};

