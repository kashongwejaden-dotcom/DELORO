import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartOverlay from './components/cart/CartOverlay';
import SearchOverlay from './components/search/SearchOverlay';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import Analytics from './pages/admin/Analytics';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import UserProfile from './pages/admin/UserProfile';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Profile from './pages/Profile';
import Story from './pages/Story';
import Magazine from './pages/Magazine';
import Contact from './pages/Contact';

// ScrollToTop component to handle route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <SearchProvider>
      <CartProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <ScrollToTop />
              <div className="app">
                <Routes>
                  {/* Admin Routes (No Header/Footer) */}
                  <Route path="/admin" element={<AdminDashboard />}>
                    <Route index element={<Analytics />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="customers/:id" element={<UserProfile />} />
                  </Route>

                  {/* Isolated Routes (No Header/Footer) */}
                  <Route path="/checkout" element={<Checkout />} />

                  {/* Public Routes */}
                  <Route path="*" element={
                    <>
                      <Navbar />
                      <main>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/collections" element={<Collection />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/story" element={<Story />} />
                          <Route path="/magazine" element={<Magazine />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/contact" element={<Contact />} />
                        </Routes>
                      </main>
                      <Footer />
                      <CartOverlay />
                      <SearchOverlay />
                    </>
                  } />
                </Routes>
              </div>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </CartProvider>
    </SearchProvider>
  );
}

export default App;
