import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, cart, addToCart } = useShop();
  
  const product = products.find(p => p.id === id);
  const cartItem = cart.find(c => c.product.id === id);
  const currentQtyInCart = cartItem ? cartItem.quantity : 0;
  
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container not-found">
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/')} className="btn-primary">Volver al inicio</button>
      </div>
    );
  }

  const availableToBuy = product.stock - currentQtyInCart;
  const maxReached = availableToBuy <= 0;

  const handleDecrease = () => setQuantity(prev => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity(prev => Math.min(availableToBuy, prev + 1));

  const handleAdd = () => {
    if (quantity > 0 && quantity <= availableToBuy) {
      addToCart(product.id, quantity);
      setQuantity(1); // reset after adding
    }
  };

  return (
    <main className="container product-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} /> Volver
      </button>

      <div className="product-detail-layout">
        <div className="product-detail-image-wrapper">
          <img src={product.imageUrl} alt={product.name} />
          {product.stock === 0 && <span className="stock-badge error large-badge">Agotado</span>}
        </div>
        
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1 className="product-name-large">{product.name}</h1>
          <p className="product-price-large">${product.price.toFixed(2)}</p>
          
          <p className="product-description">{product.description}</p>
          
          <div className="stock-info">
            <span className="stock-indicator">
              Stock disponible: <strong>{product.stock}</strong> 
              {currentQtyInCart > 0 && ` (Ya tienes ${currentQtyInCart} en el carrito)`}
            </span>
          </div>

          <div className="add-to-cart-section">
            <div className="qty-selector large">
              <button 
                onClick={handleDecrease} 
                disabled={product.stock === 0 || maxReached || quantity <= 1}
              >
                <Minus size={18} />
              </button>
              <span>{product.stock === 0 ? 0 : quantity}</span>
              <button 
                onClick={handleIncrease} 
                disabled={product.stock === 0 || maxReached || quantity >= availableToBuy}
              >
                <Plus size={18} />
              </button>
            </div>
            
            <button 
              className="btn-add-cart large"
              disabled={product.stock === 0 || maxReached}
              onClick={handleAdd}
            >
              {product.stock === 0 ? 'Agotado' : maxReached ? 'Stock Max alcanzado' : (
                <><ShoppingCart size={20} /> Agregar al Carrito</>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
