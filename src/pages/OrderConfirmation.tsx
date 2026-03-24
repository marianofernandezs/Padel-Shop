import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderId = location.state?.orderId;

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="container confirmation-page">
      <div className="confirmation-card">
        <CheckCircle size={80} className="success-icon" />
        <h1>¡Pedido Confirmado!</h1>
        <p className="confirmation-msg">Tu pago se ha procesado exitosamente y estamos preparando tu orden.</p>
        
        <div className="order-details-box">
          <p>Número de Orden</p>
          <h3>#{orderId}</h3>
        </div>
        
        <p className="email-note">Te hemos enviado un correo electrónico con los detalles de la compra y el enlace de seguimiento.</p>
        
        <button className="btn-primary" onClick={() => navigate('/')}>
          <Home size={20} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
          Volver al Inicio
        </button>
      </div>
    </main>
  );
};
