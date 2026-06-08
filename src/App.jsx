import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout & Pages
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import OrderHistory from './pages/OrderHistory';
import About from './pages/About';
import Auth from './pages/Auth'; 
import ProtectedRoute from './components/layout/ProtectedRoute';
import ScrollToTopHandler from './components/layout/ScrollToTopHandler';
import ScrollToTopButton from './components/layout/ScrollToTopButton';

// Mock Payment
import MockPayment from './pages/payment/MockPayment';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailed from './pages/payment/PaymentFailed';

// Admin
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminInventory from './pages/admin/AdminInventory';
import AdminSettings from './pages/admin/AdminSettings';

// Context Providers
import { CartProvider, WishlistProvider, OrderProvider, AuthProvider } from './contexts';

// Layout wrapper — ẩn Header/Footer cho trang admin
function AppLayout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTopHandler />
      {!isAdminPage && <Header />}
      <main className={isAdminPage ? '' : 'min-h-[calc(100vh-80px)] relative'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Auth />} /> 

          {/* Protected Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />

          {/* Payment Routes */}
          <Route path="/payment/mock/:orderId" element={
            <ProtectedRoute>
              <MockPayment />
            </ProtectedRoute>
          } />
          <Route path="/payment/success/:orderId" element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          } />
          <Route path="/payment/failed/:orderId" element={
            <ProtectedRoute>
              <PaymentFailed />
            </ProtectedRoute>
          } />

          {/* Admin Routes — nested with AdminLayout (includes AdminRoute guard) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <ScrollToTopButton />}
      
      <ToastContainer 
        position="bottom-right" 
        autoClose={2000} 
        hideProgressBar={false}
        newestOnTop 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss
        draggable 
        pauseOnHover 
        theme="dark"
        toastStyle={{
          borderRadius: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          background: '#1a1a2e',
          border: '1px solid rgba(212, 175, 55, 0.15)',
        }}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <OrderProvider>
          <CartProvider>
            <Router>
              <AppLayout />
            </Router>
          </CartProvider>
        </OrderProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
