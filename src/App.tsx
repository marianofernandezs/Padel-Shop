import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import './App.css';
import './styles/components.css';
import './styles/pages.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ShopProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header onOpenCart={() => setIsCartOpen(true)} />
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<OrderConfirmation />} />
          </Routes>
          
          <footer className="footer" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#111827', color: '#9ca3af', marginTop: 'auto' }}>
            <p>&copy; {new Date().getFullYear()} Padel Shop. Todos los derechos reservados.</p>
          </footer>
        </div>
      </BrowserRouter>
    </ShopProvider>
  );
}

export default App;
