import React from 'react';

// Component hiển thị thẻ thông số thống kê (StatCard) trong Admin Dashboard
// Nhận vào các tham số để cấu hình nhãn, giá trị, biểu tượng và màu sắc hiển thị động
const StatCard = ({ label, value, icon, color, bg, border, delay = 0 }) => {
  return (
    <div
      className={`rounded-2xl p-5 border bg-obsidian/40 backdrop-blur-sm hover:shadow-soft transition-all duration-300 animate-fade-in-up ${border}`}
      style={{ animationDelay: `${delay}s` }} // Tạo độ trễ animation để tạo hiệu ứng lần lượt xuất hiện
    >
      <div className="flex items-center justify-between mb-4">
        {/* Khối tròn/vuông chứa Icon với màu nền (bg) và màu icon (color) động */}
        <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      {/* Nhãn chỉ số (ví dụ: Tổng doanh thu, Đơn hàng mới,...) */}
      <p className="text-silver text-xs font-medium mb-1 tracking-wide uppercase">{label}</p>
      {/* Giá trị chỉ số */}
      <p className="text-ivory text-2xl font-bold font-heading">{value}</p>
    </div>
  );
};

export default StatCard;

