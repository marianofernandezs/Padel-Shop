import React from 'react';
import { ShoppingCart, Menu } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

export const Header: React.FC<{ onOpenCart: () => void }> = ({ onOpenCart }) => {
  const { cart } = useShop();
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="container header-container">
        <div className="header-left">
          <Menu className="mobile-menu-icon" />
          <Link to="/" className="logo">
            <span className="logo-text">Padel</span>
            <span className="logo-accent">Shop</span>
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/#catalog" className="nav-link">Catálogo</Link>
        </nav>

        <div className="header-actions">
          <button className="cart-button" onClick={onOpenCart} aria-label="Abrir carrito">
            <ShoppingCart size={24} />
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
