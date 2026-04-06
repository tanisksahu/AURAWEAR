import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { CheckCircle, ShoppingBag, ArrowLeft, Trash2, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CATEGORY_IMAGES: Record<string, string> = {
  'Tops': '/assets/generated/product-tshirt-white.dim_600x600.png',
  'Bottoms': '/assets/generated/product-cargo-brown.dim_600x600.png',
  'Outerwear': '/assets/generated/product-hoodie-black.dim_600x600.png',
  'Accessories': '/assets/generated/product-chain-gold.dim_600x600.png',
  'Footwear': '/assets/generated/product-sneakers-white.dim_600x600.png',
};

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleClearCart = () => {
    clearCart();
    navigate({ to: '/shop' });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="text-center px-6">
          <ShoppingBag size={64} className="mx-auto mb-6" style={{ color: 'rgba(245,166,35,0.3)' }} />
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#f5f5f5' }}>Your cart is empty</h2>
          <p className="mb-8" style={{ color: '#666' }}>Add some items before checking out.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-wider gold-btn"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div
        className="py-12 px-6 text-center"
        style={{
          background: 'linear-gradient(to bottom, rgba(245,166,35,0.04), transparent)',
          borderBottom: '1px solid rgba(245,166,35,0.08)',
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}
        >
          <CheckCircle size={28} style={{ color: '#22c55e' }} />
        </div>
        <h1 className="section-title mb-3" style={{ color: '#f5f5f5' }}>
          Order <span className="gold-gradient">Confirmed!</span>
        </h1>
        <p style={{ color: '#666' }}>
          Your order has been placed successfully. (No payment required for MVP)
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        {/* Order Summary */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package size={18} style={{ color: '#f5a623' }} />
            <h2 className="font-bold text-lg" style={{ color: '#f5f5f5' }}>Order Summary</h2>
          </div>

          <div className="space-y-4">
            {items.map(item => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <img
                  src={CATEGORY_IMAGES[item.category] || '/assets/generated/product-hoodie-black.dim_600x600.png'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  style={{ background: '#1a1a1a' }}
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#f5f5f5' }}>{item.name}</p>
                  <p className="text-xs mt-1" style={{ color: '#888' }}>Qty: {item.quantity}</p>
                  <p className="text-sm font-bold mt-1" style={{ color: '#f5a623' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="flex items-center justify-between mt-6 pt-6"
            style={{ borderTop: '1px solid rgba(245,166,35,0.1)' }}
          >
            <span className="font-semibold" style={{ color: '#f5f5f5' }}>Total Amount</span>
            <span className="text-2xl font-bold" style={{ color: '#f5a623' }}>
              ₹{cartTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Confirmation Message */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: 'rgba(34,197,94,0.05)',
            border: '1px solid rgba(34,197,94,0.15)',
          }}
        >
          <CheckCircle size={24} className="mx-auto mb-3" style={{ color: '#22c55e' }} />
          <p className="font-semibold mb-1" style={{ color: '#f5f5f5' }}>
            Thank you for your order!
          </p>
          <p className="text-sm" style={{ color: '#888' }}>
            Your AURAWEAR order is confirmed. Our AI stylist will ensure your items are perfectly curated.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/shop"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f5f5f5',
            }}
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
          <button
            onClick={handleClearCart}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444',
            }}
          >
            <Trash2 size={16} />
            Clear Cart & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
