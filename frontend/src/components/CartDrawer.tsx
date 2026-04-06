import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from '@tanstack/react-router';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate({ to: '/checkout' });
  };

  const getProductImage = (imageUrl: string, category: string) => {
    const categoryImages: Record<string, string> = {
      'Tops': '/assets/generated/product-tshirt-white.dim_600x600.png',
      'Bottoms': '/assets/generated/product-cargo-brown.dim_600x600.png',
      'Outerwear': '/assets/generated/product-hoodie-black.dim_600x600.png',
      'Accessories': '/assets/generated/product-chain-gold.dim_600x600.png',
      'Footwear': '/assets/generated/product-sneakers-white.dim_600x600.png',
    };
    return categoryImages[category] || '/assets/generated/product-hoodie-black.dim_600x600.png';
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col animate-slide-in-right"
        style={{
          background: '#111111',
          borderLeft: '1px solid rgba(245, 166, 35, 0.15)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid rgba(245, 166, 35, 0.1)' }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} style={{ color: '#f5a623' }} />
            <h2 className="text-lg font-bold tracking-wide" style={{ color: '#f5f5f5' }}>
              Your Cart
            </h2>
            {items.length > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(245,166,35,0.15)', color: '#f5a623' }}
              >
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#888' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <ShoppingBag size={48} style={{ color: 'rgba(245,166,35,0.3)' }} />
              <p className="text-center" style={{ color: '#888' }}>
                Your cart is empty.<br />
                <span style={{ color: '#f5a623' }}>Start shopping</span> to add items.
              </p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <img
                  src={getProductImage(item.imageUrl, item.category)}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  style={{ background: '#1a1a1a' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: '#f5f5f5' }}>
                    {item.name}
                  </p>
                  <p className="text-sm font-bold mt-1" style={{ color: '#f5a623' }}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#f5f5f5' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center" style={{ color: '#f5f5f5' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#f5f5f5' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-1.5 rounded-lg self-start transition-colors"
                  style={{ color: '#666' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="p-6 space-y-4"
            style={{ borderTop: '1px solid rgba(245, 166, 35, 0.1)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#888' }}>Total</span>
              <span className="text-xl font-bold" style={{ color: '#f5a623' }}>
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3 rounded-xl font-bold text-sm tracking-wider gold-btn"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
}
