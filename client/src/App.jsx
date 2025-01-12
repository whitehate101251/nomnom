import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import ErrorBoundary from './components/common/ErrorBoundary';
import NetworkStatus from './components/common/NetworkStatus';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Cart from './components/Cart/Cart';
import SearchResults from './pages/SearchResults';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import AdminLayout from './components/Admin/AdminLayout';
import ProductManagement from './components/Admin/ProductManagement';
import OrderManagement from './components/Admin/OrderManagement';
import UserManagement from './components/Admin/UserManagement';
import AnalyticsDashboard from './components/Admin/AnalyticsDashboard';

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <GlobalStyles />
              <div className="app">
                <NetworkStatus />
                <Navbar />
                
                <main>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/search" element={<SearchResults />} />

                    {/* Protected Routes */}
                    <Route element={<PrivateRoute />}>
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-confirmation" element={<OrderConfirmation />} />
                      <Route path="/order/:orderId" element={<OrderDetails />} />
                      <Route path="/profile/*" element={<Profile />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<AdminRoute />}>
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AnalyticsDashboard />} />
                        <Route path="dashboard" element={<AnalyticsDashboard />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="analytics" element={<AnalyticsDashboard />} />
                      </Route>
                    </Route>
                  </Routes>
                </main>

                <Cart />
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App; 