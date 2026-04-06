import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ShoppingCart, Menu, X, Zap } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartDrawer from './CartDrawer';

export default function Navigation() {
  const location = useLocation();
  const { cartCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/studio', label: 'AI Studio' },
    { to: '/wardrobe', label: 'Wardrobe' },
    { to: '/occasion', label: 'Occasion' },
    { to: '/try-on', label: 'Try-On' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(10, 10, 10, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(245, 166, 35, 0.1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Zap
                  size={22}
                  className="text-aw-gold"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(245,166,35,0.6))' }}
                />
              </div>
              <span
                className="text-xl font-bold tracking-widest"
                style={{
                  background: 'linear-gradient(135deg, #f5a623 0%, #f7c56a 50%, #e8920f 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '0.15em',
                }}
              >
                AURAWEAR
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Cart + Mobile Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-lg transition-all duration-200"
                style={{ color: '#f5f5f5' }}
                aria-label="Open cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{ background: '#f5a623', color: '#0a0a0a' }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              <button
                className="md:hidden p-2 rounded-lg"
                style={{ color: '#f5f5f5' }}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div
              className="md:hidden py-4 border-t"
              style={{ borderColor: 'rgba(245, 166, 35, 0.1)' }}
            >
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block py-3 px-2 nav-link ${isActive(link.to) ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
