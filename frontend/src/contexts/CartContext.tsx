import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: { id: string; name: string; imageUrl: string; price: number; category: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: { id: string; name: string; imageUrl: string; price: number; category: string }) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: 1,
        category: product.category,
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i => i.productId === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter(i => i.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
