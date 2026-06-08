import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const DEFAULT_SETTINGS = {
  // Store profile
  storeName: 'ECommerce Premium Store',
  storeEmail: 'contact@ecommerce.com',
  storePhone: '0123 456 789',
  storeAddress: '123 Luxury Road, Quận 1, TP. Hồ Chí Minh',
  currency: 'VND',

  // Payment settings
  enableCod: true,
  enableOnline: true,
  bankName: 'Vietcombank (VCB)',
  bankAccountNumber: '0123 456 789',
  bankAccountOwner: 'ECOMMERCE PORTAL',

  // System settings
  maintenanceMode: false,
  pushNotifications: true,
  defaultLanguage: 'vi',
};

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'payment' | 'system'
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggle = (name, currentValue) => {
    setSettings(prev => ({
      ...prev,
      [name]: !currentValue
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('admin_settings', JSON.stringify(settings));
      toast.success('✨ Đã lưu cấu hình hệ thống thành công!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast.error('❌ Lỗi khi lưu cấu hình');
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-sm placeholder:text-silver-dark/50 focus:outline-none focus:border-gold/40 focus:bg-white/8 transition-all";
  
  // Custom styled toggle switch component
  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
      <div className="space-y-0.5">
        <span className="text-xs font-semibold text-ivory block">{label}</span>
        {description && <span className="text-[10px] text-silver-dark block">{description}</span>}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`w-11 h-6 rounded-full relative transition-all duration-300 border-none cursor-pointer
          ${checked ? 'bg-gold' : 'bg-white/10'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-obsidian transition-all duration-300 shadow-md
            ${checked ? 'left-5.5' : 'left-0.5'}`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-ivory font-heading text-xl lg:text-2xl font-bold">Cài đặt Hệ thống</h2>
        <p className="text-silver-dark text-xs mt-1">Cấu hình các tùy chọn chung, cổng thanh toán và quản trị gian hàng</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b border-white/5 pb-px">
        {[
          { id: 'store', label: 'Cấu hình Cửa hàng', icon: '🏪' },
          { id: 'payment', label: 'Cấu hình Thanh toán', icon: '💳' },
          { id: 'system', label: 'Tùy chọn Hệ thống', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer bg-transparent
              ${activeTab === tab.id
                ? 'border-gold text-gold font-bold bg-gold/5'
                : 'border-transparent text-silver hover:text-ivory hover:bg-white/[0.02]'
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'store' && (
          <div className="glass-card rounded-2xl p-6 lg:p-8 space-y-6 animate-fade-in-up">
            <h3 className="text-ivory font-heading text-sm font-semibold uppercase tracking-wider mb-4 text-gold">Thông tin Cửa hàng</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-silver text-xs font-medium mb-1.5">Tên Cửa hàng</label>
                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-silver text-xs font-medium mb-1.5">Email liên hệ</label>
                <input
                  type="email"
                  name="storeEmail"
                  value={settings.storeEmail}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-silver text-xs font-medium mb-1.5">Hotline hỗ trợ</label>
                <input
                  type="text"
                  name="storePhone"
                  value={settings.storePhone}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-silver text-xs font-medium mb-1.5">Đơn vị tiền tệ chính</label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className={`${inputClass} bg-obsidian-light text-ivory cursor-pointer`}
                >
                  <option value="VND">Việt Nam Đồng (VNĐ - ₫)</option>
                  <option value="USD">Đô la Mỹ (USD - $)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-silver text-xs font-medium mb-1.5">Địa chỉ văn phòng</label>
                <textarea
                  name="storeAddress"
                  rows="2"
                  value={settings.storeAddress}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="glass-card rounded-2xl p-6 lg:p-8 space-y-6 animate-fade-in-up">
            <h3 className="text-ivory font-heading text-sm font-semibold uppercase tracking-wider mb-4 text-gold">Cổng Thanh toán hỗ trợ</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleSwitch
                checked={settings.enableCod}
                onChange={() => handleToggle('enableCod', settings.enableCod)}
                label="Hỗ trợ thanh toán khi nhận hàng (COD)"
                description="Cho phép khách hàng đặt đơn và thanh toán trực tiếp cho shipper."
              />
              <ToggleSwitch
                checked={settings.enableOnline}
                onChange={() => handleToggle('enableOnline', settings.enableOnline)}
                label="Hỗ trợ thanh toán trực tuyến (Simulated Online)"
                description="Kích hoạt cổng chuyển khoản ngân hàng giả lập tại trang Checkout."
              />
            </div>

            <div className="border-t border-white/5 pt-6 mt-6">
              <h4 className="text-ivory text-xs font-semibold uppercase tracking-wider mb-4">Tài khoản thụ hưởng (Nhận chuyển khoản)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-silver text-xs font-medium mb-1.5">Tên ngân hàng</label>
                  <input
                    type="text"
                    name="bankName"
                    value={settings.bankName}
                    onChange={handleChange}
                    className={inputClass}
                    disabled={!settings.enableOnline}
                  />
                </div>
                <div>
                  <label className="block text-silver text-xs font-medium mb-1.5">Số tài khoản (STK)</label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={settings.bankAccountNumber}
                    onChange={handleChange}
                    className={inputClass}
                    disabled={!settings.enableOnline}
                  />
                </div>
                <div>
                  <label className="block text-silver text-xs font-medium mb-1.5">Tên chủ tài khoản</label>
                  <input
                    type="text"
                    name="bankAccountOwner"
                    value={settings.bankAccountOwner}
                    onChange={handleChange}
                    className={inputClass}
                    disabled={!settings.enableOnline}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="glass-card rounded-2xl p-6 lg:p-8 space-y-6 animate-fade-in-up">
            <h3 className="text-ivory font-heading text-sm font-semibold uppercase tracking-wider mb-4 text-gold">Thông số Hệ thống</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleSwitch
                checked={settings.maintenanceMode}
                onChange={() => handleToggle('maintenanceMode', settings.maintenanceMode)}
                label="Chế độ bảo trì cửa hàng"
                description="Khi bật, người dùng bình thường sẽ không thể truy cập mua sắm."
              />
              <ToggleSwitch
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications', settings.pushNotifications)}
                label="Bật thông báo đẩy hệ thống"
                description="Gửi thông báo âm thanh hoặc toast khi có đơn hàng mới phát sinh."
              />
              
              <div>
                <label className="block text-silver text-xs font-medium mb-1.5">Ngôn ngữ mặc định hệ thống</label>
                <select
                  name="defaultLanguage"
                  value={settings.defaultLanguage}
                  onChange={handleChange}
                  className={`${inputClass} bg-obsidian-light text-ivory cursor-pointer`}
                >
                  <option value="vi">Tiếng Việt (Default)</option>
                  <option value="en">English (US)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-obsidian font-bold text-sm tracking-wider uppercase border-none hover:shadow-glow-gold-strong transition-all cursor-pointer"
          >
            Lưu cấu hình hệ thống
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
