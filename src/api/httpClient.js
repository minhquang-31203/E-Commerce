/**
 * HTTP Client — Lớp bọc cơ bản (Base wrapper) cho tất cả các cuộc gọi API.
 * Cung cấp cơ chế xử lý lỗi (error handling) tập trung và cấu hình mặc định.
 */

// Đường dẫn API gốc mặc định của hệ thống (sử dụng DummyJSON làm mock data)
const DEFAULT_BASE_URL = 'https://dummyjson.com';

class HttpClient {
  /**
   * Khởi tạo đối tượng HttpClient với một đường dẫn gốc tùy chọn.
   * @param {string} baseURL - URL gốc cho các API endpoint.
   */
  constructor(baseURL = DEFAULT_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Hàm cốt lõi để thực hiện các yêu cầu HTTP (HTTP Requests) sử dụng Fetch API.
   * @param {string} endpoint - Đường dẫn tương đối của API (ví dụ: "/products").
   * @param {Object} options - Cấu hình request bổ sung (headers, method, body, etc.).
   * @returns {Promise<any>} Dữ liệu JSON trả về từ API.
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Hợp nhất cấu hình mặc định và cấu hình do người dùng truyền vào
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      // Thực hiện gửi request thông qua fetch
      const response = await fetch(url, config);

      // Nếu mã trạng thái phản hồi không nằm trong khoảng 200-299, ném ra lỗi HTTP
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      // Giải mã kết quả trả về dạng JSON và trả về
      return await response.json();
    } catch (error) {
      // Ghi nhận lỗi chi tiết tại console để dễ dàng gỡ lỗi
      console.error(`[HttpClient] Yêu cầu thất bại: ${url}`, error);
      throw error; // Tiếp tục ném lỗi lên tầng phía trên xử lý
    }
  }

  /**
   * Phương thức tiện ích để gửi yêu cầu GET
   * @param {string} endpoint - Đường dẫn tương đối của API.
   */
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * Phương thức tiện ích để gửi yêu cầu POST có kèm theo body payload
   * @param {string} endpoint - Đường dẫn tương đối của API.
   * @param {Object} data - Dữ liệu JSON gửi đi.
   */
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Khởi tạo một thực thể duy nhất (Singleton Pattern) để dùng chung trên toàn hệ thống
const httpClient = new HttpClient();
export default httpClient;

