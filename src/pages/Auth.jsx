import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const GOOGLE_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Auth = () => {
  // Trạng thái chuyển đổi giữa Đăng nhập (true) và Đăng ký (false)
  const [isLogin, setIsLogin] = useState(true);
  // Quản lý các bước trong quá trình Quên mật khẩu:
  // 0: Không quên mật khẩu (Màn hình chính)
  // 1: Nhập email gửi OTP
  // 2: Nhập OTP để xác thực
  // 3: Thiết lập mật khẩu mới
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [inputOTP, setInputOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sử dụng AuthContext để lấy các hàm thực hiện đăng ký, đăng nhập, quên mật khẩu
  const { login, register, loginWithGoogle, resetPassword, checkEmailExists } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Xác định trang đích sau khi đăng nhập thành công (mặc định là trang chủ "/")
  const from = location.state?.from?.pathname || "/";

  // Cấu hình Formik để quản lý Form đăng ký/đăng nhập và validate dữ liệu
  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    // Yup validation schema: Động theo trạng thái Đăng nhập/Đăng ký/Quên mật khẩu
    validationSchema: Yup.object({
      name: isLogin ? Yup.string() : Yup.string().min(2, 'Tên phải có ít nhất 2 ký tự').required('Vui lòng nhập họ và tên'),
      email: Yup.string().email('Email không đúng định dạng').required('Vui lòng nhập email'),
      password: forgotPasswordStep > 0 ? Yup.string() : Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu')
    }),
    onSubmit: (values) => {
      // Nếu đang ở bước khôi phục mật khẩu, không thực hiện submit form thông thường
      if (forgotPasswordStep > 0) return;
      
      if (isLogin) {
        // Đăng nhập tài khoản
        const result = login(values.email, values.password);
        if (result) {
          // Điều hướng admin về trang dashboard quản lý, user thường về trang trước đó
          if (result.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate(from, { replace: true });
          }
        }
      } else {
        // Đăng ký tài khoản mới
        const success = register({ name: values.name, email: values.email, password: values.password });
        if (success) {
          toast.success("✨ Đăng ký thành công! Mời bạn đăng nhập.");
          setIsLogin(true); // Chuyển sang form đăng nhập
          formik.resetForm({ values: { name: '', email: values.email, password: '' } });
        }
      }
    }
  });

  const { values, errors, touched, handleSubmit, getFieldProps, setErrors, setTouched } = formik;

  // Reset các lỗi của Formik khi người dùng chuyển đổi màn hình
  useEffect(() => {
    setErrors({});
    setTouched({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, forgotPasswordStep]);

  // Xử lý Gửi mã OTP giả lập qua giao diện Toast thông báo
  const handleSendOTP = () => {
    if (!values.email) { 
      toast.warning("Vui lòng nhập Email!"); 
      formik.setFieldTouched('email', true); 
      return; 
    }
    if (!checkEmailExists(values.email)) { 
      toast.error("Email chưa được đăng ký!"); 
      return; 
    }
    // Tạo mã OTP ngẫu nhiên gồm 6 chữ số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setForgotPasswordStep(2); // Chuyển sang bước nhập OTP
    toast.info(`[Giả lập] Mã OTP: ${otp}`, { autoClose: false, position: 'top-center' });
  };

  // Xác minh mã OTP do người dùng nhập vào có khớp với mã giả lập không
  const handleVerifyOTP = () => {
    if (inputOTP === generatedOTP) { 
      toast.success("Xác thực thành công!"); 
      setForgotPasswordStep(3); // Chuyển sang bước đặt lại mật khẩu mới
    } else {
      toast.error("Mã OTP không chính xác!");
    }
  };

  // Xử lý thiết lập mật khẩu mới sau khi xác thực OTP thành công
  const handleSetNewPassword = () => {
    if (newPassword.length < 6) { 
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!"); 
      return; 
    }
    if (newPassword !== confirmPassword) { 
      toast.error("Mật khẩu xác nhận không khớp!"); 
      return; 
    }
    const success = resetPassword(values.email, newPassword);
    if (success) { 
      // Quay về bước đăng nhập mặc định
      setForgotPasswordStep(0); 
      setNewPassword(""); 
      setConfirmPassword(""); 
      setInputOTP(""); 
      formik.setFieldValue('password', ''); 
    }
  };


  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-sm placeholder:text-silver-dark/50 focus:outline-none focus:border-gold/40 focus:bg-white/8 transition-all";

  return (
    <div className="min-h-screen flex bg-obsidian">
      <div className="flex flex-col lg:flex-row w-full">
        
        {/* Left Banner */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-obsidian-light">
          <div className="absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gold/8 blur-[100px] animate-float"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-sapphire/8 blur-[80px] animate-float [animation-delay:3s]"></div>
          </div>
          <div className="relative z-10 text-center px-12 max-w-md">
            <h1 className="font-heading text-5xl font-bold gradient-text-gold mb-4">ECommerce</h1>
            <p className="text-silver text-sm leading-relaxed mb-8">Khám phá thế giới làm đẹp cao cấp. Mua sắm thông minh, nhận hàng tức thì mọi lúc mọi nơi.</p>
            <div className="space-y-3">
              {[
                { icon: '🛡️', title: '100% Chính hãng', desc: 'Cam kết chất lượng tuyệt đối' },
                { icon: '🚚', title: 'Freeship Toàn quốc', desc: 'Cho mọi đơn hàng của bạn' },
              ].map(item => (
                <div key={item.title} className="glass-card rounded-xl p-4 flex items-center gap-3 text-left">
                  <span className="text-2xl">{item.icon}</span>
                  <div><strong className="text-ivory text-sm block">{item.title}</strong><span className="text-silver-dark text-xs">{item.desc}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-16 lg:py-0">
          <div className="w-full max-w-md animate-fade-in-up">
            
            {forgotPasswordStep === 0 && (
              <>
                <h2 className="font-heading text-3xl font-bold text-ivory mb-2">{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</h2>
                <p className="text-silver text-sm mb-8">{isLogin ? 'Chào mừng bạn quay trở lại.' : 'Bắt đầu hành trình mua sắm đẳng cấp.'}</p>
              </>
            )}

            {forgotPasswordStep > 0 && (
              <>
                <h2 className="font-heading text-3xl font-bold text-ivory mb-2">Khôi phục mật khẩu</h2>
                <p className="text-silver text-sm mb-8">
                  {forgotPasswordStep === 1 && 'Nhập Email để nhận mã OTP'}
                  {forgotPasswordStep === 2 && 'Nhập mã 6 số từ Email'}
                  {forgotPasswordStep === 3 && 'Tạo mật khẩu mới'}
                </p>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {forgotPasswordStep === 0 && !isLogin && (
                <div>
                  <label htmlFor="name" className="block text-silver text-xs font-medium mb-1.5">Họ và tên</label>
                  <input id="name" type="text" {...getFieldProps('name')} placeholder="Nguyễn Văn A" className={`${inputClass} ${touched.name && errors.name ? 'border-rose/50' : ''}`} autoComplete="name" />
                  {touched.name && errors.name && <span className="text-rose text-xs mt-1 block">{errors.name}</span>}
                </div>
              )}

              {(forgotPasswordStep === 0 || forgotPasswordStep === 1) && (
                <div>
                  <label htmlFor="email" className="block text-silver text-xs font-medium mb-1.5">Email</label>
                  <input id="email" type="email" {...getFieldProps('email')} placeholder="name@example.com" className={`${inputClass} ${touched.email && errors.email ? 'border-rose/50' : ''}`} autoComplete="email" />
                  {touched.email && errors.email && <span className="text-rose text-xs mt-1 block">{errors.email}</span>}
                </div>
              )}

              {forgotPasswordStep === 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="text-silver text-xs font-medium">Mật khẩu</label>
                    {isLogin && <button type="button" className="text-gold text-xs bg-transparent border-none cursor-pointer hover:underline" onClick={() => setForgotPasswordStep(1)}>Quên mật khẩu?</button>}
                  </div>
                  <input id="password" type="password" {...getFieldProps('password')} placeholder="Tối thiểu 6 ký tự" className={`${inputClass} ${touched.password && errors.password ? 'border-rose/50' : ''}`} autoComplete={isLogin ? "current-password" : "new-password"} />
                  {touched.password && errors.password && <span className="text-rose text-xs mt-1 block">{errors.password}</span>}
                </div>
              )}

              {forgotPasswordStep === 2 && (
                <div>
                  <label htmlFor="otp" className="block text-silver text-xs font-medium mb-1.5">Mã OTP</label>
                  <input id="otp" type="text" value={inputOTP} onChange={(e) => setInputOTP(e.target.value)} placeholder="Nhập 6 số..." maxLength="6" className={`${inputClass} text-center tracking-[0.5em] text-lg font-bold`} />
                </div>
              )}

              {forgotPasswordStep === 3 && (
                <>
                  <div>
                    <label htmlFor="newPassword" className="block text-silver text-xs font-medium mb-1.5">Mật khẩu mới</label>
                    <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nhập mật khẩu mới" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-silver text-xs font-medium mb-1.5">Xác nhận</label>
                    <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu" className={inputClass} />
                  </div>
                </>
              )}

              {forgotPasswordStep === 1 && (
                <div className="flex gap-3 pt-2">
                  <button type="button" className="flex-1 py-3 rounded-xl bg-gold text-obsidian font-bold text-sm border-none hover:shadow-glow-gold transition-all" onClick={handleSendOTP}>Gửi OTP</button>
                  <button type="button" className="px-6 py-3 rounded-xl bg-white/5 text-silver text-sm border border-white/10 hover:bg-white/10 transition-all" onClick={() => setForgotPasswordStep(0)}>Hủy</button>
                </div>
              )}
              {forgotPasswordStep === 2 && (
                <div className="flex gap-3 pt-2">
                  <button type="button" className="flex-1 py-3 rounded-xl bg-gold text-obsidian font-bold text-sm border-none hover:shadow-glow-gold transition-all" onClick={handleVerifyOTP}>Xác nhận</button>
                  <button type="button" className="px-6 py-3 rounded-xl bg-white/5 text-silver text-sm border border-white/10 hover:bg-white/10 transition-all" onClick={() => { setForgotPasswordStep(1); setInputOTP(""); }}>Quay lại</button>
                </div>
              )}
              {forgotPasswordStep === 3 && (
                <button type="button" className="w-full py-3 rounded-xl bg-gold text-obsidian font-bold text-sm border-none hover:shadow-glow-gold transition-all mt-2" onClick={handleSetNewPassword}>Đổi mật khẩu</button>
              )}

              {forgotPasswordStep === 0 && (
                <>
                  <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-obsidian font-bold text-sm tracking-wider border-none hover:shadow-glow-gold-strong transition-all mt-2">
                    {isLogin ? 'Đăng nhập' : 'Đăng ký ngay'}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <div className="relative flex justify-center"><span className="bg-obsidian px-4 text-silver-dark text-xs uppercase tracking-widest">hoặc</span></div>
                  </div>

                  <button type="button" className="w-full py-3 rounded-xl border border-white/10 bg-white/3 text-ivory text-sm font-medium flex items-center justify-center gap-3 hover:bg-white/8 transition-all"
                    onClick={() => { const result = loginWithGoogle(); if (result) navigate(from, { replace: true }); }}>
                    {GOOGLE_SVG} Tài khoản Google
                  </button>
                </>
              )}
            </form>

            {forgotPasswordStep === 0 && (
              <div className="text-center mt-8">
                <span className="text-silver text-sm">{isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}</span>
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-gold font-semibold text-sm bg-transparent border-none cursor-pointer hover:underline">
                  {isLogin ? 'Đăng ký miễn phí' : 'Đăng nhập'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;