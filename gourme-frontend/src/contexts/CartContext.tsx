import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, MenuItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i =>
          i.menuItemId === item.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, {
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity,
      }];
    });
  };

  const removeFromCart = (menuItemId: number) => {
    setCart(prev => prev.filter(i => i.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCart(prev => prev.map(i =>
      i.menuItemId === menuItemId ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setCart([]);
  const getTotal = () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const getItemCount = () => cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};