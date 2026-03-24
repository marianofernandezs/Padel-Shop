import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Storefront components
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';

// Auth components
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Admin components
import { AdminLayout } from './pages/admin/AdminLayout';
import { Inventory } from './pages/admin/Inventory';

import './App.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/auth.css';
import './styles/admin.css';

// Layout wrapper for the public storefront logic
const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <>
      <Header onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {children}
      <footer className="footer" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#111827', color: '#9ca3af', marginTop: 'auto' }}>
        <p>&copy; {new Date().getFullYear()} Padel Shop. Todos los derechos reservados.</p>
      </footer>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="inventory" replace />} />
                <Route path="inventory" element={<Inventory />} />
              </Route>

              {/* Public Storefront Routes */}
              <Route path="*" element={
                <StorefrontLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/confirmation" element={<OrderConfirmation />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </StorefrontLayout>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
