import React from 'react';
import type { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart } = useShop();
  
  const cartItem = cart.find(c => c.product.id === product.id);
  const currentQtyInCart = cartItem ? cartItem.quantity : 0;
  const availableToBuy = product.stock - currentQtyInCart;
  const isOutOfStock = product.stock === 0;
  const maxReached = availableToBuy <= 0 && !isOutOfStock;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (availableToBuy > 0) {
      addToCart(product.id, 1);
    }
  };

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img src={product.imageUrl} alt={product.name} className="product-image" loading="lazy" />
          {isOutOfStock && <span className="stock-badge error">Agotado</span>}
          {maxReached && <span className="stock-badge warning">Máximo alcanzado</span>}
          {!isOutOfStock && !maxReached && product.stock <= 3 && (
            <span className="stock-badge warning">¡Solo {product.stock} disp!</span>
          )}
        </div>
        
        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      
      <div className="product-actions">
        <button 
          className="btn-add-cart" 
          disabled={isOutOfStock || maxReached}
          onClick={handleAdd}
        >
          {isOutOfStock ? (
            'Agotado'
          ) : maxReached ? (
            'En carrito'
          ) : (
             <>
               <ShoppingCart size={18} /> Agregar
             </>
          )}
        </button>
      </div>
    </div>
  );
};
