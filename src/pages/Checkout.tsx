import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, checkout } = useShop();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // If cart is empty, redirect to home
  if (cart.length === 0 && !isProcessing) {
    return <Navigate to="/" replace />;
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const result = await checkout();
    if (result.success) {
      navigate('/confirmation', { state: { orderId: result.orderId } });
    } else {
      setError(result.message || 'Error desconocido');
      setIsProcessing(false);
    }
  };

  return (
    <main className="container checkout-page">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} /> Volver al Carrito
      </button>

      <div className="checkout-layout">
        <div className="checkout-form-container">
          <h2>Finalizar Compra</h2>
          {error && <div className="error-alert">{error}</div>}
          
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" required placeholder="Juan Pérez" />
            </div>
            
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input type="email" required placeholder="juan@ejemplo.com" />
            </div>
            
            <div className="form-group">
              <label>Dirección de Envío</label>
              <input type="text" required placeholder="Calle Falsa 123" />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Número de Tarjeta (Simulado)</label>
                <input type="text" required placeholder="**** **** **** ****" maxLength={19} />
              </div>
              <div className="form-group short">
                <label>Vencimiento</label>
                <input type="text" required placeholder="MM/YY" maxLength={5} />
              </div>
              <div className="form-group short">
                <label>CVC</label>
                <input type="text" required placeholder="***" maxLength={4} />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary checkout-submit" 
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : (
                <><CreditCard size={20} /> Pagar ${total.toFixed(2)}</>
              )}
            </button>
            <p className="payment-security">
              <ShieldCheck size={16} /> Pago 100% Seguro y Encriptado
            </p>
          </form>
        </div>

        <div className="checkout-summary">
          <h3>Resumen del Pedido</h3>
          <div className="checkout-items">
            {cart.map(item => (
              <div key={item.product.id} className="checkout-item">
                <img src={item.product.imageUrl} alt={item.product.name} />
                <div className="checkout-item-info">
                  <h4>{item.product.name}</h4>
                  <p>Cant: {item.quantity}</p>
                </div>
                <div className="checkout-item-price">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="checkout-total-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="checkout-total-row">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <div className="checkout-total-row final">
            <span>Total a Pagar</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
};
