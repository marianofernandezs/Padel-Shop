import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, CreditCard, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQty, removeFromCart } = useShop();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Tu Carrito</h2>
          <button className="close-cart" onClick={onClose} aria-label="Cerrar carrito"><X size={24} /></button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={48} className="empty-cart-icon" />
              <p>Tu carrito está vacío</p>
              <button className="btn-primary" onClick={onClose}>Continuar comprando</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="cart-item">
                <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.product.name}</h4>
                  <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
                  
                  <div className="cart-item-actions">
                    <div className="qty-selector">
                      <button 
                        onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                      ><Minus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button 
                        disabled={item.quantity >= item.product.stock}
                        onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                      ><Plus size={14} /></button>
                    </div>
                    <button 
                      className="btn-remove"
                      onClick={() => removeFromCart(item.product.id)}
                    ><Trash2 size={16} /></button>
                  </div>
                  {item.quantity >= item.product.stock && (
                    <p className="cart-stock-warning">Stock máximo alcanzado</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn-checkout" onClick={handleCheckout}>
              <CreditCard size={20} /> Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </>
  );
};
