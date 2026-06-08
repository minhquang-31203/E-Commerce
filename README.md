ecommerce-project/
├── src/
│   ├── assets/        # Chứa hình ảnh, icon, font chữ
│   ├── components/    # Các mảnh ghép dùng chung (Tái sử dụng)
│   │   ├── common/    # Button, Input, Modal, Spinner...
│   │   └── layout/    # Header, Footer, Sidebar, Navigation...
│   ├── pages/         # Các trang chính của ứng dụng
│   │   ├── Home/      # Trang chủ (Banner, danh mục nổi bật)
│   │   ├── Product/   # Trang danh sách và chi tiết sản phẩm
│   │   ├── Cart/      # Giỏ hàng
│   │   └── Checkout/  # Thanh toán
│   ├── hooks/         # Các logic được đóng gói (ví dụ: useCart, useFetchProducts)
│   ├── context/       # Quản lý trạng thái toàn cục (ví dụ: Giỏ hàng, Đăng nhập)
│   ├── services/      # Nơi gọi API giao tiếp với Backend
│   ├── styles/        # CSS/SCSS tổng thể hoặc các biến màu sắc, font chữ
│   ├── utils/         # Các hàm tiện ích (format tiền tệ, format ngày tháng)
│   └── App.jsx        # File gốc kết nối các route (đường dẫn)
