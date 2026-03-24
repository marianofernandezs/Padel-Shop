import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product, CartItem, Order } from '../types';
import { supabase } from '../lib/supabase';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  isLoading: boolean;
  addToCart: (productId: string, quantity: number) => { success: boolean; message?: string };
  updateCartQty: (productId: string, quantity: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  checkout: () => Promise<{ success: boolean; orderId?: string; message?: string; problemProducts?: string[] }>;
  clearCart: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setIsLoading(false);
  };

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

  const checkout = async () => {
    // 1. Fetch fresh stock from DB
    const { data: dbProducts, error } = await supabase.from('products').select('*');
    if (error || !dbProducts) {
      return { success: false, message: 'Error conectando a la base de datos' };
    }

    const problemProducts: string[] = [];
    
    // Check against newest product list in DB
    for (const item of cart) {
      const productInDb = dbProducts.find(p => p.id === item.product.id);
      if (!productInDb || productInDb.stock < item.quantity) {
        problemProducts.push(productInDb?.name || item.product.name);
      }
    }

    if (problemProducts.length > 0) {
      // Refresh local store to show actual stock to the user immediately
      setProducts(dbProducts);
      return { 
        success: false, 
        message: 'Algunos productos ya no tienen stock disponible.', 
        problemProducts 
      };
    }

    // 2. Reduce stock in Database (could use a transaction RPC if multiple users, but doing sequentially for now)
    for (const item of cart) {
      const productInDb = dbProducts.find(p => p.id === item.product.id);
      if (productInDb) {
        await supabase.from('products').update({ stock: productInDb.stock - item.quantity }).eq('id', item.product.id);
      }
    }

    // Refresh local state after deduction
    await fetchProducts();

    // 3. Create order in DB (Mocking order for MVP)
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const orderId = Math.random().toString(36).substring(2, 9);
    
    const newOrder: Order = {
      id: orderId,
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
      isLoading,
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
