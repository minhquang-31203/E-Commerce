import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Component con hiển thị ô gợi ý khi hover vào biểu đồ (Custom Tooltip)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-obsidian/95 border border-white/10 rounded-xl p-3 shadow-elevated backdrop-blur-sm">
        {/* Nhãn ngày */}
        <p className="text-silver text-xs mb-1">{label}</p>
        {/* Doanh thu định dạng VNĐ */}
        <p className="text-gold font-bold text-sm">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value)}
        </p>
        {/* Tổng số đơn hàng trong ngày */}
        <p className="text-silver-dark text-[10px] mt-0.5">{payload[0].payload.orderCount} đơn hàng</p>
      </div>
    );
  }
  return null;
};

// Component chính vẽ biểu đồ doanh thu dạng vùng (Revenue Chart)
const RevenueChart = ({ orders = [] }) => {
  // Gom nhóm dữ liệu đơn hàng theo từng ngày bằng useMemo để tối ưu hiệu năng
  const chartData = useMemo(() => {
    const dayMap = {};

    orders.forEach(order => {
      // Phân tích cú pháp ngày từ trường createdAt hoặc date
      let dateStr;
      if (order.createdAt) {
        const d = new Date(order.createdAt);
        dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      } else if (order.date) {
        dateStr = order.date.split(',')[0]?.trim() || order.date.split(' ')[0];
      } else {
        return;
      }

      // Khởi tạo ngày trong map nếu chưa tồn tại
      if (!dayMap[dateStr]) {
        dayMap[dateStr] = { date: dateStr, revenue: 0, orderCount: 0 };
      }
      
      // Cộng dồn doanh thu và số lượng đơn hàng
      dayMap[dateStr].revenue += order.total;
      dayMap[dateStr].orderCount += 1;
    });

    // Lấy 14 ngày gần nhất để vẽ biểu đồ tránh bị tràn giao diện
    return Object.values(dayMap).slice(-14);
  }, [orders]);

  // Nếu không có dữ liệu doanh thu
  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl bg-obsidian/40 border border-white/[0.06] p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-ivory font-heading text-lg mb-4 flex items-center gap-2">
          <span className="text-emerald">📈</span> Doanh thu theo ngày
        </h3>
        <div className="flex items-center justify-center h-52 text-silver-dark text-sm">
          Chưa có dữ liệu doanh thu
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-obsidian/40 border border-white/[0.06] p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <h3 className="text-ivory font-heading text-lg mb-4 flex items-center gap-2">
        <span className="text-emerald">📈</span> Doanh thu theo ngày
      </h3>
      <div className="h-64">
        {/* ResponsiveContainer giúp biểu đồ tự động co giãn theo khung chứa */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            {/* Định nghĩa gradient màu vàng đồng (Gold) cho vùng tô màu phía dưới đường biểu đồ */}
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* Lưới tọa độ mờ */}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            {/* Trục X: hiển thị ngày */}
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b6b80', fontSize: 11 }}
            />
            {/* Trục Y: hiển thị số tiền rút gọn (M = Triệu, K = Nghìn) */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b6b80', fontSize: 11 }}
              tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Đường biểu đồ dạng Area */}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#d4af37"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;

