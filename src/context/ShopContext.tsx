import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product, CartItem, Order } from '../types';
import { initialProducts } from '../data/mockProducts';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (productId: string, quantity: number) => { success: boolean; message?: string };
  updateCartQty: (productId: string, quantity: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  checkout: () => { success: boolean; orderId?: string; message?: string; problemProducts?: string[] };
  clearCart: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Producto no encontrado' };

    const existingCartItem = cart.find(item => item.product.id === productId);
    const newQuantity = (existingCartItem?.quantity || 0) + quantity;

    if (newQuantity > product.stock) {
      return { success: false, message: 'Stock insuficiente para la cantidad solicitada' };
    }

    if (existingCartItem) {
      setCart(cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: newQuantity }]);
    }
    
    return { success: true };
  };

  const updateCartQty = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Producto no encontrado' };

    if (quantity > product.stock) {
      // Auto-correct to max stock (handled in UI, but just to be safe here too)
      return { success: false, message: 'Stock insuficiente' };
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity } 
        : item
    ));
    return { success: true };
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const checkout = () => {
    // 1. Re-validate all stock
    const problemProducts: string[] = [];
    
    // Check against newest product list
    for (const item of cart) {
      const productInDb = products.find(p => p.id === item.product.id);
      if (!productInDb || productInDb.stock < item.quantity) {
        problemProducts.push(productInDb?.name || 'Producto desconocido');
      }
    }

    if (problemProducts.length > 0) {
      return { 
        success: false, 
        message: 'Algunos productos ya no tienen stock disponible.', 
        problemProducts 
      };
    }

    // 2. Reduce stock
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.product.id === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.quantity };
      }
      return p;
    });

    setProducts(updatedProducts);

    // 3. Create order
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9),
      items: [...cart],
      total,
      date: new Date().toISOString()
    };
    
    setOrders([...orders, newOrder]);
    
    // 4. Clear cart
    setCart([]);
    
    return { success: true, orderId: newOrder.id };
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <ShopContext.Provider value={{ 
      products, 
      cart, 
      orders, 
      addToCart, 
      updateCartQty, 
      removeFromCart, 
      checkout,
      clearCart
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
